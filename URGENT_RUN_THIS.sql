-- ============================================
-- URGENT: Run This SQL Now!
-- ============================================
-- This is the simplest, most permissive policy possible

-- Remove all existing policies
DROP POLICY IF EXISTS "Allow public insert for guest registrations" ON public.guest_registrations;
DROP POLICY IF EXISTS "Allow anon insert for guest registrations" ON public.guest_registrations;
DROP POLICY IF EXISTS "Admins can view guest registrations" ON public.guest_registrations;

-- Create super permissive INSERT policy
CREATE POLICY "Allow public insert for guest registrations"
ON public.guest_registrations 
FOR INSERT
TO anon, public, authenticated
WITH CHECK (true);

-- Recreate SELECT policy
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

-- Verify
SELECT 
  policyname,
  cmd,
  roles,
  '✅ Policy created' as status
FROM pg_policies
WHERE tablename = 'guest_registrations'
AND cmd = 'INSERT';

