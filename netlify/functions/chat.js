import { handleChat } from '../lib/chat.js'

/**
 * POST /api/chat — the assistant's endpoint.
 *
 * A Netlify Function so the OpenRouter key stays on the server. Putting it in a
 * VITE_ variable instead would bake it into the public JavaScript bundle, where
 * anyone could read it and spend the account's credit.
 *
 * `config.path` below routes /api/chat here directly, ahead of the SPA
 * catch-all redirect.
 */
export default async (request) => {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405)
  }

  let input
  try {
    input = await request.json()
  } catch {
    return json({ error: 'Expected a JSON body.' }, 400)
  }

  const { status, body } = await handleChat(
    input,
    readEnv(),
    request.headers.get('referer') ?? '',
  )

  return json(body, status)
}

/** Netlify's runtime global where available, plain process.env otherwise. */
function readEnv() {
  return typeof Netlify !== 'undefined' ? Netlify.env.toObject() : process.env
}

function json(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  })
}

export const config = { path: '/api/chat' }
