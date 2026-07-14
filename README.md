# JobNest — Job Portal 💼

Naukri.com-style job portal for **job seekers** — search jobs, apply in one click, and track every application. Built with dummy data for now (Firebase will replace the in-memory store later).

## Structure

```
job portal/
├── frontend/   # Next.js 14 + TypeScript + Redux Toolkit (RTK Query) + Tailwind CSS
└── backend/    # Express + TypeScript, dummy data (108 jobs, 15 companies)
```

## Quick start

```bash
# 1. Install everything (root + backend + frontend)
npm run install:all

# 2. Run both servers together
npm run dev
```

- Frontend → http://localhost:3000
- Backend API → http://localhost:4000/api/health

Or run them separately: `npm run dev:backend` / `npm run dev:frontend`.

## Features

- 🏠 **Home** — hero search, categories, featured jobs, top companies (Naukri-style landing)
- 🔍 **Jobs** — search + filters (work mode, experience, job type, category, salary), sorting, pagination
- 📄 **Job detail** — full JD, skills, benefits, company info, similar jobs, one-click apply with cover note
- 📊 **My Applications** — status pipeline tracker (Applied → Under Review → Shortlisted → Interview → Offer/Rejected) with full timeline, withdraw option
- 🔖 **Saved jobs** — bookmark any job
- 👤 **Profile** — headline, about, skills, experience, education, resume, career preferences (editable)
- 🏢 **Companies** — browse companies, ratings, open roles
- 📱 Fully responsive — bottom nav on mobile, sidebar filters become a drawer

## Tech notes

- All data flows through **RTK Query** (`frontend/src/store/api.ts`) with cache invalidation tags — applying/saving updates every screen automatically.
- Backend state is **in-memory** (`backend/src/data/store.ts`) — restart resets applications/saves. This file is the single swap-point for Firebase later.
- API base URL configured in `frontend/.env.local` (`NEXT_PUBLIC_API_URL`).

## API endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/jobs` | List jobs (q, location, category, jobType, workMode, expMin/Max, salaryMin, sort, page, limit) |
| GET | `/api/jobs/featured` | Featured jobs |
| GET | `/api/jobs/:id` | Job detail (+ isApplied / isSaved) |
| GET | `/api/jobs/:id/similar` | Similar jobs |
| GET | `/api/companies` | Companies (+ open job counts) |
| GET | `/api/companies/:id` | Company + its jobs |
| GET/POST | `/api/applications` | List / apply |
| DELETE | `/api/applications/:id` | Withdraw application |
| GET/POST | `/api/saved-jobs` | List / save |
| DELETE | `/api/saved-jobs/:jobId` | Unsave |
| GET/PUT | `/api/profile` | Get / update profile |
| GET | `/api/meta` | Filter options |
