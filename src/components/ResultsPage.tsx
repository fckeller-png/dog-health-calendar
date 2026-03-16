import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  DogData,
  HealthEvent,
  HealthPlan,
  SIZE_LABELS,
  EVENT_TYPE_CONFIG,
} from '../types';
import {
  addEventsToCalendar,
  isGoogleCalendarConfigured,
  CalendarProgress,
} from '../services/googleCalendar';

interface ResultsPageProps {
  dog: DogData;
  plan: HealthPlan;
  onCalendarSuccess: (count: number) => void;
  onEditDog: () => void;
}

export default function ResultsPage({
  dog,
  plan,
  onCalendarSuccess,
  onEditDog,
}: ResultsPageProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [progress, setProgress] = useState<CalendarProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);

  const calendarConfigured = isGoogleCalendarConfigured();

  async function handleAddToCalendar() {
    setIsAdding(true);
    setError(null);

    try {
      const { successCount } = await addEventsToCalendar(plan.events, (p) =>
        setProgress(p)
      );
      onCalendarSuccess(successCount);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg === 'GOOGLE_CLIENT_ID_MISSING') {
        setError(
          'Google Client ID não configurado. Adicione VITE_GOOGLE_CLIENT_ID no arquivo .env e reinicie o servidor.'
        );
      } else {
        setError(
          `Erro ao conectar ao Google Calendar: ${msg}. Verifique as permissões e tente novamente.`
        );
      }
      setIsAdding(false);
      setProgress(null);
    }
  }

  const totalEventsInCalendar = plan.events.reduce(
    (acc, e) => acc + (e.recurrenceCount ?? 1),
    0
  );

  return (
    <div className="min-h-screen bg-amber-50 pb-36">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-2">
          <span className="text-xl">🐾</span>
          <span className="font-bold text-green-700">Dog Health Calendar</span>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-lg space-y-5">

        {/* Dog profile card */}
        <div className="card flex items-center gap-4">
          <div className="relative flex-shrink-0">
            <img
              src={imgError ? undefined : plan.imageUrl}
              alt={`Foto ilustrativa de ${dog.breed}`}
              className="w-20 h-20 rounded-full object-cover border-4 border-green-100 bg-green-50"
              onError={() => setImgError(true)}
            />
            {imgError && (
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-4xl">
                🐕
              </div>
            )}
            <span className="absolute -bottom-1 -right-1 text-lg">✅</span>
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-gray-900">{dog.name}</h1>
            <p className="text-gray-500 text-sm">
              {dog.breed} · Porte {SIZE_LABELS[dog.size].toLowerCase()} · {dog.weight} kg
            </p>
            <p className="text-green-600 text-xs font-semibold mt-0.5">
              Plano de saúde pronto!
            </p>
          </div>
        </div>

        {/* Diagnosis */}
        <div className="card">
          <h2 className="font-bold text-gray-800 text-base mb-3 flex items-center gap-2">
            <span>📋</span> Diagnóstico Organizacional
          </h2>
          <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
            {plan.diagnosis}
          </div>
          <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200">
            <p className="text-amber-800 text-xs leading-relaxed">
              ⚠️ <strong>Aviso importante:</strong> Confirme estas datas com seu veterinário.
              Este app não substitui a orientação de um profissional de saúde animal.
            </p>
          </div>
        </div>

        {/* Calendar preview */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800 text-base flex items-center gap-2">
              <span>📅</span> Plano do Próximo Ano
            </h2>
            <span className="text-xs bg-green-100 text-green-700 font-semibold px-2.5 py-1 rounded-full">
              ~{totalEventsInCalendar} eventos
            </span>
          </div>

          <div className="space-y-2">
            {plan.events.map((event) => (
              <EventRow key={event.id} event={event} />
            ))}
          </div>

          <p className="text-xs text-gray-400 text-center mt-4">
            Eventos recorrentes serão criados automaticamente no Google Calendar.
          </p>
        </div>

        {/* Disclaimer footer */}
        <p className="text-center text-xs text-gray-400 px-4">
          ⚠️ Este app não substitui a orientação de um veterinário.
        </p>
      </div>

      {/* Sticky CTA bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-xl p-4 z-20">
        <div className="container mx-auto max-w-lg space-y-2">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
              <p className="text-red-700 text-xs leading-relaxed">{error}</p>
            </div>
          )}

          {isAdding && progress && (
            <div className="text-center">
              <p className="text-green-700 text-xs font-semibold mb-1">
                Adicionando ao Google Calendar… {progress.current}/{progress.total}
              </p>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div
                  className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                />
              </div>
            </div>
          )}

          {!calendarConfigured && !error && (
            <p className="text-amber-700 text-xs text-center bg-amber-50 rounded-xl p-2 border border-amber-200">
              Configure <code className="font-mono">VITE_GOOGLE_CLIENT_ID</code> no .env para
              ativar a integração com o Google Calendar.
            </p>
          )}

          <button
            onClick={handleAddToCalendar}
            disabled={isAdding}
            className="btn-primary flex items-center justify-center gap-2"
          >
            {isAdding ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Adicionando ao Google Calendar…
              </>
            ) : (
              '📅 Adicionar ao meu Google Calendar'
            )}
          </button>

          <button onClick={onEditDog} disabled={isAdding} className="btn-secondary">
            ↩️ Editar dados do cachorro
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Event Row ────────────────────────────────────────────────────────────────

function EventRow({ event }: { event: HealthEvent }) {
  const config = EVENT_TYPE_CONFIG[event.type];

  return (
    <div className="flex items-start gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-colors group">
      {/* Date column */}
      <div className="text-center min-w-[44px] flex-shrink-0">
        <p className="text-xs font-bold text-gray-400 uppercase leading-none">
          {format(event.date, 'MMM', { locale: ptBR })}
        </p>
        <p className="text-2xl font-extrabold text-gray-800 leading-tight">
          {format(event.date, 'dd')}
        </p>
        <p className="text-xs text-gray-400 leading-none">
          {format(event.date, 'yyyy')}
        </p>
      </div>

      {/* Divider */}
      <div className="w-px self-stretch bg-gray-100 flex-shrink-0" />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className={`event-badge ${config.badgeClass}`}>
            {config.emoji} {config.label}
          </span>
          {event.frequencyLabel && (
            <span className="text-xs text-gray-400 font-medium">
              · {event.frequencyLabel}
              {event.recurrenceCount ? ` ×${event.recurrenceCount}` : ''}
            </span>
          )}
        </div>
        <p className="text-sm font-semibold text-gray-800 truncate">{event.title}</p>
      </div>
    </div>
  );
}
