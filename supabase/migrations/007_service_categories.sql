-- 007_service_categories.sql
-- Generalize the platform to any service type: announce services from any category.

-- Add a category column to jobs. Not nullable; defaults to 'other' so existing rows stay valid.
ALTER TABLE public.jobs
  ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'other';

CREATE INDEX IF NOT EXISTS jobs_category_idx ON public.jobs (category);