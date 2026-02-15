# Registration Data Flow & Admin Guide

## 📊 Data Flow Overview

### Registration Process Flow

1. **User Registration** (`/register` page)
   - User fills out registration form
   - Selects events (Event 1 required, Event 2 optional)
   - If team size > 1, enters team name and team member details
   - Uploads payment screenshot
   - Enters UPI Transaction ID
   - Submits registration

2. **Data Storage**
   - **Table**: `guest_registrations` in Supabase PostgreSQL database
   - **Storage**: Payment screenshots stored in `payment-screenshots` bucket in Supabase Storage

3. **Data Structure**

   Each registration is stored in the `guest_registrations` table with:
   - `id` (UUID) - Unique registration ID (auto-generated)
   - `name` - Full name
   - `email` - Email address
   - `whatsapp_phone` - WhatsApp phone number
   - `department` - Department name
   - `college` - College name
   - `event_1_id` - First event ID (required)
   - `event_2_id` - Second event ID (optional)
   - `event_1_team_size` - Number of participants for Event 1
   - `event_2_team_size` - Number of participants for Event 2
   - `event_1_team_name` - Team name for Event 1 (if team size > 1)
   - `event_2_team_name` - Team name for Event 2 (if team size > 1)
   - `team_members` - JSONB field containing team member details:
     ```json
     {
       "event_1": [
         {
           "name": "Member Name",
           "email": "member@email.com",
           "whatsapp_phone": "+91..."
         }
       ],
       "event_2": [...]
     }
     ```
   - `payment_screenshot_url` - URL to uploaded payment screenshot
   - `upi_transaction_id` - UPI transaction ID
   - `created_at` - Registration timestamp

## 🔍 Where to View Registrations

### As Admin:

1. **Login to Admin Dashboard**
   - Go to `/admin` (or `/dashboard` if you're logged in as admin)
   - You need `creation_admin` role to access

2. **View Guest Registrations**
   - Click on "Event Registrations" in the sidebar menu
   - This shows all registrations from the `/register` page
   - You can filter by:
     - Search (name, email)
     - Event 1
     - Event 2
     - Department
     - College

3. **View Registration Details**
   - Each row shows:
     - Name, Email, Phone
     - Events registered
     - Department, College
     - Registration date
     - Team details (if applicable)
     - Payment information

## 📋 Admin Management Features

### Real-time Data Management

1. **View All Registrations**
   - Navigate to: Admin Dashboard → "Event Registrations"
   - Data updates in real-time (refreshes automatically)
   - Use filters to find specific registrations

2. **Export Data** (Manual)
   - Currently, you can copy data from the table
   - For bulk export, use Supabase SQL Editor:
     ```sql
     SELECT * FROM guest_registrations
     ORDER BY created_at DESC;
     ```

3. **Search & Filter**
   - Search by participant name or email
   - Filter by event, department, or college
   - Filters work in real-time

4. **View Payment Screenshots**
   - Payment screenshot URLs are stored in `payment_screenshot_url` field
   - Click the URL to view the uploaded screenshot
   - Screenshots are stored in Supabase Storage bucket: `payment-screenshots`

## 🗄️ Database Schema

### Table: `guest_registrations`

```sql
CREATE TABLE guest_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp_phone TEXT,
  department TEXT,
  college TEXT,
  event_1_id UUID NOT NULL REFERENCES events(id),
  event_2_id UUID REFERENCES events(id),
  event_1_team_size INTEGER,
  event_2_team_size INTEGER,
  event_1_team_name TEXT,
  event_2_team_name TEXT,
  team_members JSONB,
  payment_screenshot_url TEXT,
  upi_transaction_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

## 🔐 Access Control

- **Public Registration**: Anyone can register via `/register` page
- **Admin View**: Only users with `creation_admin` role can view registrations
- **Storage Access**: Payment screenshots bucket must be public for uploads

## 📈 Statistics & Analytics

The Admin Dashboard shows:
- Total registrations count
- Registrations by event
- Registration trends over time
- Department and college breakdowns

## 🛠️ Troubleshooting

### If registrations aren't showing:
1. Check you're logged in as admin
2. Verify your role: `creation_admin`
3. Check browser console for errors
4. Verify database connection

### If payment uploads fail:
1. Check `STORAGE_SETUP.md` for bucket configuration
2. Verify bucket exists: `payment-screenshots`
3. Check bucket is public
4. Verify file size < 5MB
5. Check file type (jpeg, png, webp)

### To check registration data directly:
1. Go to Supabase Dashboard → SQL Editor
2. Run:
   ```sql
   SELECT * FROM guest_registrations 
   ORDER BY created_at DESC 
   LIMIT 10;
   ```

## 📝 Notes

- **Single User Registration**: The system now uses a fixed ₹250 registration fee for all participants
- **Team Names**: Required only when team size > 1
- **UPI Transaction ID**: Required, numeric only
- **Registration ID**: Auto-generated UUID, displayed in success modal
- **Real-time Updates**: Admin panel uses React Query for automatic data refresh

