-- ============================================
-- CHECK WHY RLS IS STILL BLOCKING
-- ============================================

-- Check 1: All policies on guest_registrations
SELECT 
  'All Policies' as check_type,
  policyname,
  cmd,
  roles,
  permissive,
  qual as "USING clause",
  with_check as "WITH CHECK clause"
FROM pg_policies
WHERE tablename = 'guest_registrations'
ORDER BY cmd;

-- Check 2: Are there any RESTRICTIVE policies?
SELECT 
  'Restrictive Check' as check_type,
  COUNT(*) as "RESTRICTIVE policies",
  CASE 
    WHEN COUNT(*) > 0 THEN '❌ Found RESTRICTIVE policies - these will block!'
    ELSE '✅ No RESTRICTIVE policies'
  END as status
FROM pg_policies
WHERE tablename = 'guest_registrations'
AND permissive = 'RESTRICTIVE';

-- Check 3: Is RLS enabled?
SELECT 
  'RLS Status' as check_type,
  tablename,
  rowsecurity as "RLS Enabled",
  CASE 
    WHEN rowsecurity = true THEN '✅ RLS is enabled'
    ELSE '❌ RLS is NOT enabled'
  END as status
FROM pg_tables
WHERE schemaname = 'public' 
AND tablename = 'guest_registrations';

-- Check 4: Test if we can see the policy for anon role
SELECT 
  'Anon Policy Check' as check_type,
  policyname,
  cmd,
  roles,
  CASE 
    WHEN 'anon' = ANY(roles) AND cmd = 'INSERT' THEN '✅ Policy allows anon INSERT'
    ELSE '❌ Policy does NOT allow anon INSERT'
  END as status
FROM pg_policies
WHERE tablename = 'guest_registrations'
AND cmd = 'INSERT';

-- Check 5: Make sure policy is PERMISSIVE (not RESTRICTIVE)
SELECT 
  'Permissive Check' as check_type,
  policyname,
  permissive,
  CASE 
    WHEN permissive = 'PERMISSIVE' THEN '✅ Policy is PERMISSIVE (correct)'
    WHEN permissive = 'RESTRICTIVE' THEN '❌ Policy is RESTRICTIVE (will block!)'
    ELSE '⚠️ Unknown permissive type'
  END as status
FROM pg_policies
WHERE tablename = 'guest_registrations'
AND cmd = 'INSERT';

