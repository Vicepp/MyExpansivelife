/**
 * Renders posts from scripts/content into one review page, styled with the
 * site's own article CSS, before anything is published.
 *
 *   node scripts/preview-posts.mjs [--guides] [out.html]
 *
 * --guides limits it to the keyword-first guides. Uses the stylesheet from
 * dist/ when a build exists (npm run build), so tables, video and headings look
 * as they will on the site. Also prints each post's FAQ, which is what
 * becomes FAQPage structured data.
 */
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { buildPosts } from './content/index.mjs'
import { faqFromHtml } from '../src/lib/faq.js'

const args = process.argv.slice(2)
const onlyGuides = args.includes('--guides')
const out = args.find((a) => !a.startsWith('--')) ?? 'preview-posts.html'

const posts = buildPosts().filter((p) => !onlyGuides || p.kind === 'guide')

let css = ''
try {
  const file = (await readdir('dist/assets')).find((f) => /^index-.*\.css$/.test(f))
  css = await readFile(`dist/assets/${file}`, 'utf8')
} catch {
  console.warn('preview: no dist/ build — rendering without site styles')
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')

const body = posts
  .map(
    (p) => `<article style="max-width:760px;margin:0 auto 96px">
  <p style="font-size:13px;color:#7d886e">${esc(p.category)} · ${p.words} words · ${p.publishedAt.toDateString()} · /blogs/${p.slug}</p>
  <h1 class="font-display" style="font-size:40px;line-height:1.1;color:#183734;margin:8px 0">${esc(p.title)}</h1>
  <p style="color:#555;font-style:italic">Meta description (${p.excerpt.length}): ${esc(p.excerpt)}</p>
  <img src="public/blog/${p.slug}.jpg" alt="${esc(p.coverAlt ?? '')}" style="width:100%;border-radius:16px;margin:16px 0">
  <div class="prose-mxl">${p.content}</div>
  <details style="margin-top:24px;font-size:13px"><summary>FAQ structured data (${faqFromHtml(p.content).length} questions)</summary>
  <ol>${faqFromHtml(p.content).map((f) => `<li><b>${esc(f.question)}</b><br>${esc(f.answer)}</li>`).join('')}</ol></details>
</article>`,
  )
  .join('\n<hr style="margin:64px auto;max-width:760px">\n')

await writeFile(
  out,
  `<!doctype html><html><head><meta charset="utf-8"><title>Post preview</title><style>${css}</style></head>
<body class="bg-cream" style="padding:48px 16px">${body}</body></html>`,
  'utf8',
)
console.log(`preview: ${posts.length} posts → ${out}`)
