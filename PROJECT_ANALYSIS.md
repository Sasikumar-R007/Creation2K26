# CREATION 2K26 NEXUS - Project Analysis

## 📋 Project Overview

**CREATION 2K26 NEXUS** is a comprehensive event management web application built for a college technical/cultural festival called "Creation 2K26". The application handles event registrations, user management, messaging, and administrative tasks for a multi-event competition platform.

### Event Details
- **Event Date**: February 25, 2026, 9:00 AM
- **Venue**: Bishop Heber College, Trichy - 620 017, Tamil Nadu
- **Total Events**: 10 events (mix of technical and non-technical)

---

## 🏗️ Technology Stack

### Frontend
- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 5.4.19
- **UI Library**: shadcn/ui (Radix UI components)
- **Styling**: Tailwind CSS 3.4.17
- **Routing**: React Router DOM 6.30.1
- **State Management**: React Context API
- **Data Fetching**: TanStack React Query 5.83.0
- **Form Handling**: React Hook Form 7.61.1 with Zod validation
- **Icons**: Lucide React

### Backend & Database
- **Backend**: Supabase (PostgreSQL database + Authentication)
- **Project ID**: hqkrexlemuhgwbblbbkn
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth (email/password)

### Development Tools
- **Testing**: Vitest + React Testing Library
- **Linting**: ESLint
- **Package Manager**: npm (also has bun.lockb)
- **Deployment**: Vercel (configured)

---

## 📁 Project Structure

```
creation-2k26-nexus/
├── public/                    # Static assets (images, favicon, etc.)
├── src/
│   ├── components/            # React components
│   │   ├── auth/             # Authentication components
│   │   ├── dashboard/        # Dashboard-specific components
│   │   ├── events/           # Event-related components
│   │   ├── landing/          # Landing page sections
│   │   ├── layout/           # Layout components (Navbar, Footer)
│   │   └── ui/               # shadcn/ui components (50+ components)
│   ├── contexts/             # React Context providers
│   │   ├── AuthContext.tsx   # Authentication state management
│   │   └── RegistrationModalContext.tsx
│   ├── hooks/                # Custom React hooks
│   │   ├── useEvents.ts      # Event data fetching
│   │   ├── useMessages.ts    # Messages handling
│   │   └── useRegistrations.ts # Registration management
│   ├── integrations/         # Third-party integrations
│   │   └── supabase/         # Supabase client & types
│   ├── lib/                  # Utility functions & constants
│   │   ├── constants.ts      # App constants (events, rules, etc.)
│   │   ├── eventParticipation.ts
│   │   └── utils.ts          # Helper functions
│   ├── pages/                # Page components
│   │   ├── Index.tsx         # Landing page
│   │   ├── Register.tsx      # Registration page
│   │   ├── Dashboard.tsx     # Participant dashboard
│   │   ├── ICDashboard.tsx   # Student Incharge dashboard
│   │   ├── AdminDashboard.tsx # Admin dashboard
│   │   ├── AdminLogin.tsx    # Admin login page
│   │   ├── Auth.tsx          # Authentication page
│   │   └── NotFound.tsx      # 404 page
│   ├── types/                # TypeScript type definitions
│   ├── App.tsx               # Main app component with routing
│   └── main.tsx              # Application entry point
├── supabase/
│   ├── migrations/           # Database migrations (4 files)
│   ├── email-templates/      # Email templates for auth
│   └── config.toml           # Supabase configuration
├── scripts/                  # Utility scripts
│   └── seed-admin-ic-users.mjs # Script to seed admin/IC users
├── package.json              # Dependencies & scripts
├── vite.config.ts            # Vite configuration
├── tailwind.config.ts        # Tailwind CSS configuration
└── tsconfig.json             # TypeScript configuration
```

---

## 🎯 Core Features

### 1. **User Roles & Authentication**
   - **Three Role Types**:
     - `participant`: Regular users who can register for events
     - `student_incharge`: Event coordinators (one per event)
     - `creation_admin`: Super admin with full access
   - **Authentication**: Email/password with Supabase Auth
   - **Protected Routes**: Role-based route protection

### 2. **Event Management**
   - **10 Events**:
     - **Technical Events**:
       - Quiz (Techno Quest)
       - Paper Presentation (Inno Script)
       - Debugging (Quantum Fix)
       - Web Design (Web Forge)
       - AI Prompt Engineering (Un Prompt)
     - **Non-Technical Events**:
       - Ad Zap (Ad Mad)
       - Personality Contest (Persona League)
       - Memory Matrix (Brain Blitz)
       - IPL Auction (Hammer Time)
       - Movie Spoofing (Mockumentary)
   
   - **Event Features**:
     - Event descriptions, rules, and icons
     - Category classification (technical/non-technical)
     - Custom accent colors per event
     - Team size limits (1-5 members depending on event)
     - Event conflict rules (prevents conflicting registrations)

### 3. **Registration System**
   - **Participant Registration**:
     - Register for up to 2 events
     - Conflict detection (prevents incompatible event combinations)
     - Team registration support (varies by event)
   
   - **Guest Registration**:
     - Guest users can register without full account
     - Supports team registrations
     - Payment tracking for guest teams

### 4. **Dashboard Features**
   - **Participant Dashboard**:
     - View registered events
     - Unregister from events
     - View messages/announcements
     - Profile management
   
   - **Student Incharge Dashboard**:
     - Manage event participants
     - Send event-specific messages
     - View registrations for their event
   
   - **Admin Dashboard**:
     - Full system management
     - All user management
     - All event management
     - Global messaging

### 5. **Messaging System**
   - **Message Types**:
     - `announcement`: General announcements
     - `event_update`: Event-specific updates
     - `global`: System-wide messages
   - Role-based message visibility
   - Real-time message display

### 6. **Event Conflict Rules**
   The system enforces participation rules to prevent scheduling conflicts:
   - **Group 1** (Mutually Exclusive): Quiz, Personality Contest, Memory Matrix, AI Prompt, Paper Presentation, Debugging
   - **Group 2** (Mutually Exclusive): Web Design, IPL Auction, Ad Zap, Movie Spoofing
   - Users can participate in one event from Group 1 and one from Group 2

---

## 🗄️ Database Schema

The application uses Supabase (PostgreSQL) with the following main tables:

1. **profiles**: User profile information
   - id, name, email, department, college, whatsapp_phone, avatar_url

2. **user_roles**: Role assignments
   - user_id, role (participant/student_incharge/creation_admin)

3. **events**: Event information
   - id, name, description, rules, category, icon_name, accent_color

4. **student_incharges**: Event coordinator assignments
   - user_id, event_id, name

5. **event_registrations**: Participant event registrations
   - user_id, event_id, registered_at

6. **guest_registrations**: Guest user registrations
   - name, email, whatsapp_phone, department, college, event_1_id, event_2_id

7. **messages**: Announcements and updates
   - sender_id, event_id, content, message_type, is_global

8. **winners**: Event winners tracking
   - event_id, user_id, position (1/2/3), declared_by, declared_at

---

## 🚀 How to Run the Project

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js)
- **Supabase Account** (for database access - already configured)

### Step 1: Install Dependencies

```bash
# Navigate to project directory
cd "C:\Users\sasir\OneDrive\Documents\Sasikumar R\New folder\creation-2k26-nexus"

# Install all dependencies
npm install
```

### Step 2: Environment Setup

The Supabase credentials are already hardcoded in the client file:
- **URL**: `https://hqkrexlemuhgwbblbbkn.supabase.co`
- **Anon Key**: Already configured in `src/integrations/supabase/client.ts`

**Note**: If you need to use a different Supabase project, you'll need to:
1. Update `src/integrations/supabase/client.ts` with your Supabase URL and anon key
2. Run the database migrations in your Supabase project

### Step 3: Run Database Migrations (if needed)

If this is a fresh Supabase project, you need to run the migrations:

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **SQL Editor**
4. Run each migration file in order from `supabase/migrations/`:
   - `20260203095150_fdaa533d-45e2-42d1-9dde-eaed85ccdb84.sql`
   - `20260204000000_add_whatsapp_phone_to_profiles.sql`
   - `20260205000000_guest_registrations.sql`
   - `20260214000000_guest_reg_team_payment.sql`

### Step 4: Seed Admin and IC Users (Optional)

To create admin and student incharge accounts:

```powershell
# In PowerShell (Windows)
$env:SUPABASE_URL="https://hqkrexlemuhgwbblbbkn.supabase.co"
$env:SUPABASE_SERVICE_ROLE_KEY="YOUR_SERVICE_ROLE_KEY"
npm run seed:users
```

**Note**: Get the service role key from Supabase Dashboard → Settings → API → Service Role Key

This creates:
- **Admin**: `Creation_admin@creation2k26.com` / `Creation@123`
- **IC Users**: `<EventName>_admin@creation2k26.com` / `Studentincharge@123`

### Step 5: Start Development Server

```bash
npm run dev
```

The application will start on **http://localhost:8080** (configured in `vite.config.ts`)

### Step 6: Access the Application

- **Landing Page**: http://localhost:8080/
- **Registration**: http://localhost:8080/register
- **Login**: http://localhost:8080/auth
- **Admin Login**: http://localhost:8080/admin-login
- **Dashboard**: http://localhost:8080/dashboard (requires login)
- **IC Dashboard**: http://localhost:8080/ic-dashboard (requires IC role)
- **Admin Dashboard**: http://localhost:8080/admin (requires admin role)

---

## 📜 Available Scripts

```bash
# Development
npm run dev              # Start development server (port 8080)

# Build
npm run build            # Production build
npm run build:dev        # Development build

# Testing
npm run test             # Run tests once
npm run test:watch       # Run tests in watch mode

# Linting
npm run lint             # Run ESLint

# Preview
npm run preview          # Preview production build locally

# Database
npm run seed:users       # Seed admin and IC users (requires env vars)
```

---

## 🔐 Authentication Flow

1. **User Registration**:
   - User signs up with email, password, name, department, college, WhatsApp
   - Supabase creates auth user
   - Database trigger creates profile
   - Default role: `participant`

2. **User Login**:
   - Email/password authentication via Supabase
   - Session stored in localStorage
   - User profile and role fetched from database

3. **Role-Based Access**:
   - Routes protected by `ProtectedRoute` component
   - Checks user role against `allowedRoles` prop
   - Redirects to home if unauthorized

---

## 🎨 UI/UX Features

- **Modern Design**: Glass morphism effects, neon buttons, gradient text
- **Dark Theme**: Default dark mode with theme support
- **Responsive**: Mobile-first design with Tailwind CSS
- **Loading States**: Loading screens during navigation
- **Toast Notifications**: User feedback via Sonner toasts
- **Modal Dialogs**: Event details, registration modals
- **Animations**: Smooth transitions and hover effects

---

## 📦 Key Dependencies

### Core
- `react` & `react-dom`: UI framework
- `react-router-dom`: Client-side routing
- `@supabase/supabase-js`: Backend integration

### UI Components
- `@radix-ui/*`: Headless UI primitives (50+ components)
- `lucide-react`: Icon library
- `tailwindcss`: Utility-first CSS

### Utilities
- `@tanstack/react-query`: Server state management
- `react-hook-form` + `zod`: Form handling & validation
- `date-fns`: Date manipulation
- `clsx` + `tailwind-merge`: Conditional class names

---

## 🔧 Configuration Files

- **`vite.config.ts`**: Vite build configuration (port 8080, path aliases)
- **`tailwind.config.ts`**: Tailwind CSS customization
- **`tsconfig.json`**: TypeScript compiler options
- **`components.json`**: shadcn/ui component configuration
- **`vercel.json`**: Vercel deployment configuration (SPA routing)

---

## 📝 Important Notes

1. **Supabase Configuration**: The Supabase URL and anon key are hardcoded in the client file. For production, consider using environment variables.

2. **Event Conflict Rules**: The system enforces strict participation rules. Make sure to understand these before registering users.

3. **Team Sizes**: Different events have different team size limits (1-5 members).

4. **Guest Registrations**: The system supports guest registrations without full user accounts.

5. **Email Templates**: Custom email templates are configured in `supabase/email-templates/` for authentication emails.

6. **Database Migrations**: Always run migrations in order. The initial migration creates the core schema.

---

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**:
   - Change port in `vite.config.ts` or kill process using port 8080

2. **Supabase Connection Errors**:
   - Verify Supabase URL and anon key in `src/integrations/supabase/client.ts`
   - Check Supabase project status in dashboard

3. **Database Errors**:
   - Ensure all migrations are run
   - Check Supabase database connection

4. **Build Errors**:
   - Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
   - Check Node.js version (should be 18+)

---

## 📚 Additional Resources

- **Supabase Docs**: https://supabase.com/docs
- **React Router**: https://reactrouter.com/
- **shadcn/ui**: https://ui.shadcn.com/
- **Tailwind CSS**: https://tailwindcss.com/
- **Vite**: https://vitejs.dev/

---

## 🎯 Project Status

This appears to be a **production-ready** event management system with:
- ✅ Complete authentication system
- ✅ Role-based access control
- ✅ Event registration with conflict detection
- ✅ Messaging/announcement system
- ✅ Multiple dashboard views
- ✅ Guest registration support
- ✅ Team registration support
- ✅ Responsive UI design

The project is ready for deployment and use for the Creation 2K26 event on February 25, 2026.

