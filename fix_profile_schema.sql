-- Fix Profiles Table Schema
-- Ensure all columns used in the application exist

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS address text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS city text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS state text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS country text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS latitude float;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS longitude float;

-- Ensure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Public can view profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone"
ON profiles FOR SELECT
USING (true);

-- Policy: Users can update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Policy: Users can insert their own profile (if not exists)
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Verify the columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles';
