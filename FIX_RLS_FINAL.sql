-- ============================================
-- FINAL RLS FIX - Allow BOTH anon and public
-- ============================================
-- The issue: Supabase client uses 'anon' role, not 'public'
-- This policy allows BOTH roles to insert

-- Step 1: Drop existing policy
DROP POLICY IF EXISTS "Allow public insert for guest registrations" ON public.guest_registrations;

-- Step 2: Create policy that allows BOTH anon and public
CREATE POLICY "Allow public insert for guest registrations"
ON public.guest_registrations 
FOR INSERT
TO anon, public
WITH CHECK (true);

-- Step 3: Verify
SELECT 
  policyname,
  cmd,
  roles,
  with_check,
  CASE 
    WHEN 'anon' = ANY(roles) AND 'public' = ANY(roles) THEN '✅ Allows both anon and public'
    WHEN 'anon' = ANY(roles) THEN '✅ Allows anon'
    WHEN 'public' = ANY(roles) THEN '✅ Allows public'
    ELSE '❌ Wrong roles'
  END as status
FROM pg_policies
WHERE tablename = 'guest_registrations'
AND cmd = 'INSERT';

