'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Building2, Calendar, Globe, MapPin, Star, Users } from 'lucide-react';
import CompanyLogo from '@/components/CompanyLogo';
import JobCard from '@/components/JobCard';
import { ListSkeleton } from '@/components/Skeletons';
import { useGetCompanyQuery } from '@/store/api';

export default function CompanyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: company, isLoading } = useGetCompanyQuery(id);

  if (isLoading) {
    return (
      <div className="container-page py-8">
        <div className="card mb-6 h-48 animate-pulse bg-slate-100" />
        <ListSkeleton count={3} />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="container-page py-16 text-center">
        <h1 className="text-xl font-bold text-slate-900">Company not found</h1>
        <Link href="/companies" className="btn-primary mt-6">
          Browse companies
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-6 sm:py-8">
      <Link href="/companies" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition hover:text-brand-600">
        <ArrowLeft size={16} /> All companies
      </Link>

      <div className="card mt-4 overflow-hidden">
        <div className="h-24 sm:h-28" style={{ background: `linear-gradient(120deg, ${company.logoColor}, ${company.logoColor}99)` }} />
        <div className="px-5 pb-6 sm:px-8">
          <div className="-mt-8 flex flex-col gap-4 sm:flex-row sm:items-end">
            <CompanyLogo name={company.name} color={company.logoColor} size="lg" className="border-4 border-white shadow-lg" />
            <div className="flex-1 pb-1">
              <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl">{company.name}</h1>
              <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
                <span>{company.industry}</span>
                <span className="inline-flex items-center gap-1">
                  <Star size={13} className="fill-amber-400 text-amber-400" />
                  {company.rating} · {company.reviews.toLocaleString('en-IN')} reviews
                </span>
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={15} className="text-slate-400" /> {company.headquarters}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users size={15} className="text-slate-400" /> {company.size}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar size={15} className="text-slate-400" /> Founded {company.founded}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Globe size={15} className="text-slate-400" />
              <a href={company.website} target="_blank" rel="noreferrer" className="text-brand-600 hover:underline">
                Website
              </a>
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {company.tags.map((t) => (
              <span key={t} className="chip">
                {t}
              </span>
            ))}
          </div>

          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-600">{company.about}</p>
        </div>
      </div>

      <h2 className="mt-8 flex items-center gap-2 text-lg font-extrabold text-slate-900 sm:text-xl">
        <Building2 size={20} className="text-brand-600" />
        Open positions ({company.jobs.length})
      </h2>
      <div className="mt-4 grid max-w-5xl gap-4 md:grid-cols-2">
        {company.jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}
