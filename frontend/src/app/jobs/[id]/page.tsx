'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import {
  ArrowLeft,
  Bookmark,
  Briefcase,
  Building2,
  CheckCircle2,
  Clock,
  Gift,
  IndianRupee,
  ListChecks,
  MapPin,
  Send,
  Star,
  Users,
  X,
} from 'lucide-react';
import CompanyLogo from '@/components/CompanyLogo';
import JobCard from '@/components/JobCard';
import { JobCardSkeleton } from '@/components/Skeletons';
import {
  useApplyToJobMutation,
  useGetJobQuery,
  useGetSimilarJobsQuery,
  useSaveJobMutation,
  useUnsaveJobMutation,
} from '@/store/api';
import { formatExperience, formatPosted, formatSalary } from '@/lib/utils';

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: job, isLoading } = useGetJobQuery(id);
  const { data: similar } = useGetSimilarJobsQuery(id);
  const [applyToJob, { isLoading: applying }] = useApplyToJobMutation();
  const [saveJob] = useSaveJobMutation();
  const [unsaveJob] = useUnsaveJobMutation();

  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverNote, setCoverNote] = useState('');
  const [justApplied, setJustApplied] = useState(false);

  if (isLoading) {
    return (
      <div className="container-page space-y-4 py-8">
        <JobCardSkeleton />
        <JobCardSkeleton />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container-page py-16 text-center">
        <h1 className="text-xl font-bold text-slate-900">Job not found</h1>
        <Link href="/jobs" className="btn-primary mt-6">
          Browse all jobs
        </Link>
      </div>
    );
  }

  const applied = job.isApplied || justApplied;

  const submitApplication = async () => {
    try {
      await applyToJob({ jobId: job.id, coverNote: coverNote.trim() || undefined }).unwrap();
      setJustApplied(true);
      setShowApplyModal(false);
    } catch {
      // 409 = already applied — treat as applied
      setJustApplied(true);
      setShowApplyModal(false);
    }
  };

  return (
    <div className="container-page py-6 sm:py-8">
      <Link href="/jobs" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition hover:text-brand-600">
        <ArrowLeft size={16} /> Back to jobs
      </Link>

      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          {/* ---- Job header card ---- */}
          <div className="card p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <CompanyLogo name={job.company.name} color={job.company.logoColor} size="lg" />
              <div className="min-w-0 flex-1">
                <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl">{job.title}</h1>
                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                  <Link href={`/companies/${job.companyId}`} className="font-semibold text-slate-700 hover:text-brand-600">
                    {job.company.name}
                  </Link>
                  <span className="inline-flex items-center gap-1 text-slate-500">
                    <Star size={13} className="fill-amber-400 text-amber-400" />
                    {job.company.rating} · {job.company.reviews.toLocaleString('en-IN')} reviews
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
                  <span className="inline-flex items-center gap-1.5">
                    <Briefcase size={15} className="text-slate-400" /> {formatExperience(job)}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <IndianRupee size={15} className="text-slate-400" /> {formatSalary(job).replace('₹', '')}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={15} className="text-slate-400" /> {job.location}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="chip !bg-brand-50 !text-brand-700">{job.workMode}</span>
                  <span className="chip">{job.jobType}</span>
                  <span className="chip">{job.category}</span>
                  <span className="chip">{job.openings} openings</span>
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <Clock size={13} /> Posted {formatPosted(job.postedDaysAgo)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Users size={13} /> {job.applicants.toLocaleString('en-IN')} applicants
                </span>
              </div>
              <div className="flex w-full gap-2 sm:w-auto">
                <button
                  onClick={() => (job.isSaved ? unsaveJob(job.id) : saveJob(job.id))}
                  className="btn-secondary flex-1 sm:flex-none"
                >
                  <Bookmark size={16} className={job.isSaved ? 'fill-brand-600 text-brand-600' : ''} />
                  {job.isSaved ? 'Saved' : 'Save'}
                </button>
                {applied ? (
                  <span className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-50 px-5 py-2.5 text-sm font-bold text-emerald-700 sm:flex-none">
                    <CheckCircle2 size={16} /> Applied
                  </span>
                ) : (
                  <button onClick={() => setShowApplyModal(true)} className="btn-primary flex-1 sm:flex-none">
                    <Send size={16} /> Apply Now
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ---- Description ---- */}
          <div className="card p-6">
            <h2 className="text-lg font-extrabold text-slate-900">Job description</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{job.description}</p>

            <h3 className="mt-6 flex items-center gap-2 text-base font-bold text-slate-900">
              <ListChecks size={18} className="text-brand-600" /> Key responsibilities
            </h3>
            <ul className="mt-3 space-y-2">
              {job.responsibilities.map((r) => (
                <li key={r} className="flex gap-2.5 text-sm leading-relaxed text-slate-600">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-brand-500" />
                  {r}
                </li>
              ))}
            </ul>

            <h3 className="mt-6 flex items-center gap-2 text-base font-bold text-slate-900">
              <Briefcase size={18} className="text-brand-600" /> Requirements
            </h3>
            <ul className="mt-3 space-y-2">
              {job.requirements.map((r) => (
                <li key={r} className="flex gap-2.5 text-sm leading-relaxed text-slate-600">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-brand-500" />
                  {r}
                </li>
              ))}
            </ul>

            <h3 className="mt-6 flex items-center gap-2 text-base font-bold text-slate-900">
              <Gift size={18} className="text-brand-600" /> Benefits
            </h3>
            <ul className="mt-3 space-y-2">
              {job.benefits.map((b) => (
                <li key={b} className="flex gap-2.5 text-sm leading-relaxed text-slate-600">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-500" />
                  {b}
                </li>
              ))}
            </ul>

            <h3 className="mt-6 text-base font-bold text-slate-900">Skills</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {job.skills.map((s) => (
                <span key={s} className="chip !px-3 !py-1.5">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ---- Sidebar ---- */}
        <aside className="space-y-6">
          <div className="card p-6">
            <h3 className="flex items-center gap-2 text-base font-bold text-slate-900">
              <Building2 size={18} className="text-brand-600" /> About the company
            </h3>
            <div className="mt-4 flex items-center gap-3">
              <CompanyLogo name={job.company.name} color={job.company.logoColor} />
              <div>
                <div className="text-sm font-bold text-slate-900">{job.company.name}</div>
                <div className="text-xs text-slate-500">{job.company.industry}</div>
              </div>
            </div>
            <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-slate-600">{job.company.about}</p>
            <dl className="mt-4 space-y-2 text-sm">
              {job.company.size && (
                <div className="flex justify-between">
                  <dt className="text-slate-400">Company size</dt>
                  <dd className="font-medium text-slate-700">{job.company.size}</dd>
                </div>
              )}
              {job.company.founded > 0 && (
                <div className="flex justify-between">
                  <dt className="text-slate-400">Founded</dt>
                  <dd className="font-medium text-slate-700">{job.company.founded}</dd>
                </div>
              )}
              {job.company.headquarters && (
                <div className="flex justify-between">
                  <dt className="text-slate-400">Headquarters</dt>
                  <dd className="font-medium text-slate-700">{job.company.headquarters.split(',')[0]}</dd>
                </div>
              )}
            </dl>
            <Link href={`/companies/${job.companyId}`} className="btn-secondary mt-4 w-full">
              View company page
            </Link>
          </div>

          {similar && similar.length > 0 && (
            <div>
              <h3 className="mb-3 text-base font-extrabold text-slate-900">Similar jobs</h3>
              <div className="space-y-4">
                {similar.map((j) => (
                  <JobCard key={j.id} job={j} />
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* ---- Apply modal ---- */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setShowApplyModal(false)} />
          <div className="relative w-full max-w-lg rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl">
            <button
              onClick={() => setShowApplyModal(false)}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100"
              aria-label="Close"
            >
              <X size={18} />
            </button>
            <h3 className="pr-8 text-lg font-extrabold text-slate-900">
              Apply to {job.company.name}
            </h3>
            <p className="mt-1 text-sm text-slate-500">{job.title} · {job.location.split(',')[0]}</p>

            <div className="mt-4 rounded-2xl bg-brand-50/70 p-4 text-sm text-slate-600">
              Your Amrut Jobs profile and resume will be shared with the recruiter. Make sure your
              profile is up to date before applying.
            </div>

            <label className="mt-4 block text-sm font-semibold text-slate-700">
              Cover note <span className="font-normal text-slate-400">(optional)</span>
              <textarea
                value={coverNote}
                onChange={(e) => setCoverNote(e.target.value)}
                rows={4}
                placeholder="Tell the recruiter why you are a great fit…"
                className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-sm font-normal outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              />
            </label>

            <div className="mt-5 flex gap-3">
              <button onClick={() => setShowApplyModal(false)} className="btn-secondary flex-1">
                Cancel
              </button>
              <button onClick={submitApplication} disabled={applying} className="btn-primary flex-1">
                <Send size={16} /> {applying ? 'Submitting…' : 'Submit Application'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
