// CREATION 2K26 Types

export type AppRole = 'participant' | 'student_incharge' | 'creation_admin';
export type EventCategory = 'technical' | 'non_technical';
export type MessageType = 'announcement' | 'event_update' | 'global';

export interface Profile {
  id: string;
  name: string;
  email: string;
  department: string | null;
  college: string | null;
  whatsapp_phone: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  rules: string;
  category: EventCategory;
  icon_name: string;
  accent_color: string;
  created_at: string;
}

export interface StudentIncharge {
  id: string;
  user_id: string;
  event_id: string;
  name: string;
  created_at: string;
}

export interface EventRegistration {
  id: string;
  user_id: string;
  event_id: string;
  registered_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  event_id: string | null;
  content: string;
  message_type: MessageType;
  is_global: boolean;
  created_at: string;
}

export interface Winner {
  id: string;
  event_id: string;
  user_id: string;
  position: 1 | 2 | 3;
  declared_by: string | null;
  declared_at: string;
}

// Extended types with relations
export interface EventWithIncharge extends Event {
  student_incharges?: StudentIncharge[];
}

export interface RegistrationWithEvent extends EventRegistration {
  events?: Event;
}

export interface MessageWithSender extends Message {
  profiles?: Profile;
  events?: Event;
}

export interface WinnerWithDetails extends Winner {
  profiles?: Profile;
  events?: Event;
}

// Auth context types
export interface AuthUser {
  id: string;
  email: string;
  profile: Profile | null;
  role: AppRole;
}
