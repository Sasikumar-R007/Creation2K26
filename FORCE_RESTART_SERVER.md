# 🚨 CRITICAL: Force Restart Dev Server

## The Problem:
Your app is **STILL using the OLD Supabase URL** (`hqkrexlemuhgwbblbbkn`) even though `.env.local` exists with the correct values.

This means Vite isn't loading the `.env.local` file.

---

## ✅ Solution: Force Restart with Cache Clear

### Step 1: Stop the Server
1. **Press `Ctrl + C`** in the terminal where `npm run dev` is running
2. **Wait 5 seconds** for it to fully stop

### Step 2: Clear All Caches
Run these commands one by one:

```powershell
# Clear Vite cache
Remove-Item -Recurse -Force node_modules\.vite -ErrorAction SilentlyContinue

# Clear npm cache (optional but helps)
npm cache clean --force
```

### Step 3: Verify .env.local
Make sure the file exists and has correct values:
```powershell
Get-Content .env.local
```

Should show:
```
VITE_SUPABASE_URL=https://tovokkcouwwymarnftcu.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 4: Start Server Fresh
```powershell
npm run dev
```

**Wait 15 seconds** for it to fully start.

### Step 5: Check Browser Console
1. **Open browser** → Go to registration page
2. **Open console** (F12)
3. **Look for this message:**
   ```
   🔍 Supabase URL: https://tovokkcouwwymarnftcu.supabase.co
   🔍 Using .env.local: true
   ```

**If you see the OLD URL**, the `.env.local` file is still not loading.

---

## 🔧 Alternative: Hardcode Temporarily (For Testing)

If `.env.local` still doesn't work, we can temporarily hardcode the new URL to test:

1. Edit `src/integrations/supabase/client.ts`
2. Change line 7 to:
   ```typescript
   const SUPABASE_URL = "https://tovokkcouwwymarnftcu.supabase.co";
   ```
3. Change line 8 to:
   ```typescript
   const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvdm9ra2NvdXd3eW1hcm5mdGN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExMjE5NjcsImV4cCI6MjA4NjY5Nzk2N30.CVN8RbHF1GA5Kvo3JlkZWjIryuCuGURwm6PV_auZOGs";
   ```
4. **Restart server**

**⚠️ This is just for testing!** We'll fix the `.env.local` loading issue after.

---

## 📋 After Server Restarts:

1. **Check browser console** - Should see new URL
2. **Check Network tab** - Requests should go to `tovokkcouwwymarnftcu.supabase.co`
3. **Try registration** - Should work now (if RLS policy is fixed on NEW project)

---

## ⚠️ Important Reminder:

**Make sure you:**
- ✅ Fixed RLS policy on **NEW** Supabase project (`tovokkcouwwymarnftcu`)
- ✅ Ran all migrations on **NEW** Supabase project
- ✅ Created storage bucket on **NEW** Supabase project

**NOT on the old one!**

