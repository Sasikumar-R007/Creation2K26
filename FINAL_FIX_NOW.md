# 🚨 FINAL FIX - Do These Steps

## The Problem:
- 401 Unauthorized first (authentication issue)
- Then 42501 RLS error (policy issue)

This suggests the Supabase client isn't authenticating properly.

---

## ✅ Step 1: Fix Supabase Client Configuration

I've updated the client to:
- Disable session persistence (prevents auth conflicts)
- Explicitly set API key in headers
- Disable auto refresh (not needed for anonymous)

**The code is already updated!** Just restart your dev server.

---

## ✅ Step 2: Delete and Recreate Policies (Clean Slate)

Run: `DELETE_AND_RECREATE_POLICIES.sql`

This will:
1. Delete ALL existing policies
2. Verify they're deleted
3. Recreate them fresh
4. Verify they're created correctly

**OR** copy this SQL:

```sql
-- Delete ALL policies
DROP POLICY IF EXISTS "Allow anon insert for guest registrations" ON public.guest_registrations;
DROP POLICY IF EXISTS "Allow public insert for guest registrations" ON public.guest_registrations;
DROP POLICY IF EXISTS "Allow all inserts for guest registrations" ON public.guest_registrations;
DROP POLICY IF EXISTS "Admins can view guest registrations" ON public.guest_registrations;

-- Recreate INSERT policy
CREATE POLICY "Allow anonymous inserts"
ON public.guest_registrations 
FOR INSERT
TO anon
WITH CHECK (true);

-- Recreate SELECT policy
CREATE POLICY "Admins can view guest registrations"
ON public.guest_registrations 
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = 'creation_admin'
  )
);
```

---

## ✅ Step 3: Clear Everything

1. **Clear browser localStorage:**
   - Open browser console (F12)
   - Run: `localStorage.clear()`
   - Close and reopen browser

2. **Restart dev server:**
   - `Ctrl + C` to stop
   - `npm run dev` to start
   - Wait 15 seconds

3. **Hard refresh browser:**
   - `Ctrl + Shift + R`

---

## ✅ Step 4: Test

1. Go to registration page
2. Fill form
3. Submit
4. **Should work now!** ✅

---

## 🔍 What Changed:

1. **Supabase Client:** Now explicitly sets API key and disables session persistence
2. **Policies:** Deleted and recreated fresh (clean slate)
3. **Policy Name:** Changed to "Allow anonymous inserts" (simpler name)

---

## ⚠️ If Still Not Working:

Check browser console Network tab:
- Look at the failed request
- Check the "Request Headers"
- Verify `apikey` header is present
- Share the exact headers you see

**Run the SQL and restart dev server - this should fix it!** 🚀

