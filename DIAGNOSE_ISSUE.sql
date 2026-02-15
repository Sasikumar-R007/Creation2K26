-- ============================================
-- DIAGNOSE: Temporarily Disable RLS
-- ============================================
-- This will help us determine if the issue is RLS or client auth

-- Step 1: Disable RLS
ALTER TABLE public.guest_registrations DISABLE ROW LEVEL SECURITY;

-- Step 2: Verify
SELECT 
  'RLS Disabled' as info,
  tablename,
  rowsecurity as "RLS Enabled",
  CASE 
    WHEN rowsecurity = false THEN '✅ RLS is DISABLED - test registration now'
    ELSE '❌ RLS is still enabled'
  END as status
FROM pg_tables
WHERE schemaname = 'public' 
AND tablename = 'guest_registrations';

-- ============================================
-- AFTER TESTING: Re-enable RLS
-- ============================================
-- If registration works without RLS, the policy is the issue
-- If registration still fails, the client auth is the issue
--
-- To re-enable RLS, run:
-- ALTER TABLE public.guest_registrations ENABLE ROW LEVEL SECURITY;
-- 
-- Then recreate the policy:
-- DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.guest_registrations;
-- CREATE POLICY "Allow anonymous inserts"
-- ON public.guest_registrations FOR INSERT TO anon WITH CHECK (true);

