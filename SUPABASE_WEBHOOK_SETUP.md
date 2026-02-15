# 🔧 Supabase Webhook Configuration - Step by Step

## Your Google Apps Script URL
```
https://script.google.com/macros/s/AKfycbw_TaYP4Ebb2BQIAlXwxQNv-tQPLA3ftd2FLkGwRI2lmJ4VMelX9VyqvoZqyGrM9D4c/exec
```

---

## 📋 Step-by-Step Configuration

### Step 1: Navigate to Webhooks
1. Go to **Supabase Dashboard**: https://supabase.com/dashboard/project/tovokkcouwwymarnftcu
2. Click **Database** (left sidebar)
3. Click **Webhooks** (under Database section)

### Step 2: Create New Webhook
Click **"Create a new webhook"** or **"New Webhook"** button

### Step 3: Fill in the Details

#### Basic Information:
- **Name**: `Google Sheets Sync`
  - (Any name you prefer, this is just for your reference)

#### Table & Events:
- **Table**: Select `guest_registrations` from dropdown
- **Events**: 
  - ✅ Check **INSERT** (this is the only one you need)
  - ❌ Uncheck UPDATE and DELETE (unless you want those too)

#### HTTP Request:
- **HTTP Verb**: Select `POST`
- **URL**: 
  ```
  https://script.google.com/macros/s/AKfycbw_TaYP4Ebb2BQIAlXwxQNv-tQPLA3ftd2FLkGwRI2lmJ4VMelX9VyqvoZqyGrM9D4c/exec
  ```

#### HTTP Headers (Optional but Recommended):
Click **"Add header"** and add:
- **Name**: `Content-Type`
- **Value**: `application/json`

(You can skip this if the field is optional - Google Apps Script will handle it)

#### HTTP Request Body (Important!):
This is where Supabase sends the data. You need to configure what data to send.

**Option 1: Simple (Recommended)**
- Select **"Send full event payload"** or **"Send entire record"**
- This sends the complete registration data

**Option 2: Custom JSON**
If you see a "Custom JSON" or "Request Body" field, use:
```json
{
  "record": {
    "id": "{{ $new.id }}",
    "registration_id": "{{ $new.registration_id }}",
    "name": "{{ $new.name }}",
    "email": "{{ $new.email }}",
    "whatsapp_phone": "{{ $new.whatsapp_phone }}",
    "department": "{{ $new.department }}",
    "college": "{{ $new.college }}",
    "event_1_id": "{{ $new.event_1_id }}",
    "event_2_id": "{{ $new.event_2_id }}",
    "event_1_team_size": "{{ $new.event_1_team_size }}",
    "event_2_team_size": "{{ $new.event_2_team_size }}",
    "event_1_team_name": "{{ $new.event_1_team_name }}",
    "event_2_team_name": "{{ $new.event_2_team_name }}",
    "upi_transaction_id": "{{ $new.upi_transaction_id }}",
    "payment_screenshot_url": "{{ $new.payment_screenshot_url }}",
    "created_at": "{{ $new.created_at }}"
  }
}
```

**However, if Supabase has a simple option like "Send full record" or "Send entire payload", use that instead!**

#### Retry Policy (Optional):
- **Retry attempts**: `3` (default is fine)
- **Retry interval**: `1000` ms (default is fine)

#### Enabled:
- ✅ Make sure **"Enabled"** is checked/toggled ON

### Step 4: Save
Click **"Save"** or **"Create Webhook"** button

---

## ✅ What Supabase Will Send

When a new registration is inserted, Supabase will send a POST request to your Google Apps Script with this structure:

```json
{
  "type": "INSERT",
  "table": "guest_registrations",
  "record": {
    "id": "uuid-here",
    "registration_id": "CN2K26P001",
    "name": "John Doe",
    "email": "john@example.com",
    "whatsapp_phone": "+91 9876543210",
    "department": "BCA",
    "college": "Bishop Heber College",
    "event_1_id": "event-uuid-1",
    "event_2_id": "event-uuid-2",
    "event_1_team_size": 1,
    "event_2_team_size": 2,
    "event_1_team_name": "",
    "event_2_team_name": "Team Alpha",
    "upi_transaction_id": "123456789",
    "payment_screenshot_url": "https://...",
    "created_at": "2026-02-15T10:30:00Z"
  },
  "old_record": null
}
```

Your Google Apps Script will receive this and add it to your sheet.

---

## 🧪 Testing

### Test 1: Manual Test
1. Go to your Google Sheet
2. Submit a test registration from your app
3. Check if a new row appears in the sheet

### Test 2: Check Webhook Logs
1. In Supabase, go to **Database** → **Webhooks**
2. Click on your webhook name
3. Check the **"Logs"** or **"History"** tab
4. You should see successful requests (status 200)

### Test 3: Check Google Apps Script Logs
1. Go to Google Apps Script editor
2. Click **View** → **Logs** (or **Execution log**)
3. You should see execution logs when webhook is triggered

---

## 🐛 Troubleshooting

### Issue: Webhook not triggering
- ✅ Check webhook is **Enabled**
- ✅ Verify **Table** is `guest_registrations`
- ✅ Verify **Events** includes **INSERT**
- ✅ Check webhook logs in Supabase

### Issue: Data not appearing in sheet
- ✅ Check Google Apps Script execution logs
- ✅ Verify sheet has correct headers
- ✅ Make sure Apps Script has permission to edit sheet
- ✅ Check if webhook URL is correct

### Issue: Error in webhook logs
- ✅ Check the error message in Supabase webhook logs
- ✅ Verify Google Apps Script code is correct
- ✅ Check if sheet is accessible

---

## 📝 Quick Checklist

- [ ] Webhook name: `Google Sheets Sync`
- [ ] Table: `guest_registrations`
- [ ] Event: `INSERT` ✅
- [ ] HTTP Verb: `POST`
- [ ] URL: Your Google Apps Script URL
- [ ] Request Body: Send full record/payload
- [ ] Enabled: ✅ ON
- [ ] Save the webhook

---

## 🎯 Minimal Required Fields

If Supabase is asking for many fields, here are the **essential ones**:

1. **Name** - `Google Sheets Sync`
2. **Table** - `guest_registrations`
3. **Events** - `INSERT` ✅
4. **HTTP Verb** - `POST`
5. **URL** - Your Google Apps Script URL
6. **Request Body** - "Send full record" or "Send entire payload"
7. **Enabled** - ✅ ON

Everything else can usually be left as default!

---

**Once saved, test by submitting a registration and check your Google Sheet!** 🎉

