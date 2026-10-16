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
import { writeFile } from 'node:fs/promises'
import {
  SITE_URL,
  NOINDEX_SLUGS,
  loadEnv,
  fetchPublishedPosts,
} from './lib/published-posts.mjs'

await loadEnv()

/** path -> change frequency + priority */
const STATIC_ROUTES = [
  ['/', 'weekly', '1.0'],
  ['/blogs', 'daily', '0.9'],
  ['/community', 'weekly', '0.9'],
  ['/courses/linkedin-unlocked', 'weekly', '0.9'],
  ['/linkedin-unlocked', 'weekly', '0.9'],
  ['/affiliate', 'monthly', '0.6'],
]

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

const posts = (await fetchPublishedPosts('sitemap')).filter((p) => !NOINDEX_SLUGS.has(p.slug))
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
