# 🔧 Fix 401 Unauthorized Error - Supabase Connection

## Problem
Getting 401 errors because the app is trying to connect to the **wrong Supabase project**:
- ❌ Trying to connect to: `hqkrexlemuhgwbblbbkn.supabase.co` (OLD project)
- ✅ Should connect to: `tovokkcouwwymarnftcu.supabase.co` (NEW project)

## ✅ Quick Fix

### Option 1: Use the Correct Project (Recommended)

1. **Get your Supabase credentials**:
   - Go to: https://supabase.com/dashboard/project/tovokkcouwwymarnftcu
   - Settings → API
   - Copy:
     - **Project URL**: `https://tovokkcouwwymarnftcu.supabase.co`
     - **anon public key**: (the JWT token)

2. **Update the client file** (if needed):
   - File: `src/integrations/supabase/client.ts`
   - Make sure it has the correct URL and key

3. **Clear browser cache**:
   - Press `Ctrl + Shift + Delete`
   - Clear cached images and files
   - Or use Incognito/Private window

4. **Restart dev server**:
   ```powershell
   # Stop the server (Ctrl+C)
   # Then restart
   npm run dev
   ```

### Option 2: If You Want to Use the Old Project

If you actually want to use `hqkrexlemuhgwbblbbkn`:

1. Get the anon key for that project
2. Update `src/integrations/supabase/client.ts`:
   ```typescript
   const SUPABASE_URL = "https://hqkrexlemuhgwbblbbkn.supabase.co";
   const SUPABASE_PUBLISHABLE_KEY = "YOUR_ANON_KEY_FOR_hqkrexlemuhgwbblbbkn";
   ```

## 🔍 Verify Which Project You're Using

Check the browser console - you should see:
```
🔍 Supabase Configuration:
  URL: https://tovokkcouwwymarnftcu.supabase.co
  From env: No (using fallback)
  Key present: Yes
```

If you see `hqkrexlemuhgwbblbbkn`, there's a mismatch!

## 🚨 Common Causes

1. **Browser cache** - Old JavaScript cached
2. **Environment variable** - `.env.local` or system env var set to old URL
3. **Service worker** - Cached old version
4. **Wrong anon key** - Key doesn't match the project URL

## ✅ After Fixing

1. Check browser console - should see correct URL
2. Events should load
3. No more 401 errors
4. Registration should work

---

**The code has been updated with better logging. Check your browser console to see which URL is being used!**

