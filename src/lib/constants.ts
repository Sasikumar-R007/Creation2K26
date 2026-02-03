// CREATION 2K26 Constants

export const EVENT_DATE = new Date('2026-02-25T09:00:00');

export const VENUE = {
  name: 'Main Auditorium',
  college: 'Bishop Heber College',
  address: 'Bishop Heber College, Trichy - 620 017, Tamil Nadu',
};

export const SOCIAL_LINKS = {
  instagram: 'https://instagram.com/creation2k26',
  linkedin: 'https://linkedin.com/company/creation2k26',
  twitter: 'https://twitter.com/creation2k26',
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
