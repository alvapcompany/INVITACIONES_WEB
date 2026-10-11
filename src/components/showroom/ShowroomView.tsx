import React, { useState } from 'react';
import {
  Sparkles,
  Music,
  MapPin,
  Gift,
  CheckCircle2,
  Smartphone,
  Eye,
  Star,
  MessageCircle,
  Clock,
  Shirt,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { EventItem, EventType } from '../../types';
import { THEME_CONFIGS } from '../../lib/store';

interface ShowroomViewProps {
  events: EventItem[];
  onSelectDemoEvent: (event: EventItem) => void;
  onOpenHostPanel: (event: EventItem) => void;
}

export const ShowroomView: React.FC<ShowroomViewProps> = ({
  events,
  onSelectDemoEvent,
  onOpenHostPanel,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | EventType>('all');

  const filteredEvents = events.filter((ev) =>
    selectedCategory === 'all' ? true : ev.type === selectedCategory
  );

  const handleWhatsAppContact = (tierName: string) => {
    const text = `¡Hola Alva P Studio! ✨ Estoy interesado(a) en contratar el paquete *${tierName}* de invitaciones digitales interactivas EventPass. ¿Podrían brindarme información y disponibilidad?`;
    window.open(`https://wa.me/525512345678?text=${encodeURIComponent(text)}`, '_blank');
  };

  const luxuryFeatures = [
    {
      icon: Music,
      title: 'Música Ambiental & Vals',
      desc: 'Reproductor HTML5 flotante con onda sonora, apertura con sello de cera y reproducción sin interrupciones.',
    },
    {
      icon: MapPin,
      title: 'Mapas GPS con 1-Clic',
      desc: 'Botones directos para Google Maps, Waze y solicitud de viaje en Uber con destino pre-configurado.',
    },
    {
      icon: Gift,
      title: 'Mesa de Regalos & CLABE',
      desc: 'Copia inmediata de cuenta CLABE con feedback visual, buzón de sobres y tiendas departamentales.',
    },
    {
      icon: CheckCircle2,
      title: 'RSVP en Tiempo Real',
      desc: 'Pases personalizados por familia, selector de asistentes, restricciones de alimentos y sincronización a Google Sheets.',
    },
    {
      icon: Smartphone,
      title: 'Mobile-First de Lujo',
      desc: 'Diseño editorial optimizado para pantallas retina en smartphones, sin descargas ni aplicaciones pesadas.',
    },
    {
      icon: ShieldCheck,
      title: 'Generador de WhatsApp',
      desc: 'El anfitrión crea pases y los envía por WhatsApp con mensajes pre-redactados y enlaces individuales.',
    },
  ];

  const packages = [
    {
      name: 'Paquete Esencial',
      badge: 'Básico',
      price: '$990 MXN',
      desc: 'Ideal para celebraciones íntimas y familiares.',
      features: [
        'Invitación digital personalizada',
        'Hasta 50 pases familiares',
        'Cuenta regresiva en vivo',
        'Ubicaciones con Google Maps y Waze',
        'Mesa de regalos con CLABE bancaria',
        'RSVP básico en panel del anfitrión',
      ],
      popular: false,
    },
    {
      name: 'Paquete Deluxe VIP',
      badge: 'Más Vendido',
      price: '$1,890 MXN',
      desc: 'La experiencia completa para Quinceañeras y Bodas memorables.',
      features: [
        'Invitación con apertura de sobre y sello de cera',
        'Pases ilimitados para familias',
        'Música de fondo personalizada con reproductor',
        'Botones de GPS: Google Maps, Waze y Uber',
        'Código de vestimenta con paleta de colores',
        'Galería de fotos de alta resolución',
        'Generador de pases con envío a WhatsApp',
        'Sincronización con Google Sheets / Apps Script',
      ],
      popular: true,
    },
    {
      name: 'Royal Studio Signature',
      badge: 'Exclusivo',
      price: '$2,790 MXN',
      desc: 'Para eventos de alta gala que buscan personalización total.',
      features: [
        'Todo lo incluido en Deluxe VIP',
        'Dominio web personalizado (ej. valeria15.com)',
        'Filtro de fotos personalizado para Instagram',
        'Diseño gráfico temático exclusivo a medida',
        'Soporte y asesoría técnica el día del evento',
        'Exportación completa para el banquetero / wedding planner',
      ],
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#090b0e] text-stone-100">
      {/* HERO BANNER */}
      <section className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden text-center">
        {/* Glow gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Alva P Studio • Colección 2026/2027</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-wide leading-tight">
            Invitaciones Digitales <br />
            <span className="gold-gradient-text">Interactivas de Alta Gama</span>
          </h1>

          <p className="font-serif-luxury text-base sm:text-xl text-stone-300 max-w-2xl mx-auto leading-relaxed">
            Transforma la primera impresión de tu evento en una experiencia inolvidable con música envolvente, mapas GPS, mesa de regalos y confirmación de pases en tiempo real.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onSelectDemoEvent(events[0])}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-stone-950 font-bold text-sm uppercase tracking-wider shadow-xl hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              <span>Ver Demo Interactiva en Vivo</span>
            </button>

            <button
              onClick={() => handleWhatsAppContact('General')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-semibold text-sm tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Cotizar por WhatsApp</span>
            </button>
          </div>
        </div>
      </section>

      {/* INTERACTIVE CATALOG / SHOWROOM */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white">
              Colección de Plantillas & Diseños
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 mt-1">
              Selecciona cualquier diseño para abrir la invitación interactiva o ver su panel de anfitrión.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-900/80 rounded-2xl border border-white/10 text-xs overflow-x-auto">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'xv', label: 'XV Años' },
              { id: 'boda', label: 'Bodas' },
              { id: 'fiesta', label: 'Fiestas VIP' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500 text-stone-950 shadow-md'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((ev) => {
            const theme = THEME_CONFIGS[ev.theme] || THEME_CONFIGS.esmeralda;

            return (
              <div
                key={ev.id}
                className="group relative rounded-3xl overflow-hidden border border-white/10 bg-stone-900/60 shadow-2xl transition-all hover:-translate-y-1.5 hover:border-amber-400/40"
              >
                {/* Image Cover */}
                <div className="relative aspect-[4/3] overflow-hidden bg-stone-950">
                  <img
                    src={ev.coverPhoto}
                    alt={ev.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />

                  {/* Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/70 backdrop-blur-md border border-white/20 text-amber-300">
                      {theme.label}
                    </span>
                  </div>

                  {/* Play badge */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-stone-300">
                    <span className="font-semibold text-white truncate max-w-[200px]">
                      {ev.hosts}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-amber-300 font-mono">
                      <Music className="w-3 h-3" /> Con Música
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-heading text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                      {ev.title}
                    </h3>
                    <p className="text-xs text-stone-400 line-clamp-2 mt-1">
                      {ev.phrase}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/10 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onSelectDemoEvent(ev)}
                      className="py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Ver Invitación</span>
                    </button>

                    <button
                      onClick={() => onOpenHostPanel(ev)}
                      className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-stone-200 text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>Panel Anfitrión</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* LUXURY FEATURES HIGHLIGHT */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-stone-950/60 border-y border-white/5">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-[0.25em] text-amber-400 font-bold">
              Diseño & Tecnología
            </span>
            <h2 className="font-heading text-2xl sm:text-4xl font-bold text-white">
              Todo Lo Que Una Invitación De Ensueño Debe Tener
            </h2>
            <p className="text-xs sm:text-sm text-stone-400">
              Despídete de las invitaciones en PDF estáticas o de papel que se pierden. Ofrece una experiencia interactiva inolvidable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {luxuryFeatures.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-stone-900/40 border border-white/10 hover:border-amber-400/30 transition-all space-y-3"
                >
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading text-base font-bold text-white">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-stone-400 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PRICING TIERS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs uppercase tracking-[0.25em] text-amber-400 font-bold">
            Planes & Contratación
          </span>
          <h2 className="font-heading text-2xl sm:text-4xl font-bold text-white">
            Precios Claros y Sin Sorpresas
          </h2>
          <p className="text-xs sm:text-sm text-stone-400">
            Paga una sola vez por evento. Incluye alojamiento en la nube de alta velocidad y soporte directo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((pkg, idx) => (
            <div
              key={idx}
              className={`relative rounded-3xl p-6 sm:p-8 border flex flex-col justify-between transition-all ${
                pkg.popular
                  ? 'bg-stone-900/90 border-amber-400 ring-2 ring-amber-400/30 shadow-2xl scale-105'
                  : 'bg-stone-900/40 border-white/10'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-amber-500 text-stone-950 text-[10px] font-black uppercase tracking-widest shadow-md">
                  Recomendado para Bodas y XV
                </div>
              )}

              <div>
                <div className="mb-4">
                  <span className="text-xs uppercase tracking-wider text-amber-300 font-bold">
                    {pkg.badge}
                  </span>
                  <h3 className="font-heading text-xl font-bold text-white mt-1">
                    {pkg.name}
                  </h3>
                  <p className="text-xs text-stone-400 mt-1">{pkg.desc}</p>
                </div>

                <div className="my-6">
                  <span className="font-heading text-3xl sm:text-4xl font-black text-white">
                    {pkg.price}
                  </span>
                  <span className="text-xs text-stone-400 ml-2">pago único</span>
                </div>

                <ul className="space-y-2.5 text-xs text-stone-300 mb-8">
                  {pkg.features.map((f, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleWhatsAppContact(pkg.name)}
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  pkg.popular
                    ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-lg'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                <span>Contratar {pkg.name}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-4 border-t border-white/10 text-center text-xs text-stone-500 space-y-2">
        <p className="font-heading text-sm text-stone-300 tracking-widest uppercase">
          Alva P Studio • EventPass
        </p>
        <p>Estudio de Diseño y Arquitectura de Software para Eventos Sociales de Lujo.</p>
        <p className="text-[11px] text-stone-600">
          Soporta Google Workspace, Sheets API, Firebase y Despliegue Estático en GitHub Pages.
        </p>
      </footer>
    </div>
  );
};
