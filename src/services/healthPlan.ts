import { addMonths, differenceInMonths } from 'date-fns';
import { DogData, DogSize, EventType, HealthEvent } from '../types';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

function getAgeInMonths(birthDate: string): number {
  const birth = new Date(birthDate);
  return differenceInMonths(new Date(), birth);
}

function makeEvent(
  date: Date,
  type: EventType,
  dogName: string,
  title: string,
  description: string,
  options?: { rrule?: string; frequencyLabel?: string; recurrenceCount?: number }
): HealthEvent {
  return {
    id: uid(),
    date,
    type,
    title,
    description: `${description}\n\n⚠️ Confirme estas datas com seu veterinário.`,
    ...options,
  };
}

// ─── Health Plan Generation ───────────────────────────────────────────────────

export function generateHealthEvents(dog: DogData): HealthEvent[] {
  const events: HealthEvent[] = [];
  const today = new Date();
  const ageMonths = getAgeInMonths(dog.birthDate);

  const isPuppy = ageMonths < 12;
  const isSenior = ageMonths >= 84; // 7+ years

  // ── 1. ANTIPULGAS / CARRAPATOS — Mensal ──────────────────────────────────
  events.push(
    makeEvent(
      addMonths(today, 1),
      'flea',
      dog.name,
      `Antipulgas e carrapatos — ${dog.name}`,
      dog.activityLevel === 'high'
        ? `${dog.name} é muito ativo e fica bastante exposto ao ambiente externo — a proteção mensal contra pulgas e carrapatos é essencial! Use o produto indicado pelo seu veterinário para o peso de ${dog.weight} kg.`
        : `Mês de aplicar a proteção contra pulgas e carrapatos em ${dog.name}. Use o produto indicado pelo seu veterinário na dosagem correta para ${dog.weight} kg.`,
      {
        rrule: 'RRULE:FREQ=MONTHLY;COUNT=12',
        frequencyLabel: 'Mensal',
        recurrenceCount: 12,
      }
    )
  );

  // ── 2. VERMÍFUGO — Trimestral ─────────────────────────────────────────────
  events.push(
    makeEvent(
      addMonths(today, isPuppy ? 1 : 3),
      'deworming',
      dog.name,
      `Vermífugo — ${dog.name}`,
      `Hora do vermífugo de ${dog.name}! Consulte seu veterinário sobre o produto e a dosagem correta para o porte ${dog.size === 'small' ? 'pequeno' : dog.size === 'medium' ? 'médio' : 'grande'} (${dog.weight} kg).`,
      {
        rrule: isPuppy
          ? 'RRULE:FREQ=MONTHLY;COUNT=3'
          : 'RRULE:FREQ=MONTHLY;INTERVAL=3;COUNT=4',
        frequencyLabel: isPuppy ? 'Mensal (filhote)' : 'Trimestral',
        recurrenceCount: isPuppy ? 3 : 4,
      }
    )
  );

  // ── 3. VACINAÇÃO ──────────────────────────────────────────────────────────
  if (isPuppy) {
    if (ageMonths < 2) {
      // Série completa de filhote
      events.push(
        makeEvent(
          addMonths(today, 1),
          'vaccine',
          dog.name,
          `Vacina V8/V10 — 1ª dose — ${dog.name}`,
          `Primeira dose da vacina polivalente para ${dog.name}. Esta é uma das vacinas mais importantes da vida do seu filhote! Leve a caderneta de vacinação.`
        )
      );
      events.push(
        makeEvent(
          addMonths(today, 2),
          'vaccine',
          dog.name,
          `Vacina V8/V10 — 2ª dose — ${dog.name}`,
          `Segunda dose da vacina polivalente de ${dog.name}. O sistema imunológico está se fortalecendo! Leve a caderneta.`
        )
      );
      events.push(
        makeEvent(
          addMonths(today, 3),
          'vaccine',
          dog.name,
          `V8/V10 (3ª dose) + Antirrábica — ${dog.name}`,
          `Terceira dose da polivalente e primeira dose da antirrábica de ${dog.name}. Proteção completa! Leve a caderneta de vacinação.`
        )
      );
      events.push(
        makeEvent(
          addMonths(today, 12),
          'vaccine',
          dog.name,
          `Reforço anual de vacinas — ${dog.name}`,
          `Reforço anual das vacinas de ${dog.name}. Vacinas polivalente e antirrábica. Leve a caderneta para registrar!`
        )
      );
    } else if (ageMonths < 4) {
      events.push(
        makeEvent(
          addMonths(today, 1),
          'vaccine',
          dog.name,
          `Vacinas — dose pendente — ${dog.name}`,
          `Completando o esquema vacinal de ${dog.name}! Vacina polivalente e antirrábica. Importante não atrasar. Leve a caderneta.`
        )
      );
      events.push(
        makeEvent(
          addMonths(today, 12),
          'vaccine',
          dog.name,
          `Reforço anual de vacinas — ${dog.name}`,
          `Reforço anual das vacinas de ${dog.name}. Leve a caderneta de vacinação!`
        )
      );
    } else {
      events.push(
        makeEvent(
          addMonths(today, 12),
          'vaccine',
          dog.name,
          `Reforço anual de vacinas — ${dog.name}`,
          `Reforço anual das vacinas de ${dog.name}. Vacinas polivalente e antirrábica. Leve a caderneta para registrar!`
        )
      );
    }
  } else {
    // Adulto / Sênior — reforço anual
    events.push(
      makeEvent(
        addMonths(today, 12),
        'vaccine',
        dog.name,
        `Reforço anual de vacinas — ${dog.name}`,
        `Hora de renovar as vacinas de ${dog.name}! Vacinas polivalente e antirrábica. Leve a caderneta de vacinação para registrar. Aproveite para tirar dúvidas com o veterinário.`
      )
    );
  }

  // ── 4. CHECK-UP VETERINÁRIO ───────────────────────────────────────────────
  if (isSenior) {
    events.push(
      makeEvent(
        addMonths(today, 6),
        'checkup',
        dog.name,
        `Check-up veterinário semestral — ${dog.name}`,
        `${dog.name} está na fase sênior e precisa de acompanhamento mais frequente. Este check-up semestral inclui exame clínico completo e pode incluir exames de sangue preventivos. Cuidado preventivo é a chave para uma vida longa!`
      )
    );
    events.push(
      makeEvent(
        addMonths(today, 12),
        'checkup',
        dog.name,
        `Check-up veterinário semestral — ${dog.name}`,
        `Segundo check-up semestral de ${dog.name}. Mantenha o acompanhamento veterinário em dia — pets seniores se beneficiam muito do cuidado preventivo regular.`
      )
    );
  } else {
    events.push(
      makeEvent(
        addMonths(today, 12),
        'checkup',
        dog.name,
        `Check-up veterinário anual — ${dog.name}`,
        `Consulta anual de prevenção para ${dog.name}. Uma visita ao veterinário por ano ajuda a identificar possíveis problemas cedo — mesmo que ${dog.name} esteja com saúde perfeita!`
      )
    );
  }

  return events.sort((a, b) => a.date.getTime() - b.date.getTime());
}

// ─── Dog Image (Dog CEO API) ──────────────────────────────────────────────────

const BREED_MAP: Record<string, string> = {
  'labrador': 'labrador',
  'golden retriever': 'retriever/golden',
  'golden': 'retriever/golden',
  'poodle': 'poodle/standard',
  'bulldog': 'bulldog/english',
  'beagle': 'beagle',
  'yorkshire': 'yorkshire',
  'chihuahua': 'chihuahua',
  'shih tzu': 'shihtzu',
  'shihtzu': 'shihtzu',
  'maltese': 'maltese',
  'maltês': 'maltese',
  'pug': 'pug',
  'rottweiler': 'rottweiler',
  'pastor alemão': 'germanshepherd',
  'german shepherd': 'germanshepherd',
  'husky': 'husky',
  'salsicha': 'dachshund',
  'dachshund': 'dachshund',
  'boxer': 'boxer',
  'cocker': 'cocker',
  'border collie': 'collie/border',
  'doberman': 'doberman',
  'pitbull': 'pitbull',
  'akita': 'akita',
  'dálmata': 'dalmatian',
  'dalmatian': 'dalmatian',
  'pomerânia': 'pomeranian',
  'pomeranian': 'pomeranian',
  'spitz': 'pomeranian',
  'lhasa': 'lhasa',
  'bernese': 'mountain/bernese',
  'bichon': 'bichon',
  'bloodhound': 'bloodhound',
  'borzoi': 'borzoi',
  'catahoula': 'catahoula',
  'chow': 'chow',
  'clumber': 'clumber',
  'corgi': 'corgi',
  'vizsla': 'vizsla',
  'whippet': 'whippet',
};

const SIZE_FALLBACKS: Record<DogSize, string> = {
  small: 'https://images.dog.ceo/breeds/chihuahua/n02085620_3407.jpg',
  medium: 'https://images.dog.ceo/breeds/beagle/n02088364_10108.jpg',
  large: 'https://images.dog.ceo/breeds/labrador/n02099712_7614.jpg',
};

export async function getDogImageUrl(breed: string, size: DogSize): Promise<string> {
  const breedLower = breed.toLowerCase().trim();
  let breedPath = '';

  for (const [key, value] of Object.entries(BREED_MAP)) {
    if (breedLower.includes(key)) {
      breedPath = value;
      break;
    }
  }

  const apiUrl = breedPath
    ? `https://dog.ceo/api/breed/${breedPath}/images/random`
    : 'https://dog.ceo/api/breeds/image/random';

  try {
    const res = await fetch(apiUrl);
    const data = await res.json();
    if (data.status === 'success' && data.message) {
      return data.message as string;
    }
  } catch {
    // fall through to fallback
  }

  return SIZE_FALLBACKS[size];
}
