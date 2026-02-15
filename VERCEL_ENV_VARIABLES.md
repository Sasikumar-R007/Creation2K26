# Environment Variables for Vercel

Add these environment variables in your Vercel project settings:

## Required Variables

```
VITE_SUPABASE_URL=https://tovokkcouwwymarnftcu.supabase.co

VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvdm9ra2NvdXd3eW1hcm5mdGN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExMjE5NjcsImV4cCI6MjA4NjY5Nzk2N30.CVN8RbHF1GA5Kvo3JlkZWjIryuCuGURwm6PV_auZOGs
```

## How to Add in Vercel

1. Go to your project in Vercel Dashboard
2. Click **Settings** → **Environment Variables**
3. Add each variable:
   - **Name**: `VITE_SUPABASE_URL`
   - **Value**: `https://tovokkcouwwymarnftcu.supabase.co`
   - **Environment**: Select all (Production, Preview, Development)
4. Repeat for `VITE_SUPABASE_ANON_KEY`
5. **Redeploy** your project after adding variables

## Note

These are **public** keys (anon key) and are safe to expose in the frontend. The `VITE_` prefix makes them available to your Vite application.

