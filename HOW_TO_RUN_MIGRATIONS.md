# How to Run Database Migrations - Simple Guide

## 🎯 What You're Doing
You're copying SQL code from files in your project and running them in Supabase to create your database tables.

---

## 📍 Step 1: Open Supabase SQL Editor

1. **Open Browser** → Go to: https://supabase.com/dashboard
2. **Login** to your Supabase account
3. **Click your project** (the one with URL: tovokkcouwwymarnftcu)
4. **In the left sidebar**, find and click **"SQL Editor"**
5. **Click "New query"** button (usually at the top)

You should now see a blank text area where you can type SQL.

---

## 📋 Step 2: Run Migration File #1

**File to use**: `20260203095150_fdaa533d-45e2-42d1-9dde-eaed85ccdb84.sql`

### How to do it:

1. **Open the file on your computer:**
   - Go to your project folder
   - Open folder: `supabase` → `migrations`
   - Find file: `20260203095150_fdaa533d-45e2-42d1-9dde-eaed85ccdb84.sql`
   - Double-click to open it in a text editor

2. **Select ALL the text:**
   - Press `Ctrl + A` (or Cmd + A on Mac)
   - All text should be highlighted

3. **Copy it:**
   - Press `Ctrl + C` (or Cmd + C on Mac)

4. **Go back to Supabase SQL Editor:**
   - Click in the blank text area
   - Press `Ctrl + V` (or Cmd + V on Mac) to paste

5. **Run it:**
   - Click the **"Run"** button (usually green, at bottom right)
   - OR press `Ctrl + Enter`

6. **Check result:**
   - You should see "Success" or a message saying it completed
   - If you see errors, don't worry - some are OK (like "already exists")

✅ **Done with Migration #1!**

---

## 📋 Step 3: Run Migration File #2

**File to use**: `20260204000000_add_whatsapp_phone_to_profiles.sql`

1. **Click "New query"** in Supabase (to start fresh)
2. **Open the file** on your computer
3. **Select ALL** (Ctrl+A) and **Copy** (Ctrl+C)
4. **Paste** into SQL Editor (Ctrl+V)
5. **Click "Run"**
6. **Wait for success** ✅

---

## 📋 Step 4: Run Migration File #3

**File to use**: `20260205000000_guest_registrations.sql`

1. **Click "New query"**
2. **Open the file**
3. **Select ALL** and **Copy**
4. **Paste** and **Run**
5. **Wait for success** ✅

---

## 📋 Step 5: Run Migration File #4

**File to use**: `20260214000000_guest_reg_team_payment.sql`

1. **Click "New query"**
2. **Open the file**
3. **Select ALL** and **Copy**
4. **Paste** and **Run**
5. **Wait for success** ✅

---

## 📋 Step 6: Run Migration File #5

**File to use**: `20260215000000_add_team_name_upi_transaction.sql`

1. **Click "New query"**
2. **Open the file**
3. **Select ALL** and **Copy**
4. **Paste** and **Run**
5. **Wait for success** ✅

---

## ✅ Step 7: Check If It Worked

1. **In Supabase Dashboard**, click **"Table Editor"** (left sidebar)
2. **You should see these tables:**
   - profiles
   - events
   - user_roles
   - guest_registrations
   - event_registrations
   - messages
   - winners
   - student_incharges

If you see these tables, **SUCCESS!** ✅

---

## 📦 Step 8: Create Storage Bucket

1. **Click "Storage"** in left sidebar
2. **Click "New bucket"** button
3. **Name**: Type `payment-screenshots` (exactly this, no spaces)
4. **Check the box**: "Public bucket" ✅
5. **Click "Create bucket"**

6. **Set Policies:**
   - Click on the `payment-screenshots` bucket
   - Click **"Policies"** tab
   - Click **"New Policy"**
   
   **For Upload Policy:**
   - Name: `Allow public uploads`
   - Operation: Select **"INSERT"**
   - Roles: Check both **"anon"** and **"authenticated"**
   - Policy: Type: `(bucket_id = 'payment-screenshots'::text)`
   - Click **"Save"**
   
   **For Read Policy:**
   - Click **"New Policy"** again
   - Name: `Allow public reads`
   - Operation: Select **"SELECT"**
   - Roles: Check both **"anon"** and **"authenticated"**
   - Policy: Type: `(bucket_id = 'payment-screenshots'::text)`
   - Click **"Save"**

---

## 🧪 Step 9: Test It

1. **Open Terminal/Command Prompt** in your project folder
2. **Run:**
   ```bash
   npm install
   npm run dev
   ```
3. **Open browser**: http://localhost:5173
4. **Test the registration page**

---

## ❓ Troubleshooting

### "Table already exists" error?
**Answer**: That's OK! It means the table was already created. You can ignore this.

### Can't find the migration files?
**Answer**: They're in: `supabase/migrations/` folder in your project

### SQL Editor looks different?
**Answer**: Different Supabase versions have slightly different UIs, but the "Run" button should be there somewhere.

### Nothing happens when I click Run?
**Answer**: 
- Make sure you pasted the SQL code
- Try clicking the Run button again
- Check if there's a loading indicator

---

## 📝 Quick Summary

1. Open Supabase → SQL Editor → New query
2. Copy Migration #1 → Paste → Run
3. New query → Copy Migration #2 → Paste → Run
4. New query → Copy Migration #3 → Paste → Run
5. New query → Copy Migration #4 → Paste → Run
6. New query → Copy Migration #5 → Paste → Run
7. Check Table Editor to verify
8. Create storage bucket
9. Test locally

**That's it!** 🎉

