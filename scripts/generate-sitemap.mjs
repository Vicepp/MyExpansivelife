/**
 * Writes dist/sitemap.xml after a build.
 *
 * Every article lives behind a client-side route, so a crawler has no way to
 * discover /blogs/<slug> by following links in the served HTML. The sitemap is
 * how those URLs get found.
 *
 * Published posts are world-readable under firestore.rules, so this needs no
 * credentials. If Firebase is unreachable or unconfigured the static routes
 * are still written — a partial sitemap beats a failed build.
 *
 * Runs automatically as part of `npm run build`.
 */
import { writeFile, readFile } from 'node:fs/promises'

/**
 * Minimal .env reader — dotenv is not a dependency and this needs two keys.
 * Netlify injects the same variables into the environment directly, so a
 * missing .env is normal in CI, not an error.
 */
async function loadEnv() {
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

await loadEnv()

const SITE_URL = process.env.SITE_URL ?? 'https://myexpansivelife.netlify.app'

/** path -> change frequency + priority */
const STATIC_ROUTES = [
  ['/', 'weekly', '1.0'],
  ['/blogs', 'daily', '0.9'],
  ['/community', 'weekly', '0.9'],
  ['/courses/linkedin-unlocked', 'weekly', '0.9'],
  ['/affiliate', 'monthly', '0.6'],
]

async function fetchPublishedPosts() {
  const projectId = process.env.VITE_FIREBASE_PROJECT_ID
  const key = process.env.VITE_FIREBASE_API_KEY
  if (!projectId || !key) {
    console.warn('sitemap: Firebase env not set — writing static routes only')
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
      console.warn(`sitemap: Firestore returned ${res.status} — static routes only`)
      return []
    }
    const rows = await res.json()
    return rows
      .filter((row) => row.document)
      .map(({ document }) => ({
        slug: document.fields?.slug?.stringValue,
        updatedAt:
          document.fields?.updatedAt?.timestampValue ??
          document.fields?.publishedAt?.timestampValue ??
          document.updateTime,
      }))
      .filter((p) => p.slug)
  } catch (e) {
    console.warn('sitemap: could not reach Firestore —', e.message)
    return []
  }
}

function urlEntry(loc, lastmod, changefreq, priority) {
  return [
    '  <url>',
    `    <loc>${SITE_URL}${loc}</loc>`,
    lastmod ? `    <lastmod>${new Date(lastmod).toISOString().slice(0, 10)}</lastmod>` : '',
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ]
    .filter(Boolean)
    .join('\n')
}

const posts = await fetchPublishedPosts()
const today = new Date().toISOString().slice(0, 10)

const body = [
  ...STATIC_ROUTES.map(([path, freq, pri]) => urlEntry(path, today, freq, pri)),
  ...posts.map((p) => urlEntry(`/blogs/${p.slug}`, p.updatedAt, 'monthly', '0.8')),
].join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`

await writeFile('dist/sitemap.xml', xml, 'utf8')
console.log(
  `sitemap: wrote ${STATIC_ROUTES.length + posts.length} URLs (${posts.length} articles)`,
)
