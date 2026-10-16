/**
 * Tells IndexNow search engines (Bing — and through it DuckDuckGo, Yahoo and
 * Ecosia — plus Yandex, Seznam, Naver) which URLs exist, so new and updated
 * articles are crawled within hours instead of whenever they next visit.
 *
 * Reads the URLs from dist/sitemap.xml. Proof of ownership is the key file in
 * /public, served at the site root. Only runs for Vercel production deploys;
 * local and preview builds skip it. A failed ping never fails the build.
 */
import { readFile } from 'node:fs/promises'

const KEY = '2387125ed802858173dcfae5859038c4'
const HOST = 'www.myexpansivelife.com'

if (process.env.VERCEL_ENV !== 'production') {
  console.log('indexnow: not a production deploy — skipped')
} else {
  try {
    const xml = await readFile('dist/sitemap.xml', 'utf8')
    const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: HOST,
        key: KEY,
        keyLocation: `https://${HOST}/${KEY}.txt`,
        urlList,
      }),
    })
    console.log(`indexnow: submitted ${urlList.length} URLs → ${res.status}`)
  } catch (e) {
    console.warn('indexnow: ping failed —', e.message)
  }
}
