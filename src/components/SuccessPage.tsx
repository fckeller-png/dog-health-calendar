interface SuccessPageProps {
  dogName: string;
  eventsCount: number;
  onRestart: () => void;
}

export default function SuccessPage({ dogName, eventsCount, onRestart }: SuccessPageProps) {
  const handleShare = async () => {
    const text = `Acabei de organizar toda a saúde de ${dogName} com o Dog Health Calendar! 📅🐾 Um plano anual completo — vacinas, vermífugos e check-ups — direto no Google Calendar.`;
    if (navigator.share) {
      await navigator.share({ text, title: 'Dog Health Calendar' });
    } else {
      await navigator.clipboard.writeText(text);
      alert('Texto copiado! Cole nas suas redes sociais 😊');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-amber-50 flex flex-col items-center justify-center px-6 text-center">
      {/* Celebration emoji */}
      <div className="text-8xl mb-6 animate-bounce-slow">🎉</div>

      <h1 className="text-3xl font-extrabold text-gray-900 mb-3">
        Tudo certo, {dogName} está protegido!
      </h1>

      <p className="text-gray-600 text-base mb-2 max-w-sm leading-relaxed">
        {eventsCount > 0 ? (
          <>
            <strong>{eventsCount} evento{eventsCount !== 1 ? 's' : ''}</strong> foram adicionados
            ao seu Google Calendar com lembretes automáticos.
          </>
        ) : (
          'Eventos processados! Verifique seu Google Calendar.'
        )}
      </p>

      <p className="text-gray-500 text-sm mb-10 max-w-xs">
        Você vai receber uma notificação 7 dias e 1 dia antes de cada cuidado.
        Agora é só relaxar — a saúde de {dogName} está em boas mãos! 🐾
      </p>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 mb-10 w-full max-w-xs">
        {[
          { emoji: '💉', label: 'Vacinas', desc: 'Reforços anuais' },
          { emoji: '💊', label: 'Vermífugo', desc: 'Trimestral' },
          { emoji: '🛡️', label: 'Antipulgas', desc: 'Mensal' },
          { emoji: '🩺', label: 'Check-up', desc: 'Preventivo' },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="text-3xl mb-1">{item.emoji}</div>
            <p className="font-bold text-gray-800 text-sm">{item.label}</p>
            <p className="text-gray-500 text-xs">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="w-full max-w-xs space-y-3">
        <button
          onClick={handleShare}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3.5 px-6 rounded-2xl text-sm transition-all shadow-sm hover:shadow-md"
        >
          📤 Compartilhar com amigos
        </button>

        <button
          onClick={onRestart}
          className="w-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 font-medium py-3 px-6 rounded-2xl text-sm transition-all"
        >
          🐕 Criar plano para outro cachorro
        </button>
      </div>

      {/* Disclaimer */}
      <p className="mt-10 text-xs text-gray-400 max-w-xs">
        ⚠️ Este app não substitui a orientação de um veterinário. Confirme sempre os cuidados
        com um profissional de saúde animal.
      </p>
    </div>
  );
}
