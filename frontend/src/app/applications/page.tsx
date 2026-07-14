'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Check, ChevronDown, MapPin, Trash2, X } from 'lucide-react';
import CompanyLogo from '@/components/CompanyLogo';
import StatusBadge from '@/components/StatusBadge';
import EmptyState from '@/components/EmptyState';
import { ListSkeleton } from '@/components/Skeletons';
import { useGetApplicationsQuery, useWithdrawApplicationMutation } from '@/store/api';
import type { Application, ApplicationStatus } from '@/lib/types';
import { cn, formatDate } from '@/lib/utils';

const PIPELINE: ApplicationStatus[] = ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Offer'];
const FILTERS: Array<ApplicationStatus | 'All'> = ['All', 'Applied', 'Under Review', 'Shortlisted', 'Interview', 'Offer', 'Rejected'];

function ProgressTracker({ application }: { application: Application }) {
  const rejected = application.status === 'Rejected';
  const reachedIndex = rejected
    ? PIPELINE.indexOf(application.timeline[application.timeline.length - 2]?.status ?? 'Applied')
    : PIPELINE.indexOf(application.status);

  return (
    <div className="mt-4">
      <div className="flex items-center">
        {PIPELINE.map((step, i) => {
          const done = i <= reachedIndex && !rejected;
          const half = rejected && i <= reachedIndex;
          return (
            <div key={step} className={cn('flex items-center', i < PIPELINE.length - 1 && 'flex-1')}>
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-full border-2 text-[10px] font-bold transition',
                    done
                      ? 'border-brand-600 bg-brand-600 text-white'
                      : half
                        ? 'border-rose-300 bg-rose-50 text-rose-500'
                        : 'border-slate-200 bg-white text-slate-300'
                  )}
                >
                  {done ? <Check size={13} /> : half ? <X size={13} /> : i + 1}
                </span>
              </div>
              {i < PIPELINE.length - 1 && (
                <div className={cn('mx-1 h-0.5 flex-1 rounded', i < reachedIndex && !rejected ? 'bg-brand-600' : 'bg-slate-200')} />
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-1.5 hidden justify-between text-[10px] font-semibold text-slate-400 sm:flex">
        {PIPELINE.map((step, i) => (
          <span key={step} className={cn(i <= reachedIndex && !rejected && 'text-brand-700')}>
            {step}
          </span>
        ))}
      </div>
    </div>
  );
}

function ApplicationCard({ application }: { application: Application }) {
  const [expanded, setExpanded] = useState(false);
  const [withdraw, { isLoading: withdrawing }] = useWithdrawApplicationMutation();
  const job = application.job;

  return (
    <div className="card p-5">
      <div className="flex items-start gap-4">
        <CompanyLogo name={job.company.name} color={job.company.logoColor} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <Link href={`/jobs/${job.id}`} className="block truncate text-base font-bold text-slate-900 hover:text-brand-700">
                {job.title}
              </Link>
              <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-sm text-slate-500">
                <span className="font-medium">{job.company.name}</span>
                <span className="inline-flex items-center gap-1 text-xs">
                  <MapPin size={12} /> {job.location.split(',')[0]}
                </span>
              </div>
            </div>
            <StatusBadge status={application.status} />
          </div>
          <p className="mt-1.5 text-xs text-slate-400">Applied on {formatDate(application.appliedOn)}</p>
        </div>
      </div>

      <ProgressTracker application={application} />

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        <button
          onClick={() => setExpanded((e) => !e)}
          className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700"
        >
          {expanded ? 'Hide timeline' : 'View timeline'}
          <ChevronDown size={14} className={cn('transition', expanded && 'rotate-180')} />
        </button>
        {!['Offer', 'Rejected'].includes(application.status) && (
          <button
            onClick={() => withdraw(application.id)}
            disabled={withdrawing}
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 transition hover:text-rose-600"
          >
            <Trash2 size={13} /> Withdraw
          </button>
        )}
      </div>

      {expanded && (
        <ol className="mt-4 space-y-0 border-t border-slate-100 pt-4">
          {application.timeline
            .slice()
            .reverse()
            .map((event, i, arr) => (
              <li key={`${event.status}-${event.date}`} className="relative flex gap-3 pb-5 last:pb-0">
                {i < arr.length - 1 && <span className="absolute left-[7px] top-5 h-full w-0.5 bg-slate-100" />}
                <span
                  className={cn(
                    'relative mt-1 h-4 w-4 shrink-0 rounded-full border-4',
                    i === 0
                      ? event.status === 'Rejected'
                        ? 'border-rose-100 bg-rose-500'
                        : 'border-brand-100 bg-brand-600'
                      : 'border-slate-100 bg-slate-300'
                  )}
                />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{event.status}</span>
                    <span className="text-xs text-slate-400">{formatDate(event.date)}</span>
                  </div>
                  <p className="mt-0.5 text-sm text-slate-500">{event.note}</p>
                </div>
              </li>
            ))}
        </ol>
      )}
    </div>
  );
}

export default function ApplicationsPage() {
  const { data: applications, isLoading } = useGetApplicationsQuery();
  const [filter, setFilter] = useState<ApplicationStatus | 'All'>('All');

  const filtered = applications?.filter((a) => filter === 'All' || a.status === filter) ?? [];
  const countFor = (f: ApplicationStatus | 'All') =>
    f === 'All' ? applications?.length ?? 0 : applications?.filter((a) => a.status === f).length ?? 0;

  return (
    <div className="container-page py-6 sm:py-8">
      <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">My Applications</h1>
      <p className="mt-1 text-sm text-slate-500">Track every application from Applied to Offer</p>

      <div className="mt-5 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-bold transition',
              filter === f
                ? 'border-brand-600 bg-brand-600 text-white'
                : 'border-slate-200 bg-white text-slate-600 hover:border-brand-300'
            )}
          >
            {f} ({countFor(f)})
          </button>
        ))}
      </div>

      <div className="mt-5 max-w-3xl">
        {isLoading ? (
          <ListSkeleton count={3} />
        ) : filtered.length > 0 ? (
          <div className="space-y-4">
            {filtered.map((a) => (
              <ApplicationCard key={a.id} application={a} />
            ))}
          </div>
        ) : (
          <EmptyState
            title={filter === 'All' ? 'No applications yet' : `No "${filter}" applications`}
            subtitle="Start applying to jobs and track their progress here — from Applied all the way to Offer."
            actionLabel="Browse jobs"
            actionHref="/jobs"
          />
        )}
      </div>
    </div>
  );
}
