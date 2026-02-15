-- ============================================
-- FORCE FIX RLS - This WILL Work!
-- ============================================
-- This completely removes and recreates the policy

-- Step 1: Drop ALL policies on guest_registrations
DROP POLICY IF EXISTS "Allow public insert for guest_registrations" ON public.guest_registrations;
DROP POLICY IF EXISTS "Allow anon insert for guest registrations" ON public.guest_registrations;
DROP POLICY IF EXISTS "Admins can view guest registrations" ON public.guest_registrations;

-- Step 2: Check for any other policies that might be blocking
SELECT 
  'Existing Policies' as info,
  policyname,
  cmd,
  roles,
  permissive
FROM pg_policies
WHERE tablename = 'guest_registrations';

-- Step 3: Ensure RLS is enabled
ALTER TABLE public.guest_registrations ENABLE ROW LEVEL SECURITY;

-- Step 4: Create the most permissive INSERT policy possible
-- This allows anon, public, authenticated - basically everyone
CREATE POLICY "Allow public insert for guest registrations"
ON public.guest_registrations 
FOR INSERT
TO anon, public, authenticated
WITH CHECK (true);

-- Step 5: Recreate SELECT policy for admins
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

-- Step 6: Verify the policy was created correctly
SELECT 
  '✅ Final Policy Check' as info,
  policyname,
  cmd,
  roles,
  permissive,
  with_check,
  CASE 
    WHEN cmd = 'INSERT' AND 'anon' = ANY(roles) THEN '✅ Allows anon (correct!)'
    WHEN cmd = 'INSERT' THEN '❌ Missing anon role'
    ELSE 'N/A'
  END as status
FROM pg_policies
WHERE tablename = 'guest_registrations'
ORDER BY cmd;

-- Step 7: Check if there are any RESTRICTIVE policies
SELECT 
  '⚠️ Restrictive Policy Check' as info,
  COUNT(*) as "Number of RESTRICTIVE policies",
  CASE 
    WHEN COUNT(*) > 0 THEN '❌ Found restrictive policies - these will block inserts!'
    ELSE '✅ No restrictive policies found'
  END as status
FROM pg_policies
WHERE tablename = 'guest_registrations'
AND permissive = 'RESTRICTIVE';

