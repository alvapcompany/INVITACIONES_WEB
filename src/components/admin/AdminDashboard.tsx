import React, { useState, useEffect } from 'react';
import {
  Settings,
  Plus,
  RefreshCw,
  Sheet,
  FileSpreadsheet,
  Globe,
  CheckCircle,
  ExternalLink,
  Code2,
  Trash2,
  Edit3,
  Calendar,
  Sparkles,
  LogIn,
  LogOut,
  UserCheck,
  AlertTriangle,
} from 'lucide-react';
import { EventItem, Guest, ThemeId } from '../../types';
import { AppStore, THEME_CONFIGS } from '../../lib/store';
import { googleSignIn, logoutGoogle, initAuth } from '../../lib/googleAuth';
import { syncGuestsToGoogleSheet, fetchGuestsFromGoogleSheet } from '../../lib/googleSheets';
import { useToast } from '../ui/Toast';

interface AdminDashboardProps {
  events: EventItem[];
  activeEvent: EventItem;
  onSelectEvent: (event: EventItem) => void;
  onEventUpdated: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  events,
  activeEvent,
  onSelectEvent,
  onEventUpdated,
}) => {
  const { showToast } = useToast();
  const [googleUser, setGoogleUser] = useState<any>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Sheet configuration for current event
  const [sheetId, setSheetId] = useState(activeEvent.googleSheetId || '');
  const [sheetName, setSheetName] = useState(activeEvent.googleSheetName || 'Invitados');
  const [webhookUrl, setWebhookUrl] = useState(activeEvent.appsScriptWebhookUrl || '');

  // Deployment Guide Modal Tab
  const [showDeployGuide, setShowDeployGuide] = useState(false);
  const [showNewEventModal, setShowNewEventModal] = useState(false);

  // New Event Form State
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventHosts, setNewEventHosts] = useState('');
  const [newEventType, setNewEventType] = useState<EventItem['type']>('xv');
  const [newEventTheme, setNewEventTheme] = useState<ThemeId>('esmeralda');
  const [newEventDate, setNewEventDate] = useState('2026-12-15T19:00:00');

  useEffect(() => {
    setSheetId(activeEvent.googleSheetId || '');
    setSheetName(activeEvent.googleSheetName || 'Invitados');
    setWebhookUrl(activeEvent.appsScriptWebhookUrl || '');
  }, [activeEvent]);

  useEffect(() => {
    const unsubscribe = initAuth(
      (user) => setGoogleUser(user),
      () => setGoogleUser(null)
    );
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const res = await googleSignIn();
      if (res) {
        setGoogleUser(res.user);
        showToast(`Conectado como ${res.user.displayName || res.user.email}`, 'success');
      }
    } catch (err: any) {
      showToast(`Error de autenticación Google: ${err.message}`, 'error');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleLogout = async () => {
    await logoutGoogle();
    setGoogleUser(null);
    showToast('Sesión de Google cerrada', 'info');
  };

  const handleSaveIntegration = () => {
    const updated = {
      ...activeEvent,
      googleSheetId: sheetId.trim(),
      googleSheetName: sheetName.trim(),
      appsScriptWebhookUrl: webhookUrl.trim(),
    };
    AppStore.saveEvent(updated);
    onSelectEvent(updated);
    onEventUpdated();
    showToast('Configuración de sincronización guardada', 'success');
  };

  const handlePushToSheets = async () => {
    if (!sheetId) {
      showToast('Ingresa el ID de la Hoja de Google Sheets primero.', 'error');
      return;
    }
    setIsSyncing(true);
    try {
      const guests = AppStore.getGuestsByEvent(activeEvent.id);
      const res = await syncGuestsToGoogleSheet(sheetId, sheetName, guests);
      if (res.success) {
        showToast(res.message, 'success');
      } else {
        showToast(res.message, 'error');
      }
    } finally {
      setIsSyncing(false);
    }
  };

  const handlePullFromSheets = async () => {
    if (!sheetId) {
      showToast('Ingresa el ID de la Hoja de Google Sheets primero.', 'error');
      return;
    }
    setIsSyncing(true);
    try {
      const res = await fetchGuestsFromGoogleSheet(sheetId, sheetName, activeEvent.id);
      if (res.success && res.guests) {
        AppStore.importGuests(res.guests);
        onEventUpdated();
        showToast(res.message, 'success');
      } else {
        showToast(res.message, 'error');
      }
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCreateNewEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim() || !newEventHosts.trim()) {
      showToast('Completa los campos obligatorios', 'error');
      return;
    }

    const slug = newEventTitle
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const createdEvent: EventItem = {
      id: `ev-${Date.now()}`,
      slug: slug || `evento-${Date.now()}`,
      title: newEventTitle.trim(),
      type: newEventType,
      hosts: newEventHosts.trim(),
      date: newEventDate,
      theme: newEventTheme,
      phrase: 'Celebrar los momentos más importantes junto a quienes amamos hace que los recuerdos duren por siempre.',
      musicUrl: 'https://cdn.freesound.org/previews/612/612711_5674468-lq.mp3',
      musicTitle: 'Vals de Ensueño',
      coverPhoto: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
      galleryPhotos: [
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      ],
      ceremony: {
        name: 'Ceremonia Solemne',
        address: 'Av. Reforma 500, Ciudad de México',
        time: '18:00 hrs',
        mapUrl: 'https://maps.google.com/?q=Av.+Reforma+500+CDMX',
        wazeUrl: 'https://waze.com/ul?q=Av.+Reforma+500+CDMX',
        uberAddress: 'Av. Reforma 500, CDMX',
      },
      reception: {
        name: 'Gran Salón de Gala',
        address: 'Calzada de los Leones 120, CDMX',
        time: '20:00 hrs',
        mapUrl: 'https://maps.google.com/?q=Calzada+de+los+Leones+120+CDMX',
        wazeUrl: 'https://waze.com/ul?q=Calzada+de+los+Leones+120+CDMX',
        uberAddress: 'Calzada de los Leones 120, CDMX',
      },
      itinerary: [
        { time: '18:00', title: 'Ceremonia', description: 'Recepción de invitados', iconName: 'church' },
        { time: '20:00', title: 'Recepción & Banquete', description: 'Cena y brindis', iconName: 'utensils' },
        { time: '22:00', title: 'Música & Fiesta', description: 'Pista de baile', iconName: 'sparkles' },
      ],
      dressCode: {
        type: 'Formal Elegante',
        description: 'Traje formal o de noche.',
        suggestedColors: ['#047857', '#1e293b', '#d4af37'],
        avoidColors: ['#ffffff'],
      },
      giftRegistry: {
        bankName: 'BBVA Bancomer',
        accountHolder: newEventHosts.trim(),
        clabe: '012180001234567890',
        bankNotes: `Concepto: Regalo ${newEventHosts}`,
      },
      rsvpDeadline: new Date(new Date(newEventDate).getTime() - 15 * 86400000).toISOString(),
      createdAt: new Date().toISOString(),
    };

    AppStore.saveEvent(createdEvent);
    // Seed sample guest
    AppStore.addGuest({
      eventId: createdEvent.id,
      name: 'Familia Invitada de Muestra',
      assignedPasses: 4,
      confirmedPasses: 0,
      status: 'pending',
      passCode: `${createdEvent.slug.substring(0, 3).toUpperCase()}-001`,
    });

    onSelectEvent(createdEvent);
    onEventUpdated();
    setShowNewEventModal(false);
    showToast(`Evento "${createdEvent.title}" creado con éxito`, 'success');
  };

  const handleResetDefaults = () => {
    if (confirm('¿Restablecer todos los eventos y listas de invitados a los valores iniciales de demostración?')) {
      AppStore.resetDefaults();
      onEventUpdated();
      showToast('Datos de demostración restaurados', 'info');
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0f12] text-stone-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Super Admin • Alva P Studio</span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">
              Gestión Global de Eventos & Integraciones
            </h1>
            <p className="text-xs sm:text-sm text-stone-400 mt-1">
              Administración multi-cliente, sincronización con Google Sheets / Drive y despliegue estático en GitHub Pages.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setShowDeployGuide(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/40 text-purple-200 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              <Globe className="w-4 h-4 text-purple-400" />
              <span>Guía GitHub Pages</span>
            </button>

            <button
              onClick={() => setShowNewEventModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-xs sm:text-sm font-bold shadow-lg transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Evento</span>
            </button>
          </div>
        </div>

        {/* Event Selector Cards */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-400" />
              <span>Eventos Registrados ({events.length})</span>
            </h2>
            <button
              onClick={handleResetDefaults}
              className="text-xs text-stone-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Restablecer Demos</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((ev) => {
              const theme = THEME_CONFIGS[ev.theme] || THEME_CONFIGS.esmeralda;
              const isSelected = ev.id === activeEvent.id;
              const guestCount = AppStore.getGuestsByEvent(ev.id).length;

              return (
                <div
                  key={ev.id}
                  onClick={() => onSelectEvent(ev)}
                  className={`relative p-5 rounded-3xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-stone-900/90 border-amber-400 ring-2 ring-amber-400/20 shadow-xl'
                      : 'bg-stone-900/40 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 border border-white/10 text-stone-300">
                      {theme.name}
                    </span>
                    <span className="text-xs text-stone-400 font-mono">
                      {new Date(ev.date).toLocaleDateString('es-MX', { dateStyle: 'short' })}
                    </span>
                  </div>

                  <h3 className="font-heading text-lg font-bold text-white mb-1">
                    {ev.title}
                  </h3>
                  <p className="text-xs text-stone-400 mb-4 truncate">
                    Festejado(s): <strong className="text-stone-200">{ev.hosts}</strong>
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
                    <span className="text-stone-400">
                      <strong className="text-amber-300 font-bold">{guestCount}</strong> pases generados
                    </span>
                    <span
                      className={`font-semibold ${
                        isSelected ? 'text-amber-300' : 'text-stone-400'
                      }`}
                    >
                      {isSelected ? '✓ Seleccionado' : 'Seleccionar'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Google Workspace & Google Sheets Integration Card */}
        <div className="p-6 rounded-3xl bg-stone-900/60 border border-white/10 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                <h2 className="font-heading text-xl font-bold text-white">
                  Sincronización Bidireccional con Google Sheets & Drive
                </h2>
              </div>
              <p className="text-xs text-stone-400 mt-1">
                Conecta tu cuenta de Google Workspace para sincronizar confirmaciones de invitados, importar listas o usar Apps Script en GitHub Pages.
              </p>
            </div>

            {/* Official Google Workspace Auth State */}
            <div>
              {googleUser ? (
                <div className="flex items-center gap-3 bg-emerald-950/60 border border-emerald-500/40 py-1.5 px-3 rounded-2xl">
                  <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div className="text-left text-xs">
                    <span className="font-semibold text-emerald-200 block truncate max-w-[160px]">
                      {googleUser.displayName || googleUser.email}
                    </span>
                    <span className="text-[10px] text-emerald-300/70">Google Workspace Conectado</span>
                  </div>
                  <button
                    onClick={handleGoogleLogout}
                    className="p-1 text-stone-400 hover:text-white transition-colors"
                    title="Cerrar sesión de Google"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleGoogleLogin}
                  disabled={isLoggingIn}
                  className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white hover:bg-stone-100 text-stone-900 text-xs font-bold shadow-md transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>{isLoggingIn ? 'Conectando...' : 'Iniciar Sesión con Google'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Sheet Config Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1">
                ID de la Hoja de Google Sheets
              </label>
              <input
                type="text"
                value={sheetId}
                onChange={(e) => setSheetId(e.target.value)}
                placeholder="Ej. 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white placeholder-stone-500 text-xs font-mono focus:outline-none focus:border-emerald-400"
              />
              <span className="text-[10px] text-stone-500 mt-1 block">
                Copia el ID largo de la URL de tu hoja: docs.google.com/spreadsheets/d/<strong>[ID]</strong>/edit
              </span>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1">
                Nombre de la Pestaña
              </label>
              <input
                type="text"
                value={sheetName}
                onChange={(e) => setSheetName(e.target.value)}
                placeholder="Invitados"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs focus:outline-none focus:border-emerald-400"
              />
              <span className="text-[10px] text-stone-500 mt-1 block">
                Nombre exacto de la pestaña dentro del archivo de Google Sheets.
              </span>
            </div>
          </div>

          {/* Webhook for GitHub Pages */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1">
              URL Webhook de Google Apps Script (Para GitHub Pages Estático)
            </label>
            <input
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/AKfycb.../exec"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white placeholder-stone-500 text-xs font-mono focus:outline-none focus:border-purple-400"
            />
            <span className="text-[10px] text-stone-500 mt-1 block">
              Al usar GitHub Pages, cualquier confirmación RSVP de los invitados se enviará automáticamente por HTTP POST a este Webhook para actualizar tu Google Sheet en tiempo real.
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
            <button
              onClick={handleSaveIntegration}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Guardar Configuración
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePushToSheets}
                disabled={isSyncing}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-stone-200 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>Enviar Invitados a Sheet (Push)</span>
              </button>

              <button
                onClick={handlePullFromSheets}
                disabled={isSyncing}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-stone-200 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-sky-400" />
                <span>Importar desde Sheet (Pull)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* GitHub Pages Deployment Guide Modal */}
      {showDeployGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-3xl p-6 sm:p-8 bg-stone-900 border border-purple-500/40 shadow-2xl my-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Globe className="w-6 h-6 text-purple-400" />
                <h3 className="font-heading text-xl font-bold text-white">
                  Guía de Despliegue en GitHub Pages (Arquitectura Estática)
                </h3>
              </div>
              <button
                onClick={() => setShowDeployGuide(false)}
                className="text-stone-400 hover:text-white text-xs font-semibold px-2 py-1 bg-white/5 rounded-lg"
              >
                Cerrar
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-stone-300 leading-relaxed">
              <p>
                Tu aplicación está diseñada con una arquitectura modular en <strong>React + Vite</strong> que genera un paquete estático optimizado (`dist/`), ideal para alojarse de forma 100% gratuita y ultrarrápida en <strong>GitHub Pages</strong>.
              </p>

              <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-3 font-mono text-xs">
                <p className="text-amber-300 font-sans font-bold">1. Configurar la base en vite.config.ts (si usas subcarpeta de repositorio):</p>
                <pre className="p-2.5 rounded-xl bg-stone-950 text-stone-300 overflow-x-auto">
{`// vite.config.ts
export default defineConfig({
  base: '/nombre-de-tu-repo/', // Reemplaza con el nombre de tu repositorio en GitHub
  // ... plugins
});`}
                </pre>

                <p className="text-amber-300 font-sans font-bold">2. Compilar el proyecto:</p>
                <pre className="p-2.5 rounded-xl bg-stone-950 text-stone-300 overflow-x-auto">
                  npm run build
                </pre>

                <p className="text-amber-300 font-sans font-bold">3. Desplegar en la rama gh-pages:</p>
                <pre className="p-2.5 rounded-xl bg-stone-950 text-stone-300 overflow-x-auto">
{`npx gh-pages -d dist`}
                </pre>
              </div>

              <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 text-purple-200">
                <h4 className="font-bold mb-1 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-purple-400" />
                  <span>¿Cómo funciona el RSVP en GitHub Pages sin servidor backend?</span>
                </h4>
                <p className="text-xs text-stone-300">
                  Cada vez que un invitado confirma su asistencia en su teléfono móvil, el componente RSVP guarda localmente en el dispositivo y envía simultáneamente una petición HTTP POST a tu Webhook de <strong>Google Apps Script</strong>. Apps Script añade la fila directamente a tu Google Sheet en tiempo real.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Event Creation Modal */}
      {showNewEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-stone-900 border border-white/20 shadow-2xl space-y-5">
            <h3 className="font-heading text-xl font-bold text-white">
              Crear Nuevo Evento / Cliente
            </h3>

            <form onSubmit={handleCreateNewEvent} className="space-y-4">
              <div>
                <label className="block text-xs uppercase text-stone-400 font-semibold mb-1">
                  Título del Evento *
                </label>
                <input
                  type="text"
                  required
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  placeholder="Ej. Mis XV Años - Camila Nicole"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs uppercase text-stone-400 font-semibold mb-1">
                  Festejado(s) o Pareja *
                </label>
                <input
                  type="text"
                  required
                  value={newEventHosts}
                  onChange={(e) => setNewEventHosts(e.target.value)}
                  placeholder="Ej. Camila Nicole"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase text-stone-400 font-semibold mb-1">
                    Tipo de Evento
                  </label>
                  <select
                    value={newEventType}
                    onChange={(e) => setNewEventType(e.target.value as EventItem['type'])}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-sm"
                  >
                    <option value="xv">XV Años</option>
                    <option value="boda">Boda</option>
                    <option value="fiesta">Fiesta VIP / Cocktail</option>
                    <option value="aniversario">Aniversario</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase text-stone-400 font-semibold mb-1">
                    Tema Visual
                  </label>
                  <select
                    value={newEventTheme}
                    onChange={(e) => setNewEventTheme(e.target.value as ThemeId)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-sm"
                  >
                    <option value="esmeralda">Esmeralda & Oro Imperial</option>
                    <option value="champagne">Blanco Perla & Champagne</option>
                    <option value="neon">Dark Onyx & Neón Glam</option>
                    <option value="zafiro">Azul Zafiro & Plata Estelar</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase text-stone-400 font-semibold mb-1">
                  Fecha y Hora del Evento
                </label>
                <input
                  type="datetime-local"
                  required
                  value={newEventDate}
                  onChange={(e) => setNewEventDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-sm"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowNewEventModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-stone-300 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold uppercase tracking-wider"
                >
                  Crear Evento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
