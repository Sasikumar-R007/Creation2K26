/**
 * Google Apps Script for CREATION 2K26 Registration Webhook
 * 
 * Instructions:
 * 1. Open your Google Sheet
 * 2. Go to Extensions → Apps Script
 * 3. Paste this code
 * 4. Deploy → New deployment → Web app
 * 5. Copy the Web App URL
 * 6. Use it in Supabase Webhook configuration
 */

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    const record = data.record || data;
    
    // Get event names (you'll need to update these with your actual event IDs)
    const event1Name = getEventName(record.event_1_id);
    const event2Name = record.event_2_id ? getEventName(record.event_2_id) : '';
    
    // Prepare row data matching your sheet columns
    const rowData = [
      record.registration_id || record.id.substring(0, 13), // Registration ID (CN2K26P001)
      record.name || '',                                      // Name
      record.email || '',                                     // Email
      record.whatsapp_phone || '',                           // WhatsApp Phone
      record.department || '',                               // Department
      record.college || '',                                  // College
      event1Name,                                           // Event 1
      record.event_1_team_size || 1,                        // Event 1 Team Size
      record.event_1_team_name || '',                        // Event 1 Team Name
      event2Name,                                           // Event 2
      record.event_2_team_size || '',                        // Event 2 Team Size
      record.event_2_team_name || '',                         // Event 2 Team Name
      record.upi_transaction_id || '',                       // UPI Transaction ID
      record.payment_screenshot_url || '',                    // Payment Screenshot URL
      formatDate(record.created_at)                          // Registration Date
    ];
    
    // Append row to sheet
    sheet.appendRow(rowData);
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({ 
      success: true,
      message: 'Data added to sheet successfully'
    })).setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log('Error processing webhook: ' + error.toString());
    Logger.log('Request data: ' + JSON.stringify(e.postData));
    
    return ContentService.createTextOutput(JSON.stringify({ 
      success: false, 
      error: error.toString() 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Get event name from event ID
 * Fetches from Supabase API dynamically
 */
function getEventName(eventId) {
  if (!eventId) return '';
  
  // Cache event names to avoid repeated API calls
  const cache = CacheService.getScriptCache();
  const cachedName = cache.get('event_' + eventId);
  if (cachedName) {
    return cachedName;
  }
  
  // Fetch from Supabase API
  try {
    const supabaseUrl = 'https://tovokkcouwwymarnftcu.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvdm9ra2NvdXd3eW1hcm5mdGN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExMjE5NjcsImV4cCI6MjA4NjY5Nzk2N30.CVN8RbHF1GA5Kvo3JlkZWjIryuCuGURwm6PV_auZOGs';
    
    const response = UrlFetchApp.fetch(
      `${supabaseUrl}/rest/v1/events?id=eq.${eventId}&select=name`,
      {
        method: 'GET',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        }
      }
    );
    
    const result = JSON.parse(response.getContentText());
    if (result && result.length > 0) {
      const eventName = result[0].name;
      // Cache for 1 hour (3600 seconds)
      cache.put('event_' + eventId, eventName, 3600);
      return eventName;
    }
  } catch (err) {
    Logger.log('Error fetching event name: ' + err.toString());
  }
  
  // Fallback: return first 8 chars of UUID
  return eventId.substring(0, 8);
}

/**
 * Format date to Indian timezone
 */
function formatDate(dateString) {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return Utilities.formatDate(date, 'Asia/Kolkata', 'dd-MMM-yyyy HH:mm:ss');
  } catch (e) {
    return dateString;
  }
}

/**
 * Test function - run this to verify setup
 */
function testWebhook() {
  const testData = {
    record: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      registration_id: 'CN2K26P001',
      name: 'Test User',
      email: 'test@example.com',
      whatsapp_phone: '+91 9876543210',
      department: 'BCA',
      college: 'Bishop Heber College',
      event_1_id: 'test-event-1',
      event_1_team_size: 1,
      event_1_team_name: '',
      event_2_id: null,
      event_2_team_size: null,
      event_2_team_name: null,
      upi_transaction_id: '123456789',
      payment_screenshot_url: 'https://example.com/screenshot.png',
      created_at: new Date().toISOString()
    }
  };
  
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  const result = doPost(mockEvent);
  Logger.log('Test result: ' + result.getContent());
}

