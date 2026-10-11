import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Volume2, Heart } from 'lucide-react';
import { EventItem, Guest, ThemeConfig } from '../../types';
import { luxuryAudio } from '../../lib/audioManager';

interface EnvelopeIntroProps {
  event: EventItem;
  guest?: Guest;
  themeConfig: ThemeConfig;
  onOpen: () => void;
}

export const EnvelopeIntro: React.FC<EnvelopeIntroProps> = ({
  event,
  guest,
  themeConfig,
  onOpen,
}) => {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpenClick = () => {
    setIsOpening(true);
    luxuryAudio.playCelebrationChime();
    if (event.musicUrl) {
      luxuryAudio.playMusic(event.musicUrl);
    }
    setTimeout(() => {
      onOpen();
    }, 900);
  };

  const getMonogram = () => {
    if (event.type === 'boda') {
      const parts = event.hosts.split('&');
      if (parts.length === 2) {
        return `${parts[0].trim().charAt(0)} & ${parts[1].trim().charAt(0)}`;
      }
    }
    return event.hosts.charAt(0);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
        {/* Subtle background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-amber-500/30 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-emerald-500/20 blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
          transition={{ duration: 0.8 }}
          className="relative w-full max-w-md mx-auto text-center"
        >
          {/* Envelope Card Container */}
          <div
            className="relative rounded-3xl p-8 sm:p-10 shadow-2xl overflow-hidden border"
            style={{
              backgroundColor: themeConfig.cardBg,
              borderColor: themeConfig.goldBorder,
              boxShadow: `0 25px 60px -15px ${themeConfig.waxSealColor}55`,
            }}
          >
            {/* Top decorative ornament */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="h-px w-12 bg-gradient-to-r from-transparent to-amber-400/60" />
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span className="h-px w-12 bg-gradient-to-l from-transparent to-amber-400/60" />
            </div>

            {/* Event Type & Hosts */}
            <p className="text-xs uppercase tracking-[0.3em] text-amber-300/80 font-medium mb-3">
              {event.type === 'boda'
                ? 'Nuestra Boda'
                : event.type === 'xv'
                ? 'Mis XV Años'
                : 'Celebración Exclusiva'}
            </p>

            <h1
              className="font-heading text-2xl sm:text-3xl text-white font-bold tracking-wide mb-2"
              style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
            >
              {event.hosts}
            </h1>

            <p className="font-script text-xl sm:text-2xl text-amber-200/90 mb-8">
              Tienen el honor de invitarte
            </p>

            {/* Personalized Guest Badge */}
            <div className="my-6 p-4 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md">
              <p className="text-xs text-stone-400 tracking-wider uppercase mb-1">
                Pase de Invitación Exclusivo
              </p>
              <h2 className="text-lg font-serif-luxury font-bold text-amber-100 mb-1">
                {guest ? guest.name : 'Apreciable Invitado Especial'}
              </h2>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                <span>{guest ? `${guest.assignedPasses} Pases Reservados` : 'Pase Familiar'}</span>
                {guest?.passCode && <span className="opacity-60">• #{guest.passCode}</span>}
              </div>
            </div>

            {/* Wax Seal Button */}
            <div className="flex flex-col items-center justify-center mt-8">
              <motion.button
                onClick={handleOpenClick}
                disabled={isOpening}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full shadow-2xl transition-all cursor-pointer"
                style={{
                  backgroundColor: themeConfig.waxSealColor,
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6), inset 0 2px 4px rgba(255, 255, 255, 0.3)',
                }}
              >
                {/* Gold rim */}
                <div className="absolute inset-1 rounded-full border border-amber-300/40" />

                <div className="flex flex-col items-center justify-center text-amber-100">
                  <span className="font-heading font-black text-lg sm:text-xl tracking-tighter">
                    {getMonogram()}
                  </span>
                  <Heart className="w-3.5 h-3.5 text-amber-200 fill-amber-200/40 mt-0.5 group-hover:scale-125 transition-transform" />
                </div>
              </motion.button>

              <button
                onClick={handleOpenClick}
                className="mt-5 flex items-center gap-2 text-sm font-medium text-amber-200/90 hover:text-white tracking-widest uppercase transition-colors"
              >
                <Volume2 className="w-4 h-4 text-amber-400 animate-bounce" />
                <span>Tocar para abrir invitación</span>
              </button>
              <span className="text-[11px] text-stone-400/80 mt-1">
                (Incluye música y experiencia interactiva)
              </span>
            </div>

            {/* Bottom ribbon */}
            <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-center gap-4 text-xs text-stone-400">
              <span>{new Date(event.date).toLocaleDateString('es-MX', { dateStyle: 'long' })}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
