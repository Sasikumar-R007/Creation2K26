# 🔧 Fix the Error - Step by Step

## The Error You're Seeing
"Database column missing. Please run Migration #5 in Supabase SQL Editor."

## ✅ Fix It Now (5 Steps)

### Step 1: Open Supabase Dashboard
1. Open your browser
2. Go to: **https://supabase.com/dashboard**
3. **Login** to your account
4. **Click on your project** (the one you created)

### Step 2: Open SQL Editor
1. Look at the **left sidebar** (menu on the left side)
2. Find and click **"SQL Editor"** (it has a database/query icon)
3. You'll see a page with SQL query editor

### Step 3: Create New Query
1. Click the **"New query"** button (usually top right or top left)
2. A blank text area will appear

### Step 4: Copy and Paste This SQL

**Copy this ENTIRE code:**

```sql
ALTER TABLE public.guest_registrations
  ADD COLUMN IF NOT EXISTS event_1_team_name TEXT,
  ADD COLUMN IF NOT EXISTS event_2_team_name TEXT,
  ADD COLUMN IF NOT EXISTS upi_transaction_id TEXT;
```

**Then:**
1. **Paste** it into the SQL Editor (Ctrl+V)
2. You should see the SQL code in the editor

### Step 5: Run the SQL
1. Look for a **"Run"** button (usually green, bottom right)
2. **Click "Run"**
3. Wait a few seconds
4. You should see **"Success"** or a message saying it completed ✅

### Step 6: Verify It Worked
1. In Supabase Dashboard, click **"Table Editor"** (left sidebar)
2. Click on **`guest_registrations`** table
3. Look at the column list
4. **Check if you see:**
   - ✅ `upi_transaction_id`
   - ✅ `event_1_team_name`
   - ✅ `event_2_team_name`

If you see these columns, **SUCCESS!** ✅

### Step 7: Try Registration Again
1. Go back to your registration page
2. Fill the form
3. Submit registration
4. **It should work now!** 🎉

---

## 🖼️ Visual Guide

**What you should see in Supabase:**

1. **Left Sidebar** → Click "SQL Editor"
2. **Top of page** → Click "New query"
3. **Text area** → Paste the SQL code
4. **Bottom right** → Click "Run" button
5. **Result** → Should say "Success"

---

## ❓ Still Not Working?

### Check These:

1. **Did you click "Run"?**
   - Make sure you actually clicked the Run button
   - Don't just paste and leave it

2. **Did you see "Success"?**
   - Check the result message
   - If you see errors, read them

3. **Did you verify the columns exist?**
   - Go to Table Editor → guest_registrations
   - Check if `upi_transaction_id` column is there

4. **Refresh your browser**
   - After running migration, refresh your registration page
   - Or restart `npm run dev`

---

## 📝 Quick Copy-Paste

If you just want to copy-paste quickly:

1. Go to: https://supabase.com/dashboard
2. Click your project
3. Click "SQL Editor" → "New query"
4. Paste this:
```sql
ALTER TABLE public.guest_registrations
  ADD COLUMN IF NOT EXISTS event_1_team_name TEXT,
  ADD COLUMN IF NOT EXISTS event_2_team_name TEXT,
  ADD COLUMN IF NOT EXISTS upi_transaction_id TEXT;
```
5. Click "Run"
6. Done! ✅

---

**This is the ONLY way to fix it!** The column must be added to your database.

