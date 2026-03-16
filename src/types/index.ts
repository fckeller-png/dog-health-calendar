export type DogSize = 'small' | 'medium' | 'large';
export type ActivityLevel = 'low' | 'medium' | 'high';
export type EventType = 'vaccine' | 'deworming' | 'flea' | 'checkup';
export type AppScreen = 'landing' | 'form' | 'loading' | 'results' | 'success';

export interface DogData {
  name: string;
  birthDate: string;          // ISO date string, e.g. "2023-06-15"
  breed: string;
  size: DogSize;
  weight: string;             // kg, stored as string for input compatibility
  activityLevel: ActivityLevel;
  city: string;
  country: string;
  hasVaccinationHistory: boolean;
}

export interface HealthEvent {
  id: string;
  date: Date;
  type: EventType;
  title: string;
  description: string;
  /** RRULE string for recurring events, e.g. "RRULE:FREQ=MONTHLY;COUNT=12" */
  rrule?: string;
  /** Human-readable frequency label, e.g. "Mensal" */
  frequencyLabel?: string;
  /** How many times the event recurs (for Google Calendar display) */
  recurrenceCount?: number;
}

export interface HealthPlan {
  diagnosis: string;
  events: HealthEvent[];
  imageUrl: string;
}

export const SIZE_LABELS: Record<DogSize, string> = {
  small: 'Pequeno',
  medium: 'Médio',
  large: 'Grande',
};

export const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  low: 'Baixo',
  medium: 'Moderado',
  high: 'Alto',
};

export const EVENT_TYPE_CONFIG: Record<
  EventType,
  { emoji: string; label: string; badgeClass: string }
> = {
  vaccine: {
    emoji: '💉',
    label: 'Vacinação',
    badgeClass: 'bg-blue-100 text-blue-700',
  },
  deworming: {
    emoji: '💊',
    label: 'Vermífugo',
    badgeClass: 'bg-purple-100 text-purple-700',
  },
  flea: {
    emoji: '🛡️',
    label: 'Antipulgas',
    badgeClass: 'bg-orange-100 text-orange-700',
  },
  checkup: {
    emoji: '🩺',
    label: 'Check-up',
    badgeClass: 'bg-green-100 text-green-700',
  },
};
