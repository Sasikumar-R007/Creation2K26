# 📊 Google Sheets Integration Guide

This guide will help you set up automatic data syncing from your Supabase database to Google Sheets.

## 🎯 Overview

When a participant registers, their details will automatically be added to your Google Sheet:
- Personal details (name, email, phone, department, college)
- Event details (Event 1, Event 2, team sizes, team names)
- Payment details (UPI Transaction ID, payment screenshot URL)
- Registration ID (CN2K26P001 format)
- Registration date

---

## 📋 Method 1: Using Supabase Database Webhooks (Recommended)

### Step 1: Set Up Google Apps Script

1. **Open your Google Sheet**: https://docs.google.com/spreadsheets/d/1tvWKAiP4zCFJv4JYGp7rl4TF_gjSnVs1XM_bd4rJhCE/edit

2. **Create Headers** (if not already created):
   - Row 1: `Registration ID`, `Name`, `Email`, `WhatsApp Phone`, `Department`, `College`, `Event 1`, `Event 1 Team Size`, `Event 1 Team Name`, `Event 2`, `Event 2 Team Size`, `Event 2 Team Name`, `UPI Transaction ID`, `Payment Screenshot URL`, `Registration Date`

3. **Open Apps Script**:
   - Click **Extensions** → **Apps Script**
   - Delete the default code and paste the code from `google-apps-script.js` (see below)

4. **Deploy as Web App**:
   - Click **Deploy** → **New deployment**
   - Click the gear icon ⚙️ → **Web app**
   - Description: "Registration Webhook"
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Click **Deploy**
   - **Copy the Web App URL** (you'll need this for Supabase)

### Step 2: Configure Supabase Webhook

1. **Go to Supabase Dashboard**:
   - Project: `tovokkcouwwymarnftcu`
   - Navigate to **Database** → **Webhooks**

2. **Create New Webhook**:
   - **Name**: `Google Sheets Sync`
   - **Table**: `guest_registrations`
   - **Events**: Select **INSERT**
   - **HTTP Request**:
     - **URL**: Paste your Google Apps Script Web App URL
     - **Method**: `POST`
     - **HTTP Headers**: 
       ```
       Content-Type: application/json
       ```
   - Click **Save**

### Step 3: Test the Integration

1. Submit a test registration from your app
2. Check your Google Sheet - the data should appear automatically!

---

## 📋 Method 2: Using Vercel Serverless Function (Alternative)

If you prefer to use a Vercel serverless function instead:

1. **Create API Route**: `api/sync-to-sheets.ts` (see code below)
2. **Set Environment Variables in Vercel**:
   - `GOOGLE_SHEETS_API_KEY`: Your Google Sheets API key
   - `GOOGLE_SHEETS_SPREADSHEET_ID`: `1tvWKAiP4zCFJv4JYGp7rl4TF_gjSnVs1XM_bd4rJhCE`

3. **Update Supabase Webhook** to point to your Vercel function URL

---

## 🔧 Google Apps Script Code

Create a file `google-apps-script.js` with this code:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    // Extract data from webhook payload
    const record = data.record || data;
    
    // Get event names (you may need to fetch from events table)
    const event1Name = record.event_1_id ? 'Event 1' : ''; // You'll need to join with events table
    const event2Name = record.event_2_id ? 'Event 2' : '';
    
    // Prepare row data
    const rowData = [
      record.registration_id || record.id.substring(0, 13), // Registration ID
      record.name || '',
      record.email || '',
      record.whatsapp_phone || '',
      record.department || '',
      record.college || '',
      event1Name,
      record.event_1_team_size || 1,
      record.event_1_team_name || '',
      event2Name,
      record.event_2_team_size || '',
      record.event_2_team_name || '',
      record.upi_transaction_id || '',
      record.payment_screenshot_url || '',
      new Date(record.created_at).toLocaleString('en-IN')
    ];
    
    // Append row to sheet
    sheet.appendRow(rowData);
    
    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({ 
      success: false, 
      error: error.toString() 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

---

## 🔧 Enhanced Google Apps Script (With Event Names)

For better integration, use this enhanced version that fetches event names:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    const record = data.record || data;
    
    // Note: You'll need to create a mapping of event IDs to names
    // Or fetch from Supabase API
    
    const event1Name = getEventName(record.event_1_id);
    const event2Name = record.event_2_id ? getEventName(record.event_2_id) : '';
    
    const rowData = [
      record.registration_id || record.id.substring(0, 13),
      record.name || '',
      record.email || '',
      record.whatsapp_phone || '',
      record.department || '',
      record.college || '',
      event1Name,
      record.event_1_team_size || 1,
      record.event_1_team_name || '',
      event2Name,
      record.event_2_team_size || '',
      record.event_2_team_name || '',
      record.upi_transaction_id || '',
      record.payment_screenshot_url || '',
      new Date(record.created_at).toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        dateStyle: 'medium',
        timeStyle: 'short'
      })
    ];
    
    sheet.appendRow(rowData);
    
    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({ 
      success: false, 
      error: error.toString() 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Helper function to get event name (you'll need to implement this)
function getEventName(eventId) {
  // Option 1: Hardcode event IDs (quick solution)
  const eventMap = {
    // Add your event IDs here
    // 'uuid-1': 'Quiz',
    // 'uuid-2': 'Web Design',
    // etc.
  };
  
  return eventMap[eventId] || eventId.substring(0, 8);
}
```

---

## 📝 Step-by-Step Setup Instructions

### Quick Setup (5 minutes)

1. **Open Google Sheet** → Extensions → Apps Script
2. **Paste the code** from above
3. **Deploy** → New deployment → Web app
4. **Copy Web App URL**
5. **Go to Supabase** → Database → Webhooks → Create
6. **Paste URL** and configure for INSERT events on `guest_registrations`
7. **Test** by submitting a registration

---

## 🔍 Verifying Event Names

Since the webhook only sends event IDs, you have two options:

### Option A: Create Event Mapping in Apps Script
Add a mapping of event IDs to names in your Apps Script:

```javascript
const EVENT_NAMES = {
  'your-event-1-uuid': 'Quiz',
  'your-event-2-uuid': 'Web Design',
  // ... add all 10 events
};
```

### Option B: Use Supabase API in Apps Script
Fetch event names from Supabase API (requires API key):

```javascript
function getEventName(eventId) {
  const supabaseUrl = 'https://tovokkcouwwymarnftcu.supabase.co';
  const supabaseKey = 'YOUR_ANON_KEY';
  
  const response = UrlFetchApp.fetch(
    `${supabaseUrl}/rest/v1/events?id=eq.${eventId}&select=name`,
    {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    }
  );
  
  const data = JSON.parse(response.getContentText());
  return data[0]?.name || eventId.substring(0, 8);
}
```

---

## ✅ Testing

1. Submit a test registration
2. Check Supabase → Database → Webhooks → View logs
3. Check Google Sheet for new row
4. Verify all data is correct

---

## 🐛 Troubleshooting

### Issue: Data not appearing in sheet
- Check Apps Script execution logs (View → Logs)
- Verify webhook URL is correct
- Check Supabase webhook logs

### Issue: Event names showing as UUIDs
- Implement event name mapping (see Option A above)
- Or use Supabase API to fetch names (Option B)

### Issue: Permission errors
- Make sure Apps Script is deployed with "Anyone" access
- Check that the script has permission to edit the sheet

---

## 📊 Sheet Structure

Your sheet should have these columns (in order):

| Column | Description |
|--------|-------------|
| Registration ID | CN2K26P001 format |
| Name | Participant name |
| Email | Email address |
| WhatsApp Phone | Phone number |
| Department | Department name |
| College | College name |
| Event 1 | First event name |
| Event 1 Team Size | Number of participants |
| Event 1 Team Name | Team name (if applicable) |
| Event 2 | Second event name (if any) |
| Event 2 Team Size | Number of participants |
| Event 2 Team Name | Team name (if applicable) |
| UPI Transaction ID | Payment transaction ID |
| Payment Screenshot URL | Link to uploaded screenshot |
| Registration Date | Date and time of registration |

---

## 🔐 Security Notes

- The Google Apps Script webhook URL should be kept private
- Consider adding authentication to your webhook
- The Supabase anon key is safe to use in Apps Script (it's public)

---

## 📞 Need Help?

If you encounter issues:
1. Check Supabase webhook logs
2. Check Google Apps Script execution logs
3. Verify sheet permissions
4. Test webhook with a tool like Postman

---

**🎉 Once set up, all registrations will automatically sync to your Google Sheet!**

