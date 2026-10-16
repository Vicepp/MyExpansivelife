/**
 * Writes a real HTML page for /blogs and every published article after a
 * build: dist/blogs/index.html and dist/blogs/<slug>/index.html.
 *
 * The site is a single-page app, so without this every article is served as
 * the same empty shell — one generic <title>, no description, an empty
 * #root — and the content only appears once JavaScript runs. Google renders
 * JavaScript eventually; Bing (and DuckDuckGo, Yahoo and Ecosia, which use
 * it), Yandex, and link-preview bots largely don't. These pages give every
 * crawler the article's own title, description, canonical URL, Open Graph
 * tags, BlogPosting structured data and full text up front.
 *
 * Visitors get the same app as before: the static files are served first
 * (Vercel checks the filesystem before the SPA rewrite), then React mounts
 * and replaces #root with the interactive page. Head extras are marked
 * data-prerender; src/main.jsx drops them on startup so the Seo component
 * stays the single owner of structured data during client-side navigation.
 *
 * Runs automatically as part of `npm run build`. If Firestore can't be
 * reached, nothing is written and the SPA shell keeps serving these routes.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import {
  SITE_URL,
  NOINDEX_SLUGS,
  loadEnv,
  fetchPublishedPosts,
} from './lib/published-posts.mjs'

await loadEnv()

const SITE_NAME = 'My Expansive Life'

/** Text and attribute values going into the template. */
function esc(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function absolute(url) {
  if (!url) return `${SITE_URL}/og-image.jpg`
  return url.startsWith('http') ? url : `${SITE_URL}${url}`
}

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const ENTITIES = {
  nbsp: ' ',
  amp: '&',
  quot: '"',
  apos: "'",
  lt: '<',
  gt: '>',
  rsquo: '’',
  lsquo: '‘',
  rdquo: '”',
  ldquo: '“',
  mdash: '—',
  ndash: '–',
  hellip: '…',
}

/** Turns stored HTML entities (&nbsp;, &rsquo;, &#39;…) back into text. */
function decode(text = '') {
  return String(text)
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, name) => ENTITIES[name.toLowerCase()] ?? m)
}

/** Plain-text excerpt; built from the article when none was written. */
function excerptOf(post) {
  const text = post.excerpt || String(post.content ?? '').replace(/<[^>]+>/g, ' ')
  return decode(text)
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, post.excerpt ? 300 : 160)
}

/** JSON inside <script>: neutralise "</script>" and friends. */
function jsonLd(data) {
  return `<script type="application/ld+json" data-prerender>${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`
}

/**
 * Swaps the shell's page-level tags for this page's. Every tag the template
 * carries is replaced in place, so nothing is duplicated.
 */
function page(
  template,
  { path, title, description, image, type = 'website', head = '', body, noindex = false },
) {
  const url = `${SITE_URL}${path}`
  const meta = (attr, name, content) =>
    `<meta ${attr}="${name}" content="${esc(content)}" />`

  const replacements = [
    [/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`],
    [/<meta\s+name="description"[\s\S]*?\/>/, meta('name', 'description', description)],
    [/<meta property="og:type"[^>]*\/>/, meta('property', 'og:type', type)],
    [/<meta property="og:url"[^>]*\/>/, meta('property', 'og:url', url)],
    [/<meta property="og:title"[^>]*\/>/, meta('property', 'og:title', title)],
    [/<meta\s+property="og:description"[\s\S]*?\/>/, meta('property', 'og:description', description)],
    [/<meta property="og:image" [^>]*\/>/, meta('property', 'og:image', image)],
    [/<meta property="og:image:alt"[^>]*\/>/, meta('property', 'og:image:alt', title)],
    [/<meta name="twitter:image"[^>]*\/>/, meta('name', 'twitter:image', image)],
  ]

  let html = template
  for (const [pattern, replacement] of replacements) {
    if (!pattern.test(html)) throw new Error(`prerender: template is missing ${pattern}`)
    html = html.replace(pattern, replacement)
  }

  // The 1200x630 size only describes the default image.
  if (image !== `${SITE_URL}/og-image.jpg`) {
    html = html.replace(/\s*<meta property="og:image:(width|height)"[^>]*\/>/g, '')
  }

  html = html.replace(
    '</head>',
    `    <link rel="canonical" href="${esc(url)}" />\n` +
      (noindex ? '    <meta name="robots" content="noindex" />\n' : '') +
      `    ${head}\n  </head>`,
  )
  return html.replace('<div id="root"></div>', `<div id="root">${body}</div>`)
}

function articlePage(template, post, related) {
  const path = `/blogs/${post.slug}`
  const title = `${post.title} | ${SITE_NAME}`
  const description = excerptOf(post)
  const image = absolute(post.coverImage)
  const author = post.author?.name ?? SITE_NAME

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description,
    image: [image],
    datePublished: post.publishedAt ?? undefined,
    dateModified: post.updatedAt ?? post.publishedAt ?? undefined,
    author: { '@type': 'Person', name: author },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}${path}` },
    keywords: Array.isArray(post.tags) ? post.tags.join(', ') : undefined,
    articleSection: post.category,
  }
  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blogs` },
      { '@type': 'ListItem', position: 3, name: post.title, item: `${SITE_URL}${path}` },
    ],
  }

  const head = [
    post.publishedAt
      ? `<meta property="article:published_time" content="${esc(post.publishedAt)}" data-prerender />`
      : '',
    post.updatedAt
      ? `<meta property="article:modified_time" content="${esc(post.updatedAt)}" data-prerender />`
      : '',
    post.category
      ? `<meta property="article:section" content="${esc(post.category)}" data-prerender />`
      : '',
    jsonLd(schema),
    jsonLd(breadcrumbs),
  ]
    .filter(Boolean)
    .join('\n    ')

  const more = related
    .map((p) => `<li><a href="/blogs/${esc(p.slug)}">${esc(p.title)}</a></li>`)
    .join('')

  // Content is HTML authored in the admin's rich-text editor, rendered as-is
  // exactly as the live article page does.
  const body = `<main><article>
<p><a href="/">${SITE_NAME}</a> › <a href="/blogs">Blog</a>${post.category ? ` › ${esc(post.category)}` : ''}</p>
<h1>${esc(post.title)}</h1>
<p>By ${esc(author)}${post.publishedAt ? ` · <time datetime="${esc(post.publishedAt)}">${formatDate(post.publishedAt)}</time>` : ''}${post.readMinutes ? ` · ${post.readMinutes} min read` : ''}</p>
${post.coverImage ? `<img src="${esc(post.coverImage)}" alt="${esc(post.title)}" />` : ''}
${post.content ?? ''}
</article>
${more ? `<nav aria-label="More articles"><h2>More from the blog</h2><ul>${more}</ul></nav>` : ''}
</main>`

  return page(template, {
    path,
    title,
    description,
    image,
    type: 'article',
    head,
    body,
    noindex: NOINDEX_SLUGS.has(post.slug),
  })
}

function indexPage(template, posts) {
  const title = `Blog | ${SITE_NAME}`
  const description =
    'Practical articles on LinkedIn, personal branding, entrepreneurship and building wealth beyond a single career, from Dr. Nkem Ezeamama and My Expansive Life.'

  const items = posts
    .map(
      (p) =>
        `<li><article><h2><a href="/blogs/${esc(p.slug)}">${esc(p.title)}</a></h2>` +
        `${p.publishedAt ? `<time datetime="${esc(p.publishedAt)}">${formatDate(p.publishedAt)}</time>` : ''}` +
        `<p>${esc(excerptOf(p))}</p></article></li>`,
    )
    .join('\n')

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: `${SITE_NAME} Blog`,
    url: `${SITE_URL}/blogs`,
    description,
    blogPost: posts.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      url: `${SITE_URL}/blogs/${p.slug}`,
      datePublished: p.publishedAt ?? undefined,
    })),
  }

  const body = `<main><h1>The ${SITE_NAME} Blog</h1><p>${esc(description)}</p><ul>
${items}
</ul></main>`

  return page(template, {
    path: '/blogs',
    title,
    description,
    image: `${SITE_URL}/og-image.jpg`,
    head: jsonLd(schema),
    body,
  })
}

const template = await readFile('dist/index.html', 'utf8')
const posts = await fetchPublishedPosts('prerender')

if (!posts.length) {
  console.warn('prerender: no posts — blog routes keep serving the SPA shell')
} else {
  await mkdir('dist/blogs', { recursive: true })
  const listed = posts.filter((p) => !NOINDEX_SLUGS.has(p.slug))
  await writeFile('dist/blogs/index.html', indexPage(template, listed), 'utf8')

  for (const post of posts) {
    // A few other recent posts, so crawlers can walk between articles.
    const related = listed.filter((p) => p.slug !== post.slug).slice(0, 4)
    await mkdir(`dist/blogs/${post.slug}`, { recursive: true })
    await writeFile(`dist/blogs/${post.slug}/index.html`, articlePage(template, post, related), 'utf8')
  }

  console.log(`prerender: wrote /blogs and ${posts.length} article pages`)
}
