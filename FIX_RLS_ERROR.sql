-- ============================================
-- FIX RLS POLICY FOR GUEST REGISTRATIONS
-- ============================================
-- This will allow anonymous users to insert registrations
-- Run this in Supabase SQL Editor

-- Step 1: Drop ALL existing policies on guest_registrations
DROP POLICY IF EXISTS "Allow anon insert for guest registrations" ON public.guest_registrations;
DROP POLICY IF EXISTS "Allow public insert for guest registrations" ON public.guest_registrations;
DROP POLICY IF EXISTS "Admins can view guest registrations" ON public.guest_registrations;

-- Step 2: Create a permissive INSERT policy for everyone
CREATE POLICY "Allow public insert for guest registrations"
ON public.guest_registrations FOR INSERT
TO public
WITH CHECK (true);

-- Step 3: Recreate the SELECT policy for admins (if needed)
CREATE POLICY "Admins can view guest registrations"
ON public.guest_registrations FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = 'creation_admin'
  )
);

-- Step 4: Verify RLS is enabled
ALTER TABLE public.guest_registrations ENABLE ROW LEVEL SECURITY;

-- Step 5: Verify the policy was created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'guest_registrations';

-- You should see the "Allow public insert for guest registrations" policy listed above

