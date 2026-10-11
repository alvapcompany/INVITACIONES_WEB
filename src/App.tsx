/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ToastProvider } from './components/ui/Toast';
import { Navbar, ActiveTab } from './components/Navbar';
import { ShowroomView } from './components/showroom/ShowroomView';
import { InvitationView } from './components/invitation/InvitationView';
import { HostDashboard } from './components/host/HostDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AppStore } from './lib/store';
import { EventItem, Guest } from './types';

export default function App() {
  const [events, setEvents] = useState<EventItem[]>(() => AppStore.getEvents());
  const [activeEvent, setActiveEvent] = useState<EventItem>(() => events[0]);
  const [guests, setGuests] = useState<Guest[]>(() =>
    AppStore.getGuestsByEvent(events[0]?.id || '')
  );
  const [activeGuest, setActiveGuest] = useState<Guest | undefined>(() => guests[0]);

  const [activeTab, setActiveTab] = useState<ActiveTab>('showroom');
  const [isMockupMode, setIsMockupMode] = useState(false);

  // Parse URL Search Parameters (e.g., ?event=valeria-xv&n=Familia+Gómez&p=3)
  useEffect(() => {
    AppStore.init();
    const loadedEvents = AppStore.getEvents();
    setEvents(loadedEvents);

    const params = new URLSearchParams(window.location.search);
    const eventSlugOrId = params.get('event');
    const guestNameParam = params.get('n');
    const passesParam = params.get('p');
    const codeParam = params.get('code');

    let targetEvent = loadedEvents[0];

    if (eventSlugOrId) {
      const match = loadedEvents.find(
        (e) => e.slug === eventSlugOrId || e.id === eventSlugOrId
      );
      if (match) targetEvent = match;
    }

    setActiveEvent(targetEvent);

    const eventGuests = AppStore.getGuestsByEvent(targetEvent.id);
    setGuests(eventGuests);

    // If custom URL params for guest name and passes are provided
    if (guestNameParam) {
      let matchedGuest = eventGuests.find(
        (g) => g.name.toLowerCase() === guestNameParam.toLowerCase() || g.passCode === codeParam
      );

      if (!matchedGuest) {
        // Create personalized pass on the fly
        const newPasses = passesParam ? parseInt(passesParam, 10) || 2 : 2;
        matchedGuest = AppStore.addGuest({
          eventId: targetEvent.id,
          name: guestNameParam,
          assignedPasses: newPasses,
          confirmedPasses: 0,
          status: 'pending',
          passCode: codeParam || `PASS-${Math.floor(100 + Math.random() * 900)}`,
        });
        setGuests(AppStore.getGuestsByEvent(targetEvent.id));
      }

      setActiveGuest(matchedGuest);
      // Switch straight to personalized invitation
      setActiveTab('invitation');
    } else {
      setActiveGuest(eventGuests[0]);
    }
  }, []);

  // Update guests when active event changes
  const handleEventChange = (newEvent: EventItem) => {
    setActiveEvent(newEvent);
    const updatedGuests = AppStore.getGuestsByEvent(newEvent.id);
    setGuests(updatedGuests);
    setActiveGuest(updatedGuests[0]);
  };

  const handleRefreshStore = () => {
    const refreshedEvents = AppStore.getEvents();
    setEvents(refreshedEvents);
    const currentStillExists = refreshedEvents.find((e) => e.id === activeEvent.id);
    const curr = currentStillExists || refreshedEvents[0];
    setActiveEvent(curr);
    const updatedGuests = AppStore.getGuestsByEvent(curr.id);
    setGuests(updatedGuests);
    setActiveGuest(updatedGuests[0]);
  };

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#090b0e] flex flex-col font-sans-modern selection:bg-amber-400 selection:text-black">
        {/* Navigation Bar */}
        <Navbar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          events={events}
          activeEvent={activeEvent}
          onEventChange={handleEventChange}
          guests={guests}
          activeGuest={activeGuest}
          onGuestChange={setActiveGuest}
          isMockupMode={isMockupMode}
          onToggleMockupMode={() => setIsMockupMode(!isMockupMode)}
        />

        {/* View Switcher */}
        <main className="flex-1">
          {activeTab === 'showroom' && (
            <ShowroomView
              events={events}
              onSelectDemoEvent={(ev) => {
                handleEventChange(ev);
                setActiveTab('invitation');
              }}
              onOpenHostPanel={(ev) => {
                handleEventChange(ev);
                setActiveTab('host');
              }}
            />
          )}

          {activeTab === 'invitation' && (
            <InvitationView
              event={activeEvent}
              guest={activeGuest}
              isMockupMode={isMockupMode}
              onRsvpUpdated={() => {
                const refreshed = AppStore.getGuestsByEvent(activeEvent.id);
                setGuests(refreshed);
                const current = refreshed.find((g) => g.id === activeGuest?.id);
                if (current) setActiveGuest(current);
              }}
            />
          )}

          {activeTab === 'host' && (
            <HostDashboard
              event={activeEvent}
              onPreviewGuest={(selectedGuest) => {
                setActiveGuest(selectedGuest);
                setActiveTab('invitation');
              }}
              onEventChange={handleEventChange}
            />
          )}

          {activeTab === 'admin' && (
            <AdminDashboard
              events={events}
              activeEvent={activeEvent}
              onSelectEvent={handleEventChange}
              onEventUpdated={handleRefreshStore}
            />
          )}
        </main>
      </div>
    </ToastProvider>
  );
}
