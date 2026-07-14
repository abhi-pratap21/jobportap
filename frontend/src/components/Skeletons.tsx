export function JobCardSkeleton() {
  return (
    <div className="card animate-pulse p-5">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-xl bg-slate-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-2/3 rounded bg-slate-200" />
          <div className="h-3 w-1/3 rounded bg-slate-200" />
        </div>
      </div>
      <div className="mt-4 h-3 w-full rounded bg-slate-100" />
      <div className="mt-3 flex gap-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-6 w-16 rounded-full bg-slate-100" />
        ))}
      </div>
    </div>
  );
}

export function ListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <JobCardSkeleton key={i} />
      ))}
    </div>
  );
}
