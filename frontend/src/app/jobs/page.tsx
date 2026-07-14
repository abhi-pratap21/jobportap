'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, SlidersHorizontal, X } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import FilterPanel from '@/components/FilterPanel';
import JobCard from '@/components/JobCard';
import EmptyState from '@/components/EmptyState';
import { ListSkeleton } from '@/components/Skeletons';
import {
  useGetJobsQuery,
  useGetSavedJobsQuery,
  useSaveJobMutation,
  useUnsaveJobMutation,
} from '@/store/api';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setPage, setSearch, setSort, toggleCategory, toggleJobType, toggleWorkMode } from '@/store/filtersSlice';
import type { Job, JobsQuery } from '@/lib/types';

function JobsPageInner() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((s) => s.filters);
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  // hydrate redux filters from URL params once (links from home page / footer)
  useEffect(() => {
    const q = searchParams.get('q') ?? '';
    const location = searchParams.get('location') ?? '';
    if (q || location) dispatch(setSearch({ q, location }));
    const category = searchParams.get('category');
    if (category && !filters.categories.includes(category)) dispatch(toggleCategory(category));
    const workMode = searchParams.get('workMode');
    if (workMode && !filters.workModes.includes(workMode)) dispatch(toggleWorkMode(workMode));
    const jobType = searchParams.get('jobType');
    if (jobType && !filters.jobTypes.includes(jobType)) dispatch(toggleJobType(jobType));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const query: JobsQuery = {
    q: filters.q || undefined,
    location: filters.location || undefined,
    category: filters.categories.join(',') || undefined,
    jobType: filters.jobTypes.join(',') || undefined,
    workMode: filters.workModes.join(',') || undefined,
    expMin: filters.experience ? filters.experience.split('-')[0] : undefined,
    expMax: filters.experience ? filters.experience.split('-')[1] : undefined,
    salaryMin: filters.salaryMin ?? undefined,
    sort: filters.sort,
    page: filters.page,
    limit: 10,
  };

  const { data, isLoading, isFetching } = useGetJobsQuery(query);
  const { data: savedJobs } = useGetSavedJobsQuery();
  const [saveJob] = useSaveJobMutation();
  const [unsaveJob] = useUnsaveJobMutation();

  const savedIds = new Set(savedJobs?.map((j) => j.id));
  const onToggleSave = (job: Job) => {
    savedIds.has(job.id) ? unsaveJob(job.id) : saveJob(job.id);
  };

  return (
    <div className="container-page py-6 sm:py-8">
      <SearchBar
        key={`${filters.q}|${filters.location}`}
        initialQ={filters.q}
        initialLocation={filters.location}
        onSearch={(q, location) => dispatch(setSearch({ q, location }))}
      />

      <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Desktop filters */}
        <aside className="hidden lg:block">
          <div className="sticky top-20">
            <FilterPanel />
          </div>
        </aside>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-500">
              {isLoading ? (
                'Searching jobs…'
              ) : (
                <>
                  Showing <span className="font-bold text-slate-900">{data?.total ?? 0}</span> jobs
                  {filters.q && (
                    <>
                      {' '}for <span className="font-semibold text-brand-700">&ldquo;{filters.q}&rdquo;</span>
                    </>
                  )}
                </>
              )}
            </p>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowFilters(true)} className="btn-secondary !px-3.5 !py-2 lg:hidden">
                <SlidersHorizontal size={15} /> Filters
              </button>
              <select
                value={filters.sort}
                onChange={(e) => dispatch(setSort(e.target.value))}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:border-brand-400"
              >
                <option value="relevance">Relevance</option>
                <option value="recent">Most recent</option>
                <option value="salary-desc">Salary: high to low</option>
                <option value="salary-asc">Salary: low to high</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            {isLoading ? (
              <ListSkeleton count={5} />
            ) : data && data.jobs.length > 0 ? (
              <div className={`space-y-4 ${isFetching ? 'opacity-60' : ''}`}>
                {data.jobs.map((job) => (
                  <JobCard key={job.id} job={job} saved={savedIds.has(job.id)} onToggleSave={onToggleSave} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No jobs found"
                subtitle="Try changing your search keywords or removing some filters."
                actionLabel="Clear search"
                actionHref="/jobs"
              />
            )}
          </div>

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                disabled={filters.page <= 1}
                onClick={() => dispatch(setPage(filters.page - 1))}
                className="btn-secondary !px-3 !py-2 disabled:opacity-40"
                aria-label="Previous page"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: data.totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === data.totalPages || Math.abs(p - filters.page) <= 1)
                .reduce<Array<number | '…'>>((acc, p, i, arr) => {
                  if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push('…');
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === '…' ? (
                    <span key={`gap-${i}`} className="px-1 text-slate-400">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => dispatch(setPage(p))}
                      className={
                        p === filters.page
                          ? 'flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-sm font-bold text-white'
                          : 'flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:border-brand-300'
                      }
                    >
                      {p}
                    </button>
                  )
                )}
              <button
                disabled={filters.page >= data.totalPages}
                onClick={() => dispatch(setPage(filters.page + 1))}
                className="btn-secondary !px-3 !py-2 disabled:opacity-40"
                aria-label="Next page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setShowFilters(false)} />
          <div className="absolute inset-y-0 right-0 flex w-[85%] max-w-sm flex-col bg-slate-50 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
              <h3 className="text-base font-extrabold text-slate-900">Filters</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
                aria-label="Close filters"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <FilterPanel />
            </div>
            <div className="border-t border-slate-200 bg-white p-4">
              <button onClick={() => setShowFilters(false)} className="btn-primary w-full">
                Show {data?.total ?? 0} jobs
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={<div className="container-page py-8"><ListSkeleton count={5} /></div>}>
      <JobsPageInner />
    </Suspense>
  );
}
