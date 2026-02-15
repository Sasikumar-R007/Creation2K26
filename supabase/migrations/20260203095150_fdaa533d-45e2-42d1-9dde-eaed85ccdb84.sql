-- =============================================
-- CREATION 2K26 - Complete Database Schema
-- (Safe to re-run: enums and tables are idempotent)
-- =============================================

-- 1. Create Enums (skip if already exist)
DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('participant', 'student_incharge', 'creation_admin');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
    CREATE TYPE public.event_category AS ENUM ('technical', 'non_technical');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
    CREATE TYPE public.message_type AS ENUM ('announcement', 'event_update', 'global');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- 2. Create Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    department TEXT,
    college TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. Create User Roles Table (CRITICAL: Separate from profiles for security)
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'participant',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- 4. Create Events Table
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    rules TEXT NOT NULL,
    category event_category NOT NULL,
    icon_name TEXT NOT NULL,
    accent_color TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 5. Create Student Incharges Table
CREATE TABLE IF NOT EXISTS public.student_incharges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL UNIQUE,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 6. Create Event Registrations Table
CREATE TABLE IF NOT EXISTS public.event_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    registered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, event_id)
);

-- 7. Create Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    message_type message_type NOT NULL DEFAULT 'announcement',
    is_global BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 8. Create Winners Table
CREATE TABLE IF NOT EXISTS public.winners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    position INTEGER NOT NULL CHECK (position IN (1, 2, 3)),
    declared_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    declared_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (event_id, position)
);

-- =============================================
-- SECURITY DEFINER FUNCTIONS
-- =============================================

-- Function to check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
          AND role = _role
    )
$$;

-- Function to check if user is an event incharge
CREATE OR REPLACE FUNCTION public.is_event_incharge(_user_id UUID, _event_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.student_incharges
        WHERE user_id = _user_id
          AND event_id = _event_id
    )
$$;

-- Function to get user's primary role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT role
    FROM public.user_roles
    WHERE user_id = _user_id
    ORDER BY 
        CASE role 
            WHEN 'creation_admin' THEN 1 
            WHEN 'student_incharge' THEN 2 
            ELSE 3 
        END
    LIMIT 1
$$;

-- Function to check if user is registered for an event
CREATE OR REPLACE FUNCTION public.is_registered_for_event(_user_id UUID, _event_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.event_registrations
        WHERE user_id = _user_id
          AND event_id = _event_id
    )
$$;

-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_incharges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.winners ENABLE ROW LEVEL SECURITY;

-- Drop policies if they exist (so migration is re-runnable)
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own role" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "System can insert roles on signup" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Anyone can view events" ON public.events;
DROP POLICY IF EXISTS "Admins can manage events" ON public.events;
DROP POLICY IF EXISTS "Anyone can view incharges" ON public.student_incharges;
DROP POLICY IF EXISTS "Admins can manage incharges" ON public.student_incharges;
DROP POLICY IF EXISTS "Users can view own registrations" ON public.event_registrations;
DROP POLICY IF EXISTS "ICs can view registrations for their event" ON public.event_registrations;
DROP POLICY IF EXISTS "Admins can view all registrations" ON public.event_registrations;
DROP POLICY IF EXISTS "Users can register for events" ON public.event_registrations;
DROP POLICY IF EXISTS "Users can unregister from events" ON public.event_registrations;
DROP POLICY IF EXISTS "Users can view global messages" ON public.messages;
DROP POLICY IF EXISTS "Users can view messages for their registered events" ON public.messages;
DROP POLICY IF EXISTS "ICs can send messages to their event" ON public.messages;
DROP POLICY IF EXISTS "Admins can send global messages" ON public.messages;
DROP POLICY IF EXISTS "Admins can view all messages" ON public.messages;
DROP POLICY IF EXISTS "ICs can view all messages for their event" ON public.messages;
DROP POLICY IF EXISTS "Anyone can view winners" ON public.winners;
DROP POLICY IF EXISTS "ICs can declare winners for their event" ON public.winners;
DROP POLICY IF EXISTS "ICs can update winners for their event" ON public.winners;
DROP POLICY IF EXISTS "Admins can manage all winners" ON public.winners;

-- PROFILES POLICIES
CREATE POLICY "Anyone can view profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- USER ROLES POLICIES
CREATE POLICY "Users can view own role"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'creation_admin'));

CREATE POLICY "System can insert roles on signup"
ON public.user_roles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'creation_admin'));

-- EVENTS POLICIES (Public read access)
CREATE POLICY "Anyone can view events"
ON public.events FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admins can manage events"
ON public.events FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'creation_admin'));

-- STUDENT INCHARGES POLICIES
CREATE POLICY "Anyone can view incharges"
ON public.student_incharges FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admins can manage incharges"
ON public.student_incharges FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'creation_admin'));

-- EVENT REGISTRATIONS POLICIES
CREATE POLICY "Users can view own registrations"
ON public.event_registrations FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "ICs can view registrations for their event"
ON public.event_registrations FOR SELECT
TO authenticated
USING (public.is_event_incharge(auth.uid(), event_id));

CREATE POLICY "Admins can view all registrations"
ON public.event_registrations FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'creation_admin'));

CREATE POLICY "Users can register for events"
ON public.event_registrations FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unregister from events"
ON public.event_registrations FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- MESSAGES POLICIES
CREATE POLICY "Users can view global messages"
ON public.messages FOR SELECT
TO authenticated
USING (is_global = true);

CREATE POLICY "Users can view messages for their registered events"
ON public.messages FOR SELECT
TO authenticated
USING (
    event_id IS NOT NULL 
    AND public.is_registered_for_event(auth.uid(), event_id)
);

CREATE POLICY "ICs can send messages to their event"
ON public.messages FOR INSERT
TO authenticated
WITH CHECK (
    auth.uid() = sender_id 
    AND (
        public.is_event_incharge(auth.uid(), event_id)
        OR public.has_role(auth.uid(), 'creation_admin')
    )
);

CREATE POLICY "Admins can send global messages"
ON public.messages FOR INSERT
TO authenticated
WITH CHECK (
    auth.uid() = sender_id 
    AND public.has_role(auth.uid(), 'creation_admin')
);

CREATE POLICY "Admins can view all messages"
ON public.messages FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'creation_admin'));

CREATE POLICY "ICs can view all messages for their event"
ON public.messages FOR SELECT
TO authenticated
USING (public.is_event_incharge(auth.uid(), event_id));

-- WINNERS POLICIES
CREATE POLICY "Anyone can view winners"
ON public.winners FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "ICs can declare winners for their event"
ON public.winners FOR INSERT
TO authenticated
WITH CHECK (
    public.is_event_incharge(auth.uid(), event_id)
    AND auth.uid() = declared_by
);

CREATE POLICY "ICs can update winners for their event"
ON public.winners FOR UPDATE
TO authenticated
USING (public.is_event_incharge(auth.uid(), event_id));

CREATE POLICY "Admins can manage all winners"
ON public.winners FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'creation_admin'));

-- =============================================
-- TRIGGERS
-- =============================================

-- Auto-update updated_at on profiles
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile and default role on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, name, email)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        NEW.email
    );
    
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'participant');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- SEED DATA: 10 EVENTS (only if table is empty)
-- =============================================

INSERT INTO public.events (name, description, rules, category, icon_name, accent_color)
SELECT * FROM (VALUES
-- Technical Events (Cyan accent)
('Quiz', 'Test your knowledge across multiple domains including technology, science, and general awareness. Battle it out with the brightest minds!', 
 '• Team of 2 members\n• Three rounds: Prelims, Semi-finals, Finals\n• No electronic devices allowed\n• Time limit per question: 30 seconds\n• Decision of quiz master is final', 
 'technical'::event_category, 'Brain', '185 100% 50%'),

('Paper Presentation', 'Present your innovative research and ideas to a panel of expert judges. Showcase your technical prowess and communication skills!', 
 '• Team of 1-3 members\n• Presentation time: 8-10 minutes\n• Q&A session: 5 minutes\n• Topics: AI/ML, IoT, Cybersecurity, Cloud Computing\n• PPT must be submitted 24 hours prior', 
 'technical'::event_category, 'FileText', '185 100% 50%'),

('Debugging', 'Find and fix bugs in code snippets across multiple programming languages. Race against time to prove your debugging skills!', 
 '• Individual participation\n• Languages: C, Python, Java, JavaScript\n• Time limit: 45 minutes\n• 10 bugs to find and fix\n• Partial marking available', 
 'technical'::event_category, 'Bug', '185 100% 50%'),

('Web Design', 'Create stunning, responsive websites from scratch. Let your creativity flow through code and design!', 
 '• Individual or team of 2\n• Time limit: 2 hours\n• Theme revealed on spot\n• Use of frameworks allowed\n• Judged on creativity, responsiveness, and code quality', 
 'technical'::event_category, 'Globe', '185 100% 50%'),

('AI Prompt Engineering', 'Master the art of crafting effective prompts for AI systems. Unleash the power of language models!', 
 '• Individual participation\n• Multiple AI challenges\n• Time limit: 1 hour\n• Judged on output quality and creativity\n• No prior prompt templates allowed', 
 'technical'::event_category, 'Sparkles', '185 100% 50%'),

-- Non-Technical Events (Purple accent)
('Ad Zap', 'Create compelling advertisements for fictional products. Show off your marketing genius and creative flair!', 
 '• Team of 2-4 members\n• Product revealed on spot\n• Preparation time: 30 minutes\n• Performance time: 3-5 minutes\n• Props allowed', 
 'non_technical'::event_category, 'Megaphone', '280 100% 65%'),

('Personality Contest', 'Showcase your personality, talent, and confidence. The stage is yours to shine!', 
 '• Individual participation\n• Three rounds: Introduction, Talent, Q&A\n• Dress code: Formal/Semi-formal\n• Talent round: 2-3 minutes\n• Judged on confidence, presentation, and overall personality', 
 'non_technical'::event_category, 'Crown', '280 100% 65%'),

('Memory Matrix', 'Test your memory power with challenging pattern recognition and recall tasks. How sharp is your mind?', 
 '• Individual participation\n• Multiple rounds with increasing difficulty\n• Categories: Numbers, Words, Patterns, Sequences\n• No writing materials allowed\n• Fastest correct answer wins tiebreakers', 
 'non_technical'::event_category, 'Grid3X3', '280 100% 65%'),

('IPL Auction', 'Build your dream cricket team with a virtual budget. Strategy and cricket knowledge combine!', 
 '• Team of 3-4 members\n• Virtual budget: ₹100 crores\n• Player pool provided\n• Strategy planning: 15 minutes\n• Best balanced team wins', 
 'non_technical'::event_category, 'CircleDollarSign', '280 100% 65%'),

('Movie Spoofing', 'Recreate iconic movie scenes with a hilarious twist. Entertainment at its finest!', 
 '• Team of 4-6 members\n• Scene assigned beforehand\n• Performance time: 5-8 minutes\n• Props and costumes allowed\n• Judged on creativity, humor, and teamwork', 
 'non_technical'::event_category, 'Film', '280 100% 65%')
) AS v(name, description, rules, category, icon_name, accent_color)
WHERE (SELECT COUNT(*) FROM public.events) = 0;

-- Enable realtime for messages and registrations
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.event_registrations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.winners;