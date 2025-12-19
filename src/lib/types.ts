export type JobType = 'full-time' | 'part-time' | 'contract' | 'internship' | 'remote';
export type ApplicationStatus = 'pending' | 'reviewing' | 'interviewed' | 'offered' | 'rejected';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  headline: string | null;
  bio: string | null;
  resume_url: string | null;
  is_employer: boolean;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  owner_id: string;
  name: string;
  logo_url: string | null;
  website: string | null;
  description: string | null;
  location: string | null;
  industry: string | null;
  size: string | null;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  company_id: string;
  title: string;
  description: string;
  location: string;
  job_type: JobType;
  salary_min: number | null;
  salary_max: number | null;
  requirements: string[] | null;
  benefits: string[] | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  company?: Company;
}

export interface Application {
  id: string;
  job_id: string;
  applicant_id: string;
  cover_letter: string | null;
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;
  job?: Job;
}

export interface SavedJob {
  id: string;
  user_id: string;
  job_id: string;
  created_at: string;
  job?: Job;
}
