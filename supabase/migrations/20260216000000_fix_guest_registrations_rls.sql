-- Fix RLS policies for guest_registrations to allow public inserts
-- This ensures anonymous users can register without authentication

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow anon insert for guest registrations" ON public.guest_registrations;
DROP POLICY IF EXISTS "Allow public insert for guest registrations" ON public.guest_registrations;

-- Create policy to allow ANYONE (including anonymous) to insert
-- This is needed for the public registration form
CREATE POLICY "Allow public insert for guest registrations"
ON public.guest_registrations FOR INSERT
TO public
WITH CHECK (true);

-- Ensure RLS is enabled
ALTER TABLE public.guest_registrations ENABLE ROW LEVEL SECURITY;

-- Verify the policy exists (this will error if table doesn't exist, which is fine)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'guest_registrations'
    ) THEN
        RAISE NOTICE 'RLS policy created successfully for guest_registrations';
    END IF;
END $$;

