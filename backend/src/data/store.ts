import { Application, ApplicationStatus, Profile, TimelineEvent } from '../types';

/**
 * In-memory "database". This is intentionally simple — when Firebase comes in,
 * only this file (and the data files) need to change; routes stay the same.
 */

const daysAgo = (n: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
};

const timeline = (steps: Array<[ApplicationStatus, number, string]>): TimelineEvent[] =>
  steps.map(([status, days, note]) => ({ status, date: daysAgo(days), note }));

export const applications: Application[] = [
  {
    id: 'a1',
    jobId: 'j2',
    appliedOn: daysAgo(12),
    status: 'Interview',
    timeline: timeline([
      ['Applied', 12, 'Your application was submitted successfully.'],
      ['Under Review', 10, 'Recruiter viewed your profile.'],
      ['Shortlisted', 6, 'You have been shortlisted for the next round.'],
      ['Interview', 2, 'Technical interview scheduled — check your email for the invite.'],
    ]),
  },
  {
    id: 'a2',
    jobId: 'j14',
    appliedOn: daysAgo(8),
    status: 'Under Review',
    timeline: timeline([
      ['Applied', 8, 'Your application was submitted successfully.'],
      ['Under Review', 5, 'Your profile is being reviewed by the hiring team.'],
    ]),
  },
  {
    id: 'a3',
    jobId: 'j27',
    appliedOn: daysAgo(20),
    status: 'Offer',
    timeline: timeline([
      ['Applied', 20, 'Your application was submitted successfully.'],
      ['Under Review', 18, 'Recruiter viewed your profile.'],
      ['Shortlisted', 14, 'You have been shortlisted for the next round.'],
      ['Interview', 9, 'Completed 2 rounds of interviews.'],
      ['Offer', 3, 'Congratulations! Offer letter has been rolled out.'],
    ]),
  },
  {
    id: 'a4',
    jobId: 'j33',
    appliedOn: daysAgo(15),
    status: 'Rejected',
    timeline: timeline([
      ['Applied', 15, 'Your application was submitted successfully.'],
      ['Under Review', 13, 'Your profile is being reviewed by the hiring team.'],
      ['Rejected', 7, 'The team decided to move ahead with other candidates. Keep applying!'],
    ]),
  },
];

export const savedJobIds: Set<string> = new Set(['j5', 'j18', 'j40']);

export const profile: Profile = {
  id: 'u1',
  name: 'Anil Sharma',
  email: 'anil@amrut.ai',
  phone: '+91 98765 43210',
  headline: 'Frontend Developer | React · TypeScript · Next.js',
  location: 'Bengaluru, Karnataka',
  totalExperienceYears: 3,
  currentSalaryLPA: 12,
  expectedSalaryLPA: 18,
  noticePeriod: '30 days',
  about:
    'Frontend developer with 3 years of experience building responsive, high-performance web applications. Passionate about clean UI, developer experience and shipping products that users love.',
  skills: ['React', 'TypeScript', 'Next.js', 'Redux Toolkit', 'Tailwind CSS', 'Node.js', 'Git', 'REST APIs'],
  languages: ['English', 'Hindi'],
  preferredLocations: ['Bengaluru, Karnataka', 'Pune, Maharashtra', 'Remote'],
  preferredRoles: ['Frontend Developer', 'Full Stack Engineer'],
  workExperience: [
    {
      id: 'w1',
      title: 'Frontend Developer',
      company: 'TechVista Solutions',
      from: 'Jun 2024',
      to: 'Present',
      description:
        'Building the customer-facing dashboard used by 200k+ users. Led migration to Next.js and improved LCP by 45%.',
    },
    {
      id: 'w2',
      title: 'Junior Web Developer',
      company: 'CodeCraft Studio',
      from: 'Jul 2023',
      to: 'May 2024',
      description:
        'Developed marketing sites and internal tools with React. Introduced a shared component library used across 6 projects.',
    },
  ],
  education: [
    {
      id: 'e1',
      degree: 'B.Tech, Computer Science & Engineering',
      institute: 'ABC Institute of Technology',
      from: '2019',
      to: '2023',
      score: '8.4 CGPA',
    },
    {
      id: 'e2',
      degree: 'Senior Secondary (XII), Science',
      institute: 'DAV Public School',
      from: '2018',
      to: '2019',
      score: '89%',
    },
  ],
  resume: { fileName: 'Anil_Sharma_Frontend_Resume.pdf', updatedOn: daysAgo(30) },
};

let applicationCounter = applications.length;
export const nextApplicationId = (): string => `a${++applicationCounter}`;
