# ⚡ Quick Vercel Setup - Build Commands

## 📝 Exact Commands for Vercel Dashboard

When setting up your project in Vercel, use these **exact** values:

### Build & Development Settings

| Setting | Value |
|---------|-------|
| **Framework Preset** | `Vite` |
| **Root Directory** | `./` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |
| **Node.js Version** | `20.x` (or auto) |

### Environment Variables

Add these in **Settings → Environment Variables**:

```
VITE_SUPABASE_URL = https://tovokkcouwwymarnftcu.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvdm9ra2NvdXd3eW1hcm5mdGN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExMjE5NjcsImV4cCI6MjA4NjY5Nzk2N30.CVN8RbHF1GA5Kvo3JlkZWjIryuCuGURwm6PV_auZOGs
```

**Important**: Select all environments (Production, Preview, Development)

---

## ✅ Fixed Issues

- ✅ Added missing `html2pdf.js` dependency
- ✅ Added `html2canvas` and `jspdf` (peer dependencies)
- ✅ All dependencies now in `package.json`

---

## 🚀 After Deployment

1. Your app will be live at: `https://your-project.vercel.app`
2. Test the registration page - PDF download should work
3. Verify Supabase connection
4. Test authentication flow

---

## 📚 More Details

See `DEPLOYMENT_GUIDE.md` for complete deployment instructions.

