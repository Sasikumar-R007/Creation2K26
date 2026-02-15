# Quick Test Steps

## 🚀 Start Testing (5 minutes)

### 1. Start the Server
```bash
npm install
npm run dev
```
Open: http://localhost:5173

### 2. Test Registration

**Quick Test:**
1. Go to `/register`
2. Fill all fields:
   - Name, Email, Phone, Department, College
   - Select Event 1 (any event)
   - Select "1" participant (solo)
   - Click "Proceed to Payment"
3. Payment page:
   - Enter UPI Transaction ID: `1234567890`
   - Upload a small image (< 2MB) - **verify it shows "Max file size: 2MB"**
   - Click "Submit Registration"
4. **Success!** You should see:
   - Success modal
   - Registration ID (in BOLD)
   - PDF download button
   - WhatsApp group link

### 3. Verify in Supabase

1. Go to Supabase Dashboard
2. Table Editor → `guest_registrations`
3. **Verify**: Your test registration is there! ✅

### 4. Test Admin (Optional)

1. Sign up on your site
2. Run in Supabase SQL Editor:
   ```sql
   UPDATE public.user_roles 
   SET role = 'creation_admin' 
   WHERE user_id = (
     SELECT id FROM auth.users WHERE email = 'your-email@example.com'
   );
   ```
3. Logout and login
4. Go to `/admin`
5. **Verify**: You can see registrations! ✅

---

## ✅ What to Check

- [ ] Website loads
- [ ] Registration form works
- [ ] File upload shows "Max file size: 2MB"
- [ ] Registration completes successfully
- [ ] Success modal shows with Registration ID
- [ ] PDF downloads
- [ ] Data appears in Supabase

**That's it!** If all these work, you're ready to deploy! 🎉

