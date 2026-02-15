# Vercel Build Configuration

## Build Commands for Vercel

When setting up your project in Vercel, use these commands:

### Install Command
```
npm install
```

### Build Command
```
npm run build
```

### Output Directory
```
dist
```

### Node.js Version
Vercel will auto-detect, but you can specify:
- **Node.js Version**: `18.x` or `20.x` (recommended)

---

## How to Set in Vercel Dashboard

1. Go to your project in Vercel
2. Click **Settings** → **General**
3. Scroll to **Build & Development Settings**
4. Set the following:

   - **Framework Preset**: `Vite` (auto-detected)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
   - **Node.js Version**: `20.x` (or leave auto)

5. Click **Save**

---

## Alternative: Using vercel.json

The project already has `vercel.json` configured for SPA routing. Vercel will automatically:
- Detect Vite framework
- Use `npm run build` as build command
- Use `dist` as output directory
- Handle SPA routing correctly

You only need to manually set these if auto-detection fails.

---

## Troubleshooting

### If build fails:
1. Check Node.js version (should be 18+)
2. Ensure all dependencies are in `package.json`
3. Check build logs in Vercel dashboard
4. Verify environment variables are set

### If routing doesn't work:
- The `vercel.json` file handles SPA routing
- All routes should redirect to `index.html`

