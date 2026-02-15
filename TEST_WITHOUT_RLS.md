# 🚨 Nuclear Option: Test Without RLS

## The Problem:
- Direct SQL insert works ✅
- RLS policy is correct ✅
- But app still gets 401/42501 errors ❌

This suggests the Supabase client isn't authenticating properly with RLS enabled.

---

## ✅ Solution: Temporarily Disable RLS to Test

This will help us determine if the issue is:
- **RLS policy** (if it works without RLS, policy is the issue)
- **Supabase client auth** (if it still fails, client auth is the issue)

### Step 1: Disable RLS

Run: `NUCLEAR_OPTION.sql`

**OR** copy this:

```sql
-- Disable RLS temporarily
ALTER TABLE public.guest_registrations DISABLE ROW LEVEL SECURITY;
```

### Step 2: Test Registration

1. **Clear browser cache:** `Ctrl + Shift + Delete`
2. **Hard refresh:** `Ctrl + Shift + R`
3. **Try registration**
4. **Check if it works**

---

## 🔍 What This Tells Us:

### If Registration Works:
✅ **RLS policy is the issue** - The policy isn't working correctly even though it looks right.

**Next step:** We'll need to investigate why the policy isn't being applied correctly.

### If Registration Still Fails:
❌ **Supabase client auth is the issue** - The client isn't sending the API key correctly.

**Next step:** We'll need to fix the client configuration or check for other auth issues.

---

## ⚠️ Important:

**This is ONLY for testing!** After testing:

1. **If it works:** We know RLS is the issue, and we'll fix the policy
2. **If it still fails:** We know it's a client auth issue, and we'll fix that
3. **Then re-enable RLS** with the correct policy

---

## 🔄 After Testing:

Once we know what works, run this to re-enable RLS:

```sql
-- Re-enable RLS
ALTER TABLE public.guest_registrations ENABLE ROW LEVEL SECURITY;

-- Recreate policy
DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.guest_registrations;

CREATE POLICY "Allow anonymous inserts"
ON public.guest_registrations 
FOR INSERT
TO anon
WITH CHECK (true);
```

---

**Run `NUCLEAR_OPTION.sql` and test registration - this will tell us exactly what's wrong!** 🎯

