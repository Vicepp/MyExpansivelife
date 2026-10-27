/**
 * FAQ structured data, read straight from an article's own HTML.
 *
 * Any post with an <h2> titled "Frequently asked questions" (or "FAQ" /
 * "Common questions") followed by <h3> question + answer pairs gets FAQPage
 * JSON-LD — no extra fields to keep in sync. Plain JS, so both the article page
 * (src/pages/BlogPost.jsx) and the build-time prerender use the same parser.
 */

const HEADING = /<h2[^>]*>\s*(?:frequently asked questions|faqs?|common questions)\s*<\/h2>([\s\S]*?)(?=<h2[\s>]|$)/i
const PAIR = /<h3[^>]*>([\s\S]*?)<\/h3>([\s\S]*?)(?=<h3[\s>]|$)/gi

const ENTITIES = { nbsp: ' ', amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“', mdash: '—', ndash: '–', hellip: '…' }

function text(html = '') {
  return String(html)
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&([a-z]+);/gi, (m, name) => ENTITIES[name.toLowerCase()] ?? m)
    .replace(/\s+/g, ' ')
    .trim()
}

/** [{ question, answer }] from the article's FAQ section, or []. */
export function faqFromHtml(html = '') {
  const section = HEADING.exec(String(html))
  if (!section) return []
  return [...section[1].matchAll(PAIR)]
    .map(([, q, a]) => ({ question: text(q), answer: text(a) }))
    .filter((f) => f.question && f.answer)
}

/** schema.org FAQPage for an article, or null when it has no FAQ section. */
export function faqSchema(html) {
  const items = faqFromHtml(html)
  if (!items.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }
}
