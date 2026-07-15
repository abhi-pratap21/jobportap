import { Profile } from '../types';

/**
 * Default seeker profile — used only to seed portalProfiles/{email} in
 * Firestore on first run (no login yet, single public profile). Everything
 * else (jobs, applications, saved jobs) lives in the real amrutai Firestore.
 */
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
  resume: { fileName: 'Anil_Sharma_Frontend_Resume.pdf', updatedOn: new Date().toISOString() },
};
