# ============================================
# Seed Script - Create Admin & IC Users
# ============================================
# 
# INSTRUCTIONS:
# 1. First, get your Supabase credentials (see below)
# 2. Replace YOUR_URL and YOUR_KEY below with your actual values
# 3. Run this script in PowerShell
#
# ============================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Seed Script - Admin & IC Users" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# ============================================
# STEP 1: GET YOUR SUPABASE CREDENTIALS
# ============================================
# 
# Go to: https://supabase.com/dashboard
# 1. Click your project
# 2. Click ⚙️ Settings → API
# 3. Copy "Project URL" (looks like: https://xxxxx.supabase.co)
# 4. Scroll down to "Project API keys"
# 5. Click "Reveal" next to "service_role" (the secret one)
# 6. Copy the entire key (very long, starts with eyJ...)
#
# ============================================

# ============================================
# STEP 2: PASTE YOUR CREDENTIALS HERE
# ============================================
# 
# Replace these two lines with YOUR actual values:

$SUPABASE_URL = "YOUR_URL_HERE"
$SUPABASE_SERVICE_ROLE_KEY = "YOUR_KEY_HERE"

# Example (DO NOT USE THESE - they are fake):
# $SUPABASE_URL = "https://hqkrexlemughwbbblbbkn.supabase.co"
# $SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhxa3JleGxlbXVnaHdiYmJsYmJrbiIsInJvbGUiOiJzZXJ2aWNlX3JvbGUiLCJpYXQiOjE3MTY4NzY1NDAsImV4cCI6MjAzMjQ1MjU0MH0.abc123xyz789"

# ============================================
# STEP 3: VALIDATE CREDENTIALS
# ============================================

if ($SUPABASE_URL -eq "YOUR_URL_HERE" -or $SUPABASE_SERVICE_ROLE_KEY -eq "YOUR_KEY_HERE") {
    Write-Host "❌ ERROR: You need to replace YOUR_URL_HERE and YOUR_KEY_HERE with your actual Supabase credentials!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Follow these steps:" -ForegroundColor Yellow
    Write-Host "1. Go to: https://supabase.com/dashboard" -ForegroundColor Yellow
    Write-Host "2. Click your project → Settings → API" -ForegroundColor Yellow
    Write-Host "3. Copy 'Project URL' and 'service_role' key" -ForegroundColor Yellow
    Write-Host "4. Paste them in this script (lines 30-31)" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

# ============================================
# STEP 4: SET ENVIRONMENT VARIABLES
# ============================================

Write-Host "Setting environment variables..." -ForegroundColor Green
$env:SUPABASE_URL = $SUPABASE_URL
$env:SUPABASE_SERVICE_ROLE_KEY = $SUPABASE_SERVICE_ROLE_KEY

Write-Host "✓ SUPABASE_URL set" -ForegroundColor Green
Write-Host "✓ SUPABASE_SERVICE_ROLE_KEY set" -ForegroundColor Green
Write-Host ""

# ============================================
# STEP 5: RUN THE SEED SCRIPT
# ============================================

Write-Host "Running seed script..." -ForegroundColor Cyan
Write-Host ""

npm run seed:users

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Done!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "You can now login with:" -ForegroundColor Green
Write-Host "  Admin: Creation_admin@creation2k26.com / Creation@123" -ForegroundColor Yellow
Write-Host "  ICs: <EventName>_admin@creation2k26.com / Studentincharge@123" -ForegroundColor Yellow
Write-Host ""

