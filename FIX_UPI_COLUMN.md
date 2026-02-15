# Fix: upi_transaction_id Column Missing

## The Problem
You're getting this error:
```
Could not find the 'upi_transaction_id' column of 'guest_registrations' in the schema cache
```

This means Migration #5 hasn't been run yet, or it failed.

## Quick Fix: Run Migration #5

1. **Go to Supabase Dashboard** → **SQL Editor**

2. **Click "New query"**

3. **Open this file on your computer:**
   - `supabase/migrations/20260215000000_add_team_name_upi_transaction.sql`

4. **Copy ALL the content** and paste into SQL Editor

5. **Click "Run"**

6. **Verify it worked:**
   - Go to **Table Editor** → `guest_registrations` table
   - Check if these columns exist:
     - `event_1_team_name`
     - `event_2_team_name`
     - `upi_transaction_id`

## What the Migration Does

It adds these 3 columns to `guest_registrations`:
- `event_1_team_name` (TEXT)
- `event_2_team_name` (TEXT)
- `upi_transaction_id` (TEXT)

## After Running Migration

1. **Refresh your browser** (or restart `npm run dev`)
2. **Try registration again**
3. **It should work now!** ✅

## Code Already Fixed

I've also updated the code to handle this gracefully - it will only include `upi_transaction_id` if it has a value, which helps avoid errors if the column doesn't exist yet.

But you still need to run the migration to add the column to your database!

