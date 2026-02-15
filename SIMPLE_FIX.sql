-- ============================================
-- SIMPLE FIX - Run This Entire Script
-- ============================================

-- Step 1: Drop ALL policies
DROP POLICY IF EXISTS "Allow public insert for guest registrations" ON public.guest_registrations;
DROP POLICY IF EXISTS "Allow anon insert for guest registrations" ON public.guest_registrations;
DROP POLICY IF EXISTS "Admins can view guest registrations" ON public.guest_registrations;

-- Step 2: Create INSERT policy for anon (this is what Supabase client uses)
CREATE POLICY "Allow anon insert for guest registrations"
ON public.guest_registrations 
FOR INSERT
TO anon
WITH CHECK (true);

-- Step 3: Create SELECT policy for admins
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

-- Step 4: Verify
SELECT 
  'Policy Check' as info,
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE tablename = 'guest_registrations';

