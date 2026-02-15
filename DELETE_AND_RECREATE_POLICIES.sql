-- ============================================
-- DELETE ALL POLICIES AND RECREATE - Clean Slate
-- ============================================

-- Step 1: Delete ALL existing policies
DROP POLICY IF EXISTS "Allow anon insert for guest registrations" ON public.guest_registrations;
DROP POLICY IF EXISTS "Allow public insert for guest registrations" ON public.guest_registrations;
DROP POLICY IF EXISTS "Allow all inserts for guest registrations" ON public.guest_registrations;
DROP POLICY IF EXISTS "Admins can view guest registrations" ON public.guest_registrations;

-- Step 2: Verify all policies are deleted
SELECT 
  'Policies After Deletion' as info,
  COUNT(*) as "Remaining policies",
  CASE 
    WHEN COUNT(*) = 0 THEN '✅ All policies deleted'
    ELSE '❌ Still have policies: ' || string_agg(policyname, ', ')
  END as status
FROM pg_policies
WHERE tablename = 'guest_registrations';

-- Step 3: Recreate INSERT policy (most permissive possible)
CREATE POLICY "Allow anonymous inserts"
ON public.guest_registrations 
FOR INSERT
TO anon
WITH CHECK (true);

-- Step 4: Recreate SELECT policy for admins
CREATE POLICY "Admins can view guest registrations"
ON public.guest_registrations 
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = 'creation_admin'
  )
);

-- Step 5: Verify new policies
SELECT 
  'New Policies' as info,
  policyname,
  cmd,
  roles,
  permissive,
  '✅ Policy created' as status
FROM pg_policies
WHERE tablename = 'guest_registrations'
ORDER BY cmd;

