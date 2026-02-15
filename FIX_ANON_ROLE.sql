-- ============================================
-- FIX: Allow ANON role (Supabase client uses anon, not public)
-- ============================================
-- The Supabase client with anon key uses 'anon' role, not 'public'
-- This policy allows BOTH roles to insert

-- Drop existing policy
DROP POLICY IF EXISTS "Allow public insert for guest registrations" ON public.guest_registrations;

-- Create policy that allows BOTH anon and public
CREATE POLICY "Allow public insert for guest registrations"
ON public.guest_registrations 
FOR INSERT
TO anon, public
WITH CHECK (true);

-- Verify the policy
SELECT 
  'Policy Status' as info,
  policyname,
  cmd,
  roles,
  with_check,
  CASE 
    WHEN 'anon' = ANY(roles) THEN '✅ Allows anon (this is what Supabase client uses)'
    ELSE '❌ Missing anon role'
  END as status
FROM pg_policies
WHERE tablename = 'guest_registrations'
AND cmd = 'INSERT';

