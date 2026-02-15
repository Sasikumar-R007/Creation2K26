-- Fix: Events dropdown is empty
-- Run this in Supabase SQL Editor

-- Step 1: Check if events exist
SELECT COUNT(*) as event_count FROM public.events;

-- Step 2: If count is 0, insert events
-- This will only insert if table is empty (safe to run multiple times)

INSERT INTO public.events (name, description, rules, category, icon_name, accent_color)
SELECT * FROM (VALUES
-- Technical Events
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

-- Non-Technical Events
('Ad Zap', 'Create compelling advertisements for fictional products. Show off your marketing genius and creative flair!', 
 '• Team of 2-4 members\n• Product revealed on spot\n• Preparation time: 30 minutes\n• Performance time: 3-5 minutes\n• Props allowed', 
 'non_technical'::event_category, 'Megaphone', '280 100% 60%'),

('IPL Auction', 'Participate in a mock IPL auction. Bid strategically and build your dream team!', 
 '• Team of 2-3 members\n• Virtual budget provided\n• Time limit: 1.5 hours\n• Strategy and negotiation skills tested\n• Points for team balance', 
 'non_technical'::event_category, 'Trophy', '280 100% 60%'),

('Movie Spoofing', 'Recreate and parody famous movie scenes with your own creative twist. Lights, camera, action!', 
 '• Team of 3-5 members\n• Scene selection on spot\n• Preparation time: 45 minutes\n• Performance time: 5-7 minutes\n• Props and costumes allowed', 
 'non_technical'::event_category, 'Film', '280 100% 60%'),

('Personality Contest', 'Showcase your personality, confidence, and stage presence. Be yourself and shine!', 
 '• Individual participation\n• Multiple rounds: Introduction, Talent, Q&A\n• Judged on confidence, communication, and personality\n• Formal attire required', 
 'non_technical'::event_category, 'User', '280 100% 60%'),

('Memory Matrix', 'Test your memory and pattern recognition skills. How much can you remember?', 
 '• Individual participation\n• Multiple rounds with increasing difficulty\n• Time-based challenges\n• Visual and auditory memory tests\n• Fastest and most accurate wins', 
 'non_technical'::event_category, 'Brain', '280 100% 60%')
) AS v(name, description, rules, category, icon_name, accent_color)
WHERE NOT EXISTS (SELECT 1 FROM public.events);

-- Step 3: Verify events were inserted
SELECT id, name, category FROM public.events ORDER BY category, name;

-- Step 4: Verify RLS policy allows anonymous access
-- This should return true
SELECT EXISTS (
  SELECT 1 FROM pg_policies 
  WHERE tablename = 'events' 
  AND policyname = 'Anyone can view events'
  AND 'anon' = ANY(roles::text[])
) as anon_can_read_events;

