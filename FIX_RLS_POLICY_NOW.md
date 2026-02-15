# 🚨 URGENT: Fix RLS Policy Error

## The Problem
You're getting: **"new row violates row-level security policy for table guest_registrations"**

This means the RLS (Row Level Security) policy is blocking anonymous inserts.

## ✅ Solution: Run This SQL in Supabase

### Step 1: Go to Supabase SQL Editor
1. **Go to:** https://supabase.com/dashboard
2. **Select your project:** `creation-2k26`
3. **Click "SQL Editor"** (left sidebar)
4. **Click "New query"**

### Step 2: Copy and Paste This SQL

```sql
-- Fix RLS policies for guest_registrations to allow public inserts
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

### Step 3: Run the Query
1. **Click "Run"** (or press `Ctrl + Enter`)
2. **Wait for "Success"** message
3. **Done!** ✅

---

## 🔧 Also Required: Restart Dev Server

Your app is still using the **OLD** Supabase URL. You need to restart:

1. **Stop server:** `Ctrl + C` in terminal
2. **Start again:** `npm run dev`
3. **Wait 10 seconds**

This will load the `.env.local` file I created with your new Supabase credentials.

---

## 📋 Complete Checklist

- [ ] Run the SQL above in Supabase SQL Editor
- [ ] Restart dev server (`npm run dev`)
- [ ] Create storage bucket `payment-screenshots` (if not done)
- [ ] Test registration

---

## 🎯 After These Steps

Registration should work completely! The RLS policy will allow anonymous users to insert registrations.

