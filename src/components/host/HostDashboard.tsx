import React, { useState } from 'react';
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  Share2,
  Search,
  Download,
  Trash2,
  Edit2,
  Copy,
  ExternalLink,
  MessageCircle,
  Phone,
  Filter,
} from 'lucide-react';
import { EventItem, Guest } from '../../types';
import { AppStore, THEME_CONFIGS } from '../../lib/store';
import { exportGuestsToCsv } from '../../lib/googleSheets';
import { useToast } from '../ui/Toast';

interface HostDashboardProps {
  event: EventItem;
  onPreviewGuest: (guest: Guest) => void;
  onEventChange: (event: EventItem) => void;
}

export const HostDashboard: React.FC<HostDashboardProps> = ({
  event,
  onPreviewGuest,
}) => {
  const { showToast } = useToast();
  const [guests, setGuests] = useState<Guest[]>(() => AppStore.getGuestsByEvent(event.id));

  // Quick Pass Generator Form State
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestPasses, setNewGuestPasses] = useState(2);
  const [newGuestPhone, setNewGuestPhone] = useState('');
  const [newGuestTable, setNewGuestTable] = useState('');

  // Table Filter and Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'pending' | 'declined'>('all');

  // Edit Guest Modal State
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);

  const refreshGuests = () => {
    setGuests(AppStore.getGuestsByEvent(event.id));
  };

  // Generate unique pass URL
  const generateGuestUrl = (guest: Guest) => {
    const origin = window.location.origin + window.location.pathname;
    return `${origin}?event=${event.slug}&code=${guest.passCode}&n=${encodeURIComponent(
      guest.name
    )}&p=${guest.assignedPasses}`;
  };

  // Pre-formatted WhatsApp Message
  const getWhatsAppMessage = (guest: Guest) => {
    const url = generateGuestUrl(guest);
    return `¡Hola ${guest.name}! ✨
Con mucha emoción los invitamos a celebrar con nosotros en: *${event.title}*.

Hemos reservado *${guest.assignedPasses} ${
      guest.assignedPasses === 1 ? 'pase' : 'pases'
    }* especialmente para ustedes.

Pueden consultar todos los detalles del evento (itinerario, mapas GPS, mesa de regalos) y confirmar su asistencia en su invitación digital personalizada aquí:
${url}

¡Esperamos contar con su valiosa presencia! ❤️`;
  };

  const handleShareWhatsApp = (guest: Guest) => {
    const message = getWhatsAppMessage(guest);
    const cleanPhone = guest.phone ? guest.phone.replace(/[^0-9]/g, '') : '';
    const waUrl = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  const handleCopyLink = (guest: Guest) => {
    const url = generateGuestUrl(guest);
    navigator.clipboard.writeText(url);
    showToast(`Enlace para ${guest.name} copiado al portapapeles`, 'success');
  };

  // Add Guest
  const handleAddGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim()) {
      showToast('Ingresa el nombre del invitado o familia', 'error');
      return;
    }

    const passCode = `${event.slug.substring(0, 3).toUpperCase()}-${Math.floor(
      100 + Math.random() * 900
    )}`;

    const added = AppStore.addGuest({
      eventId: event.id,
      name: newGuestName.trim(),
      assignedPasses: newGuestPasses,
      confirmedPasses: 0,
      status: 'pending',
      phone: newGuestPhone.trim() || undefined,
      tableNumber: newGuestTable.trim() || undefined,
      passCode,
    });

    setNewGuestName('');
    setNewGuestPasses(2);
    setNewGuestPhone('');
    setNewGuestTable('');
    refreshGuests();
    showToast(`Pase generado para ${added.name}`, 'success');
  };

  // Delete Guest
  const handleDeleteGuest = (id: string, name: string) => {
    if (confirm(`¿Eliminar el pase de "${name}"?`)) {
      AppStore.deleteGuest(id);
      refreshGuests();
      showToast('Invitado eliminado', 'info');
    }
  };

  // Edit Guest Submit
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGuest) return;

    AppStore.updateGuest(editingGuest.id, {
      name: editingGuest.name,
      assignedPasses: editingGuest.assignedPasses,
      confirmedPasses: editingGuest.confirmedPasses,
      status: editingGuest.status,
      phone: editingGuest.phone,
      tableNumber: editingGuest.tableNumber,
      notes: editingGuest.notes,
    });

    setEditingGuest(null);
    refreshGuests();
    showToast('Invitado actualizado con éxito', 'success');
  };

  // Calculations for KPIs
  const totalAssignedPasses = guests.reduce((acc, g) => acc + g.assignedPasses, 0);
  const totalConfirmedPasses = guests.reduce((acc, g) => acc + g.confirmedPasses, 0);
  const totalConfirmedGuests = guests.filter((g) => g.status === 'confirmed').length;
  const totalPendingGuests = guests.filter((g) => g.status === 'pending').length;
  const totalDeclinedGuests = guests.filter((g) => g.status === 'declined').length;
  const attendanceRate =
    totalAssignedPasses > 0 ? Math.round((totalConfirmedPasses / totalAssignedPasses) * 100) : 0;

  // Filtered List
  const filteredGuests = guests.filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.passCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (g.phone && g.phone.includes(searchTerm));
    const matchesStatus = statusFilter === 'all' || g.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const themeConfig = THEME_CONFIGS[event.theme] || THEME_CONFIGS.esmeralda;

  return (
    <div className="min-h-screen bg-[#0d0f12] text-stone-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
              <span>Panel del Anfitrión (Host Portal)</span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">
              {event.title}
            </h1>
            <p className="text-xs sm:text-sm text-stone-400 mt-1">
              Festejados: <strong className="text-amber-200">{event.hosts}</strong> • Fecha:{' '}
              {new Date(event.date).toLocaleDateString('es-MX', { dateStyle: 'medium' })}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => exportGuestsToCsv(guests, event.title)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-stone-200 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Descargar Excel / CSV</span>
            </button>
          </div>
        </div>

        {/* Real-time KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-stone-900/80 border border-white/10 shadow-lg">
            <div className="flex items-center justify-between text-stone-400 text-xs font-semibold mb-2">
              <span>Pases Asignados</span>
              <Users className="w-4 h-4 text-amber-400" />
            </div>
            <div className="font-heading text-2xl sm:text-3xl font-black text-white">
              {totalAssignedPasses}
            </div>
            <span className="text-[11px] text-stone-400 mt-1 block">
              en {guests.length} invitaciones
            </span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 shadow-lg">
            <div className="flex items-center justify-between text-emerald-300 text-xs font-semibold mb-2">
              <span>Pases Confirmados</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="font-heading text-2xl sm:text-3xl font-black text-emerald-400">
              {totalConfirmedPasses}
            </div>
            <span className="text-[11px] text-emerald-300/80 mt-1 block">
              {totalConfirmedGuests} familias confirmadas
            </span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-amber-950/40 border border-amber-500/30 shadow-lg">
            <div className="flex items-center justify-between text-amber-300 text-xs font-semibold mb-2">
              <span>Pendientes</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="font-heading text-2xl sm:text-3xl font-black text-amber-300">
              {totalPendingGuests}
            </div>
            <span className="text-[11px] text-amber-300/80 mt-1 block">
              Familias por responder
            </span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-rose-950/40 border border-rose-500/30 shadow-lg">
            <div className="flex items-center justify-between text-rose-300 text-xs font-semibold mb-2">
              <span>Declinaron</span>
              <XCircle className="w-4 h-4 text-rose-400" />
            </div>
            <div className="font-heading text-2xl sm:text-3xl font-black text-rose-400">
              {totalDeclinedGuests}
            </div>
            <span className="text-[11px] text-rose-300/80 mt-1 block">
              No podrán asistir
            </span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-stone-900/80 border border-white/10 shadow-lg col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between text-stone-400 text-xs font-semibold mb-2">
              <span>Tasa de Asistencia</span>
              <span className="text-amber-400 font-bold">%</span>
            </div>
            <div className="font-heading text-2xl sm:text-3xl font-black text-amber-200">
              {attendanceRate}%
            </div>
            <span className="text-[11px] text-stone-400 mt-1 block">
              de ocupación esperada
            </span>
          </div>
        </div>

        {/* Quick Pass Generator Card */}
        <div className="p-6 rounded-3xl bg-stone-900/60 border border-white/10 shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <Plus className="w-5 h-5 text-amber-400" />
            <h2 className="font-heading text-lg font-bold text-white">
              Generador Rápido de Pases
            </h2>
          </div>

          <form onSubmit={handleAddGuest} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="lg:col-span-2">
              <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                Nombre de Familia o Invitado *
              </label>
              <input
                type="text"
                required
                value={newGuestName}
                onChange={(e) => setNewGuestName(e.target.value)}
                placeholder="Ej. Familia Gómez Herrera"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white placeholder-stone-500 text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                Pases Asignados *
              </label>
              <input
                type="number"
                min={1}
                max={20}
                required
                value={newGuestPasses}
                onChange={(e) => setNewGuestPasses(parseInt(e.target.value, 10) || 1)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                WhatsApp (Opcional)
              </label>
              <input
                type="tel"
                value={newGuestPhone}
                onChange={(e) => setNewGuestPhone(e.target.value)}
                placeholder="+52 55..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white placeholder-stone-500 text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer ${themeConfig.buttonGradient} hover:brightness-110 active:scale-95 flex items-center justify-center gap-1.5`}
              >
                <Plus className="w-4 h-4" />
                <span>Generar Pase</span>
              </button>
            </div>
          </form>
        </div>

        {/* Guest Management Table */}
        <div className="p-6 rounded-3xl bg-stone-900/60 border border-white/10 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <h2 className="font-heading text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-400" />
              <span>Lista de Invitados ({filteredGuests.length})</span>
            </h2>

            {/* Search and Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nombre o código..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white placeholder-stone-500 text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
                {(['all', 'confirmed', 'pending', 'declined'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                      statusFilter === status
                        ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30'
                        : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    {status === 'all'
                      ? 'Todos'
                      : status === 'confirmed'
                      ? 'Confirmados'
                      : status === 'pending'
                      ? 'Pendientes'
                      : 'Declinados'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-left text-xs">
              <thead className="bg-black/60 text-stone-400 uppercase tracking-wider font-semibold border-b border-white/10">
                <tr>
                  <th className="py-3 px-4">Invitado / Familia</th>
                  <th className="py-3 px-3">Código</th>
                  <th className="py-3 px-3 text-center">Pases Asig.</th>
                  <th className="py-3 px-3 text-center">Confirmados</th>
                  <th className="py-3 px-3">Estado</th>
                  <th className="py-3 px-4">Notas / Alergias</th>
                  <th className="py-3 px-4 text-right">Acciones Directas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredGuests.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-stone-500">
                      No se encontraron invitados con los filtros seleccionados.
                    </td>
                  </tr>
                ) : (
                  filteredGuests.map((guest) => (
                    <tr key={guest.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-white">
                        <div className="flex flex-col">
                          <span>{guest.name}</span>
                          {guest.phone && (
                            <span className="text-[11px] text-stone-400 font-normal">
                              {guest.phone}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-3 font-mono text-stone-300">
                        {guest.passCode}
                      </td>
                      <td className="py-3.5 px-3 text-center font-bold text-stone-200">
                        {guest.assignedPasses}
                      </td>
                      <td className="py-3.5 px-3 text-center font-bold">
                        <span
                          className={
                            guest.confirmedPasses > 0
                              ? 'text-emerald-400'
                              : guest.status === 'declined'
                              ? 'text-rose-400'
                              : 'text-stone-500'
                          }
                        >
                          {guest.confirmedPasses}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        {guest.status === 'confirmed' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold">
                            <CheckCircle2 className="w-3 h-3" /> Confirmado
                          </span>
                        ) : guest.status === 'declined' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-950/80 border border-rose-500/40 text-rose-300 text-[11px] font-bold">
                            <XCircle className="w-3 h-3" /> Declinado
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-[11px] font-bold">
                            <Clock className="w-3 h-3" /> Pendiente
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 max-w-xs truncate text-stone-400">
                        {guest.notes ? (
                          <span className="text-amber-200/90 font-medium" title={guest.notes}>
                            ⚠️ {guest.notes}
                          </span>
                        ) : guest.congratulations ? (
                          <span className="italic" title={guest.congratulations}>
                            💬 {guest.congratulations}
                          </span>
                        ) : (
                          <span className="text-stone-600">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Share on WhatsApp */}
                          <button
                            onClick={() => handleShareWhatsApp(guest)}
                            className="p-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/40 text-emerald-300 transition-colors"
                            title="Compartir invitación por WhatsApp con mensaje pre-redactado"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>

                          {/* Copy Link */}
                          <button
                            onClick={() => handleCopyLink(guest)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-stone-300 hover:text-white transition-colors"
                            title="Copiar enlace único"
                          >
                            <Copy className="w-4 h-4" />
                          </button>

                          {/* Preview as Guest */}
                          <button
                            onClick={() => onPreviewGuest(guest)}
                            className="p-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 transition-colors"
                            title="Ver vista previa de la invitación como este invitado"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>

                          {/* Edit Guest */}
                          <button
                            onClick={() => setEditingGuest(guest)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-stone-400 hover:text-white transition-colors"
                            title="Editar pase"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDeleteGuest(guest.id, guest.name)}
                            className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 text-rose-400 hover:text-rose-200 transition-colors"
                            title="Eliminar invitado"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Guest Modal */}
      {editingGuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-3xl bg-stone-900 border border-white/20 shadow-2xl space-y-4">
            <h3 className="font-heading text-lg font-bold text-white">
              Editar Pase de Invitación
            </h3>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase text-stone-400 font-semibold mb-1">
                  Nombre de Familia / Invitado
                </label>
                <input
                  type="text"
                  required
                  value={editingGuest.name}
                  onChange={(e) => setEditingGuest({ ...editingGuest, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase text-stone-400 font-semibold mb-1">
                    Pases Asignados
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={editingGuest.assignedPasses}
                    onChange={(e) =>
                      setEditingGuest({
                        ...editingGuest,
                        assignedPasses: parseInt(e.target.value, 10) || 1,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase text-stone-400 font-semibold mb-1">
                    Pases Confirmados
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={editingGuest.confirmedPasses}
                    onChange={(e) =>
                      setEditingGuest({
                        ...editingGuest,
                        confirmedPasses: parseInt(e.target.value, 10) || 0,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase text-stone-400 font-semibold mb-1">
                  Estado
                </label>
                <select
                  value={editingGuest.status}
                  onChange={(e) =>
                    setEditingGuest({
                      ...editingGuest,
                      status: e.target.value as Guest['status'],
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-white text-sm"
                >
                  <option value="pending">Pendiente</option>
                  <option value="confirmed">Confirmado</option>
                  <option value="declined">Declinado</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase text-stone-400 font-semibold mb-1">
                  Notas de Alergias
                </label>
                <input
                  type="text"
                  value={editingGuest.notes || ''}
                  onChange={(e) => setEditingGuest({ ...editingGuest, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-white text-sm"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingGuest(null)}
                  className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-stone-300 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
