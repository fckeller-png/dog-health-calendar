import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  dogName: string;
}

const MESSAGES = [
  'Analisando o perfil do seu pet…',
  'Calculando o calendário de vacinas…',
  'Montando o plano de antipulgas…',
  'Preparando o diagnóstico personalizado…',
  'Organizando os eventos do ano…',
  'Quase pronto! ✨',
];

const PAWPRINTS = ['🐾', '🐾', '🐾'];

export default function LoadingScreen({ dogName }: LoadingScreenProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [dotCount, setDotCount] = useState(1);

  useEffect(() => {
    const msgInterval = setInterval(() => {
      setMessageIndex((i) => (i < MESSAGES.length - 1 ? i + 1 : i));
    }, 1400);
    return () => clearInterval(msgInterval);
  }, []);

  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDotCount((d) => (d % 3) + 1);
    }, 400);
    return () => clearInterval(dotInterval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-amber-50 flex flex-col items-center justify-center px-6">
      {/* Animated paw prints */}
      <div className="flex gap-3 mb-8">
        {PAWPRINTS.map((p, i) => (
          <span
            key={i}
            className="text-4xl animate-bounce"
            style={{ animationDelay: `${i * 0.2}s`, animationDuration: '1.2s' }}
          >
            {p}
          </span>
        ))}
      </div>

      {/* Spinner */}
      <div className="relative w-20 h-20 mb-8">
        <div className="absolute inset-0 rounded-full border-4 border-green-100" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-green-500 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-2xl">🐕</div>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-extrabold text-gray-800 mb-2 text-center">
        Montando o plano de saúde
        {dogName ? ` de ${dogName}` : ''}{'.'.repeat(dotCount)}
      </h2>

      {/* Rotating message */}
      <p
        key={messageIndex}
        className="text-gray-500 text-sm text-center animate-fade-in max-w-xs"
      >
        {MESSAGES[messageIndex]}
      </p>

      {/* Progress dots */}
      <div className="flex gap-2 mt-10">
        {MESSAGES.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i <= messageIndex ? 'bg-green-500' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
