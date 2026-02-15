-- ============================================
-- VERIFY AND FIX RLS POLICY - RUN THIS
-- ============================================
-- This will check current policies and fix them properly

-- Step 1: Check if RLS is enabled
SELECT 
  schemaname,
  tablename,
  rowsecurity as "RLS Enabled"
FROM pg_tables
WHERE schemaname = 'public' 
AND tablename = 'guest_registrations';

-- Step 2: View current policies with full details
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual as "USING clause",
  with_check as "WITH CHECK clause"
FROM pg_policies
WHERE tablename = 'guest_registrations';

-- Step 3: Drop ALL existing policies
DROP POLICY IF EXISTS "Allow anon insert for guest registrations" ON public.guest_registrations;
DROP POLICY IF EXISTS "Allow public insert for guest registrations" ON public.guest_registrations;
DROP POLICY IF EXISTS "Admins can view guest registrations" ON public.guest_registrations;
DROP POLICY IF EXISTS "Admins can view guest registrations" ON public.guest_registrations;

-- Step 4: Ensure RLS is enabled
ALTER TABLE public.guest_registrations ENABLE ROW LEVEL SECURITY;

-- Step 5: Create INSERT policy with explicit permissive setting
CREATE POLICY "Allow public insert for guest registrations"
ON public.guest_registrations 
FOR INSERT
TO public
WITH CHECK (true);

-- Step 6: Create SELECT policy for admins
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

-- Step 7: Verify policies were created correctly
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual as "USING clause",
  with_check as "WITH CHECK clause"
FROM pg_policies
WHERE tablename = 'guest_registrations';

-- Step 8: Test if anonymous insert would work (this will show the policy)
SELECT 
  'RLS Policy Check' as status,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE tablename = 'guest_registrations' 
      AND cmd = 'INSERT' 
      AND 'public' = ANY(roles)
      AND with_check = 'true'
    ) THEN '✅ INSERT policy for public exists'
    ELSE '❌ INSERT policy for public missing'
  END as result;

