-- Add team size, team members, and payment screenshot to guest_registrations

ALTER TABLE public.guest_registrations
  ADD COLUMN IF NOT EXISTS event_1_team_size INTEGER,
  ADD COLUMN IF NOT EXISTS event_2_team_size INTEGER,
  ADD COLUMN IF NOT EXISTS team_members JSONB,
  ADD COLUMN IF NOT EXISTS payment_screenshot_url TEXT;

-- Payment screenshots: Create bucket "payment-screenshots" in Supabase Dashboard > Storage
-- Set public: true, allowed MIME: image/jpeg, image/png, image/webp, max size: 5MB
