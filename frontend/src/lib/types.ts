export interface Company {
  id: string;
  name: string;
  logoColor: string;
  industry: string;
  rating: number;
  reviews: number;
  size: string;
  founded: number;
  headquarters: string;
  website: string;
  about: string;
  tags: string[];
  openJobs?: number;
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
  experienceMin: number;
  experienceMax: number;
  salaryMin: number;
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
  company: Company;
  isApplied?: boolean;
  isSaved?: boolean;
}

export interface JobsResponse {
  jobs: Job[];
  total: number;
  page: number;
  totalPages: number;
}

export interface JobsQuery {
  q?: string;
  location?: string;
  category?: string;
  jobType?: string;
  workMode?: string;
  expMin?: number | string;
  expMax?: number | string;
  salaryMin?: number | string;
  sort?: string;
  page?: number;
  limit?: number;
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
  date: string;
  note: string;
}

export interface Application {
  id: string;
  jobId: string;
  appliedOn: string;
  status: ApplicationStatus;
  coverNote?: string;
  timeline: TimelineEvent[];
  job: Job;
}

export interface WorkExperience {
  id: string;
  title: string;
  company: string;
  from: string;
  to: string;
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
  stats: { applied: number; saved: number; profileViews: number; searchAppearances: number };
}

export interface Meta {
  categories: string[];
  locations: string[];
  jobTypes: string[];
  workModes: string[];
  experienceLevels: Array<{ label: string; min: number; max: number }>;
}

export interface CompanyDetail extends Company {
  jobs: Job[];
}
