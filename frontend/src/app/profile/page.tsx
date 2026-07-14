'use client';

import { useState } from 'react';
import {
  Bookmark,
  Briefcase,
  Eye,
  FileText,
  GraduationCap,
  Languages,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Search,
  Sparkles,
  Wallet,
  X,
} from 'lucide-react';
import { useGetProfileQuery, useUpdateProfileMutation } from '@/store/api';
import { initials, formatDate } from '@/lib/utils';

export default function ProfilePage() {
  const { data: profile, isLoading } = useGetProfileQuery();
  const [updateProfile, { isLoading: saving }] = useUpdateProfileMutation();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ headline: '', about: '', skills: '' });

  if (isLoading || !profile) {
    return (
      <div className="container-page py-8">
        <div className="card h-48 animate-pulse bg-slate-100" />
      </div>
    );
  }

  const startEditing = () => {
    setForm({ headline: profile.headline, about: profile.about, skills: profile.skills.join(', ') });
    setEditing(true);
  };

  const save = async () => {
    await updateProfile({
      headline: form.headline,
      about: form.about,
      skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
    });
    setEditing(false);
  };

  const statCards = [
    { label: 'Applications', value: profile.stats.applied, icon: FileText },
    { label: 'Saved jobs', value: profile.stats.saved, icon: Bookmark },
    { label: 'Profile views', value: profile.stats.profileViews, icon: Eye },
    { label: 'Search appearances', value: profile.stats.searchAppearances, icon: Search },
  ];

  return (
    <div className="container-page py-6 sm:py-8">
      {/* ---- Profile header ---- */}
      <div className="card overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-brand-600 via-brand-500 to-violet-500 sm:h-28" />
        <div className="px-5 pb-6 sm:px-8">
          <div className="-mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <span className="flex h-20 w-20 items-center justify-center rounded-3xl border-4 border-white bg-gradient-to-br from-brand-600 to-brand-400 text-2xl font-extrabold text-white shadow-lg">
                {initials(profile.name)}
              </span>
              <div className="pb-1">
                <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl">{profile.name}</h1>
                <p className="text-sm text-slate-500">{profile.headline}</p>
              </div>
            </div>
            <button onClick={startEditing} className="btn-secondary self-start sm:self-auto">
              <Pencil size={15} /> Edit Profile
            </button>
          </div>

          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={15} className="text-slate-400" /> {profile.location}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Briefcase size={15} className="text-slate-400" /> {profile.totalExperienceYears} yrs experience
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Wallet size={15} className="text-slate-400" /> Expects ₹{profile.expectedSalaryLPA} LPA
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Mail size={15} className="text-slate-400" /> {profile.email}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Phone size={15} className="text-slate-400" /> {profile.phone}
            </span>
          </div>
        </div>
      </div>

      {/* ---- Stats ---- */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {statCards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="card flex items-center gap-3 p-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <Icon size={18} />
            </span>
            <span>
              <span className="block text-lg font-extrabold text-slate-900">{value}</span>
              <span className="block text-xs text-slate-400">{label}</span>
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          {/* About */}
          <div className="card p-6">
            <h2 className="flex items-center gap-2 text-base font-extrabold text-slate-900">
              <Sparkles size={18} className="text-brand-600" /> About
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{profile.about}</p>
          </div>

          {/* Experience */}
          <div className="card p-6">
            <h2 className="flex items-center gap-2 text-base font-extrabold text-slate-900">
              <Briefcase size={18} className="text-brand-600" /> Work experience
            </h2>
            <ol className="mt-4 space-y-0">
              {profile.workExperience.map((w, i) => (
                <li key={w.id} className="relative flex gap-4 pb-6 last:pb-0">
                  {i < profile.workExperience.length - 1 && (
                    <span className="absolute left-[9px] top-6 h-full w-0.5 bg-slate-100" />
                  )}
                  <span className="relative mt-1.5 h-5 w-5 shrink-0 rounded-full border-4 border-brand-100 bg-brand-600" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{w.title}</h3>
                    <p className="text-sm text-slate-500">
                      {w.company} · {w.from} – {w.to}
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{w.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Education */}
          <div className="card p-6">
            <h2 className="flex items-center gap-2 text-base font-extrabold text-slate-900">
              <GraduationCap size={18} className="text-brand-600" /> Education
            </h2>
            <div className="mt-4 space-y-4">
              {profile.education.map((e) => (
                <div key={e.id} className="rounded-2xl border border-slate-100 p-4">
                  <h3 className="text-sm font-bold text-slate-900">{e.degree}</h3>
                  <p className="text-sm text-slate-500">{e.institute}</p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {e.from} – {e.to} · {e.score}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          {/* Skills */}
          <div className="card p-6">
            <h2 className="text-base font-extrabold text-slate-900">Skills</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {profile.skills.map((s) => (
                <span key={s} className="chip !bg-brand-50 !px-3 !py-1.5 !text-brand-700">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Resume */}
          <div className="card p-6">
            <h2 className="text-base font-extrabold text-slate-900">Resume</h2>
            <div className="mt-3 flex items-center gap-3 rounded-2xl border border-dashed border-slate-200 p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
                <FileText size={18} />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">{profile.resume.fileName}</p>
                <p className="text-xs text-slate-400">Updated {formatDate(profile.resume.updatedOn)}</p>
              </div>
            </div>
            <button className="btn-secondary mt-3 w-full">Upload new resume</button>
          </div>

          {/* Preferences */}
          <div className="card p-6">
            <h2 className="text-base font-extrabold text-slate-900">Career preferences</h2>
            <dl className="mt-3 space-y-3 text-sm">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Preferred roles</dt>
                <dd className="mt-1 font-medium text-slate-700">{profile.preferredRoles.join(', ')}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Preferred locations</dt>
                <dd className="mt-1 font-medium text-slate-700">{profile.preferredLocations.join(', ')}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Notice period</dt>
                <dd className="mt-1 font-medium text-slate-700">{profile.noticePeriod}</dd>
              </div>
              <div>
                <dt className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  <Languages size={12} /> Languages
                </dt>
                <dd className="mt-1 font-medium text-slate-700">{profile.languages.join(', ')}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>

      {/* ---- Edit modal ---- */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setEditing(false)} />
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl">
            <button
              onClick={() => setEditing(false)}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100"
              aria-label="Close"
            >
              <X size={18} />
            </button>
            <h3 className="text-lg font-extrabold text-slate-900">Edit profile</h3>

            <label className="mt-4 block text-sm font-semibold text-slate-700">
              Headline
              <input
                value={form.headline}
                onChange={(e) => setForm({ ...form, headline: e.target.value })}
                className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-sm font-normal outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              />
            </label>
            <label className="mt-4 block text-sm font-semibold text-slate-700">
              About
              <textarea
                value={form.about}
                onChange={(e) => setForm({ ...form, about: e.target.value })}
                rows={4}
                className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-sm font-normal outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              />
            </label>
            <label className="mt-4 block text-sm font-semibold text-slate-700">
              Skills <span className="font-normal text-slate-400">(comma separated)</span>
              <input
                value={form.skills}
                onChange={(e) => setForm({ ...form, skills: e.target.value })}
                className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-sm font-normal outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              />
            </label>

            <div className="mt-5 flex gap-3">
              <button onClick={() => setEditing(false)} className="btn-secondary flex-1">
                Cancel
              </button>
              <button onClick={save} disabled={saving} className="btn-primary flex-1">
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
