# Testing Guide - CREATION 2K26 Registration System

## ✅ Setup Complete Checklist

Before testing, verify:
- [x] Supabase project created
- [x] All 5 migrations run successfully
- [x] Storage bucket `payment-screenshots` created (2MB limit)
- [x] Bucket policies set (INSERT and SELECT for anon/authenticated)
- [x] `.env.local` file created with credentials
- [x] Code updated with 2MB file size limit

---

## 🚀 Step 1: Start Local Development Server

1. **Open Terminal/Command Prompt** in your project folder

2. **Install Dependencies** (if not done):
   ```bash
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

4. **Open Browser**:
   - Go to: http://localhost:5173
   - You should see your website homepage!

---

## 🧪 Step 2: Test Registration Flow

### Test 1: Basic Registration (Solo Event)

1. **Go to Registration Page**:
   - Click "Register" button or go to `/register`
   - You should see the registration form

2. **Fill Personal Details**:
   - Full Name: `Test User`
   - Email: `test@example.com`
   - WhatsApp Phone: `+91 9876543210`
   - Department: `BCA`
   - College: `Bishop Heber College`

3. **Select Event 1**:
   - Choose any event (e.g., "Quiz")
   - Number of Participants: Select `1` (solo)
   - **Verify**: No Team Name field appears ✅

4. **Event 2** (Optional):
   - Leave as "None" or select another event

5. **Click "Proceed to Payment"**:
   - Should show confirmation modal
   - Click "Proceed to Payment"

6. **Payment Page**:
   - Verify UPI ID is displayed clearly: `chitrasathish1979-2@okicici`
   - Enter UPI Transaction ID: `1234567890` (any numbers)
   - Payment Screenshot: Try uploading a small image (< 2MB)
   - **Verify**: Shows "Max file size: 2MB" message ✅

7. **Submit Registration**:
   - Click "Submit Registration"
   - Should show confirmation modal
   - Click "Confirm & Submit"
   - Should show success modal with registration form
   - **Verify**: Registration ID is displayed in BOLD ✅
   - **Verify**: WhatsApp group link is shown ✅
   - Try downloading PDF ✅

---

### Test 2: Team Event Registration

1. **Go to Registration Page** again

2. **Select Team Event**:
   - Event 1: Choose an event that allows teams (e.g., "Ad Zap")
   - Number of Participants: Select `2` or more
   - **Verify**: Team Name field appears ✅
   - **Verify**: Warning message appears: "⚠️ Important: All other team members have to register separately." ✅

3. **Fill Team Name**:
   - Enter: `Team Alpha`
   - **Verify**: Field is required ✅

4. **Complete Registration**:
   - Fill all other fields
   - Proceed to payment
   - Submit registration
   - **Verify**: Team name is saved and displayed in success modal ✅

---

### Test 3: File Size Validation

1. **Go to Payment Page**

2. **Try Uploading Large File**:
   - Try to upload an image larger than 2MB
   - **Verify**: Error message appears: "File too large - Payment screenshot must be 2MB or smaller" ✅

3. **Upload Small File**:
   - Upload an image under 2MB
   - **Verify**: File is accepted ✅

---

### Test 4: Registration Without Screenshot

1. **Go to Registration Page**

2. **Fill All Fields**:
   - Complete personal details
   - Select events
   - Enter UPI Transaction ID

3. **Skip Screenshot Upload**:
   - Don't upload any screenshot
   - Click "Submit Registration"

4. **Verify**:
   - Registration should complete successfully ✅
   - Warning message about screenshot upload failure (if bucket not configured) ✅
   - Registration is saved to database ✅

---

## 🔐 Step 3: Test Admin Access

### Create Admin User

1. **Sign Up**:
   - Go to `/auth` or click "Sign Up"
   - Create account with your email
   - Verify email if needed

2. **Make Yourself Admin**:
   - Go to Supabase Dashboard → SQL Editor
   - Run this (replace with your email):
   ```sql
   UPDATE public.user_roles 
   SET role = 'creation_admin' 
   WHERE user_id = (
     SELECT id FROM auth.users WHERE email = 'your-email@example.com'
   );
   ```

3. **Login**:
   - Logout and login again
   - Go to `/admin` or `/dashboard`

4. **Test Admin Features**:
   - [ ] Can see admin dashboard
   - [ ] Can see "Event Registrations" section
   - [ ] Can see test registrations you created
   - [ ] Can see team names, UPI transaction IDs
   - [ ] Can filter registrations
   - [ ] Can see registration IDs

---

## 📊 Step 4: Verify Data in Supabase

1. **Go to Supabase Dashboard**

2. **Check Tables**:
   - Go to "Table Editor"
   - Open `guest_registrations` table
   - **Verify**: Your test registrations are there ✅
   - **Verify**: All fields are populated correctly ✅
   - **Verify**: Team names are saved (if team events) ✅
   - **Verify**: UPI transaction IDs are saved ✅

3. **Check Storage**:
   - Go to "Storage" → `payment-screenshots` bucket
   - **Verify**: Uploaded screenshots are there ✅

---

## 🐛 Step 5: Test Error Handling

### Test Validation Errors

1. **Empty Fields**:
   - Try submitting with empty fields
   - **Verify**: Error messages appear ✅

2. **Invalid Email**:
   - Enter invalid email format
   - **Verify**: Validation error appears ✅

3. **Invalid Phone**:
   - Enter phone without country code
   - **Verify**: Validation error appears ✅

4. **Missing Team Name** (for team events):
   - Select team event with size > 1
   - Don't enter team name
   - Try to proceed
   - **Verify**: Error message appears ✅

5. **Missing UPI Transaction ID**:
   - Go to payment page
   - Don't enter UPI Transaction ID
   - Try to submit
   - **Verify**: Error message appears ✅

---

## ✅ Step 6: Complete Test Checklist

### Registration Flow
- [ ] Homepage loads correctly
- [ ] Registration page accessible
- [ ] All form fields work
- [ ] Solo event registration works (no team name)
- [ ] Team event registration works (team name required)
- [ ] Warning message shows for team events
- [ ] Payment page loads
- [ ] UPI ID displayed clearly
- [ ] UPI Transaction ID field works
- [ ] File upload shows 2MB limit
- [ ] Large file (>2MB) is rejected
- [ ] Small file (<2MB) is accepted
- [ ] Registration without screenshot works
- [ ] Success modal appears
- [ ] Registration ID displayed
- [ ] PDF download works
- [ ] WhatsApp group link works

### Admin Panel
- [ ] Admin login works
- [ ] Can view registrations
- [ ] Can see all registration details
- [ ] Can see team names
- [ ] Can see UPI transaction IDs
- [ ] Filters work
- [ ] Search works

### Database
- [ ] Data saved correctly
- [ ] All fields populated
- [ ] Team names saved for team events
- [ ] Screenshots uploaded to storage

---

## 🚨 Troubleshooting

### Registration Not Working?
- Check browser console for errors (F12)
- Verify `.env.local` file has correct credentials
- Check Supabase project is active
- Verify migrations ran successfully

### Screenshot Upload Failing?
- Check storage bucket exists: `payment-screenshots`
- Verify bucket is Public
- Check policies are set correctly
- Verify file is under 2MB

### Admin Access Not Working?
- Verify you ran the SQL to make yourself admin
- Logout and login again
- Check `user_roles` table in Supabase

### Can't See Registrations?
- Check `guest_registrations` table in Supabase
- Verify you're logged in as admin
- Check browser console for errors

---

## 📝 Next Steps After Testing

Once everything works:

1. **Add Real Events** (if needed):
   - Go to Supabase → Table Editor → `events`
   - Add/update events as needed

2. **Deploy to Production**:
   - Follow `SETUP_NEW_HOSTING.md`
   - Deploy to Vercel
   - Connect your domain

3. **Create More Admin Users** (if needed):
   - Use the same SQL query with different emails

4. **Monitor Registrations**:
   - Check admin panel regularly
   - Monitor Supabase usage

---

## 🎉 Success Criteria

Your system is ready when:
- ✅ All test registrations complete successfully
- ✅ Data appears in Supabase database
- ✅ Admin can view all registrations
- ✅ PDF download works
- ✅ File upload works (with 2MB limit)
- ✅ All validations work correctly
- ✅ No console errors

**You're all set!** 🚀

