-- ============================================
-- FINAL RLS FIX - This Will Work!
-- ============================================
-- The Supabase client uses 'anon' role, not 'public'
-- This policy allows BOTH roles

-- Step 1: Drop existing policy
DROP POLICY IF EXISTS "Allow public insert for guest registrations" ON public.guest_registrations;
DROP POLICY IF EXISTS "Allow anon insert for guest registrations" ON public.guest_registrations;

-- Step 2: Create policy that allows BOTH anon and public
CREATE POLICY "Allow public insert for guest registrations"
ON public.guest_registrations 
FOR INSERT
TO anon, public
WITH CHECK (true);

-- Step 3: Verify it worked
SELECT 
  '✅ Policy Status' as info,
  policyname,
  cmd,
  roles,
  CASE 
    WHEN 'anon' = ANY(roles) AND 'public' = ANY(roles) THEN '✅ Perfect - allows both anon and public'
    WHEN 'anon' = ANY(roles) THEN '✅ Allows anon (good)'
    WHEN 'public' = ANY(roles) THEN '⚠️ Only allows public (will fail)'
    ELSE '❌ Wrong configuration'
  END as status
FROM pg_policies
WHERE tablename = 'guest_registrations'
AND cmd = 'INSERT';

-- Step 4: Verify RLS is enabled
SELECT 
  '✅ RLS Status' as info,
  tablename,
  rowsecurity as "RLS Enabled",
  CASE 
    WHEN rowsecurity = true THEN '✅ RLS is enabled'
    ELSE '❌ RLS is NOT enabled'
  END as status
FROM pg_tables
WHERE schemaname = 'public' 
AND tablename = 'guest_registrations';

