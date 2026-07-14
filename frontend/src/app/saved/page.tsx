'use client';

import JobCard from '@/components/JobCard';
import EmptyState from '@/components/EmptyState';
import { ListSkeleton } from '@/components/Skeletons';
import { useGetSavedJobsQuery, useUnsaveJobMutation } from '@/store/api';
import type { Job } from '@/lib/types';

export default function SavedJobsPage() {
  const { data: saved, isLoading } = useGetSavedJobsQuery();
  const [unsaveJob] = useUnsaveJobMutation();

  const onToggleSave = (job: Job) => unsaveJob(job.id);

  return (
    <div className="container-page py-6 sm:py-8">
      <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">Saved Jobs</h1>
      <p className="mt-1 text-sm text-slate-500">
        {saved?.length ?? 0} job{(saved?.length ?? 0) === 1 ? '' : 's'} saved for later
      </p>

      <div className="mt-6 max-w-3xl">
        {isLoading ? (
          <ListSkeleton count={3} />
        ) : saved && saved.length > 0 ? (
          <div className="space-y-4">
            {saved.map((job) => (
              <JobCard key={job.id} job={job} saved onToggleSave={onToggleSave} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No saved jobs"
            subtitle="Tap the bookmark icon on any job to save it here for later."
            actionLabel="Browse jobs"
            actionHref="/jobs"
          />
        )}
      </div>
    </div>
  );
}
