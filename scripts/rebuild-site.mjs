/**
 * Triggers a production redeploy through the Vercel Deploy Hook, then (with
 * slugs given) waits until each article is live with its prerendered,
 * crawler-readable page.
 *
 *   node scripts/rebuild-site.mjs                      # just redeploy
 *   node scripts/rebuild-site.mjs my-slug other-slug   # redeploy + verify
 *
 * The deploy runs the full build: prerendered pages, sitemap, IndexNow and
 * the Google Search Console sitemap resubmission (see package.json).
 * VERCEL_DEPLOY_HOOK_URL is read from .env; it is never printed.
 */
import { loadEnv, SITE_URL } from './lib/published-posts.mjs'

await loadEnv()

const hook = (process.env.VERCEL_DEPLOY_HOOK_URL ?? '').trim()
if (!hook) {
  console.error('rebuild-site: VERCEL_DEPLOY_HOOK_URL is not set in .env')
  process.exit(1)
}

const res = await fetch(hook, { method: 'POST' })
if (!res.ok) {
  console.error(`rebuild-site: deploy hook returned ${res.status}`)
  process.exit(1)
}
console.log('rebuild-site: production deploy started')

const slugs = process.argv.slice(2).filter((a) => !a.startsWith('-'))
if (slugs.length) {
  const deadline = Date.now() + 10 * 60_000
  const pending = new Set(slugs)
  while (pending.size && Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 20_000))
    for (const slug of [...pending]) {
      // Ask as a crawler would: no JavaScript, just the served HTML.
      const page = await fetch(`${SITE_URL}/blogs/${slug}`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; bingbot/2.0)' },
      })
        .then((r) => r.text())
        .catch(() => '')
      const title = /<title>([^<]*)<\/title>/.exec(page)?.[1] ?? ''
      if (page.includes('<article>') && !title.includes('Bigger Than Your Career')) {
        console.log(`rebuild-site: live and crawlable — ${SITE_URL}/blogs/${slug} ("${title}")`)
        pending.delete(slug)
      }
    }
  }
  if (pending.size) {
    console.error(`rebuild-site: not live after 10 minutes: ${[...pending].join(', ')}`)
    process.exit(1)
  }
}
