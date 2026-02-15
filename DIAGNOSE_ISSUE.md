# 🔍 Diagnose Registration Issue

## Step 1: Check Policy Status

Run this SQL in Supabase SQL Editor:

```sql
-- Check all policies on guest_registrations
SELECT 
  policyname,
  cmd as "Operation",
  roles,
  permissive,
  qual as "USING clause",
  with_check as "WITH CHECK clause"
FROM pg_policies
WHERE tablename = 'guest_registrations'
ORDER BY cmd;
```

**What to look for:**
- Should see a policy with `cmd = 'INSERT'` and `roles = '{public}'`
- The `with_check` should be `'true'` or `'(true)'`

---

## Step 2: Check Browser Console

1. **Open browser** → Go to registration page
2. **Open console** (F12)
3. **Try to register**
4. **Copy the EXACT error message** from console

**Share:**
- The exact error message
- The HTTP status code (401, 400, etc.)
- The URL it's trying to hit

---

## Step 3: Verify Supabase URL

In browser console, check:
1. **Network tab** → Look at the failed request
2. **What URL is it hitting?**
   - Should be: `tovokkcouwwymarnftcu.supabase.co`
   - NOT: `hqkrexlemuhgwbblbbkn.supabase.co`

---

## Step 4: Test Direct Insert

Run this SQL to test if anonymous insert works:

```sql
-- Test if anonymous insert would work
-- This simulates what the app is trying to do
SET ROLE anon;

-- Try a test insert (this will fail if RLS is blocking)
INSERT INTO public.guest_registrations (
  name, email, event_1_id, event_1_team_size
) VALUES (
  'Test User', 'test@example.com', 
  (SELECT id FROM public.events LIMIT 1),
  1
);

-- Reset role
RESET ROLE;

-- Check if the test insert worked
SELECT * FROM public.guest_registrations WHERE email = 'test@example.com';

-- Clean up test data
DELETE FROM public.guest_registrations WHERE email = 'test@example.com';
```

**If this fails**, the RLS policy is still blocking.

**If this works**, the issue is with the app code or Supabase client configuration.

---

## Step 5: Check Table Structure

Run this to verify all columns exist:

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'guest_registrations'
ORDER BY ordinal_position;
```

**Make sure these columns exist:**
- `name`
- `email`
- `event_1_id`
- `event_1_team_size`
- `event_2_id` (nullable)
- `event_2_team_size` (nullable)
- `event_1_team_name` (nullable)
- `event_2_team_name` (nullable)
- `upi_transaction_id` (nullable)
- `payment_screenshot_url` (nullable)

---

## 🎯 Most Likely Issues:

1. **Policy exists but `with_check` is wrong** - Run `FIX_RLS_COMPLETE.sql` again
2. **App still using old Supabase URL** - Check browser console Network tab
3. **Missing columns** - Run all migrations again
4. **Policy is RESTRICTIVE instead of PERMISSIVE** - Check policy status

---

## 📋 Share These Results:

1. Output from Step 1 (policy check)
2. Error message from Step 2 (browser console)
3. URL from Step 3 (Network tab)
4. Result from Step 4 (test insert)
5. Columns from Step 5 (table structure)

This will help identify the exact issue!

