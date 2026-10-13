import { handleChat } from '../server/chat.js'

/**
 * POST /api/chat — the assistant's endpoint on Vercel.
 *
 * A serverless function so the OpenRouter and Google keys stay on the server.
 * Putting them in VITE_ variables instead would bake them into the public
 * JavaScript bundle, where anyone could read them and spend the credit.
 *
 * vercel.json keeps /api/* out of the SPA rewrite and gives this function
 * enough time to walk the model chain.
 */
export async function POST(request) {
  let input
  try {
    input = await request.json()
  } catch {
    return json({ error: 'Expected a JSON body.' }, 400)
  }

  const { status, body } = await handleChat(
    input,
    process.env,
    request.headers.get('referer') ?? '',
  )

  return json(body, status)
}

function json(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  })
}
