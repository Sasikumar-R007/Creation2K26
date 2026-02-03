# Seed Admin & Event Incharge Users

This script creates one **Creation Admin** and **10 Student Event Incharges** in your Supabase project.

## Prerequisites

- Supabase project with migrations applied (events and auth tables exist).
- **Service role key** from Supabase: Project Settings → API → `service_role` (secret). Never expose this in the frontend.

## Credentials Created

| Role | Email | Password |
|------|--------|----------|
| **Admin** | `Creation_Admin@creation2k26.com` | `Creationadmin@123` |
| **Quiz IC** | `Quiz_admin@creation2k26.com` | `Studentincharge@123` |
| **Paper Presentation IC** | `Paper_Presentation_admin@creation2k26.com` | `Studentincharge@123` |
| **Debugging IC** | `Debugging_admin@creation2k26.com` | `Studentincharge@123` |
| **Web Design IC** | `Web_Design_admin@creation2k26.com` | `Studentincharge@123` |
| **AI Prompt Engineering IC** | `AI_Prompt_Engineering_admin@creation2k26.com` | `Studentincharge@123` |
| **Ad Zap IC** | `Ad_Zap_admin@creation2k26.com` | `Studentincharge@123` |
| **Personality Contest IC** | `Personality_Contest_admin@creation2k26.com` | `Studentincharge@123` |
| **Memory Matrix IC** | `Memory_Matrix_admin@creation2k26.com` | `Studentincharge@123` |
| **IPL Auction IC** | `IPL_Auction_admin@creation2k26.com` | `Studentincharge@123` |
| **Movie Spoofing IC** | `Movie_Spoofing_admin@creation2k26.com` | `Studentincharge@123` |

## How to Run

Set your Supabase URL and **service role** key, then run the script:

```bash
# Option 1: Inline env (Unix/macOS)
SUPABASE_URL=https://your-project.supabase.co SUPABASE_SERVICE_ROLE_KEY=your-service-role-key npm run seed:users

# Option 2: Export then run
export SUPABASE_URL=https://your-project.supabase.co
export SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
npm run seed:users
```

On Windows (PowerShell):

```powershell
$env:SUPABASE_URL="https://your-project.supabase.co"
$env:SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
npm run seed:users
```

If a user already exists (e.g. re-running the script), the script updates their role and incharge assignment instead of failing.

## After Running

- **Admin:** Log in at `/auth` with `Creation_Admin@creation2k26.com` / `Creationadmin@123` → redirects to `/admin`.
- **Event ICs:** Log in with any `*_admin@creation2k26.com` / `Studentincharge@123` → redirects to `/ic-dashboard` for their event.

**Security:** Change these passwords in production (e.g. via Supabase Dashboard → Authentication → Users).
