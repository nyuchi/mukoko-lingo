-- Comprehensive fix: Replace all instances of profiles.id with profiles.user_id
-- This ensures consistency across all RLS policies and functions

-- Drop dependent policies first before dropping functions
DROP POLICY IF EXISTS "Users can view their own profile or admins can view all" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can update any profile role" ON profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all AI phrases" ON ai_generated_phrases;
DROP POLICY IF EXISTS "Admins can view all conversations" ON ai_conversations;

-- Now drop functions with CASCADE to handle any remaining dependencies
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;
DROP FUNCTION IF EXISTS public.is_user_active(UUID) CASCADE;
DROP FUNCTION IF EXISTS get_user_activity_summary() CASCADE;

-- Recreate is_admin function with correct user_id reference
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate is_user_active function with correct user_id reference
CREATE OR REPLACE FUNCTION public.is_user_active(check_user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT COALESCE((SELECT status = 'active' FROM profiles WHERE user_id = check_user_id), false);
$$ LANGUAGE SQL SECURITY DEFINER;

-- Recreate RLS policies on profiles table with correct user_id references
CREATE POLICY "Users can view their own profile or admins can view all"
  ON profiles FOR SELECT
  USING (
    auth.uid() = user_id OR 
    (SELECT role FROM profiles WHERE user_id = auth.uid()) = 'admin'
  );

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update any profile"
  ON profiles FOR UPDATE
  USING ((SELECT role FROM profiles WHERE user_id = auth.uid()) = 'admin')
  WITH CHECK ((SELECT role FROM profiles WHERE user_id = auth.uid()) = 'admin');

-- Recreate RLS policies on AI tables with correct user_id references
CREATE POLICY "Admins can view all AI phrases" ON ai_generated_phrases
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "Admins can view all conversations" ON ai_conversations
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin')
  );

-- Recreate get_user_activity_summary function with correct user_id references
CREATE OR REPLACE FUNCTION get_user_activity_summary()
RETURNS TABLE (
  user_id UUID,
  email TEXT,
  display_name TEXT,
  role TEXT,
  total_views BIGINT,
  total_bookmarks BIGINT,
  total_progress BIGINT,
  last_active TIMESTAMPTZ
) AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  RETURN QUERY
  SELECT 
    p.user_id,
    p.email,
    p.display_name,
    p.role,
    COALESCE(COUNT(DISTINCT pv.id), 0) as total_views,
    COALESCE(COUNT(DISTINCT b.id), 0) as total_bookmarks,
    COALESCE(COUNT(DISTINCT pp.id), 0) as total_progress,
    GREATEST(
      MAX(pv.viewed_at),
      MAX(b.created_at),
      MAX(pp.updated_at)
    ) as last_active
  FROM profiles p
  LEFT JOIN phrase_views pv ON pv.user_id = p.user_id
  LEFT JOIN bookmarks b ON b.user_id = p.user_id
  LEFT JOIN phrase_progress pp ON pp.user_id = p.user_id
  GROUP BY p.user_id, p.email, p.display_name, p.role
  ORDER BY last_active DESC NULLS LAST;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
