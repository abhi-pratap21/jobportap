'use client';

import Link from 'next/link';
import { useState } from 'react';
import { MapPin, Search, Star, Users } from 'lucide-react';
import CompanyLogo from '@/components/CompanyLogo';
import EmptyState from '@/components/EmptyState';
import { useGetCompaniesQuery } from '@/store/api';

export default function CompaniesPage() {
  const { data: companies, isLoading } = useGetCompaniesQuery();
  const [q, setQ] = useState('');

  const filtered =
    companies?.filter(
      (c) =>
        c.name.toLowerCase().includes(q.toLowerCase()) ||
        c.industry.toLowerCase().includes(q.toLowerCase())
    ) ?? [];

  return (
    <div className="container-page py-6 sm:py-8">
      <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">Top companies hiring now</h1>
      <p className="mt-1 text-sm text-slate-500">Explore culture, ratings and open roles</p>

      <label className="mt-5 flex max-w-md items-center gap-2.5 rounded-2xl border border-slate-200 bg-white px-4 py-3">
        <Search size={18} className="text-slate-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by company or industry"
          className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
        />
      </label>

      {isLoading ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card h-48 animate-pulse bg-slate-100" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <Link
              key={c.id}
              href={`/companies/${c.id}`}
              className="card group p-5 transition hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              <div className="flex items-start gap-4">
                <CompanyLogo name={c.name} color={c.logoColor} />
                <div className="min-w-0">
                  <h2 className="truncate text-base font-bold text-slate-900 group-hover:text-brand-700">{c.name}</h2>
                  <p className="text-xs text-slate-500">{c.industry}</p>
                  <p className="mt-1 inline-flex items-center gap-1 text-xs text-slate-500">
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                    {c.rating} · {c.reviews.toLocaleString('en-IN')} reviews
                  </p>
                </div>
              </div>
              <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-500">{c.about}</p>
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-slate-100 pt-3 text-xs text-slate-500">
                {c.headquarters && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin size={12} /> {c.headquarters.split(',')[0]}
                  </span>
                )}
                {c.size && (
                  <span className="inline-flex items-center gap-1">
                    <Users size={12} /> {c.size}
                  </span>
                )}
                <span className="ml-auto rounded-full bg-brand-50 px-2.5 py-1 font-bold text-brand-700">
                  {c.openJobs} jobs
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-6 max-w-xl">
          <EmptyState title="No companies found" subtitle="Try a different company name or industry." />
        </div>
      )}
    </div>
  );
}
