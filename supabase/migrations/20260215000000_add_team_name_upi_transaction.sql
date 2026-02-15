-- Add team name fields and UPI transaction ID to guest_registrations

ALTER TABLE public.guest_registrations
  ADD COLUMN IF NOT EXISTS event_1_team_name TEXT,
  ADD COLUMN IF NOT EXISTS event_2_team_name TEXT,
  ADD COLUMN IF NOT EXISTS upi_transaction_id TEXT;

