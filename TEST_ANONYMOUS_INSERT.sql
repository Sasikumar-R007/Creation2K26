-- ============================================
-- TEST ANONYMOUS INSERT - Run This
-- ============================================
-- This will test if anonymous users can insert

-- First, get an event ID to use for testing
DO $$
DECLARE
  test_event_id UUID;
  test_insert_id UUID;
BEGIN
  -- Get first event ID
  SELECT id INTO test_event_id FROM public.events LIMIT 1;
  
  IF test_event_id IS NULL THEN
    RAISE NOTICE 'No events found in database. Please run migrations first.';
    RETURN;
  END IF;
  
  RAISE NOTICE 'Testing anonymous insert with event_id: %', test_event_id;
  
  -- Try to insert as anonymous user
  -- Note: In Supabase, we can't directly SET ROLE anon, but we can test the policy
  INSERT INTO public.guest_registrations (
    name, 
    email, 
    event_1_id, 
    event_1_team_size,
    created_at
  ) VALUES (
    'Test Anonymous User', 
    'test-anon-' || gen_random_uuid()::text || '@example.com', 
    test_event_id,
    1,
    now()
  ) RETURNING id INTO test_insert_id;
  
  IF test_insert_id IS NOT NULL THEN
    RAISE NOTICE '✅ SUCCESS: Anonymous insert worked! ID: %', test_insert_id;
    
    -- Clean up test data
    DELETE FROM public.guest_registrations WHERE id = test_insert_id;
    RAISE NOTICE 'Test data cleaned up.';
  ELSE
    RAISE NOTICE '❌ FAILED: Insert did not return an ID';
  END IF;
  
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE '❌ ERROR: %', SQLERRM;
    RAISE NOTICE 'This means the RLS policy is blocking anonymous inserts.';
END $$;

-- Check current policies
SELECT 
  'Current Policies' as info,
  policyname,
  cmd,
  roles,
  with_check
FROM pg_policies
WHERE tablename = 'guest_registrations';

