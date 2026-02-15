# How to Get Your Supabase Credentials

## Step 1: Get Your Project URL and API Key

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Login to your account

2. **Select Your Project**
   - Click on the project you just created (e.g., "creation-2k26")

3. **Go to Project Settings**
   - Click the gear icon (⚙️) in the left sidebar
   - Or click "Settings" → "API"

4. **Copy These Values:**

   **a) Project URL**
   - Look for "Project URL" or "API URL"
   - It looks like: `https://xxxxxxxxxxxxx.supabase.co`
   - Copy this entire URL

   **b) Anon/Public Key**
   - Look for "anon public" key
   - It's a long string starting with `eyJ...`
   - This is safe to use in frontend code
   - Copy this entire key

5. **Save These Securely:**
   ```
   Project URL: https://your-project-id.supabase.co
   Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## Step 2: Update Your Project

### Option A: Using Environment Variables (Recommended)

1. **Create `.env.local` file** in your project root:
   ```bash
   # In your project folder, create this file
   .env.local
   ```

2. **Add your credentials:**
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. **The code will automatically use these!**
   - I've already updated the code to support environment variables
   - It will use your new credentials automatically

### Option B: Direct Update (Quick Test)

If you want to test quickly, I can update the code directly with your credentials. Just provide:
- Project URL
- Anon Key

## Step 3: Run Database Migrations

You need to run these SQL migrations in order:

1. **Go to SQL Editor** in Supabase Dashboard
   - Click "SQL Editor" in left sidebar
   - Click "New query"

2. **Run each migration file** from `supabase/migrations/` folder:

   **Migration 1:** (if exists)
   - File: `20260203095150_fdaa533d-45e2-42d1-9dde-eaed85ccdb84.sql`
   - Copy entire content and run

   **Migration 2:** (if exists)
   - File: `20260204000000_add_whatsapp_phone_to_profiles.sql`
   - Copy entire content and run

   **Migration 3:**
   - File: `20260205000000_guest_registrations.sql`
   - Copy entire content and run

   **Migration 4:**
   - File: `20260214000000_guest_reg_team_payment.sql`
   - Copy entire content and run

   **Migration 5:**
   - File: `20260215000000_add_team_name_upi_transaction.sql`
   - Copy entire content and run

3. **Verify Tables Created:**
   - Go to "Table Editor" in Supabase
   - You should see:
     - `profiles`
     - `events`
     - `guest_registrations`
     - `user_roles`
     - `event_registrations`
     - etc.

## Step 4: Create Storage Bucket

1. **Go to Storage** in Supabase Dashboard
   - Click "Storage" in left sidebar

2. **Create New Bucket**
   - Click "New bucket"
   - Name: `payment-screenshots` (exactly this name)
   - Check "Public bucket" ✅
   - Click "Create bucket"

3. **Set Bucket Policies**
   - Click on the bucket name
   - Go to "Policies" tab
   - Click "New Policy"
   
   **Policy 1: Allow Public Uploads**
   - Policy name: `Allow public uploads`
   - Allowed operation: `INSERT`
   - Target roles: `anon`, `authenticated`
   - Policy definition:
   ```sql
   (bucket_id = 'payment-screenshots'::text)
   ```
   
   **Policy 2: Allow Public Reads**
   - Policy name: `Allow public reads`
   - Allowed operation: `SELECT`
   - Target roles: `anon`, `authenticated`
   - Policy definition:
   ```sql
   (bucket_id = 'payment-screenshots'::text)
   ```

## Step 5: Seed Initial Data (Optional)

If you need to add events, you can:

1. **Go to Table Editor** → `events` table
2. **Add events manually** or
3. **Run seed script** if available

## What I Need From You

Please provide:

1. **Project URL:**
   ```
   https://xxxxx.supabase.co
   ```

2. **Anon Key:**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **Confirmation:**
   - [ ] Migrations run successfully?
   - [ ] Storage bucket created?
   - [ ] Any errors during setup?

## Quick Checklist

- [ ] Got Project URL from Settings → API
- [ ] Got Anon Key from Settings → API
- [ ] Created `.env.local` file with credentials
- [ ] Ran all migration files in SQL Editor
- [ ] Created `payment-screenshots` storage bucket
- [ ] Set bucket policies for public access
- [ ] Verified tables exist in Table Editor

## Next Steps After Setup

1. **Test Locally:**
   ```bash
   npm install
   npm run dev
   ```
   - Visit http://localhost:5173
   - Test registration flow

2. **Create Admin User:**
   - Sign up on your site
   - Then run in SQL Editor:
   ```sql
   UPDATE public.user_roles 
   SET role = 'creation_admin' 
   WHERE user_id = (
     SELECT id FROM auth.users WHERE email = 'your-email@example.com'
   );
   ```

3. **Ready to Deploy!**
   - Once everything works locally
   - Follow `SETUP_NEW_HOSTING.md` for deployment

## Need Help?

If you encounter any errors:
1. Check Supabase logs (Dashboard → Logs)
2. Check browser console for errors
3. Verify all migrations ran successfully
4. Verify storage bucket exists and is public

