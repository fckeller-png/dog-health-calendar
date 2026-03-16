import { useState, FormEvent } from 'react';
import { subMonths, format } from 'date-fns';
import { DogData, DogSize, ActivityLevel } from '../types';

interface DogFormProps {
  initialData: DogData | null;
  onSubmit: (data: DogData) => Promise<void>;
}

const AGE_RANGES = [
  { label: 'Menos de 3 meses', months: 1.5 },
  { label: '3 a 6 meses', months: 4.5 },
  { label: '6 a 12 meses', months: 9 },
  { label: '1 a 2 anos', months: 18 },
  { label: '2 a 5 anos', months: 42 },
  { label: '5 a 8 anos', months: 78 },
  { label: 'Mais de 8 anos', months: 108 },
] as const;

type AgeMode = 'date' | 'range';

const SIZE_OPTIONS: { value: DogSize; label: string; sub: string }[] = [
  { value: 'small', label: 'Pequeno', sub: 'até 10 kg' },
  { value: 'medium', label: 'Médio', sub: '10–25 kg' },
  { value: 'large', label: 'Grande', sub: 'acima de 25 kg' },
];

const ACTIVITY_OPTIONS: { value: ActivityLevel; label: string; emoji: string; sub: string }[] = [
  { value: 'low', label: 'Baixo', emoji: '😴', sub: 'Passeios curtos, caseiro' },
  { value: 'medium', label: 'Moderado', emoji: '🐕', sub: 'Passeios regulares' },
  { value: 'high', label: 'Alto', emoji: '🏃', sub: 'Muito ativo, esportes' },
];

function ageRangeToBirthDate(months: number): string {
  return format(subMonths(new Date(), Math.round(months)), 'yyyy-MM-dd');
}

export default function DogForm({ initialData, onSubmit }: DogFormProps) {
  const [ageMode, setAgeMode] = useState<AgeMode>('range');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof DogData | 'ageRange', string>>>({});

  const [form, setForm] = useState<DogData & { ageRange: string }>({
    name: initialData?.name ?? '',
    birthDate: initialData?.birthDate ?? '',
    breed: initialData?.breed ?? '',
    size: initialData?.size ?? 'medium',
    weight: initialData?.weight ?? '',
    activityLevel: initialData?.activityLevel ?? 'medium',
    city: initialData?.city ?? '',
    country: initialData?.country ?? 'Brasil',
    hasVaccinationHistory: initialData?.hasVaccinationHistory ?? false,
    ageRange: '',
  });

  function set<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  }

  function validate(): boolean {
    const newErrors: typeof errors = {};
    if (!form.name.trim()) newErrors.name = 'Informe o nome do seu cachorro.';
    if (ageMode === 'date' && !form.birthDate) newErrors.birthDate = 'Informe a data de nascimento.';
    if (ageMode === 'range' && !form.ageRange) newErrors.ageRange = 'Selecione a faixa de idade.';
    if (!form.breed.trim()) newErrors.breed = 'Informe a raça.';
    if (!form.weight.trim() || isNaN(Number(form.weight)) || Number(form.weight) <= 0)
      newErrors.weight = 'Informe um peso válido (ex: 12).';
    if (!form.city.trim()) newErrors.city = 'Informe a cidade.';
    if (!form.country.trim()) newErrors.country = 'Informe o país.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const birthDate =
      ageMode === 'date'
        ? form.birthDate
        : ageRangeToBirthDate(
            AGE_RANGES.find((r) => r.label === form.ageRange)?.months ?? 18
          );

    // Destructure out ageRange (not part of DogData) before passing to onSubmit
    const { ageRange: _ageRange, ...dogFields } = form;
    await onSubmit({ ...dogFields, birthDate });
    setIsSubmitting(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-amber-50 py-8">
      {/* Header */}
      <header className="container mx-auto px-6 mb-8 flex items-center gap-2">
        <span className="text-xl">🐾</span>
        <span className="font-bold text-green-700">Dog Health Calendar</span>
      </header>

      <div className="container mx-auto px-4 max-w-lg">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Conte-nos sobre seu pet</h1>
          <p className="text-gray-500 text-sm">
            Esses dados moldam o plano de saúde personalizado do seu cachorro.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">

          {/* Nome */}
          <div className="card">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nome do cachorro <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="Ex: Rex, Luna, Thor…"
              className={`input-field ${errors.name ? 'border-red-400 focus:ring-red-400' : ''}`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Raça + Porte */}
          <div className="card space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Raça <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.breed}
                onChange={(e) => set('breed', e.target.value)}
                placeholder="Ex: Labrador, Poodle, SRD…"
                className={`input-field ${errors.breed ? 'border-red-400 focus:ring-red-400' : ''}`}
              />
              {errors.breed && <p className="text-red-500 text-xs mt-1">{errors.breed}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Porte <span className="text-red-400">*</span>
              </label>
              <div className="flex gap-2">
                {SIZE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => set('size', opt.value)}
                    className={`toggle-btn flex-col py-3 ${
                      form.size === opt.value ? 'toggle-btn-active' : 'toggle-btn-inactive'
                    }`}
                  >
                    <span className="block font-semibold">{opt.label}</span>
                    <span className="text-xs font-normal opacity-75">{opt.sub}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Idade + Peso */}
          <div className="card space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Idade <span className="text-red-400">*</span>
              </label>
              {/* Mode toggle */}
              <div className="flex gap-2 mb-3">
                {(
                  [
                    { mode: 'range' as AgeMode, label: 'Selecionar faixa' },
                    { mode: 'date' as AgeMode, label: 'Data de nascimento' },
                  ] as const
                ).map((m) => (
                  <button
                    key={m.mode}
                    type="button"
                    onClick={() => setAgeMode(m.mode)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                      ageMode === m.mode
                        ? 'bg-green-600 text-white border-green-600'
                        : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {ageMode === 'range' ? (
                <select
                  value={form.ageRange}
                  onChange={(e) => set('ageRange', e.target.value)}
                  className={`input-field ${errors.ageRange ? 'border-red-400 focus:ring-red-400' : ''}`}
                >
                  <option value="">Selecione a faixa de idade…</option>
                  {AGE_RANGES.map((r) => (
                    <option key={r.label} value={r.label}>
                      {r.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="date"
                  value={form.birthDate}
                  onChange={(e) => set('birthDate', e.target.value)}
                  max={format(new Date(), 'yyyy-MM-dd')}
                  className={`input-field ${errors.birthDate ? 'border-red-400 focus:ring-red-400' : ''}`}
                />
              )}
              {(errors.ageRange || errors.birthDate) && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.ageRange || errors.birthDate}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Peso <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={form.weight}
                  onChange={(e) => set('weight', e.target.value)}
                  placeholder="Ex: 12"
                  min="0.1"
                  step="0.1"
                  className={`input-field pr-12 ${errors.weight ? 'border-red-400 focus:ring-red-400' : ''}`}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
                  kg
                </span>
              </div>
              {errors.weight && <p className="text-red-500 text-xs mt-1">{errors.weight}</p>}
            </div>
          </div>

          {/* Nível de atividade */}
          <div className="card">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Nível de atividade <span className="text-red-400">*</span>
            </label>
            <div className="flex gap-2">
              {ACTIVITY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => set('activityLevel', opt.value)}
                  className={`toggle-btn flex-col py-3 ${
                    form.activityLevel === opt.value ? 'toggle-btn-active' : 'toggle-btn-inactive'
                  }`}
                >
                  <span className="block text-xl mb-0.5">{opt.emoji}</span>
                  <span className="block font-semibold text-xs">{opt.label}</span>
                  <span className="text-xs font-normal opacity-60 leading-tight hidden sm:block">
                    {opt.sub}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Localização */}
          <div className="card space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Cidade <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => set('city', e.target.value)}
                placeholder="Ex: São Paulo"
                className={`input-field ${errors.city ? 'border-red-400 focus:ring-red-400' : ''}`}
              />
              {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">País</label>
              <input
                type="text"
                value={form.country}
                onChange={(e) => set('country', e.target.value)}
                placeholder="Brasil"
                className="input-field"
              />
            </div>
          </div>

          {/* Histórico de vacinação */}
          <div className="card">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {form.name ? form.name : 'Seu cachorro'} tem histórico de vacinação registrado?
            </label>
            <p className="text-xs text-gray-400 mb-3">
              Isso ajuda a personalizar as recomendações do plano.
            </p>
            <div className="flex gap-3">
              {[
                { value: true, label: '✅ Sim' },
                { value: false, label: '❌ Não / Não sei' },
              ].map((opt) => (
                <button
                  key={String(opt.value)}
                  type="button"
                  onClick={() => set('hasVaccinationHistory', opt.value)}
                  className={`toggle-btn ${
                    form.hasVaccinationHistory === opt.value
                      ? 'toggle-btn-active'
                      : 'toggle-btn-inactive'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2 pb-8">
            <button type="submit" disabled={isSubmitting} className="btn-primary text-base py-4">
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Gerando plano…
                </span>
              ) : (
                '🐾 Gerar plano de saúde'
              )}
            </button>
            <p className="text-center text-xs text-gray-400 mt-3">
              ⚠️ Este app não substitui a orientação de um veterinário.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
