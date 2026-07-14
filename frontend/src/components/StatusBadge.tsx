import type { ApplicationStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

const styles: Record<ApplicationStatus, string> = {
  Applied: 'bg-slate-100 text-slate-700',
  'Under Review': 'bg-blue-50 text-blue-700',
  Shortlisted: 'bg-violet-50 text-violet-700',
  Interview: 'bg-amber-50 text-amber-700',
  Offer: 'bg-emerald-50 text-emerald-700',
  Rejected: 'bg-rose-50 text-rose-700',
};

export default function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold', styles[status])}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
