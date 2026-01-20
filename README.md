# Creation 2K26 - Event Management System

A full-stack event management system built with React, Express.js, TypeScript, and PostgreSQL/Drizzle ORM.

## 📋 Project Overview

This is a full-stack application for managing symposium events, registrations, announcements, and admin operations. The system includes:

- **Frontend**: React with TypeScript, Vite, Tailwind CSS, shadcn/ui components
- **Backend**: Express.js with TypeScript, Passport.js authentication
- **Database**: PostgreSQL with Drizzle ORM (optional - uses in-memory storage by default)
- **Features**: Event management, registrations, announcements, admin dashboard

## 🚀 Quick Start Guide

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js)
- **PostgreSQL** (optional - only needed if you want to use a real database)

### Installation Steps

1. **Navigate to the project directory**
   ```bash
   cd "Creation2K26"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (Optional)
   
   Create a `.env` file in the `Creation2K26` directory (optional, as the app works with defaults):
   ```env
   PORT=5000
   NODE_ENV=development
   DATABASE_URL=postgresql://user:password@localhost:5432/creation2k26
   SESSION_SECRET=your-secret-key-here
   ```
   
   **Note**: The application works without a `.env` file as it uses:
   - In-memory storage by default (no database required)
   - Default port: 5000
   - Default session secret: "default_secret"

4. **Run the development server**

   The application automatically runs in development mode (Vite dev server) unless NODE_ENV is explicitly set to "production".
   
   **On Windows (PowerShell or CMD)**:
   ```bash
   npm run dev
   ```
   
   Or if you encounter issues with environment variables:
   ```bash
   npm run dev:win
   ```
   
   **On Linux/Mac**:
   ```bash
   npm run dev
   ```
   
   **Note**: You can also run without setting NODE_ENV as the app defaults to development mode:
   ```bash
   npx tsx server/index.ts
   ```

5. **Access the application**
   
   Open your browser and navigate to:
   ```
   http://localhost:5000
   ```

## 🔐 Default Admin Credentials

The application automatically seeds a default admin user on first run:

- **Username**: `admin`
- **Password**: `admin123`

**⚠️ Important**: Change these credentials in production!

## 📦 Available Scripts

### Development
- `npm run dev` - Start development server (Linux/Mac)
- `npm run dev:win` - Start development server (Windows PowerShell compatible)
- `npm run check` - Type-check TypeScript code

### Production
- `npm run build` - Build both client and server for production
- `npm start` - Start production server (requires build first)

### Database (Optional)
- `npm run db:push` - Push database schema changes (requires DATABASE_URL)

## 🗄️ Database Setup (Optional)

The application works with **in-memory storage** by default, which means:
- ✅ No database setup required
- ✅ Data resets on server restart
- ❌ Data is not persistent

To use PostgreSQL:

1. **Install PostgreSQL** (if not already installed)

2. **Create a database**
   ```sql
   CREATE DATABASE creation2k26;
   ```

3. **Set up your DATABASE_URL**
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/creation2k26
   ```

4. **Push the schema**
   ```bash
   npm run db:push
   ```

5. **Update storage** - You'll need to modify `server/storage.ts` to use the database instead of MemStorage (currently uses in-memory storage).

## 🏗️ Project Structure

```
Creation2K26/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utilities
│   └── index.html
├── server/                 # Express backend
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   ├── db.ts              # Database connection
│   └── storage.ts         # Data storage layer
├── shared/                 # Shared types/schemas
│   ├── schema.ts          # Database schema
│   └── routes.ts          # API route definitions
└── package.json
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Events
- `GET /api/events` - List all events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create event (auth required)
- `PUT /api/events/:id` - Update event (auth required)
- `DELETE /api/events/:id` - Delete event (auth required)

### Registrations
- `POST /api/registrations` - Create registration
- `GET /api/registrations` - List all registrations (auth required)
- `PATCH /api/registrations/:id/status` - Update registration status (auth required)

### Announcements
- `GET /api/announcements` - List all announcements
- `POST /api/announcements` - Create announcement (auth required)

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Express.js, TypeScript, Passport.js
- **Database**: PostgreSQL, Drizzle ORM (optional - in-memory by default)
- **Build Tools**: Vite, esbuild, TypeScript
- **UI Libraries**: Radix UI, Framer Motion, React Query

## 📝 Development Notes

- The app uses **Vite** for frontend development with HMR (Hot Module Replacement)
- Backend runs on port **5000** by default
- Frontend and backend are served from the same port in development
- In production, static files are served from the Express server

## 🐛 Troubleshooting

### Port Already in Use
If port 5000 is already in use, set a different port:
```bash
$env:PORT=3000; $env:NODE_ENV="development"; npm run dev
```

### Database Connection Issues
If you see database errors but want to use in-memory storage:
- The app should work fine without DATABASE_URL (uses MemStorage)
- Check `server/storage.ts` - it currently uses in-memory storage

### TypeScript Errors
Run type checking:
```bash
npm run check
```

### Dependencies Issues
Clear node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📄 License

MIT

