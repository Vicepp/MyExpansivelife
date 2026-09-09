/**
 * SEO compliance report for the seed articles.
 *
 * The articles themselves are reviewed on the running site (see
 * VITE_PREVIEW_POSTS in .env.local) — this covers the parts you cannot see by
 * reading the page: word counts, meta description lengths, link coverage and
 * whether every internal link points at something real.
 *
 *   node scripts/check-posts.mjs
 *
 * Exits non-zero if anything fails, so it can gate a publish.
 */
import { existsSync } from 'node:fs'
import { POSTS } from './content/index.mjs'

const MIN_WORDS = 900
const MAX_WORDS = 1000
const MAX_EXCERPT = 160

const slugs = new Set(POSTS.map((p) => p.slug))
let failures = 0

console.log(`\n${POSTS.length} articles\n`)
console.log('words  meta  int  ext  cover  slug')
console.log('─'.repeat(78))

for (const post of POSTS) {
  const internal = [...post.content.matchAll(/href="(\/[^"]*)"/g)].map((m) => m[1])
  const external = [...post.content.matchAll(/href="(https?:\/\/[^"]*)"/g)].map((m) => m[1])
  const hasCover = existsSync(`public${post.coverImage}`)

  const problems = []
  if (post.words > MAX_WORDS) problems.push(`${post.words} words is over the ${MAX_WORDS} ceiling`)
  if (post.words < MIN_WORDS) problems.push(`${post.words} words is short of the ${MIN_WORDS} target`)
  if (post.excerpt.length > MAX_EXCERPT)
    problems.push(`meta description is ${post.excerpt.length}, over ${MAX_EXCERPT}`)
  if (!hasCover) problems.push(`missing cover image public${post.coverImage}`)
  if (!internal.length) problems.push('no internal links')
  if (!external.length) problems.push('no external links')

  for (const link of internal) {
    const match = /^\/blogs\/(.+)$/.exec(link)
    if (match && !slugs.has(match[1])) problems.push(`internal link to unknown post: ${link}`)
  }

  console.log(
    String(post.words).padStart(5),
    String(post.excerpt.length).padStart(5),
    String(internal.length).padStart(4),
    String(external.length).padStart(4),
    (hasCover ? '   ok' : ' MISS').padStart(6),
    ' ' + post.slug,
  )
  for (const problem of problems) {
    console.log(`       ✗ ${problem}`)
    failures++
  }
}

const words = POSTS.map((p) => p.words)
console.log('─'.repeat(78))
console.log(
  `range ${Math.min(...words)}–${Math.max(...words)} words, average ${Math.round(
    words.reduce((a, b) => a + b, 0) / POSTS.length,
  )}`,
)

const byCategory = {}
for (const p of POSTS) byCategory[p.category] = (byCategory[p.category] ?? 0) + 1
console.log(
  'categories: ' +
    Object.entries(byCategory)
      .map(([c, n]) => `${c} (${n})`)
      .join(', '),
)

if (failures) {
  console.log(`\n${failures} problem${failures === 1 ? '' : 's'} to fix.`)
  process.exit(1)
}
console.log('\nAll checks passed.')
