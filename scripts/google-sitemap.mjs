/**
 * Resubmits the sitemap to Google Search Console on production deploys, so
 * Google re-reads it and finds new or changed articles.
 *
 * Google has no instant-indexing API for blog posts (its Indexing API is only
 * for job postings and livestreams, and the sitemap "ping" was retired), so a
 * Search Console sitemap submission is the supported way to prompt a crawl.
 *
 * Needs GOOGLE_SERVICE_ACCOUNT_JSON: the JSON key of a Google Cloud service
 * account with the Search Console API enabled, added as an Owner of the
 * property in Search Console. Signs its own JWT with node:crypto, so there is
 * no SDK dependency. Skips quietly when not configured or not production; a
 * failure never fails the build.
 */
import { createSign } from 'node:crypto'
import { readFile } from 'node:fs/promises'

const PROPERTY = process.env.GSC_PROPERTY ?? 'sc-domain:myexpansivelife.com'
const SITEMAP = 'https://www.myexpansivelife.com/sitemap.xml'
const SCOPE = 'https://www.googleapis.com/auth/webmasters'

async function credentials() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON?.trim()
  if (raw) return JSON.parse(raw)
  // Local runs can use the downloaded key file (git-ignored).
  try {
    return JSON.parse(await readFile('google-service-account.json', 'utf8'))
  } catch {
    return null
  }
}

function base64url(input) {
  return Buffer.from(input).toString('base64url')
}

async function accessToken({ client_email, private_key, token_uri }) {
  const now = Math.floor(Date.now() / 1000)
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const claims = base64url(
    JSON.stringify({
      iss: client_email,
      scope: SCOPE,
      aud: token_uri ?? 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600,
    }),
  )
  const signature = createSign('RSA-SHA256')
    .update(`${header}.${claims}`)
    .sign(private_key, 'base64url')

  const res = await fetch(token_uri ?? 'https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${header}.${claims}.${signature}`,
    }),
  })
  if (!res.ok) throw new Error(`token request → ${res.status} ${(await res.text()).slice(0, 200)}`)
  return (await res.json()).access_token
}

const force = process.argv.includes('--force')

if (process.env.VERCEL_ENV !== 'production' && !force) {
  console.log('google-sitemap: not a production deploy — skipped')
} else {
  try {
    const creds = await credentials()
    if (!creds) {
      console.log('google-sitemap: GOOGLE_SERVICE_ACCOUNT_JSON not set — skipped')
    } else {
      const token = await accessToken(creds)
      const url = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(PROPERTY)}/sitemaps/${encodeURIComponent(SITEMAP)}`
      const res = await fetch(url, { method: 'PUT', headers: { Authorization: `Bearer ${token}` } })
      console.log(
        res.ok
          ? `google-sitemap: submitted ${SITEMAP} to ${PROPERTY}`
          : `google-sitemap: Search Console returned ${res.status} ${(await res.text()).slice(0, 200)}`,
      )
    }
  } catch (e) {
    console.warn('google-sitemap: failed —', e.message)
  }
}
