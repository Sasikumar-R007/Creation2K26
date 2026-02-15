# ⚠️ IMPORTANT: Run Migration #5 Now

## The Error You're Seeing
```
Could not find the 'upi_transaction_id' column of 'guest_registrations' in the schema cache
```

## Quick Fix (2 minutes)

### Step 1: Go to Supabase SQL Editor
1. Open: https://supabase.com/dashboard
2. Click your project
3. Click **"SQL Editor"** (left sidebar)
4. Click **"New query"**

### Step 2: Copy and Run This SQL

Copy this ENTIRE code and paste into SQL Editor:

```sql
-- Add team name fields and UPI transaction ID to guest_registrations

ALTER TABLE public.guest_registrations
  ADD COLUMN IF NOT EXISTS event_1_team_name TEXT,
  ADD COLUMN IF NOT EXISTS event_2_team_name TEXT,
  ADD COLUMN IF NOT EXISTS upi_transaction_id TEXT;
```

### Step 3: Run It
- Click **"Run"** button
- Wait for "Success" message ✅

### Step 4: Verify
1. Go to **"Table Editor"** → `guest_registrations` table
2. Check if these columns exist:
   - ✅ `event_1_team_name`
   - ✅ `event_2_team_name`
   - ✅ `upi_transaction_id`

### Step 5: Try Registration Again
- Go back to your registration page
- Try submitting again
- **It should work now!** ✅

---

## What This Migration Does

Adds 3 new columns to `guest_registrations` table:
- `event_1_team_name` - For team name when Event 1 has team size > 1
- `event_2_team_name` - For team name when Event 2 has team size > 1
- `upi_transaction_id` - For storing UPI transaction ID

---

## Code Already Updated

I've also updated the code to handle missing columns gracefully, but you still need to run this migration to add the columns to your database!

**Run the SQL above and try again!** 🚀

