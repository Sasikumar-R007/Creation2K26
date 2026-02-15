-- ============================================
-- NUCLEAR OPTION: Temporarily Disable RLS to Test
-- ============================================
-- WARNING: This disables RLS completely - only for testing!
-- After confirming it works, we'll re-enable RLS with correct policy

-- Step 1: Disable RLS temporarily
ALTER TABLE public.guest_registrations DISABLE ROW LEVEL SECURITY;

-- Step 2: Verify RLS is disabled
SELECT 
  'RLS Status' as info,
  tablename,
  rowsecurity as "RLS Enabled",
  CASE 
    WHEN rowsecurity = false THEN '✅ RLS is DISABLED (for testing)'
    ELSE '❌ RLS is still enabled'
  END as status
FROM pg_tables
WHERE schemaname = 'public' 
AND tablename = 'guest_registrations';

-- Step 3: Test insert (should work now)
DO $$
DECLARE
  test_event_id UUID;
  test_result UUID;
BEGIN
  SELECT id INTO test_event_id FROM public.events LIMIT 1;
  
  IF test_event_id IS NULL THEN
    RAISE NOTICE 'No events found';
    RETURN;
  END IF;
  
  INSERT INTO public.guest_registrations (
    name, email, event_1_id, event_1_team_size, created_at
  ) VALUES (
    'Test No RLS',
    'test-norls-' || gen_random_uuid()::text || '@example.com',
    test_event_id,
    1,
    now()
  ) RETURNING id INTO test_result;
  
  RAISE NOTICE '✅ Insert worked! ID: %', test_result;
  DELETE FROM public.guest_registrations WHERE id = test_result;
END $$;

-- ============================================
-- AFTER TESTING: Re-enable RLS with correct policy
-- ============================================
-- Run this AFTER confirming registration works:

-- ALTER TABLE public.guest_registrations ENABLE ROW LEVEL SECURITY;
-- 
-- DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.guest_registrations;
-- 
-- CREATE POLICY "Allow anonymous inserts"
-- ON public.guest_registrations 
-- FOR INSERT
-- TO anon
-- WITH CHECK (true);

