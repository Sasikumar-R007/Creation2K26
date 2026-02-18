# 📋 Admin Login Guide - Step by Step

## 🎯 Quick Summary
- **Admin Email:** `Creation_admin@creation2k26.com`
- **Admin Password:** `Creation@123`
- **Login URL:** `http://localhost:5173/admin-login` (local) or `https://your-live-site.com/admin-login` (live)

---

## ✅ Step 1: Create Admin User (If Not Already Created)

### Option A: Using Seed Script (Recommended)

1. **Get Your Supabase Credentials:**
   - Go to https://supabase.com/dashboard
   - Open your project
   - Go to **Project Settings** → **API**
   - Copy:
     - **Project URL** (e.g., `https://xxxxx.supabase.co`)
     - **Service Role Key** (click "Reveal" next to service_role - this is the SECRET key)

2. **Run the Seed Script:**
   
   **On Windows (PowerShell):**
   ```powershell
   cd "C:\Users\sasir\OneDrive\Documents\Sasikumar R\New folder\creation-2k26-nexus"
   $env:SUPABASE_URL="YOUR_PROJECT_URL_HERE"
   $env:SUPABASE_SERVICE_ROLE_KEY="YOUR_SERVICE_ROLE_KEY_HERE"
   npm run seed:users
   ```

   **Example:**
   ```powershell
   $env:SUPABASE_URL="https://hqkrexlemughwbbblbbkn.supabase.co"
   $env:SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   npm run seed:users
   ```

3. **Check Output:**
   - You should see: `Admin created and role set.`
   - If you see "Admin user already exists", that's fine - it means the admin already exists.

### Option B: Manual Creation (Alternative)

1. Go to Supabase Dashboard → **Authentication** → **Users**
2. Click **"Add user"** → **"Create new user"**
3. Enter:
   - Email: `Creation_admin@creation2k26.com`
   - Password: `Creation@123`
   - Auto Confirm User: ✅ (checked)
4. Click **"Create user"**
5. Go to **SQL Editor** in Supabase and run:
   ```sql
   -- Add admin role
   INSERT INTO public.user_roles (user_id, role)
   SELECT id, 'creation_admin'::app_role
   FROM auth.users
   WHERE email = 'Creation_admin@creation2k26.com'
   ON CONFLICT (user_id, role) DO NOTHING;
   ```

---

## 🚀 Step 2: Test Admin Login Locally

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Open your browser:**
   - Go to: `http://localhost:5173/admin-login`
   - Or navigate from home page to the admin login

3. **Login with:**
   - **Email:** `Creation_admin@creation2k26.com`
   - **Password:** `Creation@123`

4. **After login:**
   - You should be redirected to `/admin` (Admin Dashboard)
   - You can now manage all registrations, view statistics, etc.

---

## 🌐 Step 3: Test Admin Login on Live Site

1. **Make sure your live site is deployed** (Vercel, Netlify, etc.)

2. **Access admin login:**
   - Go to: `https://your-live-site.com/admin-login`
   - Replace `your-live-site.com` with your actual domain

3. **Login with same credentials:**
   - **Email:** `Creation_admin@creation2k26.com`
   - **Password:** `Creation@123`

4. **Verify:**
   - You should see the Admin Dashboard
   - You can manage registrations, view all data, etc.

---

## 🔍 Step 4: Verify Admin User Exists

**Check in Supabase Dashboard:**
1. Go to **Authentication** → **Users**
2. Look for `Creation_admin@creation2k26.com`
3. If it exists, click on it to see details

**Check Role:**
1. Go to **Table Editor** → **user_roles**
2. Look for a row with:
   - `user_id` matching the admin user's ID
   - `role` = `creation_admin`

---

## 🛠️ Troubleshooting

### ❌ "Invalid email or password"
- **Solution:** Make sure the admin user exists in Supabase
- Run the seed script again or create manually

### ❌ "User not found"
- **Solution:** The admin user doesn't exist
- Create it using Step 1 (Option A or B)

### ❌ "Access denied" or redirected to home
- **Solution:** The user exists but doesn't have `creation_admin` role
- Run the seed script again (it will update the role)
- Or manually add the role using SQL (see Option B in Step 1)

### ❌ Seed script fails
- **Check:** Did you use the **service_role** key (not anon key)?
- **Check:** Is your Project URL correct?
- **Check:** Are migrations applied? (events table should exist)

---

## 📝 What You Can Do in Admin Dashboard

Once logged in as admin, you can:
- ✅ View all registrations (participants and guests)
- ✅ View statistics and analytics
- ✅ Manage event registrations
- ✅ Send announcements
- ✅ View all user profiles
- ✅ Export data
- ✅ Manage winners

---

## 🔐 Security Note

**For Production:**
- Change the default password after first login
- Go to Supabase Dashboard → Authentication → Users
- Click on the admin user → Reset password
- Or change password in the app if that feature exists

---

## ✅ Quick Checklist

- [ ] Admin user created in Supabase
- [ ] Admin has `creation_admin` role in `user_roles` table
- [ ] Can login locally at `/admin-login`
- [ ] Can login on live site at `/admin-login`
- [ ] Admin Dashboard loads correctly
- [ ] Can view registrations and manage data

---

**Need Help?** If you're stuck, check:
- `scripts/README-SEED-USERS.md` for detailed seed script info
- `scripts/HOW-TO-RUN-SEED.md` for step-by-step seed instructions

