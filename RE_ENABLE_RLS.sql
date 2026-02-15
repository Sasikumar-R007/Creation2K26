-- ============================================
-- RE-ENABLE RLS WITH CORRECT POLICY
-- ============================================
-- Run this AFTER testing without RLS

-- Step 1: Re-enable RLS
ALTER TABLE public.guest_registrations ENABLE ROW LEVEL SECURITY;

-- Step 2: Delete all existing policies
DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.guest_registrations;
DROP POLICY IF EXISTS "Allow anon insert for guest registrations" ON public.guest_registrations;
DROP POLICY IF EXISTS "Allow public insert for guest registrations" ON public.guest_registrations;
DROP POLICY IF EXISTS "Allow all inserts for guest registrations" ON public.guest_registrations;

-- Step 3: Create the simplest possible policy
CREATE POLICY "Allow anonymous inserts"
ON public.guest_registrations 
FOR INSERT
TO anon
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

-- Step 5: Verify
SELECT 
  'RLS Re-enabled' as info,
  policyname,
  cmd,
  roles,
  '✅ Policy created' as status
FROM pg_policies
WHERE tablename = 'guest_registrations';

