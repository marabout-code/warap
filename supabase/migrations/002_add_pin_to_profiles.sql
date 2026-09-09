-- Add PIN authentication columns to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS pin_hash TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS pin_lookup TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS supabase_auth_secret TEXT;

-- Index for fast PIN-based login lookups
CREATE INDEX IF NOT EXISTS idx_profiles_pin_lookup ON profiles(pin_lookup);