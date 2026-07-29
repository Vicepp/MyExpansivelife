import { buildSystemPrompt } from './knowledge.js'

/**
 * The chat brain, framework-free.
 *
 * Lives here rather than in the Netlify handler so the Vite dev server can run
 * exactly the same code locally (see vite.config.js) — one implementation, no
 * "works in dev, breaks in production" gap.
 *
 * The OpenRouter key is read from the server environment and never leaves it.
 * Nothing in src/ imports this file, so the key can never end up in the browser
 * bundle.
 */

const ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions'

/**
 * The model chain, tried in order.
 *
 * All free by default, so the assistant works on an OpenRouter account with no
 * credit. Free models are aggressively rate-limited upstream — a 429 on one is
 * routine, which is exactly why there is a chain rather than a single model.
 *
 * Set OPENROUTER_MODEL to a paid model once the account has credit; the free
 * list below then becomes its fallback automatically.
 */
const DEFAULT_MODEL = 'nvidia/nemotron-3-super-120b-a12b:free'
const DEFAULT_FALLBACKS = [
  'inclusionai/ling-3.0-flash:free',
  'google/gemma-4-26b-a4b-it:free',
  'google/gemma-4-31b-it:free',
  'openai/gpt-oss-20b:free',
]

/* Guard rails — this endpoint is public, so cap what one request can cost. */
const MAX_MESSAGE_CHARS = 1200
const MAX_HISTORY = 16
const MAX_TOKENS = 700

function models(env) {
  const primary = env.OPENROUTER_MODEL?.trim() || DEFAULT_MODEL
  const fallbacks = (env.OPENROUTER_FALLBACK_MODELS ?? '')
    .split(',')
    .map((m) => m.trim())
    .filter(Boolean)

  // Set() so naming a default as the primary doesn't make us try it twice.
  return [...new Set([primary, ...(fallbacks.length ? fallbacks : DEFAULT_FALLBACKS)])]
}

function clean(messages) {
  if (!Array.isArray(messages)) return []
  return messages
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant'))
    .slice(-MAX_HISTORY)
    .map((m) => ({
      role: m.role,
      content: String(m.content ?? '').slice(0, MAX_MESSAGE_CHARS),
    }))
    .filter((m) => m.content.trim())
}

/**
 * Asks one model. Returns the reply text, or throws so the caller can try the
 * next model in the chain.
 */
async function ask(model, payload, env, referer) {
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      // Optional OpenRouter attribution headers.
      'HTTP-Referer': referer || 'https://www.myexpansivelife.com',
      'X-Title': 'My Expansive Life',
    },
    body: JSON.stringify({ ...payload, model }),
  })

  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    const error = new Error(`${model} → ${response.status} ${detail.slice(0, 300)}`)
    error.status = response.status
    throw error
  }

  const data = await response.json()
  const reply = data?.choices?.[0]?.message?.content?.trim()
  if (!reply) throw new Error(`${model} returned an empty reply`)

  return reply
}

/**
 * Handles one chat turn.
 *
 * @returns {{status: number, body: object}} ready to serialise as JSON.
 */
export async function handleChat(input, env = process.env, referer = '') {
  if (!env.OPENROUTER_API_KEY) {
    return {
      status: 503,
      body: { error: 'The assistant is not configured yet. OPENROUTER_API_KEY is missing.' },
    }
  }

  const history = clean(input?.messages)
  if (!history.length) {
    return { status: 400, body: { error: 'No message to answer.' } }
  }

  const payload = {
    max_tokens: MAX_TOKENS,
    temperature: 0.4,
    messages: [
      {
        role: 'system',
        content: buildSystemPrompt({
          name: String(input?.name ?? '').slice(0, 80),
          page: String(input?.page ?? '').slice(0, 120),
          event: input?.event ?? null,
        }),
      },
      ...history,
    ],
  }

  const chain = models(env)
  const failures = []

  // Walk the chain: the paid model first, then the free ones. A model that is
  // out of credit, rate-limited or unavailable just moves us to the next.
  for (const model of chain) {
    try {
      const reply = await ask(model, payload, env, referer)
      return { status: 200, body: { reply, model } }
    } catch (error) {
      failures.push(error.message)
      console.warn('chat: model failed —', error.message)
    }
  }

  console.error('chat: every model failed', failures)
  return {
    status: 502,
    body: {
      error:
        "Sorry — I couldn't reach the assistant just then. Please try again, or email us and we'll come straight back to you.",
    },
  }
}
