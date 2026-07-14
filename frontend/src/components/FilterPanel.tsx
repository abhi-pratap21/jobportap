'use client';

import { useGetMetaQuery } from '@/store/api';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  clearFilters,
  setExperience,
  setSalaryMin,
  toggleCategory,
  toggleJobType,
  toggleWorkMode,
} from '@/store/filtersSlice';
import { cn } from '@/lib/utils';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-slate-100 py-4 last:border-0">
      <h4 className="text-sm font-bold text-slate-900">{title}</h4>
      <div className="mt-3 space-y-2">{children}</div>
    </div>
  );
}

function CheckRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-600">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-slate-300 text-brand-600 accent-brand-600"
      />
      {label}
    </label>
  );
}

export default function FilterPanel() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((s) => s.filters);
  const { data: meta } = useGetMetaQuery();

  const activeCount =
    filters.categories.length +
    filters.jobTypes.length +
    filters.workModes.length +
    (filters.experience ? 1 : 0) +
    (filters.salaryMin ? 1 : 0);

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-extrabold text-slate-900">
          Filters{activeCount > 0 && <span className="ml-2 rounded-full bg-brand-50 px-2 py-0.5 text-xs font-bold text-brand-700">{activeCount}</span>}
        </h3>
        {activeCount > 0 && (
          <button onClick={() => dispatch(clearFilters())} className="text-xs font-semibold text-brand-600 hover:text-brand-700">
            Clear all
          </button>
        )}
      </div>

      <Section title="Work mode">
        {meta?.workModes.map((m) => (
          <CheckRow key={m} label={m} checked={filters.workModes.includes(m)} onChange={() => dispatch(toggleWorkMode(m))} />
        ))}
      </Section>

      <Section title="Experience">
        {meta?.experienceLevels.map((e) => {
          const value = `${e.min}-${e.max}`;
          return (
            <label key={value} className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-600">
              <input
                type="radio"
                name="experience"
                checked={filters.experience === value}
                onChange={() => dispatch(setExperience(value))}
                onClick={() => filters.experience === value && dispatch(setExperience(value))}
                className="h-4 w-4 border-slate-300 accent-brand-600"
              />
              {e.label}
            </label>
          );
        })}
      </Section>

      <Section title="Job type">
        {meta?.jobTypes.map((t) => (
          <CheckRow key={t} label={t} checked={filters.jobTypes.includes(t)} onChange={() => dispatch(toggleJobType(t))} />
        ))}
      </Section>

      <Section title="Category">
        {meta?.categories.map((c) => (
          <CheckRow key={c} label={c} checked={filters.categories.includes(c)} onChange={() => dispatch(toggleCategory(c))} />
        ))}
      </Section>

      <Section title="Minimum salary">
        <div className="flex flex-wrap gap-2">
          {[5, 10, 15, 25, 40].map((s) => (
            <button
              key={s}
              onClick={() => dispatch(setSalaryMin(filters.salaryMin === s ? null : s))}
              className={cn(
                'rounded-full border px-3 py-1.5 text-xs font-semibold transition',
                filters.salaryMin === s
                  ? 'border-brand-600 bg-brand-600 text-white'
                  : 'border-slate-200 text-slate-600 hover:border-brand-300'
              )}
            >
              ₹{s}+ LPA
            </button>
          ))}
        </div>
      </Section>
    </div>
  );
}
