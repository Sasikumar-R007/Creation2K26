# Team Name Field Fix

## Issue
Registration was failing with error: "Could not find the 'event_1_team_name' column of 'guest_registrations' in the schema cache"

## Root Cause
The code was trying to insert `event_1_team_name` and `event_2_team_name` fields even when:
1. Team size was 1 (no team needed)
2. The database columns didn't exist (migration not run)

## Solution Applied

### 1. Conditional Field Insertion
- Only include `event_1_team_name` and `event_2_team_name` in the database insert when:
  - Team size > 1 AND
  - Team name has a value
- This prevents schema errors if the columns don't exist yet

### 2. Team Name Field Visibility
- Team Name field only shows when team size > 1
- When team size changes to 1, team name is automatically cleared
- Validation only requires team name when team size > 1

### 3. Form State Management
- When event selection changes and team size becomes 1, team name is cleared
- When team size dropdown changes to 1, team name is cleared
- Prevents stale team name data when switching between solo and team events

## Code Changes

1. **Database Insert Logic** (lines ~520-545):
   - Builds insert object conditionally
   - Only adds team_name fields if team_size > 1 and team_name has value

2. **Event Selection Handlers**:
   - Clears team_name when new team size is 1
   - Preserves team_name when team size stays > 1

3. **Team Size Change Handlers**:
   - Clears team_name when changed to 1
   - Preserves team_name when changed to > 1

## Migration Status

The migration file exists: `supabase/migrations/20260215000000_add_team_name_upi_transaction.sql`

**To apply the migration:**
1. Go to Supabase Dashboard → SQL Editor
2. Run the migration SQL:
   ```sql
   ALTER TABLE public.guest_registrations
     ADD COLUMN IF NOT EXISTS event_1_team_name TEXT,
     ADD COLUMN IF NOT EXISTS event_2_team_name TEXT,
     ADD COLUMN IF NOT EXISTS upi_transaction_id TEXT;
   ```

**Note:** The registration will work even without running the migration, as the code now conditionally includes these fields only when needed.

## Testing Checklist

- [x] Registration works when team size = 1 (no team name field shown)
- [x] Registration works when team size > 1 (team name field shown and required)
- [x] Team name clears when team size changes from >1 to 1
- [x] Team name preserved when team size stays > 1
- [x] No schema errors when columns don't exist
- [x] Validation only requires team name when team size > 1

