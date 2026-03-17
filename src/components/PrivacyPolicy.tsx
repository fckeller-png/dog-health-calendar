interface PrivacyPolicyProps {
  onBack: () => void;
}

export default function PrivacyPolicy({ onBack }: PrivacyPolicyProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-amber-50">
      <header className="container mx-auto px-6 py-5 flex items-center gap-2">
        <span className="text-2xl">🐾</span>
        <span className="font-bold text-green-700 text-lg tracking-tight">Dog Health Calendar</span>
      </header>

      <main className="container mx-auto px-6 py-10 max-w-3xl">
        <button
          onClick={onBack}
          className="text-green-600 hover:text-green-700 font-medium mb-8 flex items-center gap-1"
        >
          ← Voltar
        </button>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Política de Privacidade</h1>
        <p className="text-sm text-gray-400 mb-10">Última atualização: março de 2026</p>

        <div className="prose prose-gray max-w-none space-y-8">

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">1. Visão Geral</h2>
            <p className="text-gray-600 leading-relaxed">
              O <strong>Dog Health Calendar</strong> (<a href="https://dog-health-calendar.vercel.app" className="text-green-600 hover:underline">dog-health-calendar.vercel.app</a>) é uma ferramenta gratuita que gera calendários anuais de saúde para cães e os adiciona diretamente ao Google Calendar do usuário. Esta política descreve quais dados coletamos, como os utilizamos e quais são seus direitos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">2. Dados Coletados</h2>
            <h3 className="text-base font-semibold text-gray-700 mb-2">2.1 Dados do Pet</h3>
            <p className="text-gray-600 leading-relaxed mb-3">
              Para gerar o plano de saúde personalizado, solicitamos as seguintes informações sobre o seu cão:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
              <li>Nome do pet</li>
              <li>Raça</li>
              <li>Data de nascimento (para calcular a idade)</li>
              <li>Peso e porte (pequeno, médio ou grande)</li>
              <li>Nível de atividade física</li>
              <li>Cidade e país de residência</li>
              <li>Datas das últimas vacinas, vermífugos e tratamentos antipulgas</li>
            </ul>
            <p className="text-gray-600 leading-relaxed">
              <strong>Esses dados são processados localmente no seu navegador</strong> e não são armazenados em nenhum servidor próprio do Dog Health Calendar. As informações existem apenas durante a sua sessão ativa e são descartadas ao fechar ou recarregar a página.
            </p>

            <h3 className="text-base font-semibold text-gray-700 mt-4 mb-2">2.2 Dados de Localização</h3>
            <p className="text-gray-600 leading-relaxed">
              A cidade e o país informados são usados exclusivamente para adaptar as recomendações veterinárias ao contexto regional (ex.: doenças endêmicas locais). Não são usados para rastreamento geográfico.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">3. Integração com Google Calendar (OAuth)</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              Para adicionar os eventos ao seu Google Calendar, utilizamos o fluxo de autenticação OAuth 2.0 do Google. Isso significa que:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Você autoriza o acesso diretamente na tela de consentimento do Google — nunca inserindo sua senha no Dog Health Calendar.</li>
              <li>Solicitamos apenas a permissão mínima necessária: <strong>criação de eventos no Google Calendar</strong> (<code className="bg-gray-100 px-1 rounded text-sm">calendar.events</code>).</li>
              <li>Não lemos, copiamos nem armazenamos eventos existentes do seu calendário.</li>
              <li>O token de acesso OAuth é utilizado apenas durante a sessão para inserir os eventos e não é persistido em servidor algum.</li>
              <li>Você pode revogar o acesso a qualquer momento em <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">myaccount.google.com/permissions</a>.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">4. Uso de Serviços de Terceiros</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li><strong>Google Calendar API</strong> — para criação dos eventos de saúde. Sujeito à <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">Política de Privacidade do Google</a>.</li>
              <li><strong>OpenAI API</strong> — para geração do diagnóstico personalizado. Os dados do pet podem ser enviados à API da OpenAI para processamento. Consulte a <a href="https://openai.com/policies/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">política de privacidade da OpenAI</a>.</li>
              <li><strong>Vercel</strong> — hospedagem da aplicação. Logs de acesso padrão (IP, user-agent) podem ser coletados pela Vercel conforme sua própria política.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">5. Armazenamento de Dados</h2>
            <p className="text-gray-600 leading-relaxed">
              O Dog Health Calendar <strong>não possui banco de dados próprio</strong>. Nenhum dado pessoal ou de pet é armazenado em servidores sob nossa administração. Todo o processamento ocorre no lado do cliente (navegador) ou é delegado diretamente às APIs de terceiros listadas acima.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">6. Cookies e Rastreamento</h2>
            <p className="text-gray-600 leading-relaxed">
              Não utilizamos cookies de rastreamento, pixels de marketing ou qualquer tecnologia de monitoramento de comportamento do usuário.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">7. Seus Direitos</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              Como não armazenamos seus dados em servidores próprios, não há dados pessoais para acessar, corrigir ou excluir no Dog Health Calendar. Para dados processados pelo Google ou OpenAI, consulte as respectivas políticas de privacidade e canais de suporte.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">8. Crianças</h2>
            <p className="text-gray-600 leading-relaxed">
              Este serviço não é direcionado a menores de 13 anos e não coletamos intencionalmente informações de crianças.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">9. Alterações nesta Política</h2>
            <p className="text-gray-600 leading-relaxed">
              Podemos atualizar esta política periodicamente. Alterações significativas serão refletidas na data de "Última atualização" no topo desta página.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">10. Contato</h2>
            <p className="text-gray-600 leading-relaxed">
              Dúvidas sobre esta política de privacidade? Entre em contato pelo e-mail:{' '}
              <a href="mailto:fckeller@gmail.com" className="text-green-600 hover:underline font-medium">
                fckeller@gmail.com
              </a>
            </p>
          </section>

        </div>
      </main>

      <footer className="container mx-auto px-6 py-8 text-center text-xs text-gray-400 mt-10 border-t border-gray-100">
        © {new Date().getFullYear()} Dog Health Calendar — Todos os direitos reservados.
      </footer>
    </div>
  );
}
