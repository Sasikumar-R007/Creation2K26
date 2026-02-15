-- Check if events exist in the database
-- Run this in Supabase SQL Editor to diagnose the issue

-- 1. Check if events table exists and has data
SELECT COUNT(*) as total_events FROM public.events;

-- 2. List all events
SELECT id, name, category, created_at 
FROM public.events 
ORDER BY category, name;

-- 3. Check RLS policies on events table
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
WHERE tablename = 'events';

-- 4. Test if anonymous user can read events (simulate)
-- This should return all events if RLS is configured correctly
SET ROLE anon;
SELECT COUNT(*) as anon_can_read FROM public.events;
RESET ROLE;

-- 5. If events table is empty, you need to seed it
-- Check if seed data exists in the migration file:
-- supabase/migrations/20260203095150_fdaa533d-45e2-42d1-9dde-eaed85ccdb84.sql
-- Look for the INSERT INTO public.events section (around line 408)

