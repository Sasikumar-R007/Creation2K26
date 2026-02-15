# 🚨 URGENT FIX - Two Critical Issues

## Problem 1: Wrong Supabase URL ✅ FIXED
Your app is using the **OLD** Supabase URL. I've created `.env.local` for you.

## Problem 2: Storage Bucket Missing ⚠️ YOU NEED TO CREATE THIS

---

## 🔧 Fix Steps (5 minutes)

### Step 1: Restart Dev Server (CRITICAL!)
The `.env.local` file won't load until you restart:

1. **Stop server:** `Ctrl + C` in terminal
2. **Start again:** `npm run dev`
3. **Wait 10 seconds**

### Step 2: Create Storage Bucket

1. **Go to:** https://supabase.com/dashboard
2. **Select project:** `creation-2k26` (or your project name)
3. **Click "Storage"** (left sidebar, folder icon)
4. **Click green "New bucket" button**
5. **Fill in:**
   - **Name:** `payment-screenshots` (exactly this)
   - **Public bucket:** ✅ **CHECK THIS** (very important!)
   - **File size limit:** `2097152` (2 MB in bytes)
   - **Allowed MIME types:** `image/jpeg,image/png,image/jpg`
6. **Click "Create bucket"**

### Step 3: Set Bucket Policies (Allow Uploads)

1. **Click on `payment-screenshots` bucket** (just created)
2. **Click "Policies" tab** (top)
3. **Click "New Policy"** → **"For full customization"**

   **Policy 1: Allow Uploads**
   - **Policy name:** `Allow public uploads`
   - **Allowed operation:** `INSERT`
   - **Policy definition:**
     ```sql
     (bucket_id = 'payment-screenshots')
     ```
   - **Click "Review"** → **"Save policy"**

   **Policy 2: Allow Reads**
   - **Click "New Policy"** again
   - **Policy name:** `Allow public reads`
   - **Allowed operation:** `SELECT`
   - **Policy definition:**
     ```sql
     (bucket_id = 'payment-screenshots')
     ```
   - **Click "Review"** → **"Save policy"**

### Step 4: Test Registration

1. **Clear browser cache:** `Ctrl + Shift + Delete`
2. **Go to registration page**
3. **Fill form and submit**
4. **Should work now!** ✅

---

## ✅ What I Fixed

1. ✅ Created `.env.local` with your new Supabase credentials
2. ✅ Updated error handling to be more resilient
3. ✅ Code will retry with minimal fields if needed

---

## 🎯 After These Steps

- ✅ App will use your NEW Supabase project (`tovokkcouwwymarnftcu.supabase.co`)
- ✅ Storage bucket will exist
- ✅ Registration will work completely

**MOST IMPORTANT: Restart your dev server after I created `.env.local`!**

