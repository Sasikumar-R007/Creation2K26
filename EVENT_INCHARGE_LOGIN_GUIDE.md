# 🎯 Event Incharge (IC) Login Guide

## ✅ Yes! Event Incharges Have Login

**All 10 events have their own Event Incharge (IC) login profiles.** Each IC can manage their specific event's registrations, send announcements, and view participants.

---

## 📋 All Event Incharge Login Credentials

All ICs use the **same password**: `Studentincharge@123`

| Event | Email | Password |
|-------|-------|----------|
| **Quiz** | `Quiz_admin@creation2k26.com` | `Studentincharge@123` |
| **Paper Presentation** | `Paper_Presentation_admin@creation2k26.com` | `Studentincharge@123` |
| **Debugging** | `Debugging_admin@creation2k26.com` | `Studentincharge@123` |
| **Web Design** | `Web_Design_admin@creation2k26.com` | `Studentincharge@123` |
| **AI Prompt Engineering** | `AI_Prompt_Engineering_admin@creation2k26.com` | `Studentincharge@123` |
| **Ad Zap** | `Ad_Zap_admin@creation2k26.com` | `Studentincharge@123` |
| **Personality Contest** | `Personality_Contest_admin@creation2k26.com` | `Studentincharge@123` |
| **Memory Matrix** | `Memory_Matrix_admin@creation2k26.com` | `Studentincharge@123` |
| **IPL Auction** | `IPL_Auction_admin@creation2k26.com` | `Studentincharge@123` |
| **Movie Spoofing** | `Movie_Spoofing_admin@creation2k26.com` | `Studentincharge@123` |

---

## 🚀 How to Login as Event Incharge

### Step 1: Make Sure IC Users Are Created

If you haven't run the seed script yet, create all IC users:

**On Windows (PowerShell):**
```powershell
cd "C:\Users\sasir\OneDrive\Documents\Sasikumar R\New folder\creation-2k26-nexus"
$env:SUPABASE_URL="YOUR_SUPABASE_PROJECT_URL"
$env:SUPABASE_SERVICE_ROLE_KEY="YOUR_SERVICE_ROLE_KEY"
npm run seed:users
```

This creates **all 10 IC users** + the admin user.

### Step 2: Access Login Page

**Local Testing:**
- Go to: `http://localhost:5173/admin-login`
- Or navigate from home page to admin login

**Live Site:**
- Go to: `https://your-live-site.com/admin-login`

### Step 3: Login with IC Credentials

1. Enter the **IC email** for the event you want to test
   - Example: `Quiz_admin@creation2k26.com`
2. Enter password: `Studentincharge@123`
3. Click **"Sign In"**

### Step 4: You'll Be Redirected

After login, you'll be automatically redirected to:
- **IC Dashboard:** `/ic-dashboard`

The dashboard will show:
- Your assigned event name
- Participant count
- Messages count
- Event category (Tech/Non-Tech)

---

## 🎨 What ICs Can Do in Their Dashboard

Once logged in, Event Incharges can:

### 1. **Dashboard Overview**
   - View statistics (participants, messages, category)
   - Quick overview of their event

### 2. **View Participants**
   - See all participants registered for their event
   - Filter by department, college, or search by name
   - View participant details

### 3. **Send Announcements**
   - Send announcements to all participants of their event
   - Messages appear in participants' dashboards

### 4. **View Recent Messages**
   - See all messages/announcements sent for their event
   - Track communication history

### 5. **Manage Their Event**
   - View event details
   - Track registrations in real-time
   - Export participant data (if available)

---

## 🧪 Testing Different IC Logins

You can test **any of the 10 events** by logging in with different IC emails:

### Example Test Cases:

**Test Quiz Event:**
- Email: `Quiz_admin@creation2k26.com`
- Password: `Studentincharge@123`
- → See Quiz event dashboard

**Test Web Design Event:**
- Email: `Web_Design_admin@creation2k26.com`
- Password: `Studentincharge@123`
- → See Web Design event dashboard

**Test AI Prompt Engineering:**
- Email: `AI_Prompt_Engineering_admin@creation2k26.com`
- Password: `Studentincharge@123`
- → See AI Prompt Engineering event dashboard

Each IC can **only see and manage their own event's data**.

---

## 🔍 Verify IC Users Exist

**Check in Supabase Dashboard:**
1. Go to **Authentication** → **Users**
2. Look for emails like:
   - `Quiz_admin@creation2k26.com`
   - `Web_Design_admin@creation2k26.com`
   - etc.
3. If they don't exist, run the seed script (Step 1 above)

**Check IC Assignments:**
1. Go to **Table Editor** → **student_incharges**
2. You should see 10 rows, one for each event
3. Each row has:
   - `user_id` (the IC user's ID)
   - `event_id` (the event they manage)
   - `name` (e.g., "Quiz IC")

---

## 🛠️ Troubleshooting

### ❌ "Invalid email or password"
- **Solution:** Make sure the IC user exists
- Run the seed script again: `npm run seed:users`

### ❌ "Access denied" or redirected to home
- **Solution:** The user exists but doesn't have `student_incharge` role
- Run the seed script again (it will update roles)

### ❌ IC Dashboard shows "No event assigned"
- **Solution:** The user exists but isn't assigned to an event
- Run the seed script again (it will create/update assignments)

### ❌ Can't see participants
- **Solution:** Make sure:
  1. The IC is assigned to the correct event (check `student_incharges` table)
  2. Participants have registered for that event
  3. The event ID matches in the database

---

## 📊 Quick Reference

| What | Where |
|------|-------|
| **Login Page** | `/admin-login` |
| **IC Dashboard** | `/ic-dashboard` |
| **All ICs Password** | `Studentincharge@123` |
| **IC Email Format** | `<EventName>_admin@creation2k26.com` |
| **Number of ICs** | 10 (one per event) |

---

## ✅ Checklist

- [ ] Seed script run successfully (creates all 10 IC users)
- [ ] Can login with any IC email at `/admin-login`
- [ ] Redirected to `/ic-dashboard` after login
- [ ] IC Dashboard shows correct event name
- [ ] Can view participants for assigned event
- [ ] Can send announcements
- [ ] Can view messages
- [ ] Each IC can only see their own event's data

---

## 🔐 Security Note

**For Production:**
- Change default passwords after first login
- Each IC should have a unique, strong password
- Go to Supabase Dashboard → Authentication → Users
- Click on each IC user → Reset password

---

## 🎯 Summary

✅ **Yes, all 10 events have IC login profiles**
✅ **All ICs use the same login page:** `/admin-login`
✅ **All ICs use the same password:** `Studentincharge@123`
✅ **Each IC email is:** `<EventName>_admin@creation2k26.com`
✅ **After login, ICs go to:** `/ic-dashboard`
✅ **Each IC can only manage their assigned event**

**Ready to test?** Just run the seed script (if not done already) and login with any IC email!

