-- ============================================
-- CHECK POLICY STATUS - Run This
-- ============================================
-- This will show you the exact policy configuration

-- Check all policies on guest_registrations
SELECT 
  policyname,
  cmd as "Operation",
  roles,
  permissive,
  qual as "USING clause",
  with_check as "WITH CHECK clause",
  CASE 
    WHEN cmd = 'INSERT' AND 'public' = ANY(roles) THEN '✅ Should allow public inserts'
    WHEN cmd = 'INSERT' THEN '❌ Wrong role configuration'
    ELSE 'N/A'
  END as "Insert Policy Status"
FROM pg_policies
WHERE tablename = 'guest_registrations'
ORDER BY cmd;

-- Check if there are any restrictive policies
SELECT 
  'Restrictive Policy Check' as check_type,
  COUNT(*) as "Number of RESTRICTIVE policies",
  CASE 
    WHEN COUNT(*) > 0 THEN '❌ Found restrictive policies - these might block inserts'
    ELSE '✅ No restrictive policies found'
  END as status
FROM pg_policies
WHERE tablename = 'guest_registrations'
AND permissive = 'RESTRICTIVE';

