# 🚀 Quick Start - Creation 2K26

## Step-by-Step Instructions to Run the Project

### 1. Prerequisites Check
- ✅ Node.js (v18+) installed? Check with: `node --version`
- ✅ npm installed? Check with: `npm --version`

### 2. Navigate to Project Directory
```bash
cd "Creation2K26"
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run the Development Server

**Windows (PowerShell/CMD)**:
```bash
npm run dev
```

**If you encounter issues, try:**
```bash
npm run dev:win
```

**Or directly:**
```bash
npx tsx server/index.ts
```

### 5. Access the Application

Open your browser and go to:
```
http://localhost:5000
```

### 6. Login (Optional - for Admin Features)

Default admin credentials (auto-created on first run):
- **Username**: `admin`
- **Password**: `admin123`

## ✅ What You Should See

- Server starts on port 5000
- Vite dev server initializes
- Browser shows the Creation 2K26 event management system
- Default events are seeded automatically

## 🔧 Troubleshooting

**Port 5000 already in use?**
```bash
# Windows PowerShell
$env:PORT=3000; npx tsx server/index.ts

# Or modify .env file
PORT=3000
```

**Dependencies not installing?**
```bash
rm -rf node_modules package-lock.json
npm install
```

**TypeScript errors?**
```bash
npm run check
```

## 📋 Important Notes

- ✅ **No database required** - Uses in-memory storage by default
- ✅ **No environment variables needed** - Works with defaults
- ✅ **Auto-seeds admin user** - Username: `admin`, Password: `admin123`
- ✅ **Auto-seeds sample events** - 14 technical and non-technical events

## 🎯 What's Next?

1. Visit http://localhost:5000
2. Browse events on the home page
3. Register for events
4. Login as admin at `/admin/login`
5. Manage events and registrations from admin dashboard

For more details, see [README.md](./README.md)


