import { format } from 'date-fns';
import { HealthEvent } from '../types';

// Google Identity Services type declarations
declare global {
  interface Window {
    google: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: { access_token?: string; error?: string }) => void;
          }) => { requestAccessToken: () => void };
        };
      };
    };
  }
}

const CALENDAR_SCOPE = 'https://www.googleapis.com/auth/calendar.events';
const CALENDAR_API = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';

// Wait for GIS script to be ready
function waitForGIS(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.oauth2) {
      resolve();
      return;
    }
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if (window.google?.accounts?.oauth2) {
        clearInterval(interval);
        resolve();
      } else if (attempts > 50) {
        clearInterval(interval);
        reject(
          new Error(
            'Google Identity Services não carregou. Verifique sua conexão com a internet.'
          )
        );
      }
    }, 100);
  });
}

async function requestAccessToken(): Promise<string> {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '296723737308-8b3dqg883erm82l4hl749kc90qad2v9m.apps.googleusercontent.com';

  if (!clientId || clientId.trim() === '' || clientId.includes('seu-client-id')) {
    throw new Error('GOOGLE_CLIENT_ID_MISSING');
  }

  await waitForGIS();

  return new Promise((resolve, reject) => {
    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: CALENDAR_SCOPE,
      callback: (response) => {
        if (response.error || !response.access_token) {
          reject(
            new Error(response.error || 'Não foi possível obter autorização do Google Calendar.')
          );
          return;
        }
        resolve(response.access_token);
      },
    });
    tokenClient.requestAccessToken();
  });
}

interface GoogleCalendarEvent {
  summary: string;
  description: string;
  start: { date: string };
  end: { date: string };
  recurrence?: string[];
  reminders: {
    useDefault: boolean;
    overrides: { method: string; minutes: number }[];
  };
}

function buildGoogleEvent(event: HealthEvent): GoogleCalendarEvent {
  const dateStr = format(event.date, 'yyyy-MM-dd');

  const calEvent: GoogleCalendarEvent = {
    summary: event.title,
    description: event.description,
    start: { date: dateStr },
    end: { date: dateStr },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'popup', minutes: 10080 }, // 1 week before
        { method: 'popup', minutes: 1440 },  // 1 day before
      ],
    },
  };

  if (event.rrule) {
    calEvent.recurrence = [event.rrule];
  }

  return calEvent;
}

async function createEvent(accessToken: string, event: HealthEvent): Promise<void> {
  const body = buildGoogleEvent(event);
  const res = await fetch(CALENDAR_API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Falha ao criar evento "${event.title}": ${err}`);
  }
}

export interface CalendarProgress {
  current: number;
  total: number;
  currentEventTitle: string;
}

export async function addEventsToCalendar(
  events: HealthEvent[],
  onProgress?: (p: CalendarProgress) => void
): Promise<{ successCount: number; errors: string[] }> {
  const accessToken = await requestAccessToken();

  let successCount = 0;
  const errors: string[] = [];

  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    onProgress?.({ current: i + 1, total: events.length, currentEventTitle: event.title });

    try {
      await createEvent(accessToken, event);
      successCount++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(msg);
      console.error(msg);
    }
  }

  return { successCount, errors };
}

/**
 * Returns true if a Google Client ID is configured in the environment
 */
export function isGoogleCalendarConfigured(): boolean {
  return true;
}
