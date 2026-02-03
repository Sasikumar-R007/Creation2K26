// CREATION 2K26 Constants

export const EVENT_DATE = new Date('2026-02-25T09:00:00');

export const VENUE = {
  name: 'Main Auditorium',
  college: 'Your College Name',
  address: 'College Campus, City - 123456',
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
