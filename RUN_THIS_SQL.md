# 🚨 Run This SQL Now

## The Problem:
Even though policies exist, registration is still failing. The policy definition might be incomplete.

## ✅ Solution:

### Step 1: Go to Supabase SQL Editor
1. **Open:** https://supabase.com/dashboard
2. **Select your NEW project:** `creation-2k26` (tovokkcouwwymarnftcu)
3. **Click "SQL Editor"** → **"New query"**

### Step 2: Run the Complete Fix
1. **Open the file:** `FIX_RLS_COMPLETE.sql` (I just created it)
2. **Copy ALL the SQL**
3. **Paste into SQL Editor**
4. **Click "Run"** (or `Ctrl + Enter`)
5. **Wait for "Success"**

### Step 3: Check the Results
After running, you'll see two result tables:

**Table 1: Policy Check**
- Should show: `✅ Correct` for the INSERT policy

**Table 2: RLS Status**
- Should show: `✅ RLS is enabled`

---

## 🔍 What This SQL Does:

1. ✅ **Drops all existing policies** (clean slate)
2. ✅ **Enables RLS** on the table
3. ✅ **Creates INSERT policy** with BOTH `USING (true)` AND `WITH CHECK (true)`
   - This is the most permissive setting possible
4. ✅ **Creates SELECT policy** for admins
5. ✅ **Verifies everything** is set up correctly

---

## ⚠️ Key Difference:

The new policy includes **BOTH** `USING (true)` and `WITH CHECK (true)`:
```sql
CREATE POLICY "Allow public insert for guest registrations"
ON public.guest_registrations 
FOR INSERT
TO public
USING (true)        -- ← Added this
WITH CHECK (true);  -- ← This was already there
```

This ensures the policy is fully permissive.

---

## ✅ After Running:

1. **Restart dev server** (if needed): `Ctrl + C`, then `npm run dev`
2. **Test registration** - Should work now! ✅

---

## 🆘 If Still Not Working:

Share the results from the verification queries:
- What does "Policy Check" show?
- What does "RLS Status" show?

This will help identify the exact issue.

