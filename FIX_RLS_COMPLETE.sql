-- ============================================
-- COMPLETE RLS FIX - Run This Entire Script
-- ============================================

-- Step 1: Drop ALL existing policies (clean slate)
DROP POLICY IF EXISTS "Allow anon insert for guest registrations" ON public.guest_registrations;
DROP POLICY IF EXISTS "Allow public insert for guest registrations" ON public.guest_registrations;
DROP POLICY IF EXISTS "Admins can view guest registrations" ON public.guest_registrations;

-- Step 2: Ensure RLS is enabled
ALTER TABLE public.guest_registrations ENABLE ROW LEVEL SECURITY;

-- Step 3: Create INSERT policy (only WITH CHECK allowed for INSERT)
-- This is the most permissive policy possible
CREATE POLICY "Allow public insert for guest registrations"
ON public.guest_registrations 
FOR INSERT
TO public
WITH CHECK (true);

-- Step 4: Create SELECT policy for admins
CREATE POLICY "Admins can view guest registrations"
ON public.guest_registrations 
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = 'creation_admin'
  )
);

-- Step 5: Verify everything
SELECT 
  'Policy Check' as check_type,
  policyname,
  cmd,
  roles,
  permissive,
  CASE 
    WHEN cmd = 'INSERT' AND 'public' = ANY(roles) AND with_check = 'true' THEN '✅ Correct'
    WHEN cmd = 'INSERT' THEN '❌ Wrong configuration'
    ELSE 'N/A'
  END as status
FROM pg_policies
WHERE tablename = 'guest_registrations';

-- Step 6: Check if RLS is enabled
SELECT 
  'RLS Status' as check_type,
  tablename,
  rowsecurity as "RLS Enabled",
  CASE 
    WHEN rowsecurity = true THEN '✅ RLS is enabled'
    ELSE '❌ RLS is NOT enabled'
  END as status
FROM pg_tables
WHERE schemaname = 'public' 
AND tablename = 'guest_registrations';

