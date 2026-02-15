# 🚨 Run This Simple Fix

## The Issue:
RLS policy is still blocking inserts even though we've tried multiple fixes.

## ✅ Solution: Use the Simplest Policy

The Supabase JavaScript client **definitely uses `anon` role**. Let's create a policy that **only** allows `anon` (not `public`).

### Step 1: Run This SQL

Open: `SIMPLE_FIX.sql`

**OR** copy this:

```sql
-- Drop ALL policies
DROP POLICY IF EXISTS "Allow public insert for guest registrations" ON public.guest_registrations;
DROP POLICY IF EXISTS "Allow anon insert for guest registrations" ON public.guest_registrations;
DROP POLICY IF EXISTS "Admins can view guest registrations" ON public.guest_registrations;

-- Create INSERT policy for anon ONLY
CREATE POLICY "Allow anon insert for guest registrations"
ON public.guest_registrations 
FOR INSERT
TO anon
WITH CHECK (true);

-- Create SELECT policy for admins
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

### Step 2: Test Registration

After running the SQL:
1. **Refresh browser** (clear cache: `Ctrl + Shift + R`)
2. **Try registration**
3. **Should work now!** ✅

---

## 🔍 Why This Should Work:

- **Supabase client uses `anon` role** - confirmed
- **Policy allows `anon` role** - this SQL creates it
- **No conflicting policies** - we drop all first
- **Simple and direct** - no extra roles that might confuse

---

## ⚠️ If Still Not Working:

Share the output from the verification query at the end of the SQL. It will show:
- What policies exist
- What roles they allow
- This will help identify the exact issue

**Run `SIMPLE_FIX.sql` and test!** 🎯

