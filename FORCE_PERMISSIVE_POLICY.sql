-- ============================================
-- FORCE PERMISSIVE POLICY - Run This
-- ============================================
-- This explicitly creates a PERMISSIVE policy

-- Drop existing policy
DROP POLICY IF EXISTS "Allow anon insert for guest registrations" ON public.guest_registrations;
DROP POLICY IF EXISTS "Allow public insert for guest registrations" ON public.guest_registrations;

-- Create PERMISSIVE policy explicitly
CREATE POLICY "Allow anon insert for guest registrations"
ON public.guest_registrations 
FOR INSERT
TO anon
WITH CHECK (true);

-- Verify it's PERMISSIVE
SELECT 
  'Policy Created' as info,
  policyname,
  cmd,
  roles,
  permissive,
  CASE 
    WHEN permissive = 'PERMISSIVE' THEN '✅ PERMISSIVE (correct)'
    WHEN permissive = 'RESTRICTIVE' THEN '❌ RESTRICTIVE (wrong!)'
    ELSE '⚠️ Unknown'
  END as status
FROM pg_policies
WHERE tablename = 'guest_registrations'
AND cmd = 'INSERT';

