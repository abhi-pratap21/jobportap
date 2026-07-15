# Amrut Jobs 💼

Naukri-style job portal for **job seekers**, by the team behind [amrut.ai](https://amrut.ai). Companies post jobs from the amrut.ai dashboard; seekers discover and apply here, and every application is tracked end-to-end.

## Structure

```
job portal/
├── frontend/   # Next.js 14 + TypeScript + Redux Toolkit (RTK Query) + Tailwind CSS
└── backend/    # Express + TypeScript — reads/writes the REAL amrutai Firestore
```

## How data flows (production)

```
amrut.ai dashboard ──POST job──▶ Firestore: jobPostings (status: published)
                                        │
                                        ▼
                      Amrut Jobs backend (this repo, /api/jobs)
                                        │
        seeker applies ──▶ Firestore: jobApplications  (+ applicantsCount++)
                                        │
                                        ▼
                     company owner sees applicant activity (future dashboard)
```

- **`jobPostings`** — jobs posted from the amrut.ai dashboard. This portal lists every `status == "published"` job. Amrut's own jobs (`domain: amrut.ai`) also appear on the amrut.ai careers page; all other companies' jobs appear **only** here.
- **`companyProfiles`** — company info, joined on `websiteUrl` == job `domain`.
- **`jobApplications`** — written by this portal when a seeker applies (applicant snapshot, cover note, status timeline, `source: "amrut-jobs-portal"`). The job's `applicantsCount` is incremented so owners see activity.
- **`portalSavedJobs` / `portalProfiles`** — portal-side saved jobs and the seeker profile (public single-profile mode for now; auth later).

Without Firebase credentials the backend automatically falls back to a built-in dummy dataset (87 jobs), so local dev always works: check `/api/health` → `"mode": "firestore" | "dummy"`.

## Quick start

```bash
npm run install:all   # root + backend + frontend
npm run dev           # backend :4000 + frontend :3000
```

### Go live against the real Firestore (one-time)

```bash
cd backend
bash scripts/setup-live.sh /path/to/amrutai-staging-service-account.json
```

This seeds 10 demo companies (+24 job posts, all tagged `seededBy: "amrut-jobs-portal-seed"`), sets `FIREBASE_*` env vars on the Vercel backend, writes `backend/.env` for local dev, and redeploys. Before real production launch, remove all seeded demo data with:

```bash
GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json npx tsx scripts/seed-firestore.ts remove
```

## Features

- 🏠 Home — hero search, categories, featured jobs, top companies
- 🔍 Jobs — search + filters (work mode, experience, job type, category, salary), sorting, pagination
- 📄 Job detail — full JD from the real post (intro, responsibilities, qualifications, perks), one-click apply
- 📊 My Applications — status pipeline (Applied → Under Review → Shortlisted → Interview → Offer/Rejected) with timeline; applications land in the company's Firestore
- 🔖 Saved jobs, 👤 editable seeker profile
- 📱 Fully responsive — bottom nav on mobile, drawer filters

## Deployments

- Frontend: https://jobnest-frontend-eight.vercel.app (Vercel project `jobnest-frontend`)
- Backend: https://jobnest-backend-omega.vercel.app (Vercel project `jobnest-backend`)
- Frontend env: `NEXT_PUBLIC_API_URL` → backend `/api`
- Backend env (live mode): `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`

## API endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Status + data mode (firestore/dummy) |
| GET | `/api/jobs` | List jobs (q, location, category, jobType, workMode, expMin/Max, salaryMin, sort, page, limit) |
| GET | `/api/jobs/featured` | Featured jobs |
| GET | `/api/jobs/:id` | Job detail (+ isApplied / isSaved) |
| GET | `/api/jobs/:id/similar` | Similar jobs |
| GET | `/api/companies` | Companies (+ open job counts) |
| GET | `/api/companies/:id` | Company + its jobs |
| GET/POST | `/api/applications` | List / apply (writes to Firestore `jobApplications`) |
| DELETE | `/api/applications/:id` | Withdraw application |
| GET/POST | `/api/saved-jobs` | List / save |
| DELETE | `/api/saved-jobs/:jobId` | Unsave |
| GET/PUT | `/api/profile` | Get / update seeker profile |
| GET | `/api/meta` | Filter options (computed from live catalogue) |

## Related changes in other repos

- `AmrutAIWebsite/components/careers/JobsListing.tsx` + `app/careers/jobs/[jobId]/page.tsx` + `lib/careers/jobs.ts` — careers page now shows **only Amrut's own jobs** (`isAmrutOwnJob`); other companies' postings appear only on Amrut Jobs. Redeploy the website for this to take effect.
