import type { Job } from './types';

export const formatSalary = (job: Pick<Job, 'salaryMin' | 'salaryMax' | 'salaryLabel'>): string => {
  if (job.salaryMin > 0) return `₹${job.salaryMin}-${job.salaryMax} LPA`;
  return job.salaryLabel || 'Not disclosed';
};

export const formatExperience = (job: Pick<Job, 'experienceMin' | 'experienceMax'>): string => {
  if (job.experienceMin === 0 && job.experienceMax === 0) return 'Any experience';
  if (job.experienceMin === 0 && job.experienceMax <= 1) return 'Fresher';
  return `${job.experienceMin}-${job.experienceMax} yrs`;
};

export const formatPosted = (days: number): string => {
  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
};

export const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export const initials = (name: string): string =>
  name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

export const cn = (...classes: Array<string | false | null | undefined>): string =>
  classes.filter(Boolean).join(' ');
