import { EventItem, Guest, ThemeConfig, ThemeId } from '../types';

export const THEME_CONFIGS: Record<ThemeId, ThemeConfig> = {
  esmeralda: {
    id: 'esmeralda',
    name: 'Esmeralda & Oro Imperial',
    label: 'XV Años & Galas',
    description: 'Verde esmeralda profundo combinado con oro bruñido y tipografía señorial.',
    bgClass: 'from-[#03150f] via-[#05261b] to-[#010b07]',
    primaryAccent: '#10b981',
    goldBorder: 'rgba(212, 175, 55, 0.4)',
    textHeading: 'text-[#d4af37]',
    buttonGradient: 'bg-gradient-to-r from-[#d4af37] via-[#f7d070] to-[#b38827] text-[#03150f]',
    cardBg: 'rgba(6, 31, 23, 0.82)',
    waxSealColor: '#064e3b',
    audioVisualizerColor: '#34d399',
  },
  champagne: {
    id: 'champagne',
    name: 'Blanco Perla & Champagne Real',
    label: 'Bodas & Aniversarios',
    description: 'Fondos marfil perlados, destellos de oro rosa y elegancia atemporal.',
    bgClass: 'from-[#141210] via-[#221c17] to-[#120f0d]',
    primaryAccent: '#f59e0b',
    goldBorder: 'rgba(245, 158, 11, 0.35)',
    textHeading: 'text-[#f5d0a9]',
    buttonGradient: 'bg-gradient-to-r from-[#e0a96d] via-[#f7d4a6] to-[#c58a47] text-[#1c140c]',
    cardBg: 'rgba(34, 28, 23, 0.85)',
    waxSealColor: '#831843',
    audioVisualizerColor: '#fbbf24',
  },
  neon: {
    id: 'neon',
    name: 'Dark Onyx & Neón Glam',
    label: 'Fiestas VIP & Graduaciones',
    description: 'Negro espacial con acentos fucsia neón, cian eléctrico y alta energía.',
    bgClass: 'from-[#090812] via-[#150d24] to-[#06040d]',
    primaryAccent: '#ec4899',
    goldBorder: 'rgba(236, 72, 153, 0.4)',
    textHeading: 'text-[#f472b6]',
    buttonGradient: 'bg-gradient-to-r from-[#ec4899] via-[#d946ef] to-[#8b5cf6] text-white',
    cardBg: 'rgba(24, 15, 38, 0.85)',
    waxSealColor: '#be185d',
    audioVisualizerColor: '#ec4899',
  },
  zafiro: {
    id: 'zafiro',
    name: 'Azul Zafiro & Plata Estelar',
    label: 'Bodas de Plata & Galas',
    description: 'Azul imperial con destellos plateados y detalles refinados.',
    bgClass: 'from-[#071324] via-[#0c1f38] to-[#040b17]',
    primaryAccent: '#38bdf8',
    goldBorder: 'rgba(56, 189, 248, 0.4)',
    textHeading: 'text-[#bae6fd]',
    buttonGradient: 'bg-gradient-to-r from-[#38bdf8] via-[#7dd3fc] to-[#0284c7] text-[#071324]',
    cardBg: 'rgba(12, 31, 56, 0.85)',
    waxSealColor: '#1e3a8a',
    audioVisualizerColor: '#38bdf8',
  },
};

export const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'valeria-xv',
    slug: 'valeria-xv',
    title: 'Mis XV Años - Valeria Monserrat',
    subtitle: 'Una noche inolvidable de ensueño y elegancia',
    type: 'xv',
    hosts: 'Valeria Monserrat G.',
    date: '2026-11-28T18:00:00',
    theme: 'esmeralda',
    phrase: 'Hay momentos en la vida que son mágicos, y su belleza perdura por siempre cuando se comparten con las personas más especiales.',
    musicUrl: 'https://cdn.freesound.org/previews/612/612711_5674468-lq.mp3', // Gentle acoustic waltz
    musicTitle: 'Danubio Azul & Vals de Ensueño',
    coverPhoto: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    secondaryPhoto: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=800&q=80',
    galleryPhotos: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
    ],
    parentsAndSponsors: {
      parentsTitle: 'Con la bendición de mis queridos padres',
      parents: ['Ing. Roberto Gómez Alva', 'Lic. Patricia López de Gómez'],
      sponsorsTitle: 'Y el acompañamiento de mis padrinos de honor',
      sponsors: ['Dr. Fernando Martínez', 'Mtra. Claudia Elena Salazar'],
    },
    ceremony: {
      name: 'Misa de Acción de Gracias - Parroquia San José',
      address: 'Av. Insurgentes Sur 1420, Actipan, Benito Juárez, CDMX',
      time: '18:00 hrs',
      mapUrl: 'https://maps.google.com/?q=Av.+Insurgentes+Sur+1420,+Actipan,+CDMX',
      wazeUrl: 'https://waze.com/ul?q=Av.+Insurgentes+Sur+1420,+Actipan,+CDMX',
      uberAddress: 'Av. Insurgentes Sur 1420, Benito Juárez, CDMX',
      notes: 'Favor de llegar 15 minutos antes para acomodación en recinto.',
    },
    reception: {
      name: 'Gran Gala en Hacienda Los Virreyes',
      address: 'Calzada San Sebastián 85, Coyoacán, Ciudad de México',
      time: '20:00 hrs',
      mapUrl: 'https://maps.google.com/?q=Calzada+San+Sebastián+85,+Coyoacán,+CDMX',
      wazeUrl: 'https://waze.com/ul?q=Calzada+San+Sebastián+85,+Coyoacán,+CDMX',
      uberAddress: 'Calzada San Sebastián 85, Coyoacán, CDMX',
      notes: 'Valet parking de cortesía y bienvenida de cóctel en el jardín central.',
    },
    itinerary: [
      { time: '18:00', title: 'Ceremonia Religiosa', description: 'Bendición y misa solemne', iconName: 'church' },
      { time: '19:45', title: 'Recepción & Cóctel', description: 'Canapés de autor y brindis de bienvenida', iconName: 'cheers' },
      { time: '21:00', title: 'Vals Principal', description: 'El momento más emotivo de la noche', iconName: 'music' },
      { time: '21:45', title: 'Banquete de Gala', description: 'Cena formal de cuatro tiempos', iconName: 'utensils' },
      { time: '23:30', title: 'Apertura de Pista & Show', description: 'Música en vivo y sorpresas', iconName: 'sparkles' },
    ],
    dressCode: {
      type: 'Rigurosa Etiqueta / Formal Elegante',
      description: 'Hombres con traje oscuro y corbata. Mujeres con vestido largo de noche.',
      suggestedColors: ['#047857', '#064e3b', '#1e293b', '#b45309', '#d4af37'],
      avoidColors: ['#10b981', '#ffffff'],
      prohibitedNote: 'Rogamos evitar el tono verde esmeralda brillante ya que está reservado para la quinceañera.',
    },
    giftRegistry: {
      bankName: 'BBVA Bancomer',
      accountHolder: 'Valeria Monserrat Gómez López',
      clabe: '012180004567891234',
      bankNotes: 'Concepto sugerido: Regalo Valeria',
      envelopeLluviaNote: 'Habrá un buzón real en la entrada de la recepción para quienes gusten compartir sus mejores deseos en sobre.',
      departmentStores: [
        {
          name: 'Liverpool',
          eventNumber: '50948321',
          url: 'https://mesaderegalos.liverpool.com.mx/',
        },
        {
          name: 'Amazon Bodas y Fiestas',
          eventNumber: 'VALERIA-XV-2026',
          url: 'https://www.amazon.com.mx/baby-reg/',
        },
      ],
    },
    rsvpDeadline: '2026-11-10T23:59:59',
    googleSheetId: '',
    googleSheetName: 'Invitados',
    appsScriptWebhookUrl: '',
    hashtag: '#XVValeriaMonserrat',
    createdAt: '2026-10-01T12:00:00Z',
  },
  {
    id: 'sofia-alejandro-boda',
    slug: 'sofia-alejandro-boda',
    title: 'Boda Real - Sofía & Alejandro',
    subtitle: 'Nuestra historia comienza para siempre',
    type: 'boda',
    hosts: 'Sofía & Alejandro',
    date: '2026-12-19T17:30:00',
    theme: 'champagne',
    phrase: 'El amor no mira con los ojos, sino con el alma. Juntos emprendemos el viaje más hermoso de nuestras vidas.',
    musicUrl: 'https://cdn.freesound.org/previews/612/612711_5674468-lq.mp3',
    musicTitle: 'Canon en Re Mayor - Pachelbel (Piano & Cello)',
    coverPhoto: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80',
    secondaryPhoto: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
    galleryPhotos: [
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80',
    ],
    parentsAndSponsors: {
      parentsTitle: 'Con el amor de nuestros padres',
      parents: ['Carlos Alarcón y Mariana Vega', 'Enrique del Río y Carmen Morales'],
      sponsorsTitle: 'Nuestros testigos de vida',
      sponsors: ['Guillermo Alva y Elena Santos'],
    },
    ceremony: {
      name: 'Capilla San Francisco de Asís',
      address: 'Plaza del Carmen 12, San Ángel, CDMX',
      time: '17:30 hrs',
      mapUrl: 'https://maps.google.com/?q=Plaza+del+Carmen+San+Angel+CDMX',
      wazeUrl: 'https://waze.com/ul?q=Plaza+del+Carmen+San+Angel+CDMX',
      uberAddress: 'Plaza del Carmen 12, San Ángel, CDMX',
    },
    reception: {
      name: 'Jardín Versalles & Salón de Cristal',
      address: 'Camino a Santa Teresa 720, Tlalpan, CDMX',
      time: '19:30 hrs',
      mapUrl: 'https://maps.google.com/?q=Camino+a+Santa+Teresa+720+Tlalpan+CDMX',
      wazeUrl: 'https://waze.com/ul?q=Camino+a+Santa+Teresa+720+Tlalpan+CDMX',
      uberAddress: 'Camino a Santa Teresa 720, CDMX',
    },
    itinerary: [
      { time: '17:30', title: 'Ceremonia Nupcial', description: 'Intercambio de votos y anillos', iconName: 'church' },
      { time: '19:30', title: 'Cóctel en Jardines', description: 'Música en vivo & mixología', iconName: 'cheers' },
      { time: '20:30', title: 'Cena Nupcial', description: 'Experiencia gastronómica maridada', iconName: 'utensils' },
      { time: '22:00', title: 'Primer Baile de Esposos', description: 'Nuestro vals nupcial', iconName: 'music' },
      { time: '23:00', title: 'Fiesta & Brindis', description: 'Celebración hasta el amanecer', iconName: 'sparkles' },
    ],
    dressCode: {
      type: 'Black Tie / Rigurosa Etiqueta',
      description: 'Smoking o traje oscuro de gala para caballeros. Vestido largo para damas.',
      suggestedColors: ['#1e1b18', '#78350f', '#1e3a8a', '#4c1d95', '#d97706'],
      avoidColors: ['#ffffff', '#fef3c7'],
      prohibitedNote: 'El blanco y marfil están estrictamente reservados para la novia.',
    },
    giftRegistry: {
      bankName: 'Santander Select',
      accountHolder: 'Alejandro del Río Morales',
      clabe: '014180556677889900',
      bankNotes: 'Concepto: Boda Sofía y Ale',
      departmentStores: [
        {
          name: 'El Palacio de Hierro',
          eventNumber: 'BODA-SOFIA-ALE-2026',
          url: 'https://www.elpalaciodehierro.com/celebraciones',
        },
        {
          name: 'Liverpool',
          eventNumber: '51203940',
          url: 'https://mesaderegalos.liverpool.com.mx/',
        },
      ],
    },
    rsvpDeadline: '2026-11-30T23:59:59',
    createdAt: '2026-10-02T10:00:00Z',
  },
  {
    id: 'neon-eclipse-vip',
    slug: 'neon-eclipse-vip',
    title: 'Neon Eclipse - VIP Birthday Celebration',
    subtitle: 'Noche exclusiva de cócteles, música y alta vibra',
    type: 'fiesta',
    hosts: 'Maximiliano Barroso',
    date: '2026-11-14T21:00:00',
    theme: 'neon',
    phrase: 'La vida se mide en momentos inolvidables rodeados de gente increíble. ¡Brindemos por un nuevo capítulo!',
    musicUrl: 'https://cdn.freesound.org/previews/612/612711_5674468-lq.mp3',
    musicTitle: 'Deep House Sunset Lounge Session',
    coverPhoto: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
    galleryPhotos: [
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
    ],
    ceremony: {
      name: 'Pre-Drinks VIP Lounge',
      address: 'Paseo de la Reforma 222, Piso 35, CDMX',
      time: '21:00 hrs',
      mapUrl: 'https://maps.google.com/?q=Reforma+222+CDMX',
      wazeUrl: 'https://waze.com/ul?q=Reforma+222+CDMX',
      uberAddress: 'Paseo de la Reforma 222, CDMX',
    },
    reception: {
      name: 'Rooftop Sky Club Reforma',
      address: 'Paseo de la Reforma 222, Terraza Panorámica, CDMX',
      time: '22:30 hrs',
      mapUrl: 'https://maps.google.com/?q=Reforma+222+CDMX',
      wazeUrl: 'https://waze.com/ul?q=Reforma+222+CDMX',
      uberAddress: 'Paseo de la Reforma 222, CDMX',
    },
    itinerary: [
      { time: '21:00', title: 'Alfombra Roja & Entrada VIP', description: 'Registro con pase digital y brazaletes', iconName: 'camera' },
      { time: '22:30', title: 'DJ Set Principal & Brindis', description: 'Champaña de bienvenida y aperitivos', iconName: 'music' },
      { time: '00:00', title: 'Hora Cumbre & Show Neón', description: 'Luces láser y pirotecnia fría', iconName: 'sparkles' },
    ],
    dressCode: {
      type: 'All Black Chic con Toque Neón',
      description: 'Prendas negras de noche con accesorios llamativos o brillantes.',
      suggestedColors: ['#000000', '#18181b', '#ec4899', '#06b6d4'],
      avoidColors: ['#ca8a04', '#64748b'],
    },
    giftRegistry: {
      bankName: 'Mercado Pago / BBVA',
      accountHolder: 'Maximiliano Barroso',
      clabe: '722180009988776655',
      bankNotes: 'Concepto: Cumple Max VIP',
    },
    rsvpDeadline: '2026-11-05T23:59:59',
    createdAt: '2026-10-05T15:00:00Z',
  },
];

export const INITIAL_GUESTS: Guest[] = [
  {
    id: 'guest-1',
    eventId: 'valeria-xv',
    name: 'Familia Pérez López',
    assignedPasses: 4,
    confirmedPasses: 4,
    status: 'confirmed',
    phone: '+52 55 1234 5678',
    passCode: 'VAL-401',
    tableNumber: 'Mesa 3',
    notes: 'Una persona vegetariana',
    congratulations: '¡Felicidades Valeria hermosa! Muy emocionados por celebrar contigo.',
    confirmationDate: '2026-10-08T14:30:00',
  },
  {
    id: 'guest-2',
    eventId: 'valeria-xv',
    name: 'Lic. Ricardo Morales y Acompañante',
    assignedPasses: 2,
    confirmedPasses: 2,
    status: 'confirmed',
    phone: '+52 55 9876 5432',
    passCode: 'VAL-402',
    tableNumber: 'Mesa 1',
    congratulations: 'Un gran abrazo de parte de la familia Morales.',
    confirmationDate: '2026-10-09T18:15:00',
  },
  {
    id: 'guest-3',
    eventId: 'valeria-xv',
    name: 'Ing. Carlos Mendoza y Familia',
    assignedPasses: 3,
    confirmedPasses: 0,
    status: 'pending',
    phone: '+52 55 4567 8901',
    passCode: 'VAL-403',
    tableNumber: 'Mesa 5',
  },
  {
    id: 'guest-4',
    eventId: 'valeria-xv',
    name: 'Dr. Fernando Salazar',
    assignedPasses: 2,
    confirmedPasses: 0,
    status: 'declined',
    phone: '+52 55 6789 0123',
    passCode: 'VAL-404',
    notes: 'Por viaje de congreso médico no podré asistir. Les mando todo mi cariño.',
    congratulations: '¡Que sea una fiesta inolvidable!',
    confirmationDate: '2026-10-10T11:00:00',
  },
  {
    id: 'guest-5',
    eventId: 'sofia-alejandro-boda',
    name: 'Familia Del Río Santillán',
    assignedPasses: 5,
    confirmedPasses: 5,
    status: 'confirmed',
    phone: '+52 55 3344 5566',
    passCode: 'BOD-101',
    tableNumber: 'Mesa Presidencial',
    notes: 'Sin mariscos para una persona',
    congratulations: '¡Que vivan los novios! Toda la felicidad del mundo.',
    confirmationDate: '2026-10-09T20:00:00',
  },
  {
    id: 'guest-6',
    eventId: 'sofia-alejandro-boda',
    name: 'Mtro. Gabriel Guillermo Alva',
    assignedPasses: 2,
    confirmedPasses: 2,
    status: 'confirmed',
    phone: '+52 55 7788 9900',
    passCode: 'BOD-102',
    tableNumber: 'Mesa de Honor',
    congratulations: 'Un honor acompañarlos en este gran paso.',
    confirmationDate: '2026-10-10T16:20:00',
  },
];

const STORAGE_KEY_EVENTS = 'eventpass_alva_events_v2';
const STORAGE_KEY_GUESTS = 'eventpass_alva_guests_v2';

export class AppStore {
  private static events: EventItem[] = [];
  private static guests: Guest[] = [];
  private static initialized = false;

  public static init() {
    if (this.initialized) return;

    try {
      const savedEvents = localStorage.getItem(STORAGE_KEY_EVENTS);
      const savedGuests = localStorage.getItem(STORAGE_KEY_GUESTS);

      this.events = savedEvents ? JSON.parse(savedEvents) : INITIAL_EVENTS;
      this.guests = savedGuests ? JSON.parse(savedGuests) : INITIAL_GUESTS;
    } catch {
      this.events = INITIAL_EVENTS;
      this.guests = INITIAL_GUESTS;
    }

    this.initialized = true;
  }

  private static persist() {
    try {
      localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(this.events));
      localStorage.setItem(STORAGE_KEY_GUESTS, JSON.stringify(this.guests));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }

  public static getEvents(): EventItem[] {
    this.init();
    return [...this.events];
  }

  public static getEventById(idOrSlug: string): EventItem | undefined {
    this.init();
    return this.events.find((e) => e.id === idOrSlug || e.slug === idOrSlug);
  }

  public static getGuestsByEvent(eventId: string): Guest[] {
    this.init();
    return this.guests.filter((g) => g.eventId === eventId);
  }

  public static getGuestById(guestId: string): Guest | undefined {
    this.init();
    return this.guests.find((g) => g.id === guestId);
  }

  public static addGuest(guest: Omit<Guest, 'id'>): Guest {
    this.init();
    const newGuest: Guest = {
      ...guest,
      id: `g-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      lastUpdated: new Date().toISOString(),
    };
    this.guests.push(newGuest);
    this.persist();
    return newGuest;
  }

  public static updateGuest(id: string, updates: Partial<Guest>): Guest | null {
    this.init();
    const index = this.guests.findIndex((g) => g.id === id);
    if (index === -1) return null;

    this.guests[index] = {
      ...this.guests[index],
      ...updates,
      lastUpdated: new Date().toISOString(),
    };
    this.persist();
    return this.guests[index];
  }

  public static deleteGuest(id: string): boolean {
    this.init();
    const initialLen = this.guests.length;
    this.guests = this.guests.filter((g) => g.id !== id);
    if (this.guests.length !== initialLen) {
      this.persist();
      return true;
    }
    return false;
  }

  public static submitRsvp(
    guestId: string,
    status: 'confirmed' | 'declined',
    confirmedPasses: number,
    notes?: string,
    congratulations?: string,
    phone?: string
  ): Guest | null {
    this.init();
    return this.updateGuest(guestId, {
      status,
      confirmedPasses: status === 'confirmed' ? confirmedPasses : 0,
      notes: notes || undefined,
      congratulations: congratulations || undefined,
      phone: phone || undefined,
      confirmationDate: new Date().toISOString(),
    });
  }

  public static saveEvent(event: EventItem): EventItem {
    this.init();
    const index = this.events.findIndex((e) => e.id === event.id);
    if (index >= 0) {
      this.events[index] = event;
    } else {
      this.events.push(event);
    }
    this.persist();
    return event;
  }

  public static deleteEvent(id: string): boolean {
    this.init();
    this.events = this.events.filter((e) => e.id !== id);
    this.guests = this.guests.filter((g) => g.eventId !== id);
    this.persist();
    return true;
  }

  public static importGuests(newGuests: Guest[]): void {
    this.init();
    // Merge or add
    for (const g of newGuests) {
      const idx = this.guests.findIndex((existing) => existing.id === g.id);
      if (idx >= 0) {
        this.guests[idx] = g;
      } else {
        this.guests.push(g);
      }
    }
    this.persist();
  }

  public static resetDefaults() {
    this.events = INITIAL_EVENTS;
    this.guests = INITIAL_GUESTS;
    this.persist();
  }
}
