# 🚀 Deployment Guide - Creation 2K26 Nexus

## 📋 Overview

This project uses **Supabase as the backend** (database, authentication, storage). You only need to deploy the **frontend** to Vercel. No separate backend server is required!

---

## 🎯 Architecture

```
┌─────────────────┐
│  Vercel (Frontend) │
│   React + Vite     │
└────────┬──────────┘
         │
         │ API Calls
         │
┌────────▼──────────┐
│   Supabase        │
│  - PostgreSQL DB  │
│  - Authentication │
│  - Storage        │
└───────────────────┘
```

**Your Supabase Project:**
- **URL**: `https://tovokkcouwwymarnftcu.supabase.co`
- **Project ID**: `tovokkcouwwymarnftcu`

---

## 📦 Step 1: Prepare Your Code

### 1.1 Ensure All Changes Are Committed

```bash
git status
git add .
git commit -m "Prepare for deployment"
git push origin main
```

---

## 🌐 Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel**
   - Visit: https://vercel.com
   - Sign in with GitHub (use your account: `Sasikumar-R007`)

2. **Import Your Repository**
   - Click **"Add New..."** → **"Project"**
   - Select **"Import Git Repository"**
   - Choose: `Sasikumar-R007/Creation2K26`
   - Click **"Import"**

3. **Configure Project Settings**
   - **Framework Preset**: `Vite` (auto-detected)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
   - **Node.js Version**: `20.x` (recommended) or leave auto

4. **Add Environment Variables**
   Click **"Environment Variables"** and add:
   
   ```
   Name: VITE_SUPABASE_URL
   Value: https://tovokkcouwwymarnftcu.supabase.co
   ```
   
   ```
   Name: VITE_SUPABASE_ANON_KEY
   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvdm9ra2NvdXd3eW1hcm5mdGN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExMjE5NjcsImV4cCI6MjA4NjY5Nzk2N30.CVN8RbHF1GA5Kvo3JlkZWjIryuCuGURwm6PV_auZOGs
   ```
   
   **Important**: Select all environments (Production, Preview, Development)

5. **Deploy**
   - Click **"Deploy"**
   - Wait for build to complete (2-3 minutes)
   - Your app will be live at: `https://your-project-name.vercel.app`

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Link to existing project? **No** (first time)
   - Project name: `creation-2k26-nexus` (or your choice)
   - Directory: `./` (default)
   - Override settings? **No**

4. **Set Environment Variables**
   ```bash
   vercel env add VITE_SUPABASE_URL
   # Paste: https://tovokkcouwwymarnftcu.supabase.co
   
   vercel env add VITE_SUPABASE_ANON_KEY
   # Paste: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvdm9ra2NvdXd3eW1hcm5mdGN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExMjE5NjcsImV4cCI6MjA4NjY5Nzk2N30.CVN8RbHF1GA5Kvo3JlkZWjIryuCuGURwm6PV_auZOGs
   ```

5. **Redeploy with Environment Variables**
   ```bash
   vercel --prod
   ```

---

## ✅ Step 3: Verify Deployment

1. **Check Your Live Site**
   - Visit your Vercel URL: `https://your-project.vercel.app`
   - Test the landing page
   - Try registration/login

2. **Test Key Features**
   - ✅ User registration
   - ✅ User login
   - ✅ Event browsing
   - ✅ Event registration
   - ✅ Dashboard access

3. **Check Browser Console**
   - Open DevTools (F12)
   - Look for any errors
   - Verify Supabase connection

---

## 🔧 Step 4: Configure Custom Domain (Optional)

1. **In Vercel Dashboard**
   - Go to your project → **Settings** → **Domains**
   - Click **"Add Domain"**
   - Enter your domain (e.g., `creation2k26.com`)
   - Follow DNS configuration instructions

2. **Update Supabase Redirect URLs**
   - Go to Supabase Dashboard: https://supabase.com/dashboard/project/tovokkcouwwymarnftcu
   - Navigate to **Authentication** → **URL Configuration**
   - Add your Vercel domain to **Redirect URLs**:
     ```
     https://your-project.vercel.app/**
     https://your-custom-domain.com/**
     ```

---

## 🔐 Step 5: Supabase Configuration

### 5.1 Verify Supabase Settings

1. **Go to Supabase Dashboard**
   - URL: https://supabase.com/dashboard/project/tovokkcouwwymarnftcu

2. **Check Authentication Settings**
   - **Authentication** → **URL Configuration**
   - Ensure your Vercel URL is in **Redirect URLs**
   - Site URL should be your Vercel URL

3. **Check Database**
   - **SQL Editor** → Verify all migrations are applied
   - Check tables: `profiles`, `events`, `registrations`, etc.

4. **Check Storage**
   - **Storage** → Verify `payment-screenshots` bucket exists
   - Check bucket policies are set correctly

---

## 🐛 Troubleshooting

### Issue: Build Fails on Vercel

**Solution:**
- Check build logs in Vercel dashboard
- Ensure `package.json` has correct build script
- Verify Node.js version (Vercel auto-detects, but you can set it in `vercel.json`)

### Issue: Environment Variables Not Working

**Solution:**
- Ensure variables start with `VITE_` prefix
- Redeploy after adding environment variables
- Check Vercel dashboard → Settings → Environment Variables

### Issue: Supabase Connection Errors

**Solution:**
- Verify environment variables are set correctly
- Check Supabase project is active
- Verify CORS settings in Supabase (should allow all by default for anon key)

### Issue: Authentication Not Working

**Solution:**
- Check Supabase Dashboard → Authentication → URL Configuration
- Add your Vercel URL to Redirect URLs
- Verify email templates are configured

---

## 📝 Important Notes

1. **No Separate Backend Needed**
   - Supabase handles all backend functionality
   - Database, Auth, Storage all in Supabase
   - No need for separate API server

2. **Environment Variables**
   - Always use `VITE_` prefix for Vite environment variables
   - These are exposed to the client (safe for anon key)
   - Never commit `.env.local` to git

3. **Database Migrations**
   - Run migrations in Supabase Dashboard → SQL Editor
   - Migrations are in `supabase/migrations/` folder

4. **Storage Buckets**
   - Ensure `payment-screenshots` bucket exists
   - Check bucket policies allow uploads

---

## 🔄 Continuous Deployment

Once connected to GitHub:
- Every push to `main` branch = Auto-deploy to production
- Every pull request = Preview deployment
- No manual deployment needed!

---

## 📞 Support

If you encounter issues:
1. Check Vercel build logs
2. Check Supabase logs
3. Check browser console for errors
4. Verify environment variables are set

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] Environment variables added
- [ ] Build successful
- [ ] Site accessible
- [ ] Authentication working
- [ ] Database connection working
- [ ] Storage bucket configured
- [ ] Custom domain configured (if applicable)

---

**🎉 Your app is now live!**

Visit: `https://your-project.vercel.app`

