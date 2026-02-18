# 🔑 How to Get Your Supabase Credentials

## Step-by-Step Guide to Get SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY

---

## 📍 Step 1: Go to Your Supabase Dashboard

1. Open your web browser
2. Go to: **https://supabase.com/dashboard**
3. Sign in to your account
4. Click on your project (the one you're using for Creation 2k26)

---

## 📍 Step 2: Get Your Project URL (SUPABASE_URL)

1. In the left sidebar, click the **⚙️ Gear Icon** → **Project Settings**
2. Click **API** in the left menu
3. Look for **"Project URL"** section
4. You'll see something like:
   ```
   https://xxxxxxxxxxxxx.supabase.co
   ```
5. **Copy this entire URL** - this is your `SUPABASE_URL`

**Example:**
```
https://hqkrexlemughwbbblbbkn.supabase.co
```

---

## 📍 Step 3: Get Your Service Role Key (SUPABASE_SERVICE_ROLE_KEY)

1. Still on the **API** page (Project Settings → API)
2. Scroll down to **"Project API keys"** section
3. You'll see two keys:
   - **anon public** (this is NOT what you need)
   - **service_role** (this is what you need - it says "secret" next to it)
4. Click **"Reveal"** button next to **service_role**
5. **Copy the entire key** - this is your `SUPABASE_SERVICE_ROLE_KEY`

**⚠️ Important:** 
- The key is very long (starts with `eyJ...`)
- Copy the ENTIRE key (it's one long string)
- This is a SECRET key - never share it publicly

**Example format:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhxa3JleGxlbXVnaHdiYmJsYmJrbiIsInJvbGUiOiJzZXJ2aWNlX3JvbGUiLCJpYXQiOjE3MTY4NzY1NDAsImV4cCI6MjAzMjQ1MjU0MH0.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 📍 Step 4: Open PowerShell in Your Project Folder

1. Open **VS Code** (or any terminal)
2. Navigate to your project folder:
   ```powershell
   cd "C:\Users\sasir\OneDrive\Documents\Sasikumar R\New folder\creation-2k26-nexus"
   ```

---

## 📍 Step 5: Run the Seed Script

Replace `YOUR_URL` and `YOUR_KEY` with the values you copied:

```powershell
$env:SUPABASE_URL="https://xxxxxxxxxxxxx.supabase.co"
$env:SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
npm run seed:users
```

### ✅ Complete Example (with fake values):

```powershell
$env:SUPABASE_URL="https://hqkrexlemughwbbblbbkn.supabase.co"
$env:SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhxa3JleGxlbXVnaHdiYmJsYmJrbiIsInJvbGUiOiJzZXJ2aWNlX3JvbGUiLCJpYXQiOjE3MTY4NzY1NDAsImV4cCI6MjAzMjQ1MjU0MH0.abc123xyz789"
npm run seed:users
```

---

## 📍 Step 6: Check the Output

If successful, you'll see:
```
Fetching events...
Creating admin user: Creation_admin@creation2k26.com
Admin created and role set.
Creating IC: Quiz_admin@creation2k26.com for event: Quiz
  IC created and assigned.
Creating IC: Paper_Presentation_admin@creation2k26.com for event: Paper Presentation
  IC created and assigned.
...
Done. Summary:
  Admin login: Creation_admin@creation2k26.com / Creation@123
  10 ICs: <EventName>_admin@creation2k26.com / Studentincharge@123
```

---

## 🛠️ Troubleshooting

### ❌ Error: "Missing env: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required"
- **Solution:** Make sure you ran the `$env:...` commands in the SAME PowerShell window before `npm run seed:users`
- Run all three commands together in one session

### ❌ Error: "Invalid API key"
- **Solution:** 
  - Make sure you copied the **service_role** key (not anon key)
  - Make sure there are no extra spaces
  - Make sure you copied the ENTIRE key

### ❌ Error: "Failed to fetch events"
- **Solution:** Make sure your database migrations are applied
- The `events` table must exist in your Supabase database

### ❌ Error: "Project URL not found"
- **Solution:** 
  - Make sure you copied the ENTIRE URL including `https://`
  - Make sure there are no extra spaces
  - Make sure you're using the correct project

---

## 📝 Quick Checklist

- [ ] Opened Supabase Dashboard
- [ ] Went to Project Settings → API
- [ ] Copied Project URL (SUPABASE_URL)
- [ ] Clicked "Reveal" on service_role key
- [ ] Copied Service Role Key (SUPABASE_SERVICE_ROLE_KEY)
- [ ] Opened PowerShell in project folder
- [ ] Ran the three commands (two $env: commands + npm run seed:users)
- [ ] Saw success message

---

## 💡 Pro Tip

If you need to run the script multiple times, you can save your credentials in a file (but NEVER commit it to git):

Create a file `seed-env.ps1` (add to .gitignore):
```powershell
$env:SUPABASE_URL="YOUR_URL_HERE"
$env:SUPABASE_SERVICE_ROLE_KEY="YOUR_KEY_HERE"
```

Then run:
```powershell
. .\seed-env.ps1
npm run seed:users
```

---

**That's it!** Once you have your credentials, just replace them in the commands above and run the seed script.

