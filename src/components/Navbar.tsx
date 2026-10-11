import React from 'react';
import {
  Sparkles,
  Mail,
  Users,
  Settings,
  Smartphone,
  Maximize2,
  Calendar,
  Layers,
} from 'lucide-react';
import { EventItem, Guest } from '../types';

export type ActiveTab = 'showroom' | 'invitation' | 'host' | 'admin';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  events: EventItem[];
  activeEvent: EventItem;
  onEventChange: (event: EventItem) => void;
  guests: Guest[];
  activeGuest?: Guest;
  onGuestChange: (guest: Guest) => void;
  isMockupMode: boolean;
  onToggleMockupMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  events,
  activeEvent,
  onEventChange,
  guests,
  activeGuest,
  onGuestChange,
  isMockupMode,
  onToggleMockupMode,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0c0f13]/90 backdrop-blur-xl border-b border-white/10 px-3 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & Main Tab Switcher */}
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <div
            onClick={() => onTabChange('showroom')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-stone-950 font-black shadow-md group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-heading font-black text-sm text-white tracking-widest block leading-none">
                EVENTPASS
              </span>
              <span className="text-[10px] text-amber-300/80 font-medium tracking-wider">
                Alva P Studio
              </span>
            </div>
          </div>

          {/* Navigation Pill Buttons */}
          <nav className="flex items-center gap-1 bg-stone-900/90 p-1 rounded-2xl border border-white/10 text-xs">
            <button
              onClick={() => onTabChange('showroom')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
                activeTab === 'showroom'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Showroom</span>
            </button>

            <button
              onClick={() => onTabChange('invitation')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
                activeTab === 'invitation'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Invitación</span>
            </button>

            <button
              onClick={() => onTabChange('host')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
                activeTab === 'host'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Anfitrión</span>
            </button>

            <button
              onClick={() => onTabChange('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Admin</span>
            </button>
          </nav>
        </div>

        {/* Secondary controls: Event Selector, Guest Switcher, Mockup Mode */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
          {/* Active Event Selector */}
          <div className="flex items-center gap-1 bg-stone-900/80 px-2.5 py-1 rounded-xl border border-white/10 text-xs">
            <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <select
              value={activeEvent.id}
              onChange={(e) => {
                const found = events.find((ev) => ev.id === e.target.value);
                if (found) onEventChange(found);
              }}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer max-w-[130px] sm:max-w-[170px] truncate"
            >
              {events.map((ev) => (
                <option key={ev.id} value={ev.id} className="bg-stone-900 text-white">
                  {ev.title}
                </option>
              ))}
            </select>
          </div>

          {/* Guest Simulator (when previewing invitation) */}
          {activeTab === 'invitation' && (
            <>
              <div className="flex items-center gap-1 bg-stone-900/80 px-2 py-1 rounded-xl border border-white/10 text-xs">
                <span className="text-[10px] uppercase text-stone-400 font-bold hidden sm:inline">
                  Pase:
                </span>
                <select
                  value={activeGuest?.id || ''}
                  onChange={(e) => {
                    const found = guests.find((g) => g.id === e.target.value);
                    if (found) onGuestChange(found);
                  }}
                  className="bg-transparent text-amber-300 font-medium focus:outline-none cursor-pointer max-w-[120px] sm:max-w-[150px] truncate"
                >
                  {guests.map((g) => (
                    <option key={g.id} value={g.id} className="bg-stone-900 text-white">
                      {g.name} ({g.assignedPasses} pases)
                    </option>
                  ))}
                </select>
              </div>

              {/* Mockup mode toggle */}
              <button
                onClick={onToggleMockupMode}
                className={`p-1.5 rounded-xl border transition-colors ${
                  isMockupMode
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                    : 'bg-white/5 border-white/10 text-stone-400 hover:text-white'
                }`}
                title={isMockupMode ? 'Vista Pantalla Completa' : 'Vista Mockup Smartphone'}
              >
                {isMockupMode ? <Maximize2 className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
