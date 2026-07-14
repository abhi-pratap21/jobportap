import Link from 'next/link';
import { SearchX } from 'lucide-react';

interface Props {
  title: string;
  subtitle: string;
  actionLabel?: string;
  actionHref?: string;
}

export default function EmptyState({ title, subtitle, actionLabel, actionHref }: Props) {
  return (
    <div className="card flex flex-col items-center px-6 py-16 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-500">
        <SearchX size={28} />
      </span>
      <h3 className="mt-4 text-lg font-bold text-slate-900">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500">{subtitle}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref} className="btn-primary mt-6">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
