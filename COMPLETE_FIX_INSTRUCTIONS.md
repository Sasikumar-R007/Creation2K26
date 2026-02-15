# 🔧 COMPLETE FIX - Registration Not Working

## Issues Found:
1. ❌ **RLS Policy blocking inserts** - Policy needs to allow `public` role
2. ❌ **Using old Supabase URL** - Need to restart dev server
3. ⚠️ **Storage bucket missing** - Need to create it

---

## ✅ Step 1: Fix RLS Policy (CRITICAL - Do This First!)

### Go to Supabase SQL Editor:
1. **Open:** https://supabase.com/dashboard
2. **Select project:** `creation-2k26`
3. **Click "SQL Editor"** (left sidebar)
4. **Click "New query"**

### Copy and Run This SQL:

```sql
-- Fix RLS policy to allow public inserts
DROP POLICY IF EXISTS "Allow anon insert for guest registrations" ON public.guest_registrations;
DROP POLICY IF EXISTS "Allow public insert for guest registrations" ON public.guest_registrations;

-- Create policy to allow ANYONE (including anonymous) to insert
CREATE POLICY "Allow public insert for guest registrations"
ON public.guest_registrations FOR INSERT
TO public
WITH CHECK (true);

-- Ensure RLS is enabled
ALTER TABLE public.guest_registrations ENABLE ROW LEVEL SECURITY;
```

5. **Click "Run"** (or `Ctrl + Enter`)
6. **Wait for "Success"** ✅

---

## ✅ Step 2: Restart Dev Server (REQUIRED!)

The `.env.local` file I created won't load until you restart:

1. **Stop server:** Press `Ctrl + C` in terminal
2. **Start again:** `npm run dev`
3. **Wait 10 seconds**

This will make the app use your NEW Supabase URL (`tovokkcouwwymarnftcu.supabase.co`)

---

## ✅ Step 3: Create Storage Bucket

1. **In Supabase Dashboard** → **Click "Storage"** (left sidebar)
2. **Click "New bucket"**
3. **Settings:**
   - **Name:** `payment-screenshots` (exactly this)
   - **Public bucket:** ✅ **YES** (check this!)
   - **File size limit:** `2097152` (2 MB)
   - **Allowed MIME types:** `image/jpeg,image/png,image/jpg`
4. **Click "Create bucket"**

### Set Bucket Policies:
1. **Click on `payment-screenshots` bucket**
2. **Click "Policies" tab**
3. **Click "New Policy"** → **"For full customization"**

   **Policy 1:**
   - Name: `Allow public uploads`
   - Operation: `INSERT`
   - Definition: `(bucket_id = 'payment-screenshots')`
   - Save

   **Policy 2:**
   - Name: `Allow public reads`
   - Operation: `SELECT`
   - Definition: `(bucket_id = 'payment-screenshots')`
   - Save

---

## ✅ Step 4: Test Registration

1. **Clear browser cache:** `Ctrl + Shift + Delete`
2. **Go to registration page**
3. **Fill form completely**
4. **Submit**
5. **Should work now!** ✅

---

## 📋 Checklist

- [ ] Run RLS policy SQL (Step 1)
- [ ] Restart dev server (Step 2)
- [ ] Create storage bucket (Step 3)
- [ ] Test registration (Step 4)

---

## 🎯 What Each Step Does

- **Step 1:** Allows anonymous users to insert registrations
- **Step 2:** Makes app use your new Supabase project
- **Step 3:** Enables payment screenshot uploads

**All three steps are required for registration to work!**

