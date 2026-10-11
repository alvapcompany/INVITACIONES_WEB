import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  Navigation,
  Car,
  Copy,
  Check,
  Gift,
  Shirt,
  Calendar,
  Sparkles,
  ExternalLink,
  Camera,
  Heart,
  Mail,
  ChevronDown,
  RotateCcw,
} from 'lucide-react';
import { EventItem, Guest } from '../../types';
import { THEME_CONFIGS } from '../../lib/store';
import { EnvelopeIntro } from './EnvelopeIntro';
import { CountdownTimer } from './CountdownTimer';
import { MusicPlayerFloat } from './MusicPlayerFloat';
import { RsvpModal } from './RsvpModal';
import { PhotoGalleryModal } from './PhotoGalleryModal';
import { useToast } from '../ui/Toast';

interface InvitationViewProps {
  event: EventItem;
  guest?: Guest;
  onRsvpUpdated?: (updatedGuest: Guest) => void;
  isMockupMode?: boolean;
}

export const InvitationView: React.FC<InvitationViewProps> = ({
  event,
  guest: initialGuest,
  onRsvpUpdated,
  isMockupMode = false,
}) => {
  const { showToast } = useToast();
  const themeConfig = THEME_CONFIGS[event.theme] || THEME_CONFIGS.esmeralda;

  const [guest, setGuest] = useState<Guest | undefined>(initialGuest);
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [copiedClabe, setCopiedClabe] = useState(false);

  // Sync state if initialGuest prop changes
  React.useEffect(() => {
    setGuest(initialGuest);
  }, [initialGuest]);

  const handleCopyClabe = (clabe: string) => {
    navigator.clipboard.writeText(clabe);
    setCopiedClabe(true);
    showToast('¡CLABE bancaria copiada al portapapeles!', 'success');
    setTimeout(() => setCopiedClabe(false), 2500);
  };

  const openUber = (address: string) => {
    const encoded = encodeURIComponent(address);
    window.open(`https://m.uber.com/ul/?action=setPickup&dropoff[formatted_address]=${encoded}`, '_blank');
  };

  const openWaze = (url: string) => {
    window.open(url, '_blank');
  };

  const openGoogleMaps = (url: string) => {
    window.open(url, '_blank');
  };

  const formattedEventDate = new Date(event.date).toLocaleDateString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className={`relative min-h-screen bg-gradient-to-b ${themeConfig.bgClass} text-stone-100 font-sans selection:bg-amber-400 selection:text-black`}>
      {/* 1. Envelope Intro Overlay */}
      {!isEnvelopeOpen && (
        <EnvelopeIntro
          event={event}
          guest={guest}
          themeConfig={themeConfig}
          onOpen={() => setIsEnvelopeOpen(true)}
        />
      )}

      {/* 2. Floating Music Player */}
      <MusicPlayerFloat
        musicUrl={event.musicUrl}
        musicTitle={event.musicTitle}
        themeConfig={themeConfig}
      />

      {/* 3. Re-open envelope button in corner */}
      <button
        onClick={() => setIsEnvelopeOpen(false)}
        className="fixed top-20 right-4 z-30 p-2.5 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 text-white/70 hover:text-white backdrop-blur-md shadow-lg transition-all text-xs flex items-center gap-1.5"
        title="Cerrar y ver sobre digital de nuevo"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Ver Sobre</span>
      </button>

      {/* Main Container - Centered Mobile First (Luxury Editorial) */}
      <div className={`mx-auto ${isMockupMode ? 'max-w-md shadow-2xl border border-white/10 my-4 rounded-3xl overflow-hidden' : 'max-w-2xl'}`}>
        
        {/* HERO SECTION */}
        <header className="relative text-center pt-16 pb-12 px-6 overflow-hidden">
          {/* Subtle glow circle */}
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Pre-title */}
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="h-px w-8 bg-amber-400/50" />
            <span className="text-[11px] uppercase tracking-[0.3em] text-amber-300 font-semibold">
              {event.type === 'boda'
                ? 'Nuestra Boda Real'
                : event.type === 'xv'
                ? 'Mis Quince Años'
                : 'Celebración Exclusiva'}
            </span>
            <span className="h-px w-8 bg-amber-400/50" />
          </div>

          {/* Main Regal Hosts Title */}
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black tracking-wide text-white mb-2 drop-shadow-md">
            {event.hosts}
          </h1>

          {event.subtitle && (
            <p className="font-script text-2xl sm:text-3xl text-amber-200/90 mb-6">
              {event.subtitle}
            </p>
          )}

          {/* Luxury Framed Cover Photo */}
          <div className="relative mx-auto my-6 w-full max-w-sm aspect-[4/5] rounded-3xl overflow-hidden p-2 shadow-2xl border" style={{ borderColor: themeConfig.goldBorder, backgroundColor: themeConfig.cardBg }}>
            <div className="relative w-full h-full rounded-2xl overflow-hidden">
              <img
                src={event.coverPhoto}
                alt={event.hosts}
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
              
              {/* Overlay date badge */}
              <div className="absolute bottom-4 left-4 right-4 text-center">
                <span className="font-serif-luxury text-lg sm:text-xl font-bold text-amber-100 uppercase tracking-widest drop-shadow">
                  {formattedEventDate}
                </span>
              </div>
            </div>
          </div>

          {/* Dedication Phrase */}
          <div className="my-8 max-w-md mx-auto px-4">
            <span className="block font-script text-3xl text-amber-300/40 leading-none">“</span>
            <p className="font-serif-luxury italic text-stone-200 text-sm sm:text-base leading-relaxed -mt-3 mb-2">
              {event.phrase}
            </p>
            <span className="block font-script text-3xl text-amber-300/40 leading-none text-right">”</span>
          </div>

          {/* Parents & Sponsors Section */}
          {event.parentsAndSponsors && (
            <div className="my-8 p-6 rounded-3xl border backdrop-blur-md" style={{ backgroundColor: themeConfig.cardBg, borderColor: themeConfig.goldBorder }}>
              {event.parentsAndSponsors.parents && event.parentsAndSponsors.parents.length > 0 && (
                <div className="mb-4">
                  <p className="text-[10px] uppercase tracking-widest text-amber-300/80 font-bold mb-2">
                    {event.parentsAndSponsors.parentsTitle || 'Con la bendición de nuestros padres'}
                  </p>
                  <div className="space-y-1">
                    {event.parentsAndSponsors.parents.map((parent, idx) => (
                      <p key={idx} className="font-serif-luxury text-sm font-semibold text-stone-100">
                        {parent}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {event.parentsAndSponsors.sponsors && event.parentsAndSponsors.sponsors.length > 0 && (
                <div className="pt-4 border-t border-white/10">
                  <p className="text-[10px] uppercase tracking-widest text-amber-300/80 font-bold mb-2">
                    {event.parentsAndSponsors.sponsorsTitle || 'Nuestros Padrinos de Honor'}
                  </p>
                  <div className="space-y-1">
                    {event.parentsAndSponsors.sponsors.map((sponsor, idx) => (
                      <p key={idx} className="font-serif-luxury text-sm font-semibold text-stone-100">
                        {sponsor}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* LIVE COUNTDOWN */}
          <CountdownTimer targetDate={event.date} themeConfig={themeConfig} />

          {/* Down Chevron indicator */}
          <div className="flex justify-center mt-6 text-amber-400/60 animate-bounce">
            <ChevronDown className="w-5 h-5" />
          </div>
        </header>

        {/* PERSONALIZED GUEST PASS TICKET (VIP Pass Banner) */}
        <section className="px-6 py-6">
          <div
            className="relative rounded-3xl p-6 sm:p-7 border shadow-2xl backdrop-blur-md overflow-hidden"
            style={{
              backgroundColor: themeConfig.cardBg,
              borderColor: themeConfig.goldBorder,
            }}
          >
            {/* Hologram side cutout */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-amber-300 font-bold block mb-1">
                  Pase Digital Reservado
                </span>
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-white">
                  {guest ? guest.name : 'Invitado Especial'}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs font-bold">
                  {guest ? `${guest.assignedPasses} Pases de Honor` : 'Pase Familiar'}
                </span>
                {guest?.passCode && (
                  <span className="text-xs text-stone-400 font-mono">
                    #{guest.passCode}
                  </span>
                )}
              </div>
            </div>

            {/* Current RSVP Status */}
            <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-300">Estado de Confirmación:</span>
                {guest?.status === 'confirmed' ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    <Check className="w-3.5 h-3.5" /> Asistencia Confirmada ({guest.confirmedPasses} pases)
                  </span>
                ) : guest?.status === 'declined' ? (
                  <span className="text-xs font-bold text-rose-400 bg-rose-950/60 px-2.5 py-0.5 rounded-full border border-rose-500/30">
                    Declinado
                  </span>
                ) : (
                  <span className="text-xs font-bold text-amber-300 bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                    Pendiente de confirmación
                  </span>
                )}
              </div>

              <button
                onClick={() => setIsRsvpOpen(true)}
                className={`py-2 px-5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer ${themeConfig.buttonGradient} hover:brightness-110 active:scale-95`}
              >
                {guest?.status === 'confirmed' ? 'Editar mi confirmación' : '✨ Confirmar Asistencia'}
              </button>
            </div>
          </div>
        </section>

        {/* VENUES SECTION (Ceremonia & Recepción) */}
        <section className="px-6 py-8 space-y-6">
          <div className="text-center mb-6">
            <span className="text-[10px] uppercase tracking-widest text-amber-300 font-bold block mb-1">
              Lugares & Horarios
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white">
              ¿Dónde & Cuándo?
            </h2>
          </div>

          {/* Ceremonia Card */}
          <div
            className="rounded-3xl p-6 sm:p-7 border backdrop-blur-md shadow-xl transition-transform hover:-translate-y-1"
            style={{
              backgroundColor: themeConfig.cardBg,
              borderColor: themeConfig.goldBorder,
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="inline-flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>Ceremonia</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-amber-200 bg-black/40 px-3 py-1 rounded-full border border-white/10">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{event.ceremony.time}</span>
              </div>
            </div>

            <h3 className="font-heading text-xl font-bold text-white mb-2">
              {event.ceremony.name}
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 mb-4 leading-relaxed">
              {event.ceremony.address}
            </p>

            {event.ceremony.notes && (
              <p className="text-xs text-amber-200/80 italic mb-5 p-2.5 rounded-xl bg-black/30 border border-white/5">
                {event.ceremony.notes}
              </p>
            )}

            {/* Direct Navigation Buttons */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10">
              <button
                onClick={() => openGoogleMaps(event.ceremony.mapUrl)}
                className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-stone-200 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Google Maps</span>
              </button>
              <button
                onClick={() => openWaze(event.ceremony.wazeUrl)}
                className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-stone-200 transition-colors"
              >
                <Navigation className="w-3.5 h-3.5 text-sky-400" />
                <span>Waze</span>
              </button>
              <button
                onClick={() => openUber(event.ceremony.uberAddress)}
                className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-stone-200 transition-colors"
              >
                <Car className="w-3.5 h-3.5 text-amber-400" />
                <span>Pedir Uber</span>
              </button>
            </div>
          </div>

          {/* Recepción Card */}
          <div
            className="rounded-3xl p-6 sm:p-7 border backdrop-blur-md shadow-xl transition-transform hover:-translate-y-1"
            style={{
              backgroundColor: themeConfig.cardBg,
              borderColor: themeConfig.goldBorder,
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="inline-flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Recepción & Fiesta</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-amber-200 bg-black/40 px-3 py-1 rounded-full border border-white/10">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{event.reception.time}</span>
              </div>
            </div>

            <h3 className="font-heading text-xl font-bold text-white mb-2">
              {event.reception.name}
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 mb-4 leading-relaxed">
              {event.reception.address}
            </p>

            {event.reception.notes && (
              <p className="text-xs text-amber-200/80 italic mb-5 p-2.5 rounded-xl bg-black/30 border border-white/5">
                {event.reception.notes}
              </p>
            )}

            {/* Direct Navigation Buttons */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10">
              <button
                onClick={() => openGoogleMaps(event.reception.mapUrl)}
                className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-stone-200 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Google Maps</span>
              </button>
              <button
                onClick={() => openWaze(event.reception.wazeUrl)}
                className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-stone-200 transition-colors"
              >
                <Navigation className="w-3.5 h-3.5 text-sky-400" />
                <span>Waze</span>
              </button>
              <button
                onClick={() => openUber(event.reception.uberAddress)}
                className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-stone-200 transition-colors"
              >
                <Car className="w-3.5 h-3.5 text-amber-400" />
                <span>Pedir Uber</span>
              </button>
            </div>
          </div>
        </section>

        {/* ITINERARY TIMELINE */}
        {event.itinerary && event.itinerary.length > 0 && (
          <section className="px-6 py-8">
            <div className="text-center mb-8">
              <span className="text-[10px] uppercase tracking-widest text-amber-300 font-bold block mb-1">
                Momentos Especiales
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white">
                Itinerario del Evento
              </h2>
            </div>

            <div className="relative border-l-2 border-amber-400/30 ml-4 sm:ml-6 space-y-6">
              {event.itinerary.map((item, idx) => (
                <div key={idx} className="relative pl-6 sm:pl-8 group">
                  {/* Timeline bullet */}
                  <div
                    className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 border-amber-400 transition-transform group-hover:scale-125"
                    style={{ backgroundColor: themeConfig.waxSealColor }}
                  />

                  <div className="p-4 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md">
                    <span className="inline-block text-xs font-bold text-amber-300 tracking-wider mb-1">
                      {item.time} hrs
                    </span>
                    <h4 className="font-heading text-base font-bold text-white">
                      {item.title}
                    </h4>
                    <p className="text-xs text-stone-300 mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* DRESS CODE SECTION */}
        <section className="px-6 py-8">
          <div
            className="rounded-3xl p-6 sm:p-8 border backdrop-blur-md text-center"
            style={{
              backgroundColor: themeConfig.cardBg,
              borderColor: themeConfig.goldBorder,
            }}
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 mb-4">
              <Shirt className="w-6 h-6" />
            </div>

            <span className="text-[10px] uppercase tracking-widest text-amber-300 font-bold block mb-1">
              Código de Vestimenta
            </span>
            <h2 className="font-heading text-2xl font-bold text-white mb-2">
              {event.dressCode.type}
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 max-w-md mx-auto mb-6">
              {event.dressCode.description}
            </p>

            {/* Suggested color swatches */}
            {event.dressCode.suggestedColors && event.dressCode.suggestedColors.length > 0 && (
              <div className="mb-6">
                <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold block mb-3">
                  Colores Sugeridos
                </span>
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  {event.dressCode.suggestedColors.map((hex, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <span
                        className="w-8 h-8 rounded-full shadow-md border-2 border-white/20 transition-transform hover:scale-110"
                        style={{ backgroundColor: hex }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Prohibited / Avoid note */}
            {event.dressCode.prohibitedNote && (
              <div className="p-3 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-200 text-xs max-w-md mx-auto">
                ⚠️ {event.dressCode.prohibitedNote}
              </div>
            )}
          </div>
        </section>

        {/* GIFT REGISTRY (Mesa de Regalos & CLABE) */}
        <section className="px-6 py-8">
          <div
            className="rounded-3xl p-6 sm:p-8 border backdrop-blur-md text-center"
            style={{
              backgroundColor: themeConfig.cardBg,
              borderColor: themeConfig.goldBorder,
            }}
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 mb-4">
              <Gift className="w-6 h-6" />
            </div>

            <span className="text-[10px] uppercase tracking-widest text-amber-300 font-bold block mb-1">
              Mesa de Regalos
            </span>
            <h2 className="font-heading text-2xl font-bold text-white mb-2">
              Nuestra Mayor Alegría Es Tu Presencia
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 max-w-md mx-auto mb-6">
              Si deseas tener un detalle adicional con nosotros, te compartimos nuestras opciones de mesa de regalos.
            </p>

            {/* Bank Transfer Card with 1-Click CLABE Copy */}
            <div className="p-5 rounded-2xl bg-black/50 border border-white/10 max-w-md mx-auto text-left mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  Transferencia Interbancaria
                </span>
                <span className="text-[11px] text-stone-400 font-medium">
                  {event.giftRegistry.bankName}
                </span>
              </div>

              <div className="mb-2">
                <span className="text-[10px] uppercase text-stone-400 block">Titular:</span>
                <span className="text-sm font-semibold text-white">
                  {event.giftRegistry.accountHolder}
                </span>
              </div>

              <div className="mb-3">
                <span className="text-[10px] uppercase text-stone-400 block">CLABE Interbancaria:</span>
                <div className="flex items-center justify-between gap-2 bg-black/60 p-2.5 rounded-xl border border-white/10 mt-1">
                  <span className="font-mono text-sm sm:text-base font-bold text-amber-200 tracking-wider">
                    {event.giftRegistry.clabe}
                  </span>
                  <button
                    onClick={() => handleCopyClabe(event.giftRegistry.clabe)}
                    className="flex items-center gap-1 py-1 px-2.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-xs font-bold transition-all shrink-0 cursor-pointer"
                  >
                    {copiedClabe ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar CLABE</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {event.giftRegistry.bankNotes && (
                <p className="text-[11px] text-stone-400 italic">
                  💡 {event.giftRegistry.bankNotes}
                </p>
              )}
            </div>

            {/* Department Stores Links */}
            {event.giftRegistry.departmentStores && event.giftRegistry.departmentStores.length > 0 && (
              <div className="space-y-2 max-w-md mx-auto mb-6">
                <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold block mb-2">
                  Tiendas Departamentales
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {event.giftRegistry.departmentStores.map((store, idx) => (
                    <a
                      key={idx}
                      href={store.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors"
                    >
                      <div>
                        <span className="text-xs font-bold text-white block">{store.name}</span>
                        <span className="text-[10px] text-stone-400">Evento: {store.eventNumber}</span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Envelope note */}
            {event.giftRegistry.envelopeLluviaNote && (
              <p className="text-xs text-amber-200/80 italic p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 max-w-md mx-auto">
                ✉️ {event.giftRegistry.envelopeLluviaNote}
              </p>
            )}
          </div>
        </section>

        {/* PHOTO GALLERY */}
        {event.galleryPhotos && event.galleryPhotos.length > 0 && (
          <section className="px-6 py-8">
            <div className="text-center mb-6">
              <span className="text-[10px] uppercase tracking-widest text-amber-300 font-bold block mb-1">
                Galería de Fotos
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white">
                Nuestros Recuerdos
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {event.galleryPhotos.map((photo, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setGalleryIndex(idx);
                    setGalleryOpen(true);
                  }}
                  className="group relative aspect-square rounded-2xl overflow-hidden border border-white/10 shadow-lg cursor-pointer"
                >
                  <img
                    src={photo}
                    alt={`Foto ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Camera className="w-6 h-6 text-white drop-shadow" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FINAL RSVP CTA FOOTER */}
        <section className="px-6 py-12 text-center">
          <div
            className="p-8 rounded-3xl border shadow-2xl backdrop-blur-md relative overflow-hidden"
            style={{
              backgroundColor: themeConfig.cardBg,
              borderColor: themeConfig.goldBorder,
            }}
          >
            <Heart className="w-8 h-8 text-amber-400 mx-auto mb-3 animate-pulse" />
            <h3 className="font-heading text-2xl font-bold text-white mb-2">
              ¡Será un Honor Contar Contigo!
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 max-w-sm mx-auto mb-6">
              Confirma tu asistencia antes del {new Date(event.rsvpDeadline).toLocaleDateString('es-MX', { dateStyle: 'long' })}.
            </p>

            <button
              onClick={() => setIsRsvpOpen(true)}
              className={`w-full max-w-xs mx-auto py-3.5 px-6 rounded-2xl font-bold tracking-wider text-sm uppercase shadow-xl transition-all cursor-pointer ${themeConfig.buttonGradient} hover:brightness-110 active:scale-95`}
            >
              ✨ Confirmar Asistencia Ahora
            </button>
          </div>

          <footer className="mt-12 text-center text-xs text-stone-500 space-y-1">
            <p className="font-heading tracking-widest uppercase">EventPass • Alva P Studio</p>
            <p className="text-[11px]">Invitaciones Digitales Interactivas de Alta Gama</p>
          </footer>
        </section>
      </div>

      {/* RSVP Modal */}
      <RsvpModal
        event={event}
        guest={guest}
        themeConfig={themeConfig}
        isOpen={isRsvpOpen}
        onClose={() => setIsRsvpOpen(false)}
        onSuccess={(updatedGuest) => {
          setGuest(updatedGuest);
          if (onRsvpUpdated) onRsvpUpdated(updatedGuest);
        }}
      />

      {/* Photo Gallery Lightbox */}
      <PhotoGalleryModal
        photos={event.galleryPhotos}
        initialIndex={galleryIndex}
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
      />
    </div>
  );
};
