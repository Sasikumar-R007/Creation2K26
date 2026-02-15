-- ============================================
-- FIX RLS POLICY - RUN THIS IN SUPABASE SQL EDITOR
-- ============================================
-- This will fix the "new row violates row-level security policy" error
-- Run this on your NEW Supabase project: tovokkcouwwymarnftcu

-- Step 1: Drop ALL existing policies
DROP POLICY IF EXISTS "Allow anon insert for guest registrations" ON public.guest_registrations;
DROP POLICY IF EXISTS "Allow public insert for guest registrations" ON public.guest_registrations;
DROP POLICY IF EXISTS "Admins can view guest registrations" ON public.guest_registrations;

-- Step 2: Create INSERT policy that allows ANYONE to insert
CREATE POLICY "Allow public insert for guest registrations"
ON public.guest_registrations FOR INSERT
TO public
WITH CHECK (true);

-- Step 3: Create SELECT policy for admins only
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

-- Step 4: Ensure RLS is enabled
ALTER TABLE public.guest_registrations ENABLE ROW LEVEL SECURITY;

-- Step 5: Verify the policies were created
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE tablename = 'guest_registrations';

-- You should see 2 policies:
-- 1. "Allow public insert for guest registrations" (INSERT, public)
-- 2. "Admins can view guest registrations" (SELECT, authenticated)

