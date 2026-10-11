import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Check, X, Users, Heart, Utensils, Phone, Sparkles } from 'lucide-react';
import { EventItem, Guest, ThemeConfig } from '../../types';
import { AppStore } from '../../lib/store';
import { sendRsvpToAppsScript } from '../../lib/googleSheets';
import { luxuryAudio } from '../../lib/audioManager';
import { useToast } from '../ui/Toast';

interface RsvpModalProps {
  event: EventItem;
  guest?: Guest;
  themeConfig: ThemeConfig;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedGuest: Guest) => void;
}

export const RsvpModal: React.FC<RsvpModalProps> = ({
  event,
  guest,
  themeConfig,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { showToast } = useToast();
  const maxPasses = guest ? guest.assignedPasses : 2;

  const [attending, setAttending] = useState<boolean>(
    guest?.status === 'declined' ? false : true
  );
  const [confirmedPasses, setConfirmedPasses] = useState<number>(
    guest?.confirmedPasses && guest.confirmedPasses > 0 ? guest.confirmedPasses : maxPasses
  );
  const [phone, setPhone] = useState<string>(guest?.phone || '');
  const [notes, setNotes] = useState<string>(guest?.notes || '');
  const [congratulations, setCongratulations] = useState<string>(guest?.congratulations || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let currentGuest = guest;

      // If no guest was passed via URL/state, create one on the fly for the event
      if (!currentGuest) {
        currentGuest = AppStore.addGuest({
          eventId: event.id,
          name: 'Invitado Web',
          assignedPasses: confirmedPasses,
          confirmedPasses: attending ? confirmedPasses : 0,
          status: attending ? 'confirmed' : 'declined',
          passCode: `WEB-${Math.floor(100 + Math.random() * 900)}`,
          phone,
          notes,
          congratulations,
          confirmationDate: new Date().toISOString(),
        });
      } else {
        currentGuest = AppStore.submitRsvp(
          currentGuest.id,
          attending ? 'confirmed' : 'declined',
          confirmedPasses,
          notes,
          congratulations,
          phone
        )!;
      }

      // If event has Apps Script Webhook configured, sync in background
      if (event.appsScriptWebhookUrl) {
        sendRsvpToAppsScript(event.appsScriptWebhookUrl, currentGuest, event).catch((err) =>
          console.warn('Apps Script sync warn:', err)
        );
      }

      // Trigger Luxury Gold Confetti if attending
      if (attending) {
        luxuryAudio.playCelebrationChime();
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#d4af37', '#f7d070', '#ffffff', '#10b981', '#ec4899'],
        });
        showToast('¡Asistencia confirmada con éxito! Te esperamos con alegría.', 'success');
      } else {
        showToast('Respuesta guardada. Agradecemos informarnos.', 'info');
      }

      onSuccess(currentGuest);
      onClose();
    } catch (err: any) {
      showToast(`Error al guardar: ${err.message}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div
        className="relative w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border my-auto transition-all"
        style={{
          backgroundColor: themeConfig.cardBg,
          borderColor: themeConfig.goldBorder,
          boxShadow: `0 20px 50px -10px ${themeConfig.waxSealColor}55`,
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-white p-1 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Confirmación de Asistencia (RSVP)</span>
          </div>
          <h2 className="font-heading text-2xl font-bold text-white tracking-wide">
            {event.hosts}
          </h2>
          <p className="text-xs text-stone-300 mt-1">
            Por favor confirma antes del{' '}
            <strong className="text-amber-200">
              {new Date(event.rsvpDeadline).toLocaleDateString('es-MX', {
                dateStyle: 'long',
              })}
            </strong>
          </p>
        </div>

        {/* Guest info card */}
        <div className="mb-6 p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold block">
              Invitación Para
            </span>
            <span className="text-sm sm:text-base font-bold text-amber-100">
              {guest ? guest.name : 'Invitado Especial'}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold block">
              Pases Asignados
            </span>
            <span className="text-sm sm:text-base font-black text-amber-300">
              {maxPasses} {maxPasses === 1 ? 'Pase' : 'Pases'}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Attending Selection */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-amber-200 font-semibold mb-2">
              ¿Podrás acompañarnos?
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAttending(true)}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                  attending
                    ? 'bg-emerald-600/30 border-emerald-400 text-emerald-200 shadow-lg'
                    : 'bg-black/30 border-white/10 text-stone-400 hover:border-white/20'
                }`}
              >
                <Check className={`w-4 h-4 ${attending ? 'text-emerald-400' : 'text-stone-500'}`} />
                <span>¡Sí, con mucho gusto!</span>
              </button>

              <button
                type="button"
                onClick={() => setAttending(false)}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                  !attending
                    ? 'bg-rose-900/40 border-rose-400 text-rose-200 shadow-lg'
                    : 'bg-black/30 border-white/10 text-stone-400 hover:border-white/20'
                }`}
              >
                <X className={`w-4 h-4 ${!attending ? 'text-rose-400' : 'text-stone-500'}`} />
                <span>No podré asistir</span>
              </button>
            </div>
          </div>

          {/* Pass Counter (only if attending) */}
          {attending && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs uppercase tracking-wider text-amber-200 font-semibold flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  <span>¿Cuántos pases confirmas?</span>
                </label>
                <span className="text-xs text-stone-400">
                  Máximo: {maxPasses}
                </span>
              </div>
              <div className="flex gap-2">
                {Array.from({ length: maxPasses }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setConfirmedPasses(num)}
                    className={`flex-1 py-2.5 rounded-xl border font-bold text-sm transition-all cursor-pointer ${
                      confirmedPasses === num
                        ? 'bg-amber-500/30 border-amber-400 text-amber-200 shadow-md scale-105'
                        : 'bg-black/30 border-white/10 text-stone-300 hover:border-white/30'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Phone */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>Teléfono / WhatsApp de contacto</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ej. +52 55 1234 5678"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white placeholder-stone-500 text-sm focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Dietary Restrictions / Allergies */}
          {attending && (
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1.5 flex items-center gap-1.5">
                <Utensils className="w-3.5 h-3.5 text-amber-400" />
                <span>Restricciones alimenticias o alergias (opcional)</span>
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ej. 1 vegetariano, alergia a mariscos..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white placeholder-stone-500 text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
          )}

          {/* Congratulations message */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1.5 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-amber-400" />
              <span>Mensaje especial o felicitaciones (opcional)</span>
            </label>
            <textarea
              rows={2}
              value={congratulations}
              onChange={(e) => setCongratulations(e.target.value)}
              placeholder="¡Les mandamos un fuerte abrazo y nuestros mejores deseos!"
              className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/15 text-white placeholder-stone-500 text-sm focus:outline-none focus:border-amber-400 resize-none"
            />
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3.5 px-6 rounded-2xl font-bold tracking-wider text-sm uppercase shadow-xl transition-all cursor-pointer ${themeConfig.buttonGradient} hover:brightness-110 active:scale-[0.98] disabled:opacity-50`}
            >
              {isSubmitting
                ? 'Guardando respuesta...'
                : attending
                ? '✨ Confirmar Mi Asistencia'
                : 'Enviar Respuesta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
