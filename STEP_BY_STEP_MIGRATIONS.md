# Step-by-Step: Run Database Migrations

## Step 1: Open Supabase SQL Editor

1. **Go to Supabase Dashboard**
   - Open your browser
   - Go to: https://supabase.com/dashboard
   - Login with your account

2. **Select Your Project**
   - You should see your project: `tovokkcouwwymarnftcu`
   - Click on it to open

3. **Open SQL Editor**
   - Look at the **left sidebar menu**
   - Find and click **"SQL Editor"** (it has a database icon)
   - You'll see a page with SQL query editor

4. **Create New Query**
   - Click the **"New query"** button (usually top right or top left)
   - A blank SQL editor will open

---

## Step 2: Run Migration 1 (Base Schema)

This creates all the main tables.

1. **Open the migration file**
   - In your project folder, go to: `supabase/migrations/`
   - Open file: `20260203095150_fdaa533d-45e2-42d1-9dde-eaed85ccdb84.sql`
   - **Select ALL** the text (Ctrl+A)
   - **Copy** it (Ctrl+C)

2. **Paste into SQL Editor**
   - Go back to Supabase SQL Editor
   - **Paste** the copied SQL (Ctrl+V)
   - You should see a lot of SQL code

3. **Run the Query**
   - Click the **"Run"** button (usually green, bottom right)
   - Or press **Ctrl+Enter**
   - Wait for it to complete (should say "Success" or show results)

4. **Check for Errors**
   - If you see "Success" or no errors → ✅ Good!
   - If you see errors, read them carefully (some are OK if tables already exist)

---

## Step 3: Run Migration 2 (Add WhatsApp Phone)

1. **Open the migration file**
   - Go to: `supabase/migrations/`
   - Open file: `20260204000000_add_whatsapp_phone_to_profiles.sql`
   - **Select ALL** and **Copy**

2. **In SQL Editor**
   - Click **"New query"** again (to start fresh)
   - **Paste** the SQL
   - Click **"Run"**
   - Wait for success ✅

---

## Step 4: Run Migration 3 (Guest Registrations)

1. **Open the migration file**
   - Go to: `supabase/migrations/`
   - Open file: `20260205000000_guest_registrations.sql`
   - **Select ALL** and **Copy**

2. **In SQL Editor**
   - Click **"New query"**
   - **Paste** the SQL
   - Click **"Run"**
   - Wait for success ✅

---

## Step 5: Run Migration 4 (Team & Payment Fields)

1. **Open the migration file**
   - Go to: `supabase/migrations/`
   - Open file: `20260214000000_guest_reg_team_payment.sql`
   - **Select ALL** and **Copy**

2. **In SQL Editor**
   - Click **"New query"**
   - **Paste** the SQL
   - Click **"Run"**
   - Wait for success ✅

---

## Step 6: Run Migration 5 (Team Names & UPI Transaction ID)

1. **Open the migration file**
   - Go to: `supabase/migrations/`
   - Open file: `20260215000000_add_team_name_upi_transaction.sql`
   - **Select ALL** and **Copy**

2. **In SQL Editor**
   - Click **"New query"**
   - **Paste** the SQL
   - Click **"Run"**
   - Wait for success ✅

---

## Step 7: Verify Tables Were Created

1. **Go to Table Editor**
   - In Supabase Dashboard, click **"Table Editor"** in left sidebar
   - You should see a list of tables

2. **Check These Tables Exist:**
   - ✅ `profiles`
   - ✅ `events`
   - ✅ `user_roles`
   - ✅ `guest_registrations`
   - ✅ `event_registrations`
   - ✅ `messages`
   - ✅ `winners`
   - ✅ `student_incharges`

3. **If tables are missing:**
   - Go back to SQL Editor
   - Check the query history
   - Re-run any failed migrations

---

## Step 8: Create Storage Bucket

1. **Go to Storage**
   - Click **"Storage"** in left sidebar
   - You'll see a list of buckets (might be empty)

2. **Create New Bucket**
   - Click **"New bucket"** button (usually top right)
   - **Name**: Type exactly: `payment-screenshots`
   - **Public bucket**: Check this box ✅ (IMPORTANT!)
   - Click **"Create bucket"**

3. **Set Bucket Policies**
   - Click on the `payment-screenshots` bucket you just created
   - Click **"Policies"** tab
   - Click **"New Policy"** button

   **Policy 1: Allow Uploads**
   - Policy name: `Allow public uploads`
   - Allowed operation: Select **"INSERT"**
   - Target roles: Check **"anon"** and **"authenticated"**
   - Policy definition: Type this exactly:
     ```sql
     (bucket_id = 'payment-screenshots'::text)
     ```
   - Click **"Review"** then **"Save policy"**

   **Policy 2: Allow Reads**
   - Click **"New Policy"** again
   - Policy name: `Allow public reads`
   - Allowed operation: Select **"SELECT"**
   - Target roles: Check **"anon"** and **"authenticated"**
   - Policy definition: Type this exactly:
     ```sql
     (bucket_id = 'payment-screenshots'::text)
     ```
   - Click **"Review"** then **"Save policy"**

---

## Step 9: Test Everything

1. **Start Your Local Server**
   ```bash
   npm install
   npm run dev
   ```

2. **Open Browser**
   - Go to: http://localhost:5173
   - You should see your website!

3. **Test Registration**
   - Click "Register" or go to `/register`
   - Fill out the form
   - Try to submit a registration
   - Check if it works!

---

## Common Issues & Solutions

### Issue: "Table already exists" error
**Solution**: This is OK! The migrations use `IF NOT EXISTS`, so it's safe to run again.

### Issue: "Permission denied" error
**Solution**: Make sure you're logged into Supabase and have access to the project.

### Issue: Can't find SQL Editor
**Solution**: Look in the left sidebar - it might be under a menu. Or search for "SQL" in the dashboard.

### Issue: Storage bucket not working
**Solution**: 
- Make sure bucket name is exactly `payment-screenshots` (case-sensitive)
- Make sure it's marked as Public
- Check policies are set correctly

---

## Quick Checklist

- [ ] Opened Supabase SQL Editor
- [ ] Ran Migration 1 (Base Schema)
- [ ] Ran Migration 2 (WhatsApp Phone)
- [ ] Ran Migration 3 (Guest Registrations)
- [ ] Ran Migration 4 (Team & Payment)
- [ ] Ran Migration 5 (Team Names & UPI)
- [ ] Verified tables exist in Table Editor
- [ ] Created `payment-screenshots` storage bucket
- [ ] Set bucket policies (INSERT and SELECT)
- [ ] Tested locally with `npm run dev

---

## Need Help?

If you get stuck:
1. Check the error message in SQL Editor
2. Make sure you copied the ENTIRE file content
3. Try running the migration again
4. Check that you're in the correct Supabase project

Good luck! 🚀

