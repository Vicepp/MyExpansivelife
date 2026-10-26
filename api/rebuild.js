/**
 * /api/rebuild — redeploys the site so new or changed blog posts get their
 * prerendered page, sitemap entry and search-engine pings (see the build
 * script in package.json).
 *
 * Called by the admin after publishing, updating, unpublishing or deleting a
 * post, and when opening the panel flips due scheduled posts to published
 * (scheduled posts stay private until then, so no cron could see them).
 * Needs the signed-in admin's Firebase ID token as a Bearer token; the
 * account's email must be in VITE_ADMIN_EMAILS.
 *
 * The rebuild itself is VERCEL_DEPLOY_HOOK_URL, which must never reach the
 * browser — that's why this endpoint exists rather than the admin calling
 * the hook directly.
 */

import { adminEmails } from '../src/lib/admins.js'

function env(name) {
  return (process.env[name] ?? '').trim().replace(/^(['"])(.*)\1$/s, '$2').trim()
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  })
}

function bearer(request) {
  const header = request.headers.get('authorization') ?? ''
  return header.startsWith('Bearer ') ? header.slice(7).trim() : ''
}

async function triggerDeploy(reason) {
  const hook = env('VERCEL_DEPLOY_HOOK_URL')
  if (!hook) return json({ error: 'VERCEL_DEPLOY_HOOK_URL is not set.' }, 503)

  const res = await fetch(hook, { method: 'POST' })
  if (!res.ok) {
    console.error('rebuild: deploy hook returned', res.status)
    return json({ error: `Deploy hook returned ${res.status}.` }, 502)
  }
  console.log('rebuild: deploy triggered —', reason)
  return json({ ok: true })
}

/**
 * Verifies a Firebase ID token with the Identity Toolkit API (no Admin SDK
 * needed) and returns the account's email, or '' if the token is invalid.
 */
async function emailFromIdToken(idToken) {
  const key = env('VITE_FIREBASE_API_KEY')
  if (!key || !idToken) return ''
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(key)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    },
  )
  if (!res.ok) return ''
  const data = await res.json()
  return String(data?.users?.[0]?.email ?? '').toLowerCase()
}

export async function POST(request) {
  const admins = adminEmails(env('VITE_ADMIN_EMAILS'))

  const email = await emailFromIdToken(bearer(request))
  if (!email || !admins.includes(email)) {
    return json({ error: 'Not allowed.' }, 403)
  }

  let reason = 'admin'
  try {
    reason = String((await request.json())?.reason ?? reason).slice(0, 120)
  } catch {
    /* body is optional */
  }
  return triggerDeploy(`${reason} (${email})`)
}
