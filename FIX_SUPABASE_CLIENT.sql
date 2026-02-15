-- ============================================
-- ALTERNATIVE: Try allowing authenticated role too
-- ============================================
-- Sometimes Supabase client might be using authenticated role

-- Drop and recreate with all possible roles
DROP POLICY IF EXISTS "Allow anon insert for guest registrations" ON public.guest_registrations;
DROP POLICY IF EXISTS "Allow public insert for guest registrations" ON public.guest_registrations;

-- Create policy that allows anon, public, AND authenticated
-- This covers all possible scenarios
CREATE POLICY "Allow all inserts for guest registrations"
ON public.guest_registrations 
FOR INSERT
TO anon, public, authenticated
WITH CHECK (true);

-- Verify
SELECT 
  'Policy Status' as info,
  policyname,
  cmd,
  roles,
  '✅ Policy allows anon, public, and authenticated' as status
FROM pg_policies
WHERE tablename = 'guest_registrations'
AND cmd = 'INSERT';

