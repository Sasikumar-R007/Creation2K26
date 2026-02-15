# Complete Setup Guide for New Hosting

## Overview
This guide will help you set up your own hosting environment for the CREATION 2K26 project, even if you don't have access to the original Vercel/Render/Supabase accounts.

## Step 1: Create Your Own Supabase Project

### Why Create a New Supabase Project?
- You'll have full admin access
- You can manage the database yourself
- No dependency on the other person's account

### Steps:

1. **Go to Supabase**
   - Visit: https://supabase.com
   - Sign up/Login with your own account

2. **Create New Project**
   - Click "New Project"
   - Project Name: `creation-2k26` (or any name you prefer)
   - Database Password: Create a strong password (SAVE THIS!)
   - Region: Choose closest to your users (e.g., `Southeast Asia (Singapore)`)
   - Click "Create new project"

3. **Get Your Project Credentials**
   - Go to Project Settings → API
   - Copy these values:
     - `Project URL` (e.g., `https://xxxxx.supabase.co`)
     - `anon public` key (starts with `eyJ...`)
   - Save these securely!

4. **Run Database Migrations**
   - Go to SQL Editor in Supabase Dashboard
   - Run all migration files from `supabase/migrations/` folder in order:
     - `20260203095150_*.sql` (if exists)
     - `20260204000000_*.sql` (if exists)
     - `20260205000000_guest_registrations.sql`
     - `20260214000000_guest_reg_team_payment.sql`
     - `20260215000000_add_team_name_upi_transaction.sql`

5. **Create Storage Bucket**
   - Go to Storage → Create bucket
   - Name: `payment-screenshots`
   - Make it Public
   - Set policies (see STORAGE_SETUP.md)

## Step 2: Update Project Configuration

### Update Supabase Credentials

1. **Update `src/integrations/supabase/client.ts`**
   ```typescript
   const SUPABASE_URL = "YOUR_NEW_PROJECT_URL";
   const SUPABASE_PUBLISHABLE_KEY = "YOUR_NEW_ANON_KEY";
   ```

2. **Or Use Environment Variables (Recommended)**
   - Create `.env.local` file in project root:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```
   
   - Update `src/integrations/supabase/client.ts`:
   ```typescript
   const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://hqkrexlemuhgwbblbbkn.supabase.co";
   const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "old-key";
   ```

## Step 3: Host on Vercel (Free & Easy)

### Why Vercel?
- Free for personal projects
- Automatic deployments from GitHub
- Easy domain connection
- Built-in SSL certificates
- Fast global CDN

### Steps:

1. **Prepare Your Code**
   ```bash
   # Make sure all changes are committed
   git add .
   git commit -m "Ready for deployment"
   ```

2. **Push to GitHub**
   - Create a new repository on GitHub (if not already)
   - Push your code:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/creation-2k26.git
   git push -u origin main
   ```

3. **Deploy to Vercel**
   - Go to: https://vercel.com
   - Sign up/Login (use GitHub account)
   - Click "Add New Project"
   - Import your GitHub repository
   - Configure:
     - Framework Preset: `Vite`
     - Root Directory: `./` (default)
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - Add Environment Variables:
     - `VITE_SUPABASE_URL` = Your Supabase URL
     - `VITE_SUPABASE_ANON_KEY` = Your Supabase anon key
   - Click "Deploy"

4. **Get Your Vercel URL**
   - After deployment, you'll get: `your-project.vercel.app`
   - Test the site to make sure it works

## Step 4: Connect Your GoDaddy Domain

### Option A: Point Domain to Vercel (Recommended)

1. **In Vercel Dashboard**
   - Go to your project → Settings → Domains
   - Add your domain: `yourdomain.com` and `www.yourdomain.com`
   - Vercel will show you DNS records to add

2. **In GoDaddy**
   - Go to GoDaddy → My Products → DNS Management
   - Add/Update these records:
     - **Type A**: 
       - Name: `@`
       - Value: `76.76.21.21` (Vercel's IP - check Vercel docs for latest)
     - **Type CNAME**:
       - Name: `www`
       - Value: `cname.vercel-dns.com` (or what Vercel shows)
   - Save changes
   - Wait 5-30 minutes for DNS propagation

3. **Verify in Vercel**
   - Vercel will automatically detect and configure SSL
   - Your site will be live at your domain!

### Option B: Use Vercel's Nameservers (Easier)

1. **In Vercel**
   - Add your domain
   - Vercel will provide nameservers

2. **In GoDaddy**
   - Go to DNS Management
   - Change nameservers to Vercel's nameservers
   - Save and wait for propagation

## Step 5: Stop Old Website (Optional)

### If You Want to Stop the Old Site:

1. **Contact the Other Person**
   - Ask them to take down the old site
   - Or just point your domain away (your domain, your control)

2. **Point Domain Away**
   - Once you point your GoDaddy domain to Vercel, the old site won't be accessible via your domain
   - The old site will still exist on Vercel/Render but won't be accessible via your domain

## Step 6: Verify Everything Works

### Checklist:
- [ ] Supabase project created and migrations run
- [ ] Storage bucket `payment-screenshots` created
- [ ] Environment variables set in Vercel
- [ ] Site deployed on Vercel
- [ ] Domain connected and SSL active
- [ ] Test registration flow works
- [ ] Test admin login works
- [ ] Test payment screenshot upload works

## Step 7: Admin Access Setup

### Create Admin User:

1. **Sign up on your site**
   - Go to your live site
   - Sign up with your email
   - Verify email if needed

2. **Make Yourself Admin**
   - Go to Supabase Dashboard → SQL Editor
   - Run:
   ```sql
   -- Replace 'your-email@example.com' with your actual email
   UPDATE public.user_roles 
   SET role = 'creation_admin' 
   WHERE user_id = (
     SELECT id FROM auth.users WHERE email = 'your-email@example.com'
   );
   ```

3. **Test Admin Access**
   - Logout and login again
   - Go to `/admin` or `/dashboard`
   - You should have admin access!

## Troubleshooting

### Domain Not Working?
- Check DNS propagation: https://www.whatsmydns.net
- Wait up to 48 hours for full propagation
- Check GoDaddy DNS settings are correct

### Supabase Connection Issues?
- Verify environment variables in Vercel
- Check Supabase project is active
- Verify API keys are correct

### Build Errors?
- Check Vercel build logs
- Ensure all dependencies are in `package.json`
- Check Node.js version (Vercel auto-detects)

## Cost Estimate

- **Vercel**: FREE (Hobby plan) - Unlimited for personal projects
- **Supabase**: FREE tier includes:
  - 500 MB database
  - 1 GB file storage
  - 2 GB bandwidth
  - 50,000 monthly active users
- **GoDaddy Domain**: Already paid (your existing domain)
- **Total**: $0/month (if within free tiers)

## Need More Resources?

If you exceed free tiers:
- **Vercel Pro**: $20/month (if needed)
- **Supabase Pro**: $25/month (if needed)
- But free tier should be enough for most events!

## Important Notes

1. **Backup Your Code**
   - Keep GitHub repository updated
   - Regular commits

2. **Keep Credentials Safe**
   - Never commit `.env` files
   - Use Vercel environment variables
   - Keep Supabase password secure

3. **Monitor Usage**
   - Check Supabase dashboard for usage
   - Monitor Vercel bandwidth

4. **Test Before Going Live**
   - Test registration flow
   - Test admin panel
   - Test all features

## Support Resources

- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- GoDaddy DNS Help: https://www.godaddy.com/help

