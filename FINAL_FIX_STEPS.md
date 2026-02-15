# 🚨 FINAL FIX - Do These 2 Things

## The Problem:
1. ❌ RLS policy is blocking registration inserts
2. ❌ Storage bucket auto-creation is failing

## ✅ Solution:

### Step 1: Fix RLS Policy (MUST DO!)

**Go to your NEW Supabase project** (`tovokkcouwwymarnftcu`):

1. **Open:** https://supabase.com/dashboard
2. **Select project:** `creation-2k26` (your NEW project)
3. **Click "SQL Editor"** (left sidebar)
4. **Click "New query"**
5. **Open the file:** `FIX_RLS_NOW.sql` (I just created it)
6. **Copy ALL the SQL** from that file
7. **Paste into Supabase SQL Editor**
8. **Click "Run"** (or `Ctrl + Enter`)
9. **Wait for "Success"** ✅

**OR** copy this SQL directly:

```sql
-- Fix RLS Policy
DROP POLICY IF EXISTS "Allow anon insert for guest registrations" ON public.guest_registrations;
DROP POLICY IF EXISTS "Allow public insert for guest registrations" ON public.guest_registrations;
DROP POLICY IF EXISTS "Admins can view guest registrations" ON public.guest_registrations;

CREATE POLICY "Allow public insert for guest registrations"
ON public.guest_registrations FOR INSERT
TO public
WITH CHECK (true);

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

ALTER TABLE public.guest_registrations ENABLE ROW LEVEL SECURITY;
```

### Step 2: Verify Storage Bucket Exists

1. **In Supabase Dashboard** → **Click "Storage"** (left sidebar)
2. **Check if `payment-screenshots` bucket exists**
3. **If it doesn't exist:**
   - Click "New bucket"
   - Name: `payment-screenshots` (exactly this)
   - Public: ✅ **YES**
   - File size: `2097152` (2 MB)
   - MIME types: `image/jpeg,image/png,image/jpg`
   - Click "Create bucket"
4. **Set bucket policies:**
   - Click on `payment-screenshots` bucket
   - Click "Policies" tab
   - Create two policies:
     - **Policy 1:** Name `Allow public uploads`, Operation `INSERT`, Definition `(bucket_id = 'payment-screenshots')`
     - **Policy 2:** Name `Allow public reads`, Operation `SELECT`, Definition `(bucket_id = 'payment-screenshots')`

---

## ✅ After These Steps:

1. **Restart dev server** (if not already running):
   - `Ctrl + C` to stop
   - `npm run dev` to start
   - Wait 15 seconds

2. **Test registration:**
   - Fill form
   - Submit
   - **Should work now!** ✅

---

## 🎯 What I Fixed in Code:

1. ✅ Removed auto-bucket creation (it was failing)
2. ✅ Simplified screenshot upload (assumes bucket exists)
3. ✅ Better error handling

**The bucket must be created manually in Supabase Dashboard** - the code will no longer try to create it automatically.

---

## ⚠️ Important:

**Make sure you're running the SQL on your NEW Supabase project** (`tovokkcouwwymarnftcu`), NOT the old one!

You can verify by checking the URL in your Supabase dashboard - it should show `tovokkcouwwymarnftcu.supabase.co`.

---

## 📋 Checklist:

- [ ] Run `FIX_RLS_NOW.sql` in NEW Supabase project
- [ ] Verify `payment-screenshots` bucket exists
- [ ] Set bucket policies (INSERT and SELECT)
- [ ] Restart dev server
- [ ] Test registration

**After these steps, registration should work!** 🎉
