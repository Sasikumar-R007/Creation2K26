# 🔍 How to Find Your Service Role Key

## ❌ The Anon Key is NOT What You Need

You found the **anon key**, but you need the **service_role key** (the secret one).

**Difference:**
- **anon key** = Public key (for frontend) ❌ Won't work for seed script
- **service_role key** = Secret admin key (for backend scripts) ✅ This is what you need

---

## ✅ Step-by-Step: Find Service Role Key

### Step 1: Go to Supabase Dashboard
1. Go to: **https://supabase.com/dashboard**
2. Click your project

### Step 2: Open API Settings
1. Click **⚙️ Settings** (gear icon in left sidebar)
2. Click **API** in the left menu

### Step 3: Find Service Role Key
On the API page, you'll see:

```
┌─────────────────────────────────────────┐
│ Project URL                              │
│ https://tovokkcouwwymarnftcu.supabase.co │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Project API keys                         │
│                                          │
│ anon public                              │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... │ ← This is what you found
│                                          │
│ service_role [Reveal]  ← LOOK FOR THIS! │
│ (secret)                                 │
└─────────────────────────────────────────┘
```

### Step 4: Reveal the Service Role Key
1. Look for **"service_role"** (it says "secret" next to it)
2. Click the **"Reveal"** button next to it
3. Copy the ENTIRE key (it's very long, starts with `eyJ...`)

---

## 🔍 Where Exactly Is It?

The service_role key is on the **SAME PAGE** as the anon key, but:

1. **Scroll down** on the API page - it's below the anon key
2. Look for a section called **"Project API keys"** or **"API Keys"**
3. You'll see two keys:
   - **anon public** (the one you found)
   - **service_role** (the one you need) ← This one!

---

## 📸 Visual Guide

```
Supabase Dashboard
├── Your Project
    └── Settings (⚙️)
        └── API
            ├── Project URL: https://tovokkcouwwymarnftcu.supabase.co
            └── Project API keys:
                ├── anon public
                │   └── eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (you found this)
                │
                └── service_role [Reveal] ← CLICK REVEAL HERE!
                    └── eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (this is what you need)
```

---

## ⚠️ Important Notes

1. **The service_role key is LONGER** than the anon key
2. **It starts with `eyJ...`** (same as anon, but different content)
3. **It says "secret"** next to it
4. **You must click "Reveal"** to see it
5. **Copy the ENTIRE key** - it's one long string

---

## 🚨 If You Still Can't Find It

### Option 1: Check Your Permissions
- Make sure you're the **project owner** or have **admin access**
- If you're a collaborator, you might not see the service_role key

### Option 2: Check Different Sections
Sometimes it's in:
- **Settings** → **API** → Scroll down
- **Settings** → **General** → **API Settings**
- Look for tabs: "API Keys", "Keys", "Credentials"

### Option 3: Ask Project Owner
If you can't see it, ask the project owner to:
1. Go to Settings → API
2. Reveal the service_role key
3. Share it with you (securely!)

---

## ✅ Once You Find It

Use it in the seed script:

```powershell
$env:SUPABASE_URL="https://tovokkcouwwymarnftcu.supabase.co"
$env:SUPABASE_SERVICE_ROLE_KEY="PASTE_THE_SERVICE_ROLE_KEY_HERE"
npm run seed:users
```

---

## 🔐 Security Reminder

- **Never commit** the service_role key to git
- **Never share** it publicly
- **Only use** it for backend scripts (like the seed script)
- It has **full admin access** to your database

