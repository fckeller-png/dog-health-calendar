/**
 * Vercel Edge Function — /api/diagnosis
 *
 * Recebe: POST { prompt: string }
 * Retorna: { diagnosis: string }
 *
 * A ANTHROPIC_API_KEY fica no ambiente do servidor (Vercel), nunca exposta ao browser.
 */

export const config = { runtime: 'edge' };

interface AnthropicContent {
  type: string;
  text?: string;
}

interface AnthropicResponse {
  content: AnthropicContent[];
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export default async function handler(req: Request): Promise<Response> {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('ANTHROPIC_API_KEY is not set');
    return json({ error: 'API not configured' }, 500);
  }

  let prompt: string;
  try {
    const body = await req.json() as { prompt?: unknown };
    if (typeof body.prompt !== 'string' || !body.prompt.trim()) {
      return json({ error: 'prompt is required' }, 400);
    }
    prompt = body.prompt;
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  try {
    const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 500,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!claudeRes.ok) {
      const errText = await claudeRes.text();
      console.error('Claude API error:', claudeRes.status, errText);
      return json({ error: 'Claude API error' }, 502);
    }

    const data = (await claudeRes.json()) as AnthropicResponse;
    const diagnosis = data.content?.find((c) => c.type === 'text')?.text ?? '';

    return json({ diagnosis });
  } catch (err) {
    console.error('Unexpected error:', err);
    return json({ error: 'Internal server error' }, 500);
  }
}
