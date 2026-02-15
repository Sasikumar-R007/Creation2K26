-- ============================================
-- TEST DIRECT INSERT - This Will Show Us the Real Error
-- ============================================
-- This simulates what the app is trying to do

-- First, get a valid event ID
DO $$
DECLARE
  test_event_id UUID;
  test_result UUID;
  test_error TEXT;
BEGIN
  -- Get first event ID
  SELECT id INTO test_event_id FROM public.events LIMIT 1;
  
  IF test_event_id IS NULL THEN
    RAISE NOTICE '❌ No events found. Run migrations first.';
    RETURN;
  END IF;
  
  RAISE NOTICE 'Testing insert with event_id: %', test_event_id;
  
  -- Try to insert (this will show the actual error if it fails)
  BEGIN
    INSERT INTO public.guest_registrations (
      name,
      email,
      whatsapp_phone,
      department,
      college,
      event_1_id,
      event_1_team_size,
      created_at
    ) VALUES (
      'Test User',
      'test-' || gen_random_uuid()::text || '@example.com',
      '1234567890',
      'Computer Science',
      'Test College',
      test_event_id,
      1,
      now()
    ) RETURNING id INTO test_result;
    
    RAISE NOTICE '✅ SUCCESS! Insert worked. ID: %', test_result;
    
    -- Clean up
    DELETE FROM public.guest_registrations WHERE id = test_result;
    RAISE NOTICE 'Test data cleaned up.';
    
  EXCEPTION WHEN OTHERS THEN
    test_error := SQLERRM;
    RAISE NOTICE '❌ INSERT FAILED: %', test_error;
    RAISE NOTICE 'Error Code: %', SQLSTATE;
    
    -- Show more details
    IF test_error LIKE '%row-level security%' THEN
      RAISE NOTICE 'This is an RLS policy error.';
      RAISE NOTICE 'Check if policy allows anon role.';
    ELSIF test_error LIKE '%foreign key%' THEN
      RAISE NOTICE 'This is a foreign key constraint error.';
      RAISE NOTICE 'Check if event_1_id exists in events table.';
    ELSIF test_error LIKE '%not null%' THEN
      RAISE NOTICE 'This is a NOT NULL constraint error.';
      RAISE NOTICE 'Check if all required fields are provided.';
    END IF;
  END;
END $$;

