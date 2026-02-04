-- Add WhatsApp phone number to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS whatsapp_phone TEXT;

-- Update trigger to set department, college, whatsapp_phone from signup metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, name, email, department, college, whatsapp_phone)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        NEW.email,
        NEW.raw_user_meta_data->>'department',
        NEW.raw_user_meta_data->>'college',
        NEW.raw_user_meta_data->>'whatsapp_phone'
    );
    
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'participant');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
