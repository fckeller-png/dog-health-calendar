interface LandingPageProps {
  onStart: () => void;
  onPrivacy: () => void;
}

export default function LandingPage({ onStart, onPrivacy }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-amber-50 flex flex-col">
      {/* Header */}
      <header className="container mx-auto px-6 py-5 flex items-center gap-2">
        <span className="text-2xl">🐾</span>
        <span className="font-bold text-green-700 text-lg tracking-tight">Dog Health Calendar</span>
      </header>

      {/* Hero */}
      <main className="flex-1 container mx-auto px-6 py-10 flex flex-col items-center text-center max-w-3xl">
        <div className="text-8xl mb-6">🐶</div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-5">
          Faça um diagnóstico e crie o
          <br />
          <span className="text-green-600">calendário anual do seu cachorro</span>.
        </h1>

        <p className="text-lg text-gray-600 mb-3 max-w-xl leading-relaxed">
          Informe os dados do seu pet e receba um calendário com vacinas,
          vermífugos e antipulgas — baseado no histórico real dele.
        </p>
        <p className="text-sm text-gray-400 mb-10">
          Sem cadastro. Sem custo.
        </p>

        <button
          onClick={onStart}
          className="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold px-10 py-4 rounded-2xl text-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 mb-4"
        >
          🐾 Fazer diagnóstico e criar calendário
        </button>

        <p className="text-xs text-gray-400 mb-16">
          Leva menos de 2 minutos
        </p>

        {/* Benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mb-14">
          {[
            {
              emoji: '📋',
              title: 'Baseado no histórico real',
              desc: 'Informe as últimas datas de vacina, vermífugo e antipulga — o calendário parte dali',
            },
            {
              emoji: '📅',
              title: 'Google Calendar',
              desc: 'Todos os eventos salvos com um clique, com lembretes automáticos',
            },
            {
              emoji: '🎯',
              title: 'Frequência correta',
              desc: 'Vermífugo mensal, trimestral ou semestral — conforme o produto que você usa',
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
      </main>

      {/* Footer */}
      <footer className="text-center py-6 px-4 space-y-2">
        <p className="text-xs text-gray-400 max-w-md mx-auto">
          ⚠️ <strong>Aviso:</strong> Este aplicativo não substitui a orientação de um veterinário.
          Sempre confirme as datas e cuidados com um profissional de saúde animal.
        </p>
        <p className="text-xs text-gray-400">
          <button onClick={onPrivacy} className="text-green-600 hover:underline">
            Política de Privacidade
          </button>
        </p>
      </footer>
    </div>
  );
}