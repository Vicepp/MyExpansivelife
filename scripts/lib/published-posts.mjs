/**
 * Published blog posts, fetched over Firestore's REST API for build scripts
 * (sitemap, prerendered blog pages).
 *
 * Published posts are world-readable under firestore.rules, so this needs no
 * credentials beyond the public web API key. Callers treat an empty result as
 * "Firebase unreachable or unconfigured" and degrade rather than fail the build.
 */
import { readFile } from 'node:fs/promises'

export const SITE_URL = process.env.SITE_URL ?? 'https://www.myexpansivelife.com'

/**
 * Minimal .env reader — dotenv is not a dependency and this needs two keys.
 * Vercel injects the same variables into the environment directly, so a
 * missing .env is normal in CI, not an error.
 */
export async function loadEnv() {
  try {
    const raw = await readFile('.env', 'utf8')
    for (const line of raw.split(/\r?\n/)) {
      const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*)$/.exec(line)
      if (!match) continue
      const value = match[2].trim().replace(/^["']|["']$/g, '')
      if (!(match[1] in process.env)) process.env[match[1]] = value
    }
  } catch {
    /* no .env locally is fine */
  }
}

/**
 * Published posts kept out of search engines: no sitemap entry, no blog-index
 * link, and a robots noindex on the prerendered page. They stay reachable by
 * direct link. Remove a slug here to let it be indexed.
 */
export const NOINDEX_SLUGS = new Set([
  // An internal underwriting memo, not an article (flagged 2026-10-16).
  'committee-review-montrose-berkeley-lake',
])

/** Unwraps one Firestore REST value ({stringValue: …}, {arrayValue: …}, …). */
function unwrap(value) {
  if (!value || typeof value !== 'object') return undefined
  if ('stringValue' in value) return value.stringValue
  if ('integerValue' in value) return Number(value.integerValue)
  if ('doubleValue' in value) return value.doubleValue
  if ('booleanValue' in value) return value.booleanValue
  if ('timestampValue' in value) return value.timestampValue
  if ('nullValue' in value) return null
  if ('arrayValue' in value) return (value.arrayValue.values ?? []).map(unwrap)
  if ('mapValue' in value) return fields(value.mapValue.fields)
  return undefined
}

function fields(raw = {}) {
  return Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, unwrap(v)]))
}

/** Every published post, newest first. [] when Firestore can't be reached. */
export async function fetchPublishedPosts(label = 'build') {
  const projectId = process.env.VITE_FIREBASE_PROJECT_ID
  const key = process.env.VITE_FIREBASE_API_KEY
  if (!projectId || !key) {
    console.warn(`${label}: Firebase env not set — no posts`)
    return []
  }

  // runQuery, not a plain document list: the security rules only allow a read
  // they can prove returns published posts, so the status filter has to be part
  // of the query itself. An unfiltered list is rejected with a 403.
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:runQuery?key=${key}`
  const body = {
    structuredQuery: {
      from: [{ collectionId: 'posts' }],
      where: {
        fieldFilter: {
          field: { fieldPath: 'status' },
          op: 'EQUAL',
          value: { stringValue: 'published' },
        },
      },
      limit: 500,
    },
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      console.warn(`${label}: Firestore returned ${res.status} — no posts`)
      return []
    }
    const rows = await res.json()
    return rows
      .filter((row) => row.document)
      .map(({ document }) => {
        const post = fields(document.fields)
        post.updatedAt = post.updatedAt ?? post.publishedAt ?? document.updateTime
        return post
      })
      .filter((p) => p.slug)
      .sort((a, b) => String(b.publishedAt ?? '').localeCompare(String(a.publishedAt ?? '')))
  } catch (e) {
    console.warn(`${label}: could not reach Firestore —`, e.message)
    return []
  }
}
