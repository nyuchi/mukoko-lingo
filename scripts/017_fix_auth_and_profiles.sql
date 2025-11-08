-- Fix profile table structure and triggers
-- This script handles the profile column naming and ensures proper profile creation

-- First, check if we need to rename the id column to user_id
DO $$
BEGIN
  -- Check if 'id' column exists and 'user_id' does not
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'id'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'user_id'
  ) THEN
    -- Rename id to user_id
    ALTER TABLE profiles RENAME COLUMN id TO user_id;
  END IF;
END $$;

-- Ensure all required columns exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS preferred_ui_language TEXT DEFAULT 'en';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS learning_goal TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS daily_goal INTEGER DEFAULT 10;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS study_streak INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_study_date DATE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- Drop old RLS policies that might be conflicting
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile or admins can view all" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create clean RLS policies
CREATE POLICY "profiles_select_own"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "profiles_insert_own"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "profiles_admin_update_all"
  ON profiles FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'
  ));

-- Update the trigger function to create profiles with all fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    user_id, 
    email, 
    display_name, 
    preferred_ui_language,
    learning_goal,
    daily_goal,
    study_streak,
    role,
    status
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'preferred_ui_language', 'en'),
    COALESCE(NEW.raw_user_meta_data->>'learning_goal', 'Learn basic phrases'),
    COALESCE((NEW.raw_user_meta_data->>'daily_goal')::INTEGER, 10),
    0,
    'user',
    'active'
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Make bryan@nyuchi.com an admin (if exists)
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'bryan@nyuchi.com';
