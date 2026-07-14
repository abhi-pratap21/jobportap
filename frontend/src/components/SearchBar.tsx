'use client';

import { FormEvent, useState } from 'react';
import { MapPin, Search } from 'lucide-react';

interface Props {
  initialQ?: string;
  initialLocation?: string;
  onSearch: (q: string, location: string) => void;
  size?: 'md' | 'lg';
}

export default function SearchBar({ initialQ = '', initialLocation = '', onSearch, size = 'md' }: Props) {
  const [q, setQ] = useState(initialQ);
  const [location, setLocation] = useState(initialLocation);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(q.trim(), location.trim());
  };

  return (
    <form
      onSubmit={submit}
      className={
        size === 'lg'
          ? 'flex flex-col gap-2 rounded-2xl bg-white p-2 shadow-card-hover sm:flex-row sm:items-center sm:rounded-full'
          : 'flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-2 sm:flex-row sm:items-center sm:rounded-full'
      }
    >
      <label className="flex flex-1 items-center gap-2.5 rounded-full px-3.5 py-2">
        <Search size={18} className="shrink-0 text-slate-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Job title, skills or company"
          className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
        />
      </label>
      <div className="hidden h-6 w-px bg-slate-200 sm:block" />
      <label className="flex flex-1 items-center gap-2.5 rounded-full px-3.5 py-2 sm:max-w-[220px]">
        <MapPin size={18} className="shrink-0 text-slate-400" />
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
          className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
        />
      </label>
      <button type="submit" className="btn-primary sm:rounded-full">
        <Search size={16} className="sm:hidden" />
        Search Jobs
      </button>
    </form>
  );
}
