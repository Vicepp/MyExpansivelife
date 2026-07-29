import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Serves POST /api/chat during `npm run dev`.
 *
 * In production that path is a Netlify Function (netlify/functions/chat.js).
 * Both call the same handleChat(), so the assistant behaves identically here
 * and on the deployed site. The API key is read from .env without a VITE_
 * prefix, which keeps it out of the browser bundle.
 */
function chatDevApi(env) {
  return {
    name: 'mxl-chat-dev-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/chat', async (req, res, next) => {
        if (req.method !== 'POST') return next()

        const chunks = []
        for await (const chunk of req) chunks.push(chunk)

        let payload = {}
        try {
          payload = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')
        } catch {
          res.statusCode = 400
          res.setHeader('Content-Type', 'application/json')
          return res.end(JSON.stringify({ error: 'Expected a JSON body.' }))
        }

        // Imported lazily so an error in the handler cannot stop the dev
        // server from booting.
        const { handleChat } = await import('./netlify/lib/chat.js')
        const { status, body } = await handleChat(payload, { ...process.env, ...env })

        res.statusCode = status
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(body))
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // '' as the prefix loads every variable, not just VITE_ ones. These stay in
  // the Node process — Vite only inlines VITE_-prefixed values into the client.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss(), chatDevApi(env)],
    server: {
      port: 5173,
      open: true,
      watch: {
        // Raw Figma exports live here; watching them locks files and crashes the dev server.
        ignored: ['**/Design PNG/**'],
      },
    },
  }
})
