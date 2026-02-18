# 🚀 Quick Start: Run Seed Script

## The Easiest Way - Copy & Paste These Commands

---

## 📋 Step 1: Get Your Supabase Credentials

### A. Get Your Project URL

1. Go to: **https://supabase.com/dashboard**
2. Click your project
3. Click **⚙️ Settings** → **API**
4. Find **"Project URL"**
5. Copy it (looks like: `https://xxxxx.supabase.co`)

### B. Get Your Service Role Key

1. Still on the **API** page
2. Scroll to **"Project API keys"**
3. Find **"service_role"** (says "secret" next to it)
4. Click **"Reveal"**
5. Copy the ENTIRE key (very long, starts with `eyJ...`)

---

## 📋 Step 2: Open PowerShell

1. Open **VS Code** or **PowerShell**
2. Navigate to your project:
   ```powershell
   cd "C:\Users\sasir\OneDrive\Documents\Sasikumar R\New folder\creation-2k26-nexus"
   ```

---

## 📋 Step 3: Run These 3 Commands

**Replace the two values with what you copied:**

```powershell
$env:SUPABASE_URL="PASTE_YOUR_PROJECT_URL_HERE"
$env:SUPABASE_SERVICE_ROLE_KEY="PASTE_YOUR_SERVICE_ROLE_KEY_HERE"
npm run seed:users
```

### ✅ Example (with fake values - replace with yours):

```powershell
$env:SUPABASE_URL="https://tovokkcouwwymarnftcu.supabase.co"
$env:SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvdm9ra2NvdXd3eW1hcm5mdGN1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTEyMTk2NywiZXhwIjoyMDg2Njk3OTY3fQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
npm run seed:users
```

---

## 📋 Step 4: Check the Output

You should see:
```
Fetching events...
Creating admin user: Creation_admin@creation2k26.com
Admin created and role set.
Creating IC: Quiz_admin@creation2k26.com for event: Quiz
  IC created and assigned.
...
Done. Summary:
  Admin login: Creation_admin@creation2k26.com / Creation@123
  10 ICs: <EventName>_admin@creation2k26.com / Studentincharge@123
```

---

## 🎯 Alternative: Use the PowerShell Script

I've created a script file: `RUN_SEED_SCRIPT.ps1`

1. Open `RUN_SEED_SCRIPT.ps1` in VS Code
2. Replace `YOUR_URL_HERE` and `YOUR_KEY_HERE` with your actual values
3. Run in PowerShell:
   ```powershell
   .\RUN_SEED_SCRIPT.ps1
   ```

---

## ❓ Where to Find Your Credentials?

### Visual Guide:

1. **Supabase Dashboard** → Your Project
2. **Settings** (⚙️ icon) → **API**
3. You'll see:
   ```
   Project URL
   └─ https://xxxxx.supabase.co  ← Copy this
   
   Project API keys
   ├─ anon public (don't use this)
   └─ service_role [Reveal] ← Click Reveal, copy the key
   ```

---

## 🛠️ Troubleshooting

### "Missing env" error
- Make sure you ran ALL 3 commands in the SAME PowerShell window
- Don't close PowerShell between commands

### "Invalid API key" error
- Make sure you copied the **service_role** key (not anon)
- Make sure you copied the ENTIRE key (it's very long)
- No extra spaces before/after

### "Failed to fetch events" error
- Make sure your database migrations are applied
- The `events` table must exist

---

## ✅ That's It!

Once the script runs successfully, you can login:
- **Admin:** `Creation_admin@creation2k26.com` / `Creation@123`
- **Any IC:** `<EventName>_admin@creation2k26.com` / `Studentincharge@123`

Login at: `http://localhost:5173/admin-login` (local) or your live site.

