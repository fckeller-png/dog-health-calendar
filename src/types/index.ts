export type DogSize = 'small' | 'medium' | 'large';
export type ActivityLevel = 'low' | 'medium' | 'high';
export type EventType = 'vaccine' | 'deworming' | 'flea' | 'checkup';
export type AppScreen = 'landing' | 'form' | 'loading' | 'results' | 'success';
export type DewormingFrequency = 'monthly' | 'quarterly' | 'semiannual';

export interface DogData {
  name: string;
  birthDate: string;
  breed: string;
  size: DogSize;
  weight: string;
  activityLevel: ActivityLevel;
  city: string;
  country: string;
  lastVaccineDate: string;
  lastDewormingDate: string;
  dewormingFrequency: DewormingFrequency;
  lastFleaTreatmentDate: string;
  fleaTreatmentFrequency: 'monthly' | 'quarterly' | 'eighthmonths';
}

export interface HealthEvent {
  id: string;
  date: Date;
  type: EventType;
  title: string;
  description: string;
  rrule?: string;
  frequencyLabel?: string;
  recurrenceCount?: number;
}

export interface HealthPlan {
  diagnosis: string;
  events: HealthEvent[];
  imageUrl: string;
}

export const SIZE_LABELS: Record<DogSize, string> = {
  small: 'Pequeno',
  medium: 'Medio',
  large: 'Grande',
};

export const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  low: 'Baixo',
  medium: 'Moderado',
  high: 'Alto',
};

export const DEWORMING_FREQUENCY_LABELS: Record<DewormingFrequency, string> = {
  monthly: 'Mensal',
  quarterly: 'Trimestral',
  semiannual: 'Semestral',
};

export const EVENT_TYPE_CONFIG: Record<EventType, { emoji: string; label: string; badgeClass: string }> = {
  vaccine: {
    emoji: '💉',
    label: 'Vacinacao',
    badgeClass: 'bg-blue-100 text-blue-700',
  },
  deworming: {
    emoji: '💊',
    label: 'Vermifugo',
    badgeClass: 'bg-purple-100 text-purple-700',
  },
  flea: {
    emoji: '🐛',
    label: 'Antipulgas',
    badgeClass: 'bg-orange-100 text-orange-700',
  },
  checkup: {
    emoji: '🏥',
    label: 'Check-up',
    badgeClass: 'bg-green-100 text-green-700',
  },
};