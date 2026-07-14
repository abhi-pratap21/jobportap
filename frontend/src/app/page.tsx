'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  Code2,
  Database,
  FileSearch,
  LineChart,
  Megaphone,
  MousePointerClick,
  Palette,
  Rocket,
  ShieldCheck,
  Star,
  UserRound,
  Wallet,
} from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import JobCard from '@/components/JobCard';
import CompanyLogo from '@/components/CompanyLogo';
import { ListSkeleton } from '@/components/Skeletons';
import { useGetCompaniesQuery, useGetFeaturedJobsQuery } from '@/store/api';

const categories = [
  { name: 'Engineering', icon: Code2, count: '2.4k+ jobs' },
  { name: 'Data Science', icon: Database, count: '860+ jobs' },
  { name: 'Design', icon: Palette, count: '540+ jobs' },
  { name: 'Product', icon: Rocket, count: '390+ jobs' },
  { name: 'Marketing', icon: Megaphone, count: '720+ jobs' },
  { name: 'Finance', icon: Wallet, count: '480+ jobs' },
  { name: 'Sales', icon: LineChart, count: '1.1k+ jobs' },
  { name: 'Human Resources', icon: UserRound, count: '310+ jobs' },
];

const stats = [
  { value: '50k+', label: 'Live jobs' },
  { value: '8k+', label: 'Companies hiring' },
  { value: '10M+', label: 'Job seekers' },
  { value: '96%', label: 'Match accuracy' },
];

const steps = [
  {
    icon: FileSearch,
    title: 'Discover jobs',
    text: 'Search thousands of curated openings with smart filters for role, salary, location and work mode.',
  },
  {
    icon: MousePointerClick,
    title: 'Apply in one click',
    text: 'Your JobNest profile is your resume. Apply to any job instantly — no forms, no friction.',
  },
  {
    icon: BadgeCheck,
    title: 'Track everything',
    text: 'Follow every application from Applied to Offer with a live status timeline and updates.',
  },
];

export default function HomePage() {
  const router = useRouter();
  const { data: featured, isLoading: loadingJobs } = useGetFeaturedJobsQuery();
  const { data: companies } = useGetCompaniesQuery();

  const onSearch = (q: string, location: string) => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (location) params.set('location', location);
    router.push(`/jobs${params.toString() ? `?${params}` : ''}`);
  };

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-slate-50">
        <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[52rem] -translate-x-1/2 rounded-full bg-brand-200/40 blur-3xl" />
        <div className="container-page relative py-14 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-brand-700 shadow-sm">
              <ShieldCheck size={14} />
              Trusted by 10M+ job seekers across India
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Find the job that <span className="bg-gradient-to-r from-brand-600 to-violet-500 bg-clip-text text-transparent">finds you</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base text-slate-500 sm:text-lg">
              Search 50,000+ live openings from India&apos;s best companies. Apply in one click and
              track every application — all in one place.
            </p>
          </div>

          <div className="mx-auto mt-8 max-w-3xl animate-fade-up">
            <SearchBar onSearch={onSearch} size="lg" />
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
              <span className="font-medium">Popular:</span>
              {['React', 'Data Scientist', 'Product Manager', 'Remote', 'DevOps'].map((t) => (
                <Link
                  key={t}
                  href={`/jobs?q=${encodeURIComponent(t === 'Remote' ? '' : t)}${t === 'Remote' ? '&workMode=Remote' : ''}`}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 transition hover:border-brand-300 hover:text-brand-600"
                >
                  {t}
                </Link>
              ))}
            </div>
          </div>

          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="card px-4 py-5 text-center">
                <div className="text-2xl font-extrabold text-slate-900">{s.value}</div>
                <div className="mt-0.5 text-xs font-medium text-slate-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Categories ---------- */}
      <section className="container-page py-12 sm:py-16">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">Browse by category</h2>
            <p className="mt-1 text-sm text-slate-500">Explore openings across every domain</p>
          </div>
          <Link href="/jobs" className="hidden items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700 sm:inline-flex">
            All jobs <ArrowRight size={16} />
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map(({ name, icon: Icon, count }) => (
            <Link
              key={name}
              href={`/jobs?category=${encodeURIComponent(name)}`}
              className="card group flex items-center gap-3.5 p-4 transition hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
                <Icon size={20} />
              </span>
              <span>
                <span className="block text-sm font-bold text-slate-900">{name}</span>
                <span className="block text-xs text-slate-400">{count}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------- Featured jobs ---------- */}
      <section className="bg-white py-12 sm:py-16">
        <div className="container-page">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">Featured jobs</h2>
              <p className="mt-1 text-sm text-slate-500">Hand-picked opportunities for you</p>
            </div>
            <Link href="/jobs" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700">
              View all <ArrowRight size={16} />
            </Link>
          </div>
          <div className="mt-6">
            {loadingJobs ? (
              <div className="grid gap-4 md:grid-cols-2">
                <ListSkeleton count={2} />
                <ListSkeleton count={2} />
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {featured?.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ---------- Top companies ---------- */}
      <section className="container-page py-12 sm:py-16">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">Top companies hiring</h2>
            <p className="mt-1 text-sm text-slate-500">Join teams building the future</p>
          </div>
          <Link href="/companies" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700">
            View all <ArrowRight size={16} />
          </Link>
        </div>
        <div className="mt-6 flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {companies?.slice(0, 8).map((c) => (
            <Link
              key={c.id}
              href={`/companies/${c.id}`}
              className="card flex w-56 shrink-0 flex-col items-center p-5 text-center transition hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              <CompanyLogo name={c.name} color={c.logoColor} size="lg" />
              <span className="mt-3 line-clamp-1 text-sm font-bold text-slate-900">{c.name}</span>
              <span className="mt-0.5 inline-flex items-center gap-1 text-xs text-slate-500">
                <Star size={12} className="fill-amber-400 text-amber-400" />
                {c.rating} · {c.reviews.toLocaleString('en-IN')} reviews
              </span>
              <span className="mt-3 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                {c.openJobs} open jobs
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------- How it works ---------- */}
      <section className="bg-gradient-to-b from-white to-brand-50/60 py-12 sm:py-16">
        <div className="container-page">
          <div className="text-center">
            <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">How JobNest works</h2>
            <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
              Three simple steps between you and your next role
            </p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {steps.map(({ icon: Icon, title, text }, i) => (
              <div key={title} className="card relative p-6">
                <span className="absolute right-5 top-5 text-4xl font-extrabold text-slate-100">0{i + 1}</span>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-brand-400 text-white shadow-sm">
                  <Icon size={22} />
                </span>
                <h3 className="mt-4 text-base font-bold text-slate-900">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="container-page pb-4 pt-12 sm:pt-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-700 via-brand-600 to-violet-600 px-6 py-12 text-center sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
          <BriefcaseBusiness className="mx-auto text-white/80" size={36} />
          <h2 className="mx-auto mt-4 max-w-xl text-2xl font-extrabold text-white sm:text-3xl">
            Your dream job is one click away
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-brand-100">
            Complete your profile and let the best opportunities come to you.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/jobs" className="btn-primary !bg-white !text-brand-700 hover:!bg-brand-50">
              Explore Jobs <ArrowRight size={16} />
            </Link>
            <Link href="/profile" className="btn-secondary !border-white/30 !bg-transparent !text-white hover:!border-white">
              <Building2 size={16} /> Complete Profile
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
