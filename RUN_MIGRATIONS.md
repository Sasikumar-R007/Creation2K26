# How to Run Database Migrations

## Your Supabase Project
- **URL**: https://tovokkcouwwymarnftcu.supabase.co
- **Credentials**: Already configured in `.env.local` ✅

## Step-by-Step: Run Migrations

### 1. Go to Supabase SQL Editor
1. Login to https://supabase.com/dashboard
2. Click your project
3. Click **"SQL Editor"** in left sidebar
4. Click **"New query"**

### 2. Run Each Migration (In Order)

Copy and paste each migration file content, then click **"Run"**:

#### Migration 1: Base Schema
**File**: `supabase/migrations/20260203095150_fdaa533d-45e2-42d1-9dde-eaed85ccdb84.sql`
- This creates all base tables (profiles, events, user_roles, etc.)
- **Copy entire file content** and run

#### Migration 2: Add WhatsApp Phone
**File**: `supabase/migrations/20260204000000_add_whatsapp_phone_to_profiles.sql`
- Adds whatsapp_phone column to profiles
- **Copy entire file content** and run

#### Migration 3: Guest Registrations
**File**: `supabase/migrations/20260205000000_guest_registrations.sql`
- Creates guest_registrations table
- **Copy entire file content** and run

#### Migration 4: Team & Payment Fields
**File**: `supabase/migrations/20260214000000_guest_reg_team_payment.sql`
- Adds team_size, team_members, payment_screenshot_url
- **Copy entire file content** and run

#### Migration 5: Team Names & UPI Transaction ID
**File**: `supabase/migrations/20260215000000_add_team_name_upi_transaction.sql`
- Adds event_1_team_name, event_2_team_name, upi_transaction_id
- **Copy entire file content** and run

### 3. Verify Tables Created

After running all migrations:
1. Go to **"Table Editor"** in Supabase Dashboard
2. You should see these tables:
   - ✅ `profiles`
   - ✅ `events`
   - ✅ `user_roles`
   - ✅ `guest_registrations`
   - ✅ `event_registrations`
   - ✅ `messages`
   - ✅ `winners`
   - ✅ `student_incharges`

### 4. Create Storage Bucket

1. Go to **"Storage"** in left sidebar
2. Click **"New bucket"**
3. Name: `payment-screenshots` (exactly this)
4. Check **"Public bucket"** ✅
5. Click **"Create bucket"**

6. **Set Policies:**
   - Click on `payment-screenshots` bucket
   - Go to **"Policies"** tab
   - Click **"New Policy"**
   
   **Policy 1: Allow Public Uploads**
   - Name: `Allow public uploads`
   - Operation: `INSERT`
   - Roles: `anon`, `authenticated`
   - Policy: `(bucket_id = 'payment-screenshots'::text)`
   
   **Policy 2: Allow Public Reads**
   - Name: `Allow public reads`
   - Operation: `SELECT`
   - Roles: `anon`, `authenticated`
   - Policy: `(bucket_id = 'payment-screenshots'::text)`

### 5. Seed Events (Optional)

If you need to add events:
1. Go to **"Table Editor"** → `events` table
2. Click **"Insert"** → **"Insert row"**
3. Add your events manually

Or check if there's a seed script in `scripts/` folder.

## Quick Test

After migrations:

```bash
npm install
npm run dev
```

Visit http://localhost:5173 and test:
- [ ] Homepage loads
- [ ] Registration page works
- [ ] Can submit registration
- [ ] Admin login works (after creating admin user)

## Create Admin User

1. **Sign up** on your local site (http://localhost:5173)
2. **Go to SQL Editor** in Supabase
3. **Run this** (replace with your email):
   ```sql
   UPDATE public.user_roles 
   SET role = 'creation_admin' 
   WHERE user_id = (
     SELECT id FROM auth.users WHERE email = 'your-email@example.com'
   );
   ```
4. **Logout and login again**
5. **Go to `/admin`** - you should have admin access!

## Troubleshooting

### Migration Errors?
- Check if tables already exist (some migrations use `IF NOT EXISTS`)
- Run migrations one at a time
- Check error messages in SQL Editor

### Can't See Tables?
- Refresh the Table Editor
- Check you're in the right project
- Verify migrations ran successfully (check SQL Editor history)

### Storage Bucket Not Working?
- Verify bucket name is exactly `payment-screenshots`
- Check bucket is marked as Public
- Verify policies are set correctly

## Next Steps

Once migrations are done:
1. ✅ Test locally
2. ✅ Create admin user
3. ✅ Add events (if needed)
4. ✅ Deploy to Vercel (see SETUP_NEW_HOSTING.md)

