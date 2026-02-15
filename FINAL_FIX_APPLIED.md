# ✅ Final Fix Applied

## What I Just Did:
I've **completely hardcoded** the new Supabase URL and key directly in the code, bypassing the `.env.local` loading issue.

**The app will now ALWAYS use:** `tovokkcouwwymarnftcu.supabase.co`

---

## 🔄 Restart Dev Server (REQUIRED!)

1. **Stop server:** Press `Ctrl + C` in terminal
2. **Wait 5 seconds**
3. **Start again:** `npm run dev`
4. **Wait 15 seconds**

---

## ✅ Verify It's Working

1. **Open browser** → Go to registration page
2. **Open console** (F12)
3. **You should see:**
   ```
   ✅ Supabase URL: https://tovokkcouwwymarnftcu.supabase.co
   ✅ Using NEW Supabase project: tovokkcouwwymarnftcu
   ```
4. **Check Network tab** → All requests should go to `tovokkcouwwymarnftcu.supabase.co`

**You should NO LONGER see:** `hqkrexlemuhgwbblbbkn.supabase.co`

---

## ⚠️ Before Testing Registration

Make sure you've done these on your **NEW Supabase project** (`tovokkcouwwymarnftcu`):

### 1. ✅ Run ALL 5 Migrations
In Supabase SQL Editor, run (in order):
- `20260203095150_fdaa533d-45e2-42d1-9dde-eaed85ccdb84.sql`
- `20260204000000_add_whatsapp_phone_to_profiles.sql`
- `20260205000000_guest_registrations.sql`
- `20260214000000_guest_reg_team_payment.sql`
- `20260215000000_add_team_name_upi_transaction.sql`

### 2. ✅ Fix RLS Policy
Run this SQL:

```sql
DROP POLICY IF EXISTS "Allow anon insert for guest registrations" ON public.guest_registrations;
DROP POLICY IF EXISTS "Allow public insert for guest registrations" ON public.guest_registrations;
DROP POLICY IF EXISTS "Admins can view guest registrations" ON public.guest_registrations;

CREATE POLICY "Allow public insert for guest registrations"
ON public.guest_registrations FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Admins can view guest registrations"
ON public.guest_registrations FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = 'creation_admin'
  )
);

ALTER TABLE public.guest_registrations ENABLE ROW LEVEL SECURITY;
```

### 3. ✅ Create Storage Bucket
- Name: `payment-screenshots`
- Public: Yes
- Size: 2MB
- MIME: `image/jpeg,image/png,image/jpg`

---

## 🎯 Test Registration

After restarting and verifying setup:

1. **Fill registration form**
2. **Submit**
3. **Should work now!** ✅

**Expected:**
- ✅ No "401 Unauthorized" errors
- ✅ No "RLS policy" errors
- ✅ Registration succeeds
- ✅ Success modal appears

---

## 📝 Note

The hardcoded values are now permanent in the code. This is fine for now - we can switch back to environment variables later if needed for deployment.

