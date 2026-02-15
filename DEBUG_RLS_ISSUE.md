# 🔍 Debug RLS Issue

## ✅ What We Know:
- Policy exists: "Allow anon insert for guest registrations"
- Policy allows: `anon` role
- Policy command: `INSERT`
- RLS is enabled

## ❌ But Still Getting Error:
- `42501: new row violates row-level security policy`

---

## 🔍 Possible Issues:

### Issue 1: Policy is RESTRICTIVE instead of PERMISSIVE
PostgreSQL policies can be PERMISSIVE (allow) or RESTRICTIVE (block). If it's RESTRICTIVE, it will block even if the condition is true.

**Fix:** Run `FORCE_PERMISSIVE_POLICY.sql` to explicitly create a PERMISSIVE policy.

### Issue 2: Multiple Conflicting Policies
There might be another policy that's blocking.

**Check:** Run `CHECK_WHY_BLOCKING.sql` to see all policies.

### Issue 3: Policy Not Applied to Current Session
Sometimes Supabase needs a moment to refresh the policy cache.

**Fix:** Wait 30 seconds after running SQL, then try again.

---

## ✅ Steps to Fix:

### Step 1: Check Current State
Run: `CHECK_WHY_BLOCKING.sql`

**Look for:**
- Are there RESTRICTIVE policies? (Should be none)
- Is the INSERT policy PERMISSIVE? (Should be yes)
- Are there multiple INSERT policies? (Should be only one)

### Step 2: Force PERMISSIVE Policy
Run: `FORCE_PERMISSIVE_POLICY.sql`

This explicitly creates a PERMISSIVE policy.

### Step 3: Wait and Test
1. **Wait 30 seconds** after running SQL
2. **Clear browser cache:** `Ctrl + Shift + Delete`
3. **Hard refresh:** `Ctrl + Shift + R`
4. **Test registration**

---

## 🎯 Most Likely Issue:

The policy might be **RESTRICTIVE** instead of **PERMISSIVE**. 

**Run `FORCE_PERMISSIVE_POLICY.sql` - this should fix it!**

