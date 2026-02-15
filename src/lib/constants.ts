// CREATION 2K26 Constants

export const EVENT_DATE = new Date('2026-02-25T09:00:00');

export const VENUE = {
  name: 'Multi-Purpose Auditorium',
  college: 'Bishop Heber College',
  address: 'Trichy - 620 017, Tamil Nadu',
};

export const SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/bca_association_2k25?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
  email: 'bcaassociation2k25@gmail.com',
};

export const IC_SECRET_CODES: Record<string, string> = {
  quiz: 'QUIZ2K26',
  paper_presentation: 'PAPER2K26',
  debugging: 'DEBUG2K26',
  web_design: 'WEB2K26',
  ai_prompt_engineering: 'AIPROMPT2K26',
  ad_zap: 'ADZAP2K26',
  personality_contest: 'PERSONA2K26',
  memory_matrix: 'MEMORY2K26',
  ipl_auction: 'IPL2K26',
  movie_spoofing: 'MOVIE2K26',
};

export const ADMIN_EMAIL = 'admin@creation2k26.com';

/** Maximum number of events a participant can register for */
export const MAX_EVENTS_PER_PARTICIPANT = 2;

// Lucide icon mapping for events
export const EVENT_ICONS = {
  Brain: 'Brain',
  FileText: 'FileText',
  Bug: 'Bug',
  Globe: 'Globe',
  Sparkles: 'Sparkles',
  Megaphone: 'Megaphone',
  Crown: 'Crown',
  Grid3X3: 'Grid3X3',
  CircleDollarSign: 'CircleDollarSign',
  Film: 'Film',
} as const;

export type EventIconName = keyof typeof EVENT_ICONS;

// Event participation conflict rules: one event per conflict group.
// Keys are normalized event names (uppercase). Values list what you CAN and CANNOT participate in if you choose this event.
export const EVENT_PARTICIPATION_RULES: Record<string, { can: string[]; cannot: string[] }> = {
  QUIZ: {
    can: ["WEB DESIGN", "IPL AUCTION", "AD-ZAP", "MOVIE SPOOFING"],
    cannot: ["PERSONALITY CONTEST", "MEMORY MATRIX", "AI PROMPT", "PAPER PRESENTATION", "DEBUGGING"],
  },
  "PERSONALITY CONTEST": {
    can: ["WEB DESIGN", "IPL AUCTION", "AD-ZAP", "MOVIE SPOOFING"],
    cannot: ["QUIZ", "MEMORY MATRIX", "AI PROMPT", "PAPER PRESENTATION", "DEBUGGING"],
  },
  "MEMORY MATRIX": {
    can: ["WEB DESIGN", "IPL AUCTION", "AD-ZAP", "MOVIE SPOOFING"],
    cannot: ["QUIZ", "PERSONALITY CONTEST", "AI PROMPT", "PAPER PRESENTATION", "DEBUGGING"],
  },
  "AI PROMPT": {
    can: ["WEB DESIGN", "IPL AUCTION", "AD-ZAP", "MOVIE SPOOFING"],
    cannot: ["QUIZ", "PERSONALITY CONTEST", "MEMORY MATRIX", "PAPER PRESENTATION", "DEBUGGING"],
  },
  "PAPER PRESENTATION": {
    can: ["WEB DESIGN", "IPL AUCTION", "AD-ZAP", "MOVIE SPOOFING"],
    cannot: ["QUIZ", "PERSONALITY CONTEST", "MEMORY MATRIX", "AI PROMPT", "DEBUGGING"],
  },
  DEBUGGING: {
    can: ["WEB DESIGN", "IPL AUCTION", "AD-ZAP", "MOVIE SPOOFING"],
    cannot: ["QUIZ", "PERSONALITY CONTEST", "MEMORY MATRIX", "AI PROMPT", "PAPER PRESENTATION"],
  },
  "WEB DESIGN": {
    can: ["QUIZ", "PERSONALITY CONTEST", "MEMORY MATRIX", "AI PROMPT", "PAPER PRESENTATION", "DEBUGGING"],
    cannot: ["IPL AUCTION", "AD-ZAP", "MOVIE SPOOFING"],
  },
  "IPL AUCTION": {
    can: ["QUIZ", "PERSONALITY CONTEST", "MEMORY MATRIX", "AI PROMPT", "PAPER PRESENTATION", "DEBUGGING"],
    cannot: ["WEB DESIGN", "AD-ZAP", "MOVIE SPOOFING"],
  },
  "AD-ZAP": {
    can: ["QUIZ", "PERSONALITY CONTEST", "MEMORY MATRIX", "AI PROMPT", "PAPER PRESENTATION", "DEBUGGING"],
    cannot: ["WEB DESIGN", "IPL AUCTION", "MOVIE SPOOFING"],
  },
  "MOVIE SPOOFING": {
    can: ["QUIZ", "PERSONALITY CONTEST", "MEMORY MATRIX", "AI PROMPT", "PAPER PRESENTATION", "DEBUGGING"],
    cannot: ["WEB DESIGN", "IPL AUCTION", "AD-ZAP"],
  },
};

// Map DB/display name variants to rule key (normalized uppercase)
export const EVENT_NAME_TO_RULE_KEY: Record<string, string> = {
  "AI PROMPT ENGINEERING": "AI PROMPT",
  "AD ZAP": "AD-ZAP",
};

/** Event display names and logo paths for cards. Key = normalized event name (uppercase). */
export const EVENT_DISPLAY: Record<
  string,
  { displayName: string; logo: string }
> = {
  "AI PROMPT ENGINEERING": { displayName: "Un Prompt", logo: "/UN PROMPT.jpeg" },
  DEBUGGING: { displayName: "Quantum Fix", logo: "/Quantum Fix.jpeg" },
  "PAPER PRESENTATION": { displayName: "Inno Script", logo: "/Inno Script.jpeg" },
  QUIZ: { displayName: "Techno Quest", logo: "/Techno Quest.jpeg" },
  "WEB DESIGN": { displayName: "Web Forge", logo: "/Web Forge.jpeg" },
  "AD ZAP": { displayName: "Ad Zap", logo: "/Ad Mad.jpeg" },
  "AD-ZAP": { displayName: "Ad Zap", logo: "/Ad Mad.jpeg" },
  "IPL AUCTION": { displayName: "Hammer Time", logo: "/Hammer Time.jpeg" },
  "MEMORY MATRIX": { displayName: "Brain Blitz", logo: "/Brain Blitz.jpeg" },
  "MOVIE SPOOF": { displayName: "Mockumentary", logo: "/Mockumentary.jpeg" },
  "MOVIE SPOOFING": { displayName: "Mockumentary", logo: "/Mockumentary.jpeg" },
  "PERSONALITY CONTEST": { displayName: "Persona League", logo: "/Persona League.jpeg" },
};

/** Event name to max team size. Events not listed default to 1 (solo). */
export const EVENT_TEAM_SIZES: Record<string, number> = {
  "AD ZAP": 5,
  "AD-ZAP": 5,
  "MOVIE SPOOFING": 5,
  "MOVIE SPOOF": 5,
  "PAPER PRESENTATION": 2,
  "IPL AUCTION": 2,
  "MEMORY MATRIX": 2,
  QUIZ: 2,
};

/** Get max team size for an event by name. */
export function getEventTeamSize(eventName: string): number {
  const key = eventName.trim().toUpperCase();
  return EVENT_TEAM_SIZES[key] ?? 1;
}

/** Get display name and logo for an event by its DB name. */
export function getEventDisplay(eventName: string): {
  displayName: string;
  logo: string | null;
} {
  const key = eventName.trim().toUpperCase();
  const entry = EVENT_DISPLAY[key];
  if (entry) return { displayName: entry.displayName, logo: entry.logo };
  return { displayName: eventName, logo: null };
}
