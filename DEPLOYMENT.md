# 🚀 Deployment Guide - Creation 2K26

This guide will help you deploy the Creation 2K26 project to **Render** (recommended for demo) or **Vercel**.

## 📋 Pre-Deployment Checklist

- [x] Database storage implementation created
- [x] Auto-detection of database vs in-memory storage
- [x] Build scripts configured
- [x] Environment variables documented

## 🎯 Recommended: Render Deployment

Render is **better suited** for this Express.js application because:
- ✅ Supports long-running processes (Express server)
- ✅ Free PostgreSQL database included
- ✅ Simple configuration with `render.yaml`
- ✅ Better for traditional full-stack apps

### Step 1: Prepare Your Repository

1. **Commit all changes** to your Git repository:
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push
   ```

2. **Ensure your code is on GitHub/GitLab/Bitbucket**

### Step 2: Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with your GitHub account (recommended)
3. Verify your email

### Step 3: Create PostgreSQL Database

1. In Render dashboard, click **"New +"** → **"PostgreSQL"**
2. Configure:
   - **Name**: `creation2k26-db`
   - **Database**: `creation2k26`
   - **User**: `creation2k26`
   - **Region**: Choose closest to you
   - **Plan**: Free (for demo)
3. Click **"Create Database"**
4. **Copy the Internal Database URL** (you'll need this)

### Step 4: Deploy Web Service

1. In Render dashboard, click **"New +"** → **"Web Service"**
2. Connect your repository
3. Configure the service:
   - **Name**: `creation2k26`
   - **Environment**: `Node`
   - **Region**: Same as database
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `Creation2K26` (if your project is in a subdirectory)
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. **Add Environment Variables**:
   ```
   NODE_ENV=production
   PORT=10000
   DATABASE_URL=<paste the Internal Database URL from Step 3>
   SESSION_SECRET=<generate a random string, e.g., use: openssl rand -hex 32>
   ```
5. Click **"Create Web Service"**

### Step 5: Initialize Database

1. Wait for the first deployment to complete
2. Go to your service → **"Shell"** tab
3. Run:
   ```bash
   npm run db:push
   ```
4. This will create all tables in your database

### Step 6: Access Your Application

Your app will be available at:
```
https://creation2k26.onrender.com
```

**Note**: Free tier services spin down after 15 minutes of inactivity. First request may take 30-60 seconds.

---

## 🌐 Alternative: Vercel Deployment

Vercel is optimized for serverless functions. For this Express app, it requires some adjustments.

### Step 1: Install Vercel CLI

```bash
npm i -g vercel
```

### Step 2: Create Vercel Postgres Database

1. Go to [vercel.com](https://vercel.com)
2. Create a new project
3. Go to **Storage** → **Create Database** → **Postgres**
4. Copy the connection string

### Step 3: Deploy to Vercel

1. **Login to Vercel**:
   ```bash
   vercel login
   ```

2. **Link your project**:
   ```bash
   cd Creation2K26
   vercel link
   ```

3. **Add environment variables**:
   ```bash
   vercel env add DATABASE_URL
   # Paste your Vercel Postgres connection string
   
   vercel env add SESSION_SECRET
   # Enter a random secret string
   
   vercel env add NODE_ENV production
   ```

4. **Deploy**:
   ```bash
   vercel --prod
   ```

5. **Initialize database** (after first deployment):
   ```bash
   vercel env pull .env.local
   npm run db:push
   ```

### Step 4: Configure Vercel

The `vercel.json` is already configured. If you need to adjust:
- API routes go to `/api/*`
- All other routes serve the React app

---

## 🔧 Environment Variables Reference

### Required for Production

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `SESSION_SECRET` | Secret for session encryption | Random 32+ character string |
| `NODE_ENV` | Environment mode | `production` |

### Optional

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` (Render uses `10000`) |

---

## 🗄️ Database Setup

### Automatic (Recommended)

The app automatically detects `DATABASE_URL` and uses PostgreSQL when available.

### Manual Setup

1. **Push schema to database**:
   ```bash
   npm run db:push
   ```

2. **Verify tables created**:
   - `users`
   - `events`
   - `registrations`
   - `announcements`

### Seed Data

The app automatically seeds:
- Admin user: `admin` / `admin123`
- 14 sample events (technical + non-technical)

**⚠️ Change admin password in production!**

---

## 🐛 Troubleshooting

### Database Connection Issues

**Error**: `Connection refused` or `Database does not exist`

**Solution**:
1. Verify `DATABASE_URL` is set correctly
2. Check database is running (Render: check dashboard)
3. Ensure database URL uses correct format:
   ```
   postgresql://user:password@host:port/database
   ```

### Build Failures

**Error**: Build command fails

**Solution**:
1. Check Node.js version (should be 18+)
2. Verify all dependencies install: `npm install`
3. Test build locally: `npm run build`

### Port Issues

**Error**: Port already in use

**Solution**:
- Render: Use `PORT=10000` (default)
- Vercel: Port is handled automatically
- Local: Change `PORT` in environment variables

### Static Files Not Serving

**Error**: 404 for React routes

**Solution**:
1. Ensure build completed: `npm run build`
2. Check `dist/public` directory exists
3. Verify `serveStatic` function in `server/static.ts`

---

## 📊 Monitoring

### Render

- **Logs**: Available in dashboard → Service → Logs
- **Metrics**: CPU, Memory usage in dashboard
- **Health Checks**: Automatic at `/` endpoint

### Vercel

- **Logs**: Available in dashboard → Deployments → Logs
- **Analytics**: Enable in project settings
- **Functions**: Monitor API route performance

---

## 🔐 Security Checklist

Before going live:

- [ ] Change default admin password
- [ ] Use strong `SESSION_SECRET` (32+ characters)
- [ ] Enable HTTPS (automatic on Render/Vercel)
- [ ] Review CORS settings if needed
- [ ] Set up database backups (Render Pro plan)
- [ ] Monitor for security updates

---

## 🚀 Post-Deployment

1. **Test the application**:
   - Visit your deployed URL
   - Test event registration
   - Login as admin
   - Create/edit events

2. **Update admin credentials**:
   - Login as admin
   - Create a new admin user
   - Delete or change default admin password

3. **Customize content**:
   - Update events
   - Add announcements
   - Customize branding

---

## 📝 Quick Reference

### Render Commands

```bash
# View logs
render logs

# SSH into service
render shell

# Restart service
# (via dashboard or redeploy)
```

### Vercel Commands

```bash
# View logs
vercel logs

# Redeploy
vercel --prod

# Pull environment variables
vercel env pull .env.local
```

---

## 🎉 Success!

Your Creation 2K26 application should now be live! Share your demo URL and showcase your event management system.

**Need help?** Check the logs in your hosting platform's dashboard for detailed error messages.

