interface LandingPageProps {
  onStart: () => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-amber-50 flex flex-col">
      {/* Header */}
      <header className="container mx-auto px-6 py-5 flex items-center gap-2">
        <span className="text-2xl">🐾</span>
        <span className="font-bold text-green-700 text-lg tracking-tight">Dog Health Calendar</span>
      </header>

      {/* Hero */}
      <main className="flex-1 container mx-auto px-6 py-10 flex flex-col items-center text-center max-w-3xl">
        <div className="text-8xl mb-6 animate-bounce-slow">🐕</div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-5">
          O plano de saúde completo
          <br />
          <span className="text-green-600">do seu cachorro</span>, em minutos.
        </h1>

        <p className="text-lg text-gray-600 mb-3 max-w-xl leading-relaxed">
          Informe os dados básicos do seu pet e receba um calendário anual personalizado —
          vacinas, vermífugos, antipulgas e check-ups — direto no seu Google Calendar.
        </p>
        <p className="text-sm text-gray-400 mb-10">
          Sem cadastro. Sem custo. Configure uma vez e esqueça.
        </p>

        <button
          onClick={onStart}
          className="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold px-10 py-4 rounded-2xl text-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 mb-4"
        >
          Criar plano de saúde grátis 🐾
        </button>

        <p className="text-xs text-gray-400 mb-16">
          Leva menos de 2 minutos
        </p>

        {/* Benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mb-14">
          {[
            {
              emoji: '📋',
              title: 'Plano personalizado',
              desc: 'Baseado na raça, idade, porte e estilo de vida do seu pet',
            },
            {
              emoji: '📅',
              title: 'Google Calendar',
              desc: 'Todos os eventos salvos com um clique, com lembretes automáticos',
            },
            {
              emoji: '🎯',
              title: 'Zero esforço',
              desc: 'Configure uma vez e deixe os lembretes cuidarem do resto',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-left"
            >
              <div className="text-3xl mb-2">{item.emoji}</div>
              <h3 className="font-bold text-gray-800 mb-1 text-sm">{item.title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* What's included */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 w-full text-left mb-10">
          <h2 className="font-bold text-gray-800 mb-4 text-center">O que está incluído no plano</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { emoji: '💉', label: 'Vacinação', desc: 'Datas das vacinas anuais' },
              { emoji: '💊', label: 'Vermífugo', desc: 'Controle trimestral' },
              { emoji: '🛡️', label: 'Antipulgas', desc: 'Proteção mensal' },
              { emoji: '🩺', label: 'Check-up', desc: 'Consulta preventiva anual' },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-3">
                <span className="text-2xl">{item.emoji}</span>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{item.label}</p>
                  <p className="text-gray-500 text-xs">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 px-4">
        <p className="text-xs text-gray-400 max-w-md mx-auto">
          ⚠️ <strong>Aviso:</strong> Este aplicativo não substitui a orientação de um veterinário.
          Sempre confirme as datas e cuidados com um profissional de saúde animal.
        </p>
      </footer>
    </div>
  );
}
