/**
 * Firestore data layer — connects the portal to the REAL amrutai database.
 *
 * Reads:  jobPostings (status == "published")  +  companyProfiles (join on websiteUrl/domain)
 * Writes: jobApplications (new collection — company owners' applicant activity),
 *         portalSavedJobs, portalProfiles, and applicantsCount on jobPostings.
 *
 * If Firebase credentials are not configured, every function signals "disabled"
 * and the routes fall back to the local dummy dataset — so local dev never breaks.
 */
import { applicationDefault, cert, getApps, initializeApp } from 'firebase-admin/app';
import { FieldValue, Firestore, getFirestore } from 'firebase-admin/firestore';
import { Application, ApplicationStatus, Company, Job, JobWithCompany, Profile } from '../types';
import { profile as defaultProfile } from './store';

const PROFILE_EMAIL = process.env.PORTAL_PROFILE_EMAIL || defaultProfile.email;
const APP_SOURCE = 'amrut-jobs-portal';

let db: Firestore | null = null;

export function firestoreEnabled(): boolean {
  return Boolean(
    (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) ||
      process.env.GOOGLE_APPLICATION_CREDENTIALS
  );
}

function getDb(): Firestore {
  if (db) return db;
  if (getApps().length === 0) {
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
      });
    } else {
      initializeApp({ credential: applicationDefault() });
    }
  }
  db = getFirestore();
  return db;
}

// ---------------------------------------------------------------------------
// Deterministic cosmetics (rating/logo) — companyProfiles has no ratings yet,
// so we derive stable pseudo-values per domain to keep the UI rich.
// ---------------------------------------------------------------------------
const LOGO_COLORS = [
  '#4F46E5', '#DB2777', '#0891B2', '#7C3AED', '#059669', '#DC2626',
  '#EA580C', '#9333EA', '#2563EB', '#0D9488', '#E11D48', '#16A34A',
];

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

// ---------------------------------------------------------------------------
// Mapping: Firestore jobPostings doc → portal Job shape
// ---------------------------------------------------------------------------
function parseSalary(range?: string): { min: number; max: number } | null {
  if (!range) return null;
  const m = range.match(/(\d+(?:\.\d+)?)\s*[–-]\s*(\d+(?:\.\d+)?)\s*LPA/i);
  if (m) return { min: Number(m[1]), max: Number(m[2]) };
  const single = range.match(/(\d+(?:\.\d+)?)\s*LPA/i);
  if (single) return { min: Number(single[1]), max: Number(single[1]) };
  return null;
}

function parseExperience(doc: FirebaseFirestore.DocumentData): { min: number; max: number } {
  if (typeof doc.experienceMin === 'number' || typeof doc.experienceMax === 'number') {
    return { min: doc.experienceMin ?? 0, max: doc.experienceMax ?? Math.max(doc.experienceMin ?? 0, 1) };
  }
  const text = (doc.requiredQualifications ?? []).join(' ');
  const band = text.match(/(\d+)\s*[–-]\s*(\d+)\s*(?:\+)?\s*(?:years|yrs)/i);
  if (band) return { min: Number(band[1]), max: Number(band[2]) };
  const plus = text.match(/(\d+)\s*\+\s*(?:years|yrs)/i);
  if (plus) return { min: Number(plus[1]), max: Number(plus[1]) + 3 };
  return { min: 0, max: 0 }; // unknown → matches every experience filter
}

function normalizeJobType(type?: string): string {
  if (!type) return 'Full-time';
  const t = type.toLowerCase();
  if (t.includes('intern')) return 'Internship';
  if (t.includes('contract')) return 'Contract';
  if (t.includes('part')) return 'Part-time';
  return 'Full-time';
}

function daysSince(iso?: string | null): number {
  if (!iso) return 0;
  const ms = Date.now() - new Date(iso).getTime();
  return Math.max(0, Math.floor(ms / 86_400_000));
}

function mapJob(doc: FirebaseFirestore.DocumentData, id: string): Job {
  const salary = parseSalary(doc.salaryRange);
  const exp = parseExperience(doc);
  const posted = daysSince(doc.publishedAt ?? null);
  const aboutRole: Array<{ title: string; description: string }> = doc.aboutRole ?? [];
  const preferred: string[] = doc.preferredQualifications ?? [];

  return {
    id,
    title: doc.title,
    companyId: doc.domain,
    category: doc.team || 'General',
    location: doc.location || '—',
    workMode: doc.workFormat || 'On-site',
    jobType: normalizeJobType(doc.type),
    experienceMin: exp.min,
    experienceMax: exp.max,
    salaryMin: salary?.min ?? 0,
    salaryMax: salary?.max ?? 0,
    salaryLabel: doc.salaryRange || '',
    skills: doc.skills ?? [],
    description: [doc.shortDescription, ...(doc.intro ?? [])].filter(Boolean).join('\n\n'),
    responsibilities: aboutRole.map((r) => (r.description ? `${r.title} — ${r.description}` : r.title)),
    requirements: [...(doc.requiredQualifications ?? []), ...preferred.map((p) => `Preferred: ${p}`)],
    benefits: doc.perks ?? [],
    postedDaysAgo: posted,
    applicants: doc.applicantsCount ?? 0,
    openings: doc.openings ?? 1,
    featured: Boolean(doc.verifiedPost) && posted <= 4,
    applyEmail: doc.applyEmail ?? null,
  };
}

function mapCompany(domain: string, doc?: FirebaseFirestore.DocumentData): Company {
  const h = hash(domain);
  return {
    id: domain,
    name: doc?.name ?? domain,
    logoColor: LOGO_COLORS[h % LOGO_COLORS.length],
    industry: doc?.industryTags?.[0] ?? 'Technology',
    rating: Math.round((3.8 + (h % 9) / 10) * 10) / 10,
    reviews: 150 + (h % 4850),
    size: doc?.employees?.range ? `${doc.employees.range} employees` : '—',
    founded: doc?.founded ? Number(doc.founded) || 0 : 0,
    headquarters: doc?.headquarters
      ? [doc.headquarters.city, doc.headquarters.country].filter(Boolean).join(', ')
      : '—',
    website: doc?.website ?? `https://${domain}`,
    about: doc?.description ?? doc?.tagline ?? `${doc?.name ?? domain} is hiring on Amrut Jobs.`,
    tags: doc?.industryTags ?? [],
  };
}

// ---------------------------------------------------------------------------
// Cached reads
// ---------------------------------------------------------------------------
interface Catalog {
  jobs: Job[];
  companies: Map<string, Company>;
  at: number;
}

let catalog: Catalog | null = null;
const CACHE_TTL_MS = 60_000;

export async function loadCatalog(force = false): Promise<Catalog> {
  if (!force && catalog && Date.now() - catalog.at < CACHE_TTL_MS) return catalog;
  const store = getDb();

  // equality-only filter → no composite index needed; sort in memory
  const snap = await store.collection('jobPostings').where('status', '==', 'published').limit(500).get();
  const jobs = snap.docs
    .map((d) => mapJob(d.data(), d.id))
    .sort((a, b) => a.postedDaysAgo - b.postedDaysAgo);

  const domains = Array.from(new Set(jobs.map((j) => j.companyId)));
  const companies = new Map<string, Company>();

  // Firestore "in" supports max 30 values per query — chunk to 10 to be safe
  for (let i = 0; i < domains.length; i += 10) {
    const chunk = domains.slice(i, i + 10);
    const profSnap = await store.collection('companyProfiles').where('websiteUrl', 'in', chunk).get();
    for (const d of profSnap.docs) {
      const data = d.data();
      companies.set(data.websiteUrl, mapCompany(data.websiteUrl, data));
    }
  }
  for (const domain of domains) {
    if (!companies.has(domain)) companies.set(domain, mapCompany(domain));
  }

  catalog = { jobs, companies, at: Date.now() };
  return catalog;
}

export function invalidateCatalog(): void {
  catalog = null;
}

export function withCompanyFS(job: Job, companies: Map<string, Company>): JobWithCompany {
  return { ...job, company: companies.get(job.companyId) ?? mapCompany(job.companyId) };
}

// ---------------------------------------------------------------------------
// Applications — jobApplications collection, ONE doc per application.
// Single source of truth, no duplication:
//   seeker view  → where("userEmail", "==", …)
//   company view → where("domain", "==", …)   (all applicants across its jobs)
// ---------------------------------------------------------------------------
function mapApplication(doc: FirebaseFirestore.DocumentData, id: string): Application {
  return {
    id,
    jobId: doc.jobId,
    appliedOn: doc.appliedOn ?? new Date().toISOString(),
    status: (doc.status ?? 'Applied') as ApplicationStatus,
    coverNote: doc.coverNote ?? undefined,
    timeline: doc.timeline ?? [],
  };
}

export async function fsGetApplications(): Promise<Application[]> {
  const store = getDb();
  const snap = await store.collection('jobApplications').where('userEmail', '==', PROFILE_EMAIL).get();
  return snap.docs
    .map((d) => mapApplication(d.data(), d.id))
    .sort((a, b) => new Date(b.appliedOn).getTime() - new Date(a.appliedOn).getTime());
}

export async function fsCreateApplication(
  job: JobWithCompany,
  coverNote: string | undefined,
  applicant: Profile
): Promise<Application | 'duplicate'> {
  const store = getDb();
  const dup = await store
    .collection('jobApplications')
    .where('userEmail', '==', PROFILE_EMAIL)
    .where('jobId', '==', job.id)
    .limit(1)
    .get();
  if (!dup.empty) return 'duplicate';

  const now = new Date().toISOString();
  const ref = store.collection('jobApplications').doc();
  const data = {
    id: ref.id,
    // seeker side (query: userEmail ==)
    userEmail: PROFILE_EMAIL,
    applicant: {
      name: applicant.name,
      email: applicant.email,
      phone: applicant.phone,
      headline: applicant.headline,
      location: applicant.location,
      totalExperienceYears: applicant.totalExperienceYears,
      skills: applicant.skills,
      resumeFileName: applicant.resume.fileName,
    },
    // company side (query: domain ==)
    jobId: job.id,
    jobTitle: job.title,
    domain: job.companyId,
    companyName: job.company.name,
    applyEmail: job.applyEmail ?? null,
    // application state
    coverNote: coverNote ?? null,
    status: 'Applied' as ApplicationStatus,
    timeline: [
      { status: 'Applied' as ApplicationStatus, date: now, note: 'Your application was submitted successfully.' },
    ],
    source: APP_SOURCE,
    appliedOn: now,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };
  await ref.set(data);
  // derived counter on the job post — powers the "applicants" count on job cards
  await store
    .collection('jobPostings')
    .doc(job.id)
    .set({ applicantsCount: FieldValue.increment(1) }, { merge: true })
    .catch(() => undefined);
  invalidateCatalog();
  return mapApplication(data, ref.id);
}

export async function fsWithdrawApplication(id: string): Promise<boolean> {
  const store = getDb();
  const ref = store.collection('jobApplications').doc(id);
  const doc = await ref.get();
  if (!doc.exists || doc.data()?.userEmail !== PROFILE_EMAIL) return false;
  const jobId = doc.data()?.jobId;
  await ref.delete();
  if (jobId) {
    await store
      .collection('jobPostings')
      .doc(jobId)
      .set({ applicantsCount: FieldValue.increment(-1) }, { merge: true })
      .catch(() => undefined);
  }
  invalidateCatalog();
  return true;
}

// ---------------------------------------------------------------------------
// Saved jobs → portalSavedJobs collection (persists across serverless instances)
// ---------------------------------------------------------------------------
const savedDocId = (jobId: string) => `${PROFILE_EMAIL.replace(/[^a-zA-Z0-9]/g, '_')}__${jobId}`;

export async function fsGetSavedJobIds(): Promise<string[]> {
  const store = getDb();
  const snap = await store.collection('portalSavedJobs').where('email', '==', PROFILE_EMAIL).get();
  return snap.docs.map((d) => d.data().jobId as string);
}

export async function fsSaveJob(jobId: string): Promise<void> {
  const store = getDb();
  await store.collection('portalSavedJobs').doc(savedDocId(jobId)).set({
    email: PROFILE_EMAIL,
    jobId,
    savedAt: FieldValue.serverTimestamp(),
  });
}

export async function fsUnsaveJob(jobId: string): Promise<void> {
  const store = getDb();
  await store.collection('portalSavedJobs').doc(savedDocId(jobId)).delete();
}

// ---------------------------------------------------------------------------
// Profile → portalProfiles collection (single public seeker profile for now)
// ---------------------------------------------------------------------------
export async function fsGetProfile(): Promise<Profile> {
  const store = getDb();
  const ref = store.collection('portalProfiles').doc(PROFILE_EMAIL);
  const doc = await ref.get();
  if (!doc.exists) {
    await ref.set({ ...defaultProfile, email: PROFILE_EMAIL });
    return { ...defaultProfile, email: PROFILE_EMAIL };
  }
  return doc.data() as Profile;
}

export async function fsUpdateProfile(patch: Partial<Profile>): Promise<Profile> {
  const store = getDb();
  const ref = store.collection('portalProfiles').doc(PROFILE_EMAIL);
  await ref.set(patch, { merge: true });
  const doc = await ref.get();
  return doc.data() as Profile;
}
