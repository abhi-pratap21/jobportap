'use client';

import Link from 'next/link';
import { Bookmark, Briefcase, Clock, IndianRupee, MapPin, Star, Users } from 'lucide-react';
import type { Job } from '@/lib/types';
import { cn, formatExperience, formatPosted, formatSalary } from '@/lib/utils';
import CompanyLogo from './CompanyLogo';

interface Props {
  job: Job;
  saved?: boolean;
  onToggleSave?: (job: Job) => void;
}

export default function JobCard({ job, saved = false, onToggleSave }: Props) {
  return (
    <div className="card group relative p-5 transition hover:-translate-y-0.5 hover:shadow-card-hover">
      {job.featured && (
        <span className="absolute -top-2.5 left-5 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
          Featured
        </span>
      )}

      <div className="flex items-start gap-4">
        <CompanyLogo name={job.company.name} color={job.company.logoColor} />
        <div className="min-w-0 flex-1">
          <Link href={`/jobs/${job.id}`} className="block">
            <h3 className="truncate text-base font-bold text-slate-900 transition group-hover:text-brand-700">
              {job.title}
            </h3>
          </Link>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm text-slate-500">
            <Link href={`/companies/${job.companyId}`} className="font-medium text-slate-600 hover:text-brand-600">
              {job.company.name}
            </Link>
            <span className="inline-flex items-center gap-0.5 text-xs">
              <Star size={12} className="fill-amber-400 text-amber-400" />
              {job.company.rating}
            </span>
            <span className="text-xs text-slate-400">
              ({job.company.reviews.toLocaleString('en-IN')} reviews)
            </span>
          </div>
        </div>
        {onToggleSave && (
          <button
            onClick={() => onToggleSave(job)}
            aria-label={saved ? 'Unsave job' : 'Save job'}
            className={cn(
              'flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition',
              saved ? 'bg-brand-50 text-brand-600' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
            )}
          >
            <Bookmark size={18} className={saved ? 'fill-brand-600' : ''} />
          </button>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
        <span className="inline-flex items-center gap-1.5">
          <Briefcase size={14} className="text-slate-400" />
          {formatExperience(job)}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <IndianRupee size={14} className="text-slate-400" />
          {formatSalary(job).replace('₹', '')}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <MapPin size={14} className="text-slate-400" />
          {job.location.split(',')[0]}
          <span className="chip !py-0.5">{job.workMode}</span>
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {job.skills.slice(0, 5).map((s) => (
          <span key={s} className="chip">
            {s}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-400">
        <span className="inline-flex items-center gap-1">
          <Clock size={12} />
          {formatPosted(job.postedDaysAgo)}
        </span>
        <span className="inline-flex items-center gap-1">
          <Users size={12} />
          {job.applicants.toLocaleString('en-IN')} applicants
        </span>
      </div>
    </div>
  );
}
