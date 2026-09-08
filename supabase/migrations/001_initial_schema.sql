-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'employer', 'jobseeker');
CREATE TYPE employment_type AS ENUM ('full-time', 'part-time', 'contract', 'internship', 'remote');
CREATE TYPE job_status AS ENUM ('open', 'closed', 'draft');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'review', 'done');
CREATE TYPE application_status AS ENUM ('pending', 'reviewed', 'shortlisted', 'rejected', 'accepted');

-- Profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  location TEXT,
  website TEXT,
  role user_role DEFAULT 'jobseeker' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Companies table
CREATE TABLE companies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  website TEXT,
  location TEXT,
  industry TEXT,
  size TEXT,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Jobs table
CREATE TABLE jobs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  salary_min NUMERIC,
  salary_max NUMERIC,
  employment_type employment_type NOT NULL,
  status job_status DEFAULT 'open' NOT NULL,
  posted_by UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Tasks table
CREATE TABLE tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority task_priority DEFAULT 'medium' NOT NULL,
  status task_status DEFAULT 'todo' NOT NULL,
  due_date TIMESTAMPTZ,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_by UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Applications table
CREATE TABLE applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  cover_letter TEXT,
  resume_url TEXT,
  status application_status DEFAULT 'pending' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(job_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX idx_jobs_posted_by ON jobs(posted_by);
CREATE INDEX idx_jobs_company_id ON jobs(company_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_employment_type ON jobs(employment_type);
CREATE INDEX idx_tasks_job_id ON tasks(job_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_applications_job_id ON applications(job_id);
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_companies_owner_id ON companies(owner_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Profiles RLS policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Companies RLS policies
CREATE POLICY "Companies are viewable by everyone" ON companies
  FOR SELECT USING (true);

CREATE POLICY "Employers can create companies" ON companies
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'employer'))
  );

CREATE POLICY "Company owners can update their companies" ON companies
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Company owners can delete their companies" ON companies
  FOR DELETE USING (auth.uid() = owner_id);

-- Jobs RLS policies
CREATE POLICY "Jobs are viewable by everyone" ON jobs
  FOR SELECT USING (true);

CREATE POLICY "Employers and admins can create jobs" ON jobs
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'employer'))
    AND auth.uid() = posted_by
  );

CREATE POLICY "Job posters can update their jobs" ON jobs
  FOR UPDATE USING (auth.uid() = posted_by);

CREATE POLICY "Job posters can delete their jobs" ON jobs
  FOR DELETE USING (auth.uid() = posted_by);

-- Tasks RLS policies
CREATE POLICY "Tasks viewable by job poster or assigned user" ON tasks
  FOR SELECT USING (
    auth.uid() = created_by
    OR auth.uid() = assigned_to
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Employers and admins can create tasks" ON tasks
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'employer'))
    AND auth.uid() = created_by
  );

CREATE POLICY "Task creator or assigned user can update tasks" ON tasks
  FOR UPDATE USING (
    auth.uid() = created_by
    OR auth.uid() = assigned_to
  );

CREATE POLICY "Task creator can delete tasks" ON tasks
  FOR DELETE USING (auth.uid() = created_by);

-- Applications RLS policies
CREATE POLICY "Users can view own applications" ON applications
  FOR SELECT USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM jobs WHERE jobs.id = applications.job_id AND jobs.posted_by = auth.uid()
    )
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Jobseekers can create applications" ON applications
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'jobseeker')
    AND auth.uid() = user_id
  );

CREATE POLICY "Job posters can update application status" ON applications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM jobs WHERE jobs.id = applications.job_id AND jobs.posted_by = auth.uid()
    )
  );

-- Function to auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auto-creating profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
