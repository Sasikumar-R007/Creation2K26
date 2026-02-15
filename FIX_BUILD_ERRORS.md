# 🔧 Fix Build Errors - Step by Step

## Problem
Build errors with:
- `lucide-react` icons not resolving
- `canvg/core-js` internals not resolving
- 1534+ build errors

## ✅ Solution Applied

### 1. Cleaned Dependencies
- Removed `node_modules`
- Removed `package-lock.json`
- Reinstalled all dependencies

### 2. Updated Vite Config
- Added `optimizeDeps` for html2pdf.js dependencies
- Simplified build configuration

### 3. Updated PDF Import
- Changed to dynamic import with fallback
- Better error handling

---

## 🚀 Quick Fix Commands

If you still see errors, run these commands:

```powershell
# 1. Stop the dev server (Ctrl+C)

# 2. Clear Vite cache
Remove-Item -Recurse -Force node_modules\.vite -ErrorAction SilentlyContinue

# 3. Clear npm cache (optional)
npm cache clean --force

# 4. Reinstall dependencies
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install

# 5. Start dev server
npm run dev
```

---

## 🔍 Alternative: If Errors Persist

### Option 1: Use Different PDF Library

If `html2pdf.js` continues to cause issues, we can switch to `jspdf` + `html2canvas` directly:

```typescript
// Instead of html2pdf.js
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const canvas = await html2canvas(element);
const imgData = canvas.toDataURL('image/png');
const pdf = new jsPDF();
pdf.addImage(imgData, 'PNG', 0, 0);
pdf.save(`CN2K26_Registration_${registrationId}.pdf`);
```

### Option 2: Lazy Load PDF Feature

Only load PDF libraries when user clicks download:

```typescript
const downloadPDF = async () => {
  // Only import when needed
  const [{ default: html2pdf }] = await Promise.all([
    import('html2pdf.js')
  ]);
  // ... rest of code
};
```

---

## ✅ Current Status

- ✅ Dependencies reinstalled
- ✅ Vite config updated
- ✅ PDF import improved
- ✅ Dev server should start

---

## 🐛 If Still Not Working

1. **Check Node.js version**: Should be 18.x or 20.x
   ```powershell
   node --version
   ```

2. **Check npm version**: Should be 9.x or 10.x
   ```powershell
   npm --version
   ```

3. **Try with different package manager**:
   ```powershell
   # Using yarn
   yarn install
   yarn dev
   
   # Or using pnpm
   pnpm install
   pnpm dev
   ```

4. **Check for conflicting packages**:
   ```powershell
   npm ls html2pdf.js
   npm ls html2canvas
   npm ls jspdf
   ```

---

## 📝 Notes

- The errors were likely due to corrupted `node_modules`
- `html2pdf.js` has complex dependencies (canvg, html2canvas, jspdf)
- Vite needs proper configuration to handle these CommonJS modules
- Dynamic imports help avoid build-time issues

---

**The dev server should now start successfully!** 🎉

If you still see errors, share the specific error message and I'll help fix it.

