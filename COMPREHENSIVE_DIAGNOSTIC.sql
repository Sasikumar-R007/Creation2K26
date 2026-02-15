-- ============================================
-- COMPREHENSIVE DIAGNOSTIC - Run This
-- ============================================
-- This will check everything that could be blocking

-- Check 1: All policies (should only be 2)
SELECT 
  'All Policies' as check_type,
  policyname,
  cmd,
  roles,
  permissive,
  with_check
FROM pg_policies
WHERE tablename = 'guest_registrations'
ORDER BY cmd;

-- Check 2: RESTRICTIVE policies (should be 0)
SELECT 
  'RESTRICTIVE Policies' as check_type,
  COUNT(*) as count,
  CASE 
    WHEN COUNT(*) > 0 THEN '❌ Found RESTRICTIVE policies!'
    ELSE '✅ No RESTRICTIVE policies'
  END as status
FROM pg_policies
WHERE tablename = 'guest_registrations'
AND permissive = 'RESTRICTIVE';

-- Check 3: RLS enabled
SELECT 
  'RLS Status' as check_type,
  rowsecurity as enabled,
  CASE 
    WHEN rowsecurity = true THEN '✅ RLS enabled'
    ELSE '❌ RLS NOT enabled'
  END as status
FROM pg_tables
WHERE schemaname = 'public' 
AND tablename = 'guest_registrations';

-- Check 4: Table structure - required columns
SELECT 
  'Table Columns' as check_type,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'guest_registrations'
ORDER BY ordinal_position;

-- Check 5: Foreign key constraints
SELECT 
  'Foreign Keys' as check_type,
  tc.constraint_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_name = 'guest_registrations';

-- Check 6: Check constraints
SELECT 
  'Check Constraints' as check_type,
  constraint_name,
  check_clause
FROM information_schema.check_constraints
WHERE constraint_schema = 'public'
AND constraint_name LIKE '%guest_registrations%';

