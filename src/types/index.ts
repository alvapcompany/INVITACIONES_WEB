export type EventType = 'xv' | 'boda' | 'fiesta' | 'aniversario';
export type ThemeId = 'esmeralda' | 'champagne' | 'neon' | 'zafiro';
export type GuestStatus = 'pending' | 'confirmed' | 'declined';
export type AppRole = 'superadmin' | 'host' | 'guest';

export interface CeremonyDetails {
  name: string;
  address: string;
  time: string;
  mapUrl: string;
  wazeUrl: string;
  uberAddress: string;
  notes?: string;
}

export interface ItineraryItem {
  time: string;
  title: string;
  description: string;
  iconName: 'church' | 'cheers' | 'music' | 'camera' | 'cake' | 'utensils' | 'sparkles' | 'car';
}

export interface DressCode {
  type: string; // e.g. "Formal Riguroso", "Etiqueta / Black Tie", "Cocktail Chic"
  description: string;
  suggestedColors: string[];
  avoidColors: string[];
  prohibitedNote?: string; // e.g. "El color blanco y marfil está reservado para la novia"
}

export interface GiftRegistry {
  bankName: string;
  accountHolder: string;
  clabe: string;
  bankNotes: string;
  envelopeLluviaNote?: string;
  departmentStores?: Array<{
    name: string;
    eventNumber: string;
    url: string;
    icon?: string;
  }>;
}

export interface EventItem {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  type: EventType;
  hosts: string; // e.g. "Sofía & Alejandro" or "Valeria Monserrat"
  date: string; // ISO String, e.g. "2026-11-28T18:00:00"
  theme: ThemeId;
  phrase: string;
  musicUrl: string;
  musicTitle: string;
  coverPhoto: string;
  secondaryPhoto?: string;
  galleryPhotos: string[];
  parentsAndSponsors?: {
    parentsTitle?: string;
    parents?: string[];
    sponsorsTitle?: string;
    sponsors?: string[];
  };
  ceremony: CeremonyDetails;
  reception: CeremonyDetails;
  itinerary: ItineraryItem[];
  dressCode: DressCode;
  giftRegistry: GiftRegistry;
  rsvpDeadline: string;
  googleSheetId?: string;
  googleSheetName?: string;
  appsScriptWebhookUrl?: string;
  hashtag?: string;
  createdAt: string;
}

export interface Guest {
  id: string;
  eventId: string;
  name: string; // "Familia Pérez López"
  assignedPasses: number; // e.g. 4
  confirmedPasses: number; // e.g. 4 or 0
  status: GuestStatus;
  confirmationDate?: string;
  phone?: string;
  notes?: string; // Alergias o restricciones alimenticias
  congratulations?: string; // Mensaje de buenos deseos
  passCode: string; // e.g. "VAL-489"
  tableNumber?: string;
  lastUpdated?: string;
}

export interface RsvpSubmission {
  guestId: string;
  status: 'confirmed' | 'declined';
  confirmedPasses: number;
  notes?: string;
  congratulations?: string;
}

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  label: string;
  description: string;
  bgClass: string;
  primaryAccent: string;
  goldBorder: string;
  textHeading: string;
  buttonGradient: string;
  cardBg: string;
  waxSealColor: string;
  audioVisualizerColor: string;
}
