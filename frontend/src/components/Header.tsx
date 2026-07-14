'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { BriefcaseBusiness, Building2, Bookmark, FileText, Menu, User, X } from 'lucide-react';
import { useGetProfileQuery } from '@/store/api';
import { cn, initials } from '@/lib/utils';

const navLinks = [
  { href: '/jobs', label: 'Jobs', icon: BriefcaseBusiness },
  { href: '/companies', label: 'Companies', icon: Building2 },
  { href: '/applications', label: 'My Applications', icon: FileText },
  { href: '/saved', label: 'Saved', icon: Bookmark },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { data: profile } = useGetProfileQuery();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-400 text-white shadow-sm">
            <BriefcaseBusiness size={18} />
          </span>
          <span className="text-xl font-extrabold tracking-tight text-slate-900">
            Job<span className="text-brand-600">Nest</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'rounded-lg px-3.5 py-2 text-sm font-medium transition',
                pathname.startsWith(href)
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/profile"
            className="hidden items-center gap-2 rounded-full border border-slate-200 py-1 pl-1 pr-3 transition hover:border-brand-300 md:flex"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-brand-400 text-xs font-bold text-white">
              {profile ? initials(profile.name) : <User size={14} />}
            </span>
            <span className="text-sm font-semibold text-slate-700">
              {profile ? profile.name.split(' ')[0] : 'Profile'}
            </span>
          </Link>

          {/* Mobile hamburger */}
          <button
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="border-t border-slate-100 bg-white px-4 py-3 md:hidden">
          {[...navLinks, { href: '/profile', label: 'My Profile', icon: User }].map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium',
                pathname.startsWith(href) ? 'bg-brand-50 text-brand-700' : 'text-slate-700 hover:bg-slate-50'
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
