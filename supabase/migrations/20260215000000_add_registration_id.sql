-- Add registration_id column to guest_registrations table
-- This will store the formatted registration ID (e.g., CN2K26P001)

ALTER TABLE public.guest_registrations
  ADD COLUMN IF NOT EXISTS registration_id TEXT UNIQUE;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_guest_registrations_registration_id 
  ON public.guest_registrations(registration_id);

-- Function to generate registration ID
CREATE OR REPLACE FUNCTION generate_registration_id()
RETURNS TEXT AS $$
DECLARE
  next_num INTEGER;
  reg_id TEXT;
BEGIN
  -- Get the next sequence number
  SELECT COALESCE(MAX(
    CAST(SUBSTRING(registration_id FROM 8) AS INTEGER)
  ), 0) + 1
  INTO next_num
  FROM public.guest_registrations
  WHERE registration_id IS NOT NULL
    AND registration_id ~ '^CN2K26P\d{3}$';
  
  -- Generate ID in format: CN2K26P001
  reg_id := 'CN2K26P' || LPAD(next_num::TEXT, 3, '0');
  
  RETURN reg_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate registration_id on insert
CREATE OR REPLACE FUNCTION set_registration_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.registration_id IS NULL THEN
    NEW.registration_id := generate_registration_id();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_registration_id ON public.guest_registrations;
CREATE TRIGGER trigger_set_registration_id
  BEFORE INSERT ON public.guest_registrations
  FOR EACH ROW
  EXECUTE FUNCTION set_registration_id();

