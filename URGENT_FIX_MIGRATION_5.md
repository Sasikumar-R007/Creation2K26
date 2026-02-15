# ⚠️ URGENT: Run Migration #5 - This Will Fix Your Error!

## The Problem
You're getting: `Could not find the 'upi_transaction_id' column`

**This is NOT a code issue** - it's a database issue. The column doesn't exist yet.

## ✅ Solution: Run This SQL (2 minutes)

### Step 1: Open Supabase
1. Go to: https://supabase.com/dashboard
2. Click your project
3. Click **"SQL Editor"** (left sidebar)
4. Click **"New query"**

### Step 2: Copy This SQL

```sql
ALTER TABLE public.guest_registrations
  ADD COLUMN IF NOT EXISTS event_1_team_name TEXT,
  ADD COLUMN IF NOT EXISTS event_2_team_name TEXT,
  ADD COLUMN IF NOT EXISTS upi_transaction_id TEXT;
```

### Step 3: Run It
- Paste the SQL above
- Click **"Run"** button (green button, usually bottom right)
- Wait for "Success" ✅

### Step 4: Verify It Worked
1. Go to **"Table Editor"** (left sidebar)
2. Click on **`guest_registrations`** table
3. Look at the columns - you should see:
   - ✅ `upi_transaction_id`
   - ✅ `event_1_team_name`
   - ✅ `event_2_team_size`

### Step 5: Try Registration Again
- Go back to your registration page
- Fill the form
- Submit
- **It should work now!** ✅

---

## ❌ What WON'T Fix It

- ❌ `npm install` - This won't help (it's a database issue)
- ❌ Restarting server - Won't help
- ❌ Clearing browser cache - Won't help

## ✅ What WILL Fix It

- ✅ Running the SQL migration above - **This is the ONLY fix!**

---

## Why This Happened

You ran Migrations #1-4, but Migration #5 (which adds `upi_transaction_id`) hasn't been run yet.

**Just run the SQL above and you're done!** 🚀

