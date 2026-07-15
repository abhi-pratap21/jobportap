import fs from 'fs';
import path from 'path';
import express, { Request, Response } from 'express';
import cors from 'cors';

// tiny .env loader (no dependency) — local dev only; Vercel injects real env vars
(() => {
  try {
    const envPath = path.join(__dirname, '..', '.env');
    if (!fs.existsSync(envPath)) return;
    for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
      const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
      if (!m) continue;
      let v = m[2].trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
      if (!(m[1] in process.env)) process.env[m[1]] = v;
    }
  } catch {
    /* .env is optional */
  }
})();

import {
  firestoreEnabled,
  fsCreateApplication,
  fsGetApplications,
  fsGetProfile,
  fsGetSavedJobIds,
  fsSaveJob,
  fsUnsaveJob,
  fsUpdateProfile,
  fsWithdrawApplication,
  loadCatalog,
  withCompanyFS,
} from './data/firestore';
import { Company, Job, JobWithCompany } from './types';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// The portal serves REAL data only — jobs posted from the amrut.ai dashboard
// (jobPostings in Firestore). Without credentials there is nothing to show.
if (!firestoreEnabled()) {
  console.error(
    '❌ Firebase credentials missing. Set GOOGLE_APPLICATION_CREDENTIALS (key file path) ' +
      'or FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY in backend/.env'
  );
}

app.use('/api', (req, res, next) => {
  if (!firestoreEnabled()) {
    return res.status(503).json({
      message: 'Backend is not connected to Firebase. Set Firebase credentials and restart.',
    });
  }
  next();
});

const withCompany = (job: Job, companies: Map<string, Company>): JobWithCompany =>
  withCompanyFS(job, companies);

const wrap =
  (fn: (req: Request, res: Response) => Promise<unknown>) => (req: Request, res: Response) => {
    fn(req, res).catch((err) => {
      console.error(`[api] ${req.method} ${req.path} failed:`, err.message);
      res.status(500).json({ message: `Request failed: ${err.message}` });
    });
  };

// ---------- Health ----------
app.get(
  '/api/health',
  wrap(async (_req, res) => {
    const { jobs, companies } = await loadCatalog();
    res.json({
      status: 'ok',
      service: 'amrut-jobs-backend',
      mode: 'firestore',
      jobs: jobs.length,
      companies: companies.size,
    });
  })
);

// ---------- Meta (filter options, computed from the live catalogue) ----------
app.get(
  '/api/meta',
  wrap(async (_req, res) => {
    const { jobs } = await loadCatalog();
    res.json({
      categories: Array.from(new Set(jobs.map((j) => j.category))).sort(),
      locations: Array.from(new Set(jobs.map((j) => j.location))).sort(),
      jobTypes: Array.from(new Set(jobs.map((j) => j.jobType))).sort(),
      workModes: ['On-site', 'Remote', 'Hybrid'],
      experienceLevels: [
        { label: 'Fresher (0-1 yrs)', min: 0, max: 1 },
        { label: '1-3 yrs', min: 1, max: 3 },
        { label: '3-5 yrs', min: 3, max: 5 },
        { label: '5-10 yrs', min: 5, max: 10 },
      ],
    });
  })
);

// ---------- Jobs ----------
app.get(
  '/api/jobs',
  wrap(async (req, res) => {
    const {
      q = '',
      location = '',
      category = '',
      jobType = '',
      workMode = '',
      expMin,
      expMax,
      salaryMin,
      sort = 'relevance',
      page = '1',
      limit = '10',
    } = req.query as Record<string, string>;

    const { jobs, companies } = await loadCatalog();
    let result = jobs.slice();

    if (q) {
      const needle = q.toLowerCase();
      result = result.filter((j) => {
        const company = companies.get(j.companyId);
        return (
          j.title.toLowerCase().includes(needle) ||
          j.category.toLowerCase().includes(needle) ||
          (company?.name.toLowerCase().includes(needle) ?? false) ||
          j.skills.some((s) => s.toLowerCase().includes(needle))
        );
      });
    }
    if (location) {
      const locs = location.split(',').map((l) => l.trim().toLowerCase()).filter(Boolean);
      result = result.filter((j) => locs.some((l) => j.location.toLowerCase().includes(l)));
    }
    if (category) {
      const cats = category.split(',').map((c) => c.trim().toLowerCase());
      result = result.filter((j) => cats.includes(j.category.toLowerCase()));
    }
    if (jobType) {
      const types = jobType.split(',').map((t) => t.trim().toLowerCase());
      result = result.filter((j) => types.includes(j.jobType.toLowerCase()));
    }
    if (workMode) {
      const modes = workMode.split(',').map((m) => m.trim().toLowerCase());
      result = result.filter((j) => modes.includes(j.workMode.toLowerCase()));
    }
    if (expMin !== undefined && expMin !== '') {
      const min = Number(expMin);
      const max = expMax !== undefined && expMax !== '' ? Number(expMax) : 50;
      // jobs with unspecified experience (0/0) always match
      result = result.filter(
        (j) => (j.experienceMin === 0 && j.experienceMax === 0) || (j.experienceMin <= max && j.experienceMax >= min)
      );
    }
    if (salaryMin !== undefined && salaryMin !== '') {
      result = result.filter((j) => j.salaryMax >= Number(salaryMin));
    }

    switch (sort) {
      case 'recent':
        result.sort((a, b) => a.postedDaysAgo - b.postedDaysAgo);
        break;
      case 'salary-desc':
        result.sort((a, b) => b.salaryMax - a.salaryMax);
        break;
      case 'salary-asc':
        result.sort((a, b) => a.salaryMin - b.salaryMin);
        break;
      default:
        result.sort((a, b) => Number(b.featured) - Number(a.featured) || a.postedDaysAgo - b.postedDaysAgo);
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
    const total = result.length;
    const totalPages = Math.max(1, Math.ceil(total / limitNum));
    const start = (pageNum - 1) * limitNum;

    res.json({
      jobs: result.slice(start, start + limitNum).map((j) => withCompany(j, companies)),
      total,
      page: pageNum,
      totalPages,
    });
  })
);

app.get(
  '/api/jobs/featured',
  wrap(async (_req, res) => {
    const { jobs, companies } = await loadCatalog();
    const featured = jobs.filter((j) => j.featured).slice(0, 8);
    const filler = featured.length < 4 ? jobs.filter((j) => !j.featured).slice(0, 8 - featured.length) : [];
    res.json([...featured, ...filler].map((j) => withCompany(j, companies)));
  })
);

app.get(
  '/api/jobs/:id',
  wrap(async (req, res) => {
    const { jobs, companies } = await loadCatalog();
    const job = jobs.find((j) => j.id === req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    const [apps, savedIds] = await Promise.all([fsGetApplications(), fsGetSavedJobIds()]);
    res.json({
      ...withCompany(job, companies),
      isApplied: apps.some((a) => a.jobId === job.id),
      isSaved: savedIds.includes(job.id),
    });
  })
);

app.get(
  '/api/jobs/:id/similar',
  wrap(async (req, res) => {
    const { jobs, companies } = await loadCatalog();
    const job = jobs.find((j) => j.id === req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    const similar = jobs
      .filter((j) => j.id !== job.id && (j.category === job.category || j.companyId === job.companyId))
      .slice(0, 4)
      .map((j) => withCompany(j, companies));
    res.json(similar);
  })
);

// ---------- Companies ----------
app.get(
  '/api/companies',
  wrap(async (_req, res) => {
    const { jobs, companies } = await loadCatalog();
    const list = Array.from(companies.values()).map((c) => ({
      ...c,
      openJobs: jobs.filter((j) => j.companyId === c.id).length,
    }));
    res.json(list.sort((a, b) => b.openJobs - a.openJobs));
  })
);

app.get(
  '/api/companies/:id',
  wrap(async (req, res) => {
    const { jobs, companies } = await loadCatalog();
    const company = companies.get(req.params.id);
    if (!company) return res.status(404).json({ message: 'Company not found' });
    res.json({
      ...company,
      jobs: jobs.filter((j) => j.companyId === company.id).map((j) => withCompany(j, companies)),
    });
  })
);

// ---------- Applications ----------
app.get(
  '/api/applications',
  wrap(async (_req, res) => {
    const { jobs, companies } = await loadCatalog();
    const apps = await fsGetApplications();
    const list = apps
      .map((a) => {
        const job = jobs.find((j) => j.id === a.jobId);
        return job ? { ...a, job: withCompany(job, companies) } : null;
      })
      .filter(Boolean);
    res.json(list);
  })
);

app.post(
  '/api/applications',
  wrap(async (req, res) => {
    const { jobId, coverNote } = req.body as { jobId?: string; coverNote?: string };
    const { jobs, companies } = await loadCatalog();
    const job = jobId ? jobs.find((j) => j.id === jobId) : undefined;
    if (!job) return res.status(400).json({ message: 'Valid jobId is required' });

    const applicant = await fsGetProfile();
    const created = await fsCreateApplication(withCompany(job, companies), coverNote, applicant);
    if (created === 'duplicate') {
      return res.status(409).json({ message: 'You have already applied to this job' });
    }
    res.status(201).json({ ...created, job: withCompany(job, companies) });
  })
);

app.delete(
  '/api/applications/:id',
  wrap(async (req, res) => {
    const ok = await fsWithdrawApplication(req.params.id);
    if (!ok) return res.status(404).json({ message: 'Application not found' });
    res.json({ withdrawn: true, id: req.params.id });
  })
);

// ---------- Saved jobs ----------
app.get(
  '/api/saved-jobs',
  wrap(async (_req, res) => {
    const { jobs, companies } = await loadCatalog();
    const savedIds = await fsGetSavedJobIds();
    const list = savedIds
      .map((id) => jobs.find((j) => j.id === id))
      .filter((j): j is Job => Boolean(j))
      .map((j) => withCompany(j, companies));
    res.json(list);
  })
);

app.post(
  '/api/saved-jobs',
  wrap(async (req, res) => {
    const { jobId } = req.body as { jobId?: string };
    const { jobs } = await loadCatalog();
    if (!jobId || !jobs.some((j) => j.id === jobId)) {
      return res.status(400).json({ message: 'Valid jobId is required' });
    }
    await fsSaveJob(jobId);
    res.status(201).json({ saved: true, jobId });
  })
);

app.delete(
  '/api/saved-jobs/:jobId',
  wrap(async (req, res) => {
    await fsUnsaveJob(req.params.jobId);
    res.json({ saved: false, jobId: req.params.jobId });
  })
);

// ---------- Profile ----------
app.get(
  '/api/profile',
  wrap(async (_req, res) => {
    const [apps, savedIds, base] = await Promise.all([
      fsGetApplications(),
      fsGetSavedJobIds(),
      fsGetProfile(),
    ]);
    res.json({
      ...base,
      stats: { applied: apps.length, saved: savedIds.length, profileViews: 128, searchAppearances: 342 },
    });
  })
);

app.put(
  '/api/profile',
  wrap(async (req, res) => {
    const allowed = [
      'name',
      'phone',
      'headline',
      'location',
      'about',
      'skills',
      'expectedSalaryLPA',
      'noticePeriod',
      'preferredLocations',
      'preferredRoles',
    ] as const;
    const patch: Record<string, unknown> = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) patch[key] = req.body[key];
    }
    const updated = await fsUpdateProfile(patch);
    res.json(updated);
  })
);

// On Vercel the app runs as a serverless function — no port listening there
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Amrut Jobs backend running on http://localhost:${PORT}`);
    console.log(
      firestoreEnabled()
        ? '   mode: firestore — real jobs from the amrut.ai dashboard (amrutai-2a231)'
        : '   ⚠️  Firebase credentials missing — API will return 503'
    );
  });
}

export default app;
