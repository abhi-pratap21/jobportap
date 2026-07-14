import express, { Request, Response } from 'express';
import cors from 'cors';
import { companies, companyById } from './data/companies';
import { jobs, jobById, categories, allLocations } from './data/jobs';
import { applications, savedJobIds, profile, nextApplicationId } from './data/store';
import { Job, JobWithCompany } from './types';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const withCompany = (job: Job): JobWithCompany => ({
  ...job,
  company: companyById.get(job.companyId)!,
});

// ---------- Health ----------
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'jobnest-backend', jobs: jobs.length, companies: companies.length });
});

// ---------- Meta (filter options) ----------
app.get('/api/meta', (_req, res) => {
  res.json({
    categories,
    locations: allLocations,
    jobTypes: ['Full-time', 'Part-time', 'Internship', 'Contract'],
    workModes: ['On-site', 'Remote', 'Hybrid'],
    experienceLevels: [
      { label: 'Fresher (0-1 yrs)', min: 0, max: 1 },
      { label: '1-3 yrs', min: 1, max: 3 },
      { label: '3-5 yrs', min: 3, max: 5 },
      { label: '5-10 yrs', min: 5, max: 10 },
    ],
  });
});

// ---------- Jobs ----------
app.get('/api/jobs', (req: Request, res: Response) => {
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

  let result = jobs.slice();

  if (q) {
    const needle = q.toLowerCase();
    result = result.filter((j) => {
      const company = companyById.get(j.companyId)!;
      return (
        j.title.toLowerCase().includes(needle) ||
        j.category.toLowerCase().includes(needle) ||
        company.name.toLowerCase().includes(needle) ||
        j.skills.some((s) => s.toLowerCase().includes(needle))
      );
    });
  }
  if (location) {
    const locs = location.split(',').map((l) => l.trim().toLowerCase());
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
    result = result.filter((j) => j.experienceMin <= max && j.experienceMax >= min);
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
      // relevance: featured first, then most recent
      result.sort((a, b) => Number(b.featured) - Number(a.featured) || a.postedDaysAgo - b.postedDaysAgo);
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
  const total = result.length;
  const totalPages = Math.max(1, Math.ceil(total / limitNum));
  const start = (pageNum - 1) * limitNum;

  res.json({
    jobs: result.slice(start, start + limitNum).map(withCompany),
    total,
    page: pageNum,
    totalPages,
  });
});

app.get('/api/jobs/featured', (_req, res) => {
  const featured = jobs.filter((j) => j.featured).slice(0, 8).map(withCompany);
  res.json(featured);
});

app.get('/api/jobs/:id', (req, res) => {
  const job = jobById.get(req.params.id);
  if (!job) return res.status(404).json({ message: 'Job not found' });
  res.json({
    ...withCompany(job),
    isApplied: applications.some((a) => a.jobId === job.id),
    isSaved: savedJobIds.has(job.id),
  });
});

app.get('/api/jobs/:id/similar', (req, res) => {
  const job = jobById.get(req.params.id);
  if (!job) return res.status(404).json({ message: 'Job not found' });
  const similar = jobs
    .filter((j) => j.id !== job.id && (j.category === job.category || j.companyId === job.companyId))
    .slice(0, 4)
    .map(withCompany);
  res.json(similar);
});

// ---------- Companies ----------
app.get('/api/companies', (_req, res) => {
  res.json(
    companies.map((c) => ({
      ...c,
      openJobs: jobs.filter((j) => j.companyId === c.id).length,
    }))
  );
});

app.get('/api/companies/:id', (req, res) => {
  const company = companyById.get(req.params.id);
  if (!company) return res.status(404).json({ message: 'Company not found' });
  res.json({
    ...company,
    jobs: jobs.filter((j) => j.companyId === company.id).map(withCompany),
  });
});

// ---------- Applications ----------
app.get('/api/applications', (_req, res) => {
  const list = applications
    .slice()
    .sort((a, b) => new Date(b.appliedOn).getTime() - new Date(a.appliedOn).getTime())
    .map((a) => ({ ...a, job: withCompany(jobById.get(a.jobId)!) }));
  res.json(list);
});

app.post('/api/applications', (req, res) => {
  const { jobId, coverNote } = req.body as { jobId?: string; coverNote?: string };
  if (!jobId || !jobById.get(jobId)) {
    return res.status(400).json({ message: 'Valid jobId is required' });
  }
  if (applications.some((a) => a.jobId === jobId)) {
    return res.status(409).json({ message: 'You have already applied to this job' });
  }
  const now = new Date().toISOString();
  const application = {
    id: nextApplicationId(),
    jobId,
    appliedOn: now,
    status: 'Applied' as const,
    coverNote,
    timeline: [{ status: 'Applied' as const, date: now, note: 'Your application was submitted successfully.' }],
  };
  applications.push(application);
  res.status(201).json({ ...application, job: withCompany(jobById.get(jobId)!) });
});

app.delete('/api/applications/:id', (req, res) => {
  const idx = applications.findIndex((a) => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Application not found' });
  const [removed] = applications.splice(idx, 1);
  res.json({ withdrawn: true, id: removed.id });
});

// ---------- Saved jobs ----------
app.get('/api/saved-jobs', (_req, res) => {
  const list = Array.from(savedJobIds)
    .map((id) => jobById.get(id))
    .filter((j): j is Job => Boolean(j))
    .map(withCompany);
  res.json(list);
});

app.post('/api/saved-jobs', (req, res) => {
  const { jobId } = req.body as { jobId?: string };
  if (!jobId || !jobById.get(jobId)) {
    return res.status(400).json({ message: 'Valid jobId is required' });
  }
  savedJobIds.add(jobId);
  res.status(201).json({ saved: true, jobId });
});

app.delete('/api/saved-jobs/:jobId', (req, res) => {
  savedJobIds.delete(req.params.jobId);
  res.json({ saved: false, jobId: req.params.jobId });
});

// ---------- Profile ----------
app.get('/api/profile', (_req, res) => {
  const appliedCount = applications.length;
  const savedCount = savedJobIds.size;
  res.json({ ...profile, stats: { applied: appliedCount, saved: savedCount, profileViews: 128, searchAppearances: 342 } });
});

app.put('/api/profile', (req, res) => {
  const allowed: Array<keyof typeof profile> = [
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
  ];
  for (const key of allowed) {
    if (req.body[key] !== undefined) {
      (profile as unknown as Record<string, unknown>)[key] = req.body[key];
    }
  }
  res.json(profile);
});

// On Vercel the app runs as a serverless function — no port listening there
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 JobNest backend running on http://localhost:${PORT}`);
    console.log(`   ${jobs.length} dummy jobs across ${companies.length} companies loaded`);
  });
}

export default app;
