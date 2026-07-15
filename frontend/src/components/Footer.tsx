import Link from 'next/link';
import { BriefcaseBusiness } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white pb-24 md:pb-8">
      <div className="container-page grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-brand-400 text-white">
              <BriefcaseBusiness size={16} />
            </span>
            <span className="text-lg font-extrabold text-slate-900">
              Amrut<span className="text-brand-600">Jobs</span>
            </span>
          </div>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-500">
            India&apos;s smartest job platform, by the team behind{' '}
            <a href="https://amrut.ai" target="_blank" rel="noreferrer" className="font-medium text-brand-600 hover:underline">
              amrut.ai
            </a>
            . Discover opportunities, apply in one click and track every application in one place.
          </p>
        </div>
        {[
          {
            title: 'Explore',
            links: [
              { label: 'Browse Jobs', href: '/jobs' },
              { label: 'Companies', href: '/companies' },
              { label: 'Remote Jobs', href: '/jobs?workMode=Remote' },
              { label: 'Internships', href: '/jobs?jobType=Internship' },
            ],
          },
          {
            title: 'My Account',
            links: [
              { label: 'My Profile', href: '/profile' },
              { label: 'My Applications', href: '/applications' },
              { label: 'Saved Jobs', href: '/saved' },
            ],
          },
          {
            title: 'Company',
            links: [
              { label: 'About Us', href: '#' },
              { label: 'Contact', href: '#' },
              { label: 'Privacy Policy', href: '#' },
              { label: 'Terms of Service', href: '#' },
            ],
          },
        ].map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-bold uppercase tracking-wide text-slate-900">{col.title}</h4>
            <ul className="mt-3 space-y-2">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-slate-500 transition hover:text-brand-600">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-100">
        <div className="container-page py-4 text-center text-xs text-slate-400">
          © 2026 Amrut Jobs · An amrut.ai product. Made with ❤️ in India.
        </div>
      </div>
    </footer>
  );
}
