# Quick Setup: Connect Your New Supabase Database

## What I Need From You

Just **2 things** from your Supabase dashboard:

### 1. Project URL
- Go to: **Settings** → **API** (in Supabase Dashboard)
- Copy the **"Project URL"**
- Looks like: `https://xxxxxxxxxxxxx.supabase.co`

### 2. Anon/Public Key  
- Same page (Settings → API)
- Copy the **"anon public"** key
- Long string starting with `eyJ...`

## Where to Find These

1. Login to https://supabase.com/dashboard
2. Click your project
3. Click ⚙️ **Settings** (left sidebar)
4. Click **API** (under Project Settings)
5. You'll see:
   - **Project URL** (copy this)
   - **anon public** key (copy this)

## Quick Setup Steps

### Step 1: Create `.env.local` File

In your project root folder, create a file named `.env.local`:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Replace with your actual values!**

### Step 2: Run Migrations

Go to Supabase Dashboard → **SQL Editor** → **New query**

Run these 5 migration files in order (copy-paste each one):

1. `supabase/migrations/20260203095150_fdaa533d-45e2-42d1-9dde-eaed85ccdb84.sql`
2. `supabase/migrations/20260204000000_add_whatsapp_phone_to_profiles.sql`
3. `supabase/migrations/20260205000000_guest_registrations.sql`
4. `supabase/migrations/20260214000000_guest_reg_team_payment.sql`
5. `supabase/migrations/20260215000000_add_team_name_upi_transaction.sql`

### Step 3: Create Storage Bucket

1. Go to **Storage** (left sidebar)
2. Click **New bucket**
3. Name: `payment-screenshots`
4. Check **Public bucket** ✅
5. Click **Create**

Then set policies (see STORAGE_SETUP.md for details)

### Step 4: Test It!

```bash
npm install
npm run dev
```

Visit http://localhost:5173 and test!

## Share Your Credentials

Once you have them, you can share:
- Project URL
- Anon Key

And I can help you set it up, or you can just create the `.env.local` file yourself!

## Security Note

- ✅ **Anon key is safe** to use in frontend code
- ✅ **Anon key is safe** to share (it's meant to be public)
- ❌ **Never share** your service_role key (if you see it)
- ❌ **Never commit** `.env.local` to git (it's already in .gitignore)

