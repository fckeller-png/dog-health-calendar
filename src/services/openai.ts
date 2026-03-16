/**
 * Diagnosis service — chama o endpoint /api/diagnosis (Vercel Function)
 * que usa Claude internamente. A API key fica no servidor, nunca no browser.
 */
import { differenceInMonths } from 'date-fns';
import { DogData, ACTIVITY_LABELS, SIZE_LABELS } from '../types';

function getAgeDescription(birthDate: string): string {
  const months = differenceInMonths(new Date(), new Date(birthDate));
  if (months < 1) return 'recém-nascido';
  if (months < 12) return `${months} ${months === 1 ? 'mês' : 'meses'}`;
  const years = Math.floor(months / 12);
  const rem = months % 12;
  if (rem === 0) return `${years} ${years === 1 ? 'ano' : 'anos'}`;
  return `${years} ${years === 1 ? 'ano' : 'anos'} e ${rem} ${rem === 1 ? 'mês' : 'meses'}`;
}

function buildPrompt(dog: DogData): string {
  const age = getAgeDescription(dog.birthDate);
  const size = SIZE_LABELS[dog.size].toLowerCase();
  const activity = ACTIVITY_LABELS[dog.activityLevel].toLowerCase();

  return `Você é um assistente organizacional amigável e carinhoso para tutores de cachorros. Escreva um diagnóstico organizacional personalizado para o cachorro abaixo.

Dados:
- Nome: ${dog.name}
- Raça: ${dog.breed}
- Idade: ${age}
- Porte: ${size}
- Peso: ${dog.weight} kg
- Nível de atividade: ${activity}
- Cidade: ${dog.city}, ${dog.country}
- Histórico de vacinação registrado: ${dog.hasVaccinationHistory ? 'sim' : 'não'}

Escreva 3 parágrafos curtos (máximo 4 linhas cada) que:
1. Apresente o perfil do ${dog.name} de forma carinhosa, destacando características da raça/porte/idade
2. Explique quais cuidados preventivos são mais importantes para ${dog.name} e por quê
3. Incentive o tutor de forma positiva sobre a importância do calendário organizado

Regras obrigatórias:
- Tom amigável, como um companheiro cuidador, NÃO como médico
- Linguagem simples, não técnica, não clínica
- Não faça diagnóstico de doenças
- Não inclua disclaimer (ele aparece separado na tela)
- Máximo 200 palavras no total`;
}

export async function generateDiagnosis(dog: DogData): Promise<string> {
  try {
    const response = await fetch('/api/diagnosis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: buildPrompt(dog) }),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json() as { diagnosis?: string; error?: string };
    return data.diagnosis?.trim() || generateFallbackDiagnosis(dog);
  } catch (err) {
    // Em desenvolvimento sem Vercel, cai no fallback automaticamente
    console.warn('Diagnosis API unavailable, using fallback:', err);
    return generateFallbackDiagnosis(dog);
  }
}

export function generateFallbackDiagnosis(dog: DogData): string {
  const age = getAgeDescription(dog.birthDate);
  const size = SIZE_LABELS[dog.size].toLowerCase();
  const activity = ACTIVITY_LABELS[dog.activityLevel].toLowerCase();
  const months = differenceInMonths(new Date(), new Date(dog.birthDate));
  const isSenior = months >= 84;
  const isPuppy = months < 12;

  let para1 = `${dog.name} é um ${dog.breed} de porte ${size}, com ${age} e nível de atividade ${activity}. `;
  if (isPuppy) {
    para1 += `Filhotes precisam de atenção redobrada nos primeiros meses — este é o período mais importante para construir uma base sólida de saúde para toda a vida!`;
  } else if (isSenior) {
    para1 += `Pets seniores são lindos e merecem todo o cuidado do mundo. Com acompanhamento preventivo regular, ${dog.name} pode ter uma velhice saudável e cheia de alegria.`;
  } else {
    para1 += `Com energia e saúde em dia, ${dog.name} está em uma ótima fase para consolidar bons hábitos preventivos que vão durar a vida toda.`;
  }

  let para2 = `Para o perfil de ${dog.name}, os cuidados mais importantes são: `;
  if (isPuppy) {
    para2 += `completar o esquema vacinal inicial (fundamental para filhotes!), manter o vermífugo em dia e iniciar a proteção mensal contra pulgas e carrapatos desde cedo.`;
  } else if (isSenior) {
    para2 += `check-ups semestrais para monitorar a saúde com mais frequência, reforço anual das vacinas, vermífugo trimestral e proteção mensal contra parasitas — essenciais para garantir qualidade de vida na fase sênior.`;
  } else {
    para2 += `reforço anual das vacinas, vermífugo trimestral, proteção mensal contra pulgas e carrapatos, e check-up anual preventivo. Simples assim — e muito eficaz!`;
  }

  const para3 = `A boa notícia é que, com o calendário organizado, você não precisa se lembrar de nada sozinho. Cada cuidado já está agendado com data e descrição. É só adicionar ao Google Calendar e deixar os lembretes trabalharem por você — para que ${dog.name} tenha sempre tudo em dia! 🐾`;

  return `${para1}\n\n${para2}\n\n${para3}`;
}
