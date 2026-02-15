-- ============================================
-- CHECK IF ANON ROLE IS ALLOWED
-- ============================================
-- Run this to verify the policy allows anon role

SELECT 
  'Current INSERT Policy' as check_type,
  policyname,
  cmd,
  roles,
  with_check,
  CASE 
    WHEN 'anon' = ANY(roles) THEN '✅ Allows anon role (correct)'
    WHEN 'public' = ANY(roles) THEN '⚠️ Only allows public (needs anon too)'
    ELSE '❌ Wrong roles'
  END as status
FROM pg_policies
WHERE tablename = 'guest_registrations'
AND cmd = 'INSERT';

-- If the status shows "⚠️ Only allows public", run this:
-- DROP POLICY IF EXISTS "Allow public insert for guest registrations" ON public.guest_registrations;
-- CREATE POLICY "Allow public insert for guest registrations"
-- ON public.guest_registrations FOR INSERT
-- TO anon, public
-- WITH CHECK (true);

