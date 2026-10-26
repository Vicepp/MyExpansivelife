/**
 * Writes dist/llms.txt and dist/llms-full.txt after a build — the plain-text
 * guides AI search and answer engines (ChatGPT, Perplexity, Claude, Gemini,
 * Copilot) read to understand a site and cite it (https://llmstxt.org).
 *
 * llms.txt      — who we are, the key pages, and every article with a summary.
 * llms-full.txt — the same, plus each article's full text as Markdown, so an
 *                 assistant can read the whole journal in one request.
 *
 * Built from the same published posts as the sitemap and prerendered pages;
 * NOINDEX_SLUGS are left out. Runs automatically as part of `npm run build`.
 */
import { writeFile } from 'node:fs/promises'
import {
  SITE_URL,
  NOINDEX_SLUGS,
  loadEnv,
  fetchPublishedPosts,
} from './lib/published-posts.mjs'

await loadEnv()

const ENTITIES = { nbsp: ' ', amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“', mdash: '—', ndash: '–', hellip: '…' }

function decode(text = '') {
  return String(text)
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, name) => ENTITIES[name.toLowerCase()] ?? m)
}

function absolute(href) {
  return href.startsWith('/') ? `${SITE_URL}${href}` : href
}

/** The rich-text editor's HTML → Markdown (headings, lists, emphasis, links, quotes). */
function toMarkdown(html = '') {
  let md = String(html)
    .replace(/<(script|style|iframe)[\s\S]*?<\/\1>/gi, '')
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '\n\n## $1\n\n')
    .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '\n\n### $1\n\n')
    .replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, '\n\n#### $1\n\n')
    .replace(/<a\s[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, (_, href, text) => `[${text}](${absolute(decode(href))})`)
    .replace(/<(strong|b)>([\s\S]*?)<\/\1>/gi, '**$2**')
    .replace(/<(em|i)>([\s\S]*?)<\/\1>/gi, '*$2*')
    .replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, q) => `\n\n> ${q.replace(/<[^>]+>/g, ' ').trim()}\n\n`)
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '\n- $1')
    .replace(/<\/(ul|ol)>/gi, '\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
  md = decode(md)
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
  return md
}

function summary(post) {
  const text = post.excerpt || String(post.content ?? '').replace(/<[^>]+>/g, ' ')
  return decode(text).replace(/\s+/g, ' ').trim().slice(0, 240)
}

const posts = (await fetchPublishedPosts('llms-txt')).filter((p) => !NOINDEX_SLUGS.has(p.slug))

const header = `# My Expansive Life

> My Expansive Life is the coaching and education business of Dr. Nkem Ezeamama — a former ER physician who built a LinkedIn audience of 17,000+ followers and founded Pheenyx Capital, which manages $153 million in assets. It helps professionals build visibility, income and wealth beyond a single career, mainly through LinkedIn, community and investing education.

## Key pages

- [Home](${SITE_URL}/): what My Expansive Life is and the six areas it covers (career and identity, brand and visibility, entrepreneurship, wealth and ownership, sustainable growth, community).
- [LinkedIn Unlocked course](${SITE_URL}/courses/linkedin-unlocked): a step-by-step system for turning a LinkedIn presence into visibility, leads and revenue — six modules plus an AI toolkit; cohort or done-with-you.
- [Free LinkedIn webinar](${SITE_URL}/linkedin-unlocked): "How a Single LinkedIn Post Turned Into a Six Figure Partnership", live with Dr. Nkem; registration includes the free Personal Brand Playbook.
- [The Circle community](${SITE_URL}/community): the private membership for learning, connection and weekly accountability, including the live Monday Momentum sessions.
- [Affiliate programme](${SITE_URL}/affiliate): earn 20% on every LinkedIn Unlocked enrolment you refer.
- [The Expansive Journal](${SITE_URL}/blogs): practical articles on LinkedIn strategy, personal branding, entrepreneurship and investing.

## Articles

${posts.map((p) => `- [${p.title}](${SITE_URL}/blogs/${p.slug}): ${summary(p)}`).join('\n')}
`

const full = `${header}
---

# Full articles

${posts
  .map((p) =>
    [
      `## ${p.title}`,
      '',
      `URL: ${SITE_URL}/blogs/${p.slug}`,
      `Author: ${p.author?.name ?? 'My Expansive Life'}${p.publishedAt ? ` · Published: ${String(p.publishedAt).slice(0, 10)}` : ''}${p.category ? ` · ${p.category}` : ''}`,
      '',
      // Demote the article's own headings one level under its ## title.
      toMarkdown(p.content).replace(/^(#{2,5}) /gm, '#$1 '),
    ].join('\n'),
  )
  .join('\n\n---\n\n')}
`

await writeFile('dist/llms.txt', header, 'utf8')
await writeFile('dist/llms-full.txt', full, 'utf8')
console.log(`llms-txt: wrote llms.txt and llms-full.txt (${posts.length} articles)`)
