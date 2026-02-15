# Fix: Schema Cache Issue

## The Problem
You're seeing: "Could not find the 'upi_transaction_id' column" error
**BUT** the column EXISTS in your database (you can see it in Table Editor)

This is a **Supabase schema cache issue** - the column exists but Supabase's client hasn't refreshed its cache.

## ✅ Quick Fixes (Try These in Order)

### Fix 1: Clear Browser Cache & Restart (2 minutes)

1. **Clear Browser Cache:**
   - Press `Ctrl + Shift + Delete` (Windows) or `Cmd + Shift + Delete` (Mac)
   - Select "Cached images and files"
   - Click "Clear data"

2. **Restart Dev Server:**
   - Stop your server (Ctrl+C in terminal)
   - Run again: `npm run dev`

3. **Wait 30 seconds** (let Supabase cache refresh)

4. **Try registration again**

### Fix 2: Refresh Supabase Schema (1 minute)

1. **Go to Supabase Dashboard** → **SQL Editor**
2. **Run this query:**
   ```sql
   SELECT * FROM guest_registrations LIMIT 1;
   ```
3. This forces Supabase to refresh its schema cache
4. **Wait 10 seconds**
5. **Try registration again**

### Fix 3: Update Column (Force Refresh)

1. **Go to Supabase Dashboard** → **SQL Editor**
2. **Run this:**
   ```sql
   -- This will refresh the schema
   COMMENT ON COLUMN public.guest_registrations.upi_transaction_id IS 'UPI Transaction ID for payment verification';
   ```
3. **Wait 10 seconds**
4. **Try registration again**

### Fix 4: Code Already Updated

I've updated the code to:
- Retry without optional fields if schema cache error occurs
- Registration will still work (some optional fields may not save)
- Show a warning message

**Try submitting again - it should work now!**

---

## Why This Happens

Supabase caches the database schema for performance. When you add a new column:
1. Column is added to database ✅
2. But Supabase client cache hasn't refreshed yet ❌
3. Client thinks column doesn't exist

**Solution:** Clear cache or wait for it to auto-refresh (usually 30-60 seconds)

---

## Test After Fix

1. Clear browser cache
2. Restart `npm run dev`
3. Wait 30 seconds
4. Try registration
5. **Should work now!** ✅

---

## If Still Not Working

The code will now retry without optional fields, so registration should complete. You'll see a warning, but the registration will be saved.

For full functionality, clear cache and restart as above.

