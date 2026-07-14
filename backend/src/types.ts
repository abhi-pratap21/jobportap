export interface Company {
  id: string;
  name: string;
  logoColor: string; // used by frontend to render initial-avatar logo
  industry: string;
  rating: number;
  reviews: number;
  size: string;
  founded: number;
  headquarters: string;
  website: string;
  about: string;
  tags: string[];
}

export type JobType = 'Full-time' | 'Part-time' | 'Internship' | 'Contract';
export type WorkMode = 'On-site' | 'Remote' | 'Hybrid';

export interface Job {
  id: string;
  title: string;
  companyId: string;
  category: string;
  location: string;
  workMode: WorkMode;
  jobType: JobType;
  experienceMin: number; // years
  experienceMax: number;
  salaryMin: number; // LPA
  salaryMax: number;
  skills: string[];
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  postedDaysAgo: number;
  applicants: number;
  openings: number;
  featured: boolean;
}

export interface JobWithCompany extends Job {
  company: Company;
}

export type ApplicationStatus =
  | 'Applied'
  | 'Under Review'
  | 'Shortlisted'
  | 'Interview'
  | 'Offer'
  | 'Rejected';

export interface TimelineEvent {
  status: ApplicationStatus;
  date: string; // ISO
  note: string;
}

export interface Application {
  id: string;
  jobId: string;
  appliedOn: string; // ISO
  status: ApplicationStatus;
  coverNote?: string;
  timeline: TimelineEvent[];
}

export interface WorkExperience {
  id: string;
  title: string;
  company: string;
  from: string;
  to: string; // 'Present' allowed
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  institute: string;
  from: string;
  to: string;
  score: string;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  phone: string;
  headline: string;
  location: string;
  totalExperienceYears: number;
  currentSalaryLPA: number;
  expectedSalaryLPA: number;
  noticePeriod: string;
  about: string;
  skills: string[];
  languages: string[];
  preferredLocations: string[];
  preferredRoles: string[];
  workExperience: WorkExperience[];
  education: Education[];
  resume: { fileName: string; updatedOn: string };
}
