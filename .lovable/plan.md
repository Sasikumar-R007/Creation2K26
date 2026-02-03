

# CREATION 2K26 - Implementation Plan

## Overview
Building a premium, dark-themed symposium website with role-based authentication, real-time messaging, and stunning UI/UX for 10 events (5 technical + 5 non-technical).

---

## Phase 1: Database Schema & Security Architecture

### Database Tables to Create

**1. Profiles Table** - Store user profile information
- `id` (uuid, references auth.users)
- `name` (text)
- `email` (text)
- `department` (text, nullable)
- `college` (text, nullable)
- `avatar_url` (text, nullable)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**2. User Roles Table** - Separate role storage (security best practice)
- `id` (uuid)
- `user_id` (uuid, references auth.users)
- `role` (enum: 'participant', 'student_incharge', 'creation_admin')
- Unique constraint on (user_id, role)

**3. Events Table** - All 10 events
- `id` (uuid)
- `name` (text)
- `description` (text)
- `rules` (text)
- `category` (enum: 'technical', 'non_technical')
- `icon_name` (text) - Lucide icon name
- `accent_color` (text) - HSL color for theming
- `created_at` (timestamp)

**4. Student Incharges Table** - IC assignments
- `id` (uuid)
- `user_id` (uuid, references auth.users)
- `event_id` (uuid, references events)
- `name` (text)
- Unique constraint on event_id (one IC per event)

**5. Event Registrations Table** - Participant registrations
- `id` (uuid)
- `user_id` (uuid, references auth.users)
- `event_id` (uuid, references events)
- `registered_at` (timestamp)
- Unique constraint on (user_id, event_id)

**6. Messages Table** - Real-time messaging system
- `id` (uuid)
- `sender_id` (uuid, references auth.users)
- `event_id` (uuid, nullable - for event-specific messages)
- `content` (text)
- `message_type` (enum: 'announcement', 'event_update', 'global')
- `is_global` (boolean)
- `created_at` (timestamp)

**7. Winners Table** - Prize winners
- `id` (uuid)
- `event_id` (uuid, references events)
- `user_id` (uuid, references auth.users)
- `position` (integer: 1, 2, or 3)
- `declared_by` (uuid, references auth.users)
- `declared_at` (timestamp)

### Security Functions (SECURITY DEFINER)
- `has_role(user_id, role)` - Check if user has specific role
- `is_event_incharge(user_id, event_id)` - Check if user is IC for event
- `get_user_role(user_id)` - Get user's primary role

### Row Level Security Policies
- Profiles: Users can read all, update own
- User Roles: Only admins can modify, authenticated can read own
- Events: Public read access
- Registrations: Participants manage own, ICs/Admins view all
- Messages: Based on event registration and role
- Winners: ICs can set for their event, admins full access

---

## Phase 2: Design System & Theme

### Color Palette (Dark Theme with Neon Accents)
```css
--background: 230 25% 5%        /* Deep dark blue-black */
--foreground: 210 40% 98%       /* Off-white text */
--neon-cyan: 185 100% 50%       /* Electric cyan accent */
--neon-purple: 280 100% 65%     /* Neon purple */
--neon-gold: 45 100% 60%        /* Gold highlights */
--glass: 230 25% 12%            /* Glassmorphism panels */
--technical: 185 100% 50%       /* Technical events color */
--non-technical: 280 100% 65%   /* Non-technical events color */
```

### Custom Animations
- `glow-pulse` - Neon pulsing effect
- `float` - Subtle floating animation for cards
- `gradient-shift` - Moving gradient backgrounds
- `slide-up` - Entrance animations
- `shimmer` - Loading states

### Typography
- Headings: Bold, gradient text with glow effects
- Body: Clean, readable with proper contrast

---

## Phase 3: Component Architecture

### Layout Components
1. **Navbar** - Sticky, glassmorphism, animated
   - Logo + Event name
   - Navigation links
   - Auth status/buttons
   - Mobile hamburger menu

2. **Footer** - Event info, social links

3. **PageWrapper** - Consistent page transitions

### UI Components
1. **EventCard** - Premium card with:
   - Icon + gradient border
   - Hover glow effect
   - Category badge (Tech/Non-Tech)
   - Click to open modal

2. **EventModal** - Full event details:
   - Description, rules
   - IC name
   - Register button
   - Animated entrance

3. **GlassPanel** - Glassmorphism container

4. **NeonButton** - Glowing CTA buttons

5. **NotificationBadge** - Unread message indicator

6. **DashboardCard** - Stats and info cards

7. **MessageCard** - Message display with timestamp

8. **ParticipantTable** - Data table for IC/Admin views

### Form Components
1. **AuthForm** - Login/Signup with validation
2. **RegistrationForm** - Event registration
3. **MessageForm** - Send announcements
4. **WinnerForm** - Declare winners

---

## Phase 4: Pages & Routes

### Public Pages
1. **/ (Home/Landing)**
   - Hero section with animated title
   - Countdown timer to event
   - Events grid (5 Tech + 5 Non-Tech)
   - About section
   - Contact/Venue info

2. **/auth**
   - Login tab
   - Signup tab (with role selection)
   - Forgot password

### Protected Pages (Role-Based)

**Participant Dashboard (/dashboard)**
- Welcome message
- Registered events list
- Messages/Announcements panel
- Quick register to more events

**Student Incharge Dashboard (/ic-dashboard)**
- Event overview
- Participant list for their event
- Send messages to participants
- Declare winners (1st, 2nd, 3rd)

**Admin Dashboard (/admin)**
- All events overview
- All registrations with filters
- All ICs list
- Global announcements
- View all winners
- Statistics cards

---

## Phase 5: Authentication Flow

### Sign Up Flow
1. User fills: Name, Email, Password, Department, College
2. Role selection: Participant (default) | Student Incharge (with event + secret code)
3. Email confirmation (can be disabled in Supabase for testing)
4. Profile creation trigger
5. Redirect to appropriate dashboard

### Sign In Flow
1. Email + Password
2. Fetch user role
3. Redirect based on role:
   - Participant → /dashboard
   - Student Incharge → /ic-dashboard
   - Admin → /admin

### Admin Account
- Pre-seeded in database
- Special login path or same form with admin role check

---

## Phase 6: Real-Time Features

### Supabase Realtime Subscriptions
1. **Messages channel** - New announcements
2. **Registrations channel** - New signups (for IC/Admin)
3. **Winners channel** - Winner declarations

### Notification System
- Toast notifications for new messages
- Badge count in navbar
- Dashboard notification panel

---

## Phase 7: File Structure

```text
src/
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── PageWrapper.tsx
│   ├── events/
│   │   ├── EventCard.tsx
│   │   ├── EventModal.tsx
│   │   ├── EventsGrid.tsx
│   │   └── EventDetails.tsx
│   ├── dashboard/
│   │   ├── DashboardCard.tsx
│   │   ├── MessagePanel.tsx
│   │   ├── ParticipantTable.tsx
│   │   └── WinnerSelector.tsx
│   ├── auth/
│   │   ├── AuthForm.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── RoleGuard.tsx
│   └── ui/
│       ├── ... (existing)
│       ├── glass-panel.tsx
│       └── neon-button.tsx
├── contexts/
│   └── AuthContext.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useEvents.ts
│   ├── useMessages.ts
│   ├── useRegistrations.ts
│   └── useRealtime.ts
├── pages/
│   ├── Index.tsx (Landing)
│   ├── Auth.tsx
│   ├── Dashboard.tsx (Participant)
│   ├── ICDashboard.tsx
│   ├── AdminDashboard.tsx
│   └── NotFound.tsx
├── lib/
│   ├── utils.ts
│   └── constants.ts (events data)
└── types/
    └── index.ts
```

---

## Phase 8: Events Data

### Technical Events (Cyan/Blue accent)
1. **Quiz** - Test your knowledge
2. **Paper Presentation** - Present your research
3. **Debugging** - Find and fix bugs
4. **Web Design** - Create stunning websites
5. **AI Prompt Engineering** - Master AI prompts

### Non-Technical Events (Purple/Pink accent)
1. **Ad Zap** - Creative advertising
2. **Personality Contest** - Showcase yourself
3. **Memory Matrix** - Test your memory
4. **IPL Auction** - Strategic bidding game
5. **Movie Spoofing** - Entertainment and fun

---

## Implementation Order

### Step 1: Database Setup
- Create all tables with migrations
- Set up RLS policies
- Create security functions
- Seed events data

### Step 2: Theme & Base UI
- Update CSS variables for dark theme
- Add custom animations
- Create GlassPanel, NeonButton components

### Step 3: Landing Page
- Build hero section
- Create EventCard component
- Build events grid
- Add animations and interactions

### Step 4: Authentication
- Create AuthContext
- Build Auth page with forms
- Implement ProtectedRoute
- Set up role-based routing

### Step 5: Participant Dashboard
- Dashboard layout
- Registered events display
- Messages panel
- Event registration flow

### Step 6: IC Dashboard
- Event management view
- Participants list
- Message sending
- Winner declaration

### Step 7: Admin Dashboard
- Overview statistics
- All events management
- Global messaging
- Full participant view

### Step 8: Real-Time Features
- Set up Supabase subscriptions
- Notification system
- Live updates

---

## Technical Notes

### Key Security Measures
- Roles stored in separate `user_roles` table (not in profiles)
- Security definer functions for role checks
- RLS policies on all tables
- Server-side role validation (never trust client)

### Performance Optimizations
- React Query for data caching
- Optimistic updates for better UX
- Lazy loading for dashboard components

### Responsive Design
- Mobile-first approach
- Hamburger menu on mobile
- Touch-friendly event cards
- Responsive dashboard grids

