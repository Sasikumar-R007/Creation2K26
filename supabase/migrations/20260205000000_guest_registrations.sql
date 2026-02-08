-- Guest event registrations (no auth required)
-- Stores name, contact info, and up to 2 event choices for symposium registration.

CREATE TABLE IF NOT EXISTS public.guest_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    whatsapp_phone TEXT,
    department TEXT,
    college TEXT,
    event_1_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    event_2_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.guest_registrations ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (public registration form)
DROP POLICY IF EXISTS "Allow anon insert for guest registrations" ON public.guest_registrations;
CREATE POLICY "Allow anon insert for guest registrations"
ON public.guest_registrations FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only admins can read
DROP POLICY IF EXISTS "Admins can view guest registrations" ON public.guest_registrations;
CREATE POLICY "Admins can view guest registrations"
ON public.guest_registrations FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'creation_admin'));
