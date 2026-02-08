# Step-by-step: How to run the seed script (Admin + IC logins)

Follow these steps in order.

---

## Step 1: Open your Supabase project

1. Go to **https://supabase.com/dashboard**
2. Sign in and click your project (e.g. **creation-2k26** or the one you use for this app).

---

## Step 2: Get the Project URL and Service role key

1. In the left sidebar, click the **gear icon** → **Project Settings**.
2. Click **API** in the left menu.
3. On the API page you’ll see:
   - **Project URL**  
     Example: `https://xxxxxxxxxxxx.supabase.co`  
     Copy this; you’ll use it as `SUPABASE_URL`.
   - **Project API keys**  
     - **anon public** – used by the frontend (you already have this in `.env`).  
     - **service_role** (labeled “secret”) – used only for the seed script.  
     Click **Reveal** next to **service_role**, then copy the key.  
     You’ll use it as `SUPABASE_SERVICE_ROLE_KEY`.

⚠️ **Important:** Never put the **service_role** key in your frontend code or in a public place. Use it only in the seed command below (or in a local `.env` that is not committed).

---

## Step 3: Open a terminal in your project folder

1. Open **VS Code** (or any terminal).
2. Go to your project folder, for example:
   ```bash
   cd e:\creation-2k26-nexus
   ```
   (Use your actual path if it’s different.)

---

## Step 4: Run the seed script with your URL and key

Replace the two placeholders with your real values from Step 2:

- `YOUR_PROJECT_URL` → the **Project URL** (e.g. `https://hqkrexlemughwbbblbbkn.supabase.co`)
- `YOUR_SERVICE_ROLE_KEY` → the **service_role** key you copied

### On Windows (PowerShell)

Run these three lines one by one (paste your real URL and key in the second and third):

```powershell
cd e:\creation-2k26-nexus
$env:SUPABASE_URL="YOUR_PROJECT_URL"
$env:SUPABASE_SERVICE_ROLE_KEY="YOUR_SERVICE_ROLE_KEY"
npm run seed:users
```

Example (with fake key):

```powershell
cd e:\creation-2k26-nexus
$env:SUPABASE_URL="https://hqkrexlemughwbbblbbkn.supabase.co"
$env:SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
npm run seed:users
```

### On Windows (Command Prompt / CMD)

```cmd
cd e:\creation-2k26-nexus
set SUPABASE_URL=YOUR_PROJECT_URL
set SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
npm run seed:users
```

### On Mac / Linux / Git Bash

```bash
cd /path/to/creation-2k26-nexus
export SUPABASE_URL="YOUR_PROJECT_URL"
export SUPABASE_SERVICE_ROLE_KEY="YOUR_SERVICE_ROLE_KEY"
npm run seed:users
```

Or in one line:

```bash
SUPABASE_URL="YOUR_PROJECT_URL" SUPABASE_SERVICE_ROLE_KEY="YOUR_SERVICE_ROLE_KEY" npm run seed:users
```

---

## Step 5: Check the output

If it worked, you’ll see something like:

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

If you see **“Admin user already exists”** or **“IC already exists”**, that’s fine – the script only updates their role/assignment.

If you see an error:

- **Missing env** → You didn’t set `SUPABASE_URL` or `SUPABASE_SERVICE_ROLE_KEY` in the same terminal before `npm run seed:users`. Run the `$env:...` or `set ...` or `export ...` lines again, then `npm run seed:users`.
- **Failed to fetch events** → Run your Supabase migrations first so the `events` table exists.
- **Invalid API key** → Double-check that you copied the **service_role** key (not the anon key) and that there are no extra spaces.

---

## Step 6: Log in in your app

1. Start your app (e.g. `npm run dev`).
2. Open the site and go to **Admin** (or `/admin-login`).
3. **Admin:**  
   - Email: `Creation_admin@creation2k26.com`  
   - Password: `Creation@123`
4. **Event Incharges:**  
   - Email: e.g. `Quiz_admin@creation2k26.com`  
   - Password: `Studentincharge@123`

That’s it. You’ve run the seed script and can use Admin and IC logins.
