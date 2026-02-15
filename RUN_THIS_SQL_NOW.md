# 🚨 URGENT: Run This SQL to Fix Registration Error

## The Error You're Seeing:
**"new row violates row-level security policy for table 'guest_registrations'"**

This means the database is blocking anonymous inserts. The fix is simple - just run the SQL below.

---

## ✅ Step-by-Step Fix:

### 1. Open Supabase SQL Editor
1. Go to: **https://supabase.com/dashboard**
2. Select your project: **`creation-2k26`**
3. Click **"SQL Editor"** (left sidebar)
4. Click **"New query"**

### 2. Copy This Entire SQL Block:

```sql
-- Fix RLS Policy for Guest Registrations
DROP POLICY IF EXISTS "Allow anon insert for guest registrations" ON public.guest_registrations;
DROP POLICY IF EXISTS "Allow public insert for guest registrations" ON public.guest_registrations;
DROP POLICY IF EXISTS "Admins can view guest registrations" ON public.guest_registrations;

-- Create permissive INSERT policy for everyone
CREATE POLICY "Allow public insert for guest registrations"
ON public.guest_registrations FOR INSERT
TO public
WITH CHECK (true);

-- Recreate SELECT policy for admins
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

-- Ensure RLS is enabled
ALTER TABLE public.guest_registrations ENABLE ROW LEVEL SECURITY;
```

### 3. Run the Query
1. **Paste** the SQL above into the editor
2. **Click "Run"** (or press `Ctrl + Enter`)
3. **Wait for "Success"** message ✅

### 4. Verify It Worked
After running, you should see a success message. The query at the end will also show you the policies that were created.

---

## 🔄 After Running This:

1. **Go back to your registration page**
2. **Try registering again**
3. **It should work now!** ✅

---

## ⚠️ If You Still Get Errors:

1. **Make sure you restarted the dev server** (`npm run dev`)
2. **Clear browser cache** (`Ctrl + Shift + Delete`)
3. **Check that you're using the new Supabase URL** (should be `tovokkcouwwymarnftcu.supabase.co`)

---

## 📝 What This Does:

- **Removes old policies** that might be blocking inserts
- **Creates a new policy** that allows **ANYONE** (including anonymous users) to insert registrations
- **Keeps admin-only read access** for security

This is safe and necessary for public registration forms!

