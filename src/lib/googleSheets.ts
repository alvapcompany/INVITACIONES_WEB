import { Guest, EventItem } from '../types';
import { getAccessToken } from './googleAuth';

/**
 * Google Sheets Integration Helper
 * Supports:
 * 1. Google Sheets REST API via OAuth token
 * 2. Webhook sync via Google Apps Script (ideal for GitHub Pages static deployments)
 * 3. Client-side CSV direct export
 */

export interface SyncResult {
  success: boolean;
  message: string;
  count?: number;
  data?: any;
}

// Format guests to 2D array for Google Sheets
export function formatGuestsForSheet(guests: Guest[]): string[][] {
  const header = [
    'ID',
    'Código de Pase',
    'Nombre de Familia / Invitado',
    'Pases Asignados',
    'Pases Confirmados',
    'Estado',
    'Teléfono',
    'Restricciones / Alergias',
    'Mensaje / Felicitaciones',
    'Fecha Confirmación',
  ];

  const rows = guests.map((g) => [
    g.id,
    g.passCode,
    g.name,
    String(g.assignedPasses),
    String(g.confirmedPasses),
    g.status === 'confirmed' ? 'Confirmado' : g.status === 'declined' ? 'Declinado' : 'Pendiente',
    g.phone || '',
    g.notes || '',
    g.congratulations || '',
    g.confirmationDate || '',
  ]);

  return [header, ...rows];
}

/**
 * Send RSVP confirmation to Google Apps Script Webhook
 * Used in static deployments (GitHub Pages)
 */
export async function sendRsvpToAppsScript(
  webhookUrl: string,
  guest: Guest,
  event: EventItem
): Promise<SyncResult> {
  if (!webhookUrl || !webhookUrl.startsWith('http')) {
    return { success: false, message: 'URL de Apps Script no configurada.' };
  }

  try {
    const payload = {
      action: 'rsvp_update',
      eventId: event.id,
      eventTitle: event.title,
      guestId: guest.id,
      guestName: guest.name,
      passCode: guest.passCode,
      assignedPasses: guest.assignedPasses,
      confirmedPasses: guest.confirmedPasses,
      status: guest.status,
      phone: guest.phone || '',
      notes: guest.notes || '',
      congratulations: guest.congratulations || '',
      timestamp: new Date().toISOString(),
    };

    // Google Apps Script usually returns redirect 302, mode: 'no-cors' is safe for webhook
    await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
      mode: 'no-cors',
    });

    return {
      success: true,
      message: 'Confirmación enviada a Google Sheets exitosamente.',
    };
  } catch (error: any) {
    console.error('Error syncing with Apps Script:', error);
    return {
      success: false,
      message: `Error al enviar a Google Sheets: ${error.message || 'Error de red'}`,
    };
  }
}

/**
 * Sync entire guest list to Google Sheets using Google Workspace OAuth
 */
export async function syncGuestsToGoogleSheet(
  spreadsheetId: string,
  sheetName: string,
  guests: Guest[]
): Promise<SyncResult> {
  const token = await getAccessToken();
  if (!token) {
    return {
      success: false,
      message: 'Debes iniciar sesión con Google para sincronizar directamente con Sheets.',
    };
  }

  try {
    const values = formatGuestsForSheet(guests);
    const range = `${sheetName || 'Invitados'}!A1:J${values.length}`;

    // Clear old values then write updated values
    const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
      range
    )}?valueInputOption=USER_ENTERED`;

    const res = await fetch(updateUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        range,
        majorDimension: 'ROWS',
        values,
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `HTTP ${res.status}`);
    }

    return {
      success: true,
      message: `Sincronizados ${guests.length} invitados con tu hoja de cálculo.`,
      count: guests.length,
    };
  } catch (error: any) {
    console.error('Error writing to Google Sheets:', error);
    return {
      success: false,
      message: `Error al sincronizar con Google Sheets: ${error.message}`,
    };
  }
}

/**
 * Fetch guest list from Google Sheets using Google Workspace OAuth
 */
export async function fetchGuestsFromGoogleSheet(
  spreadsheetId: string,
  sheetName: string,
  eventId: string
): Promise<{ success: boolean; guests?: Guest[]; message: string }> {
  const token = await getAccessToken();
  if (!token) {
    return {
      success: false,
      message: 'Inicia sesión con Google para importar desde Google Sheets.',
    };
  }

  try {
    const range = `${sheetName || 'Invitados'}!A2:J200`;
    const getUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
      range
    )}`;

    const res = await fetch(getUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `HTTP ${res.status}`);
    }

    const json = await res.json();
    const rows: string[][] = json.values || [];

    const importedGuests: Guest[] = rows.map((row, index) => {
      const id = row[0] || `g-${Date.now()}-${index}`;
      const passCode = row[1] || `PASS-${Math.floor(100 + Math.random() * 900)}`;
      const name = row[2] || `Invitado ${index + 1}`;
      const assigned = parseInt(row[3], 10) || 2;
      const confirmed = parseInt(row[4], 10) || 0;
      const statusRaw = (row[5] || '').toLowerCase();
      let status: Guest['status'] = 'pending';
      if (statusRaw.includes('confirma') || statusRaw === 'si') status = 'confirmed';
      if (statusRaw.includes('declina') || statusRaw === 'no') status = 'declined';

      return {
        id,
        eventId,
        name,
        passCode,
        assignedPasses: assigned,
        confirmedPasses: confirmed,
        status,
        phone: row[6] || '',
        notes: row[7] || '',
        congratulations: row[8] || '',
        confirmationDate: row[9] || '',
      };
    });

    return {
      success: true,
      guests: importedGuests,
      message: `Se importaron ${importedGuests.length} invitados desde Google Sheets.`,
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Error al leer de Google Sheets: ${error.message}`,
    };
  }
}

/**
 * Generate client-side CSV download
 */
export function exportGuestsToCsv(guests: Guest[], eventTitle: string) {
  const rows = formatGuestsForSheet(guests);
  const csvContent =
    'data:text/csv;charset=utf-8,\uFEFF' +
    rows
      .map((row) =>
        row
          .map((cell) => `"${(cell || '').replace(/"/g, '""')}"`)
          .join(',')
      )
      .join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `EventPass_Invitados_${eventTitle.replace(/\s+/g, '_')}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
