-- Add food_preference column to guest_registrations

ALTER TABLE public.guest_registrations
  ADD COLUMN IF NOT EXISTS food_preference TEXT;

