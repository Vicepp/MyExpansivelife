import { useEffect } from 'react'
import { SITE_URL } from '../lib/links'

/*
 * Per-page document head.
 *
 * This is a client-rendered SPA, so index.html ships one title and one
 * description for every route. Google renders JS and will pick these up, but
 * plenty of crawlers and link unfurlers do not — so the tags are written into
 * the real <head> as early as possible and torn down on unmount.
 *
 * No library: react-helmet and friends are more machinery than three tag
 * types need.
 */

const MANAGED = 'data-seo'

function upsertMeta(selector, attrs) {
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(MANAGED, '')
    document.head.appendChild(el)
  }
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v))
}

function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    el.setAttribute(MANAGED, '')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

export default function Seo({
  title,
  description,
  path = '',
  image,
  type = 'website',
  publishedAt,
  author,
  /* JSON-LD, so an article can describe itself to search and to answer engines. */
  schema,
}) {
  useEffect(() => {
    const previousTitle = document.title
    const url = `${SITE_URL}${path}`
    const fullTitle = title ? `${title} | My Expansive Life` : previousTitle

    document.title = fullTitle
    upsertLink('canonical', url)

    if (description) {
      upsertMeta('meta[name="description"]', { name: 'description', content: description })
      upsertMeta('meta[property="og:description"]', {
        property: 'og:description',
        content: description,
      })
      upsertMeta('meta[name="twitter:description"]', {
        name: 'twitter:description',
        content: description,
      })
    }

    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: fullTitle })
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: type })
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: url })
    upsertMeta('meta[property="og:site_name"]', {
      property: 'og:site_name',
      content: 'My Expansive Life',
    })
    upsertMeta('meta[name="twitter:card"]', {
      name: 'twitter:card',
      content: image ? 'summary_large_image' : 'summary',
    })
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: fullTitle })

    if (image) {
      const absolute = image.startsWith('http') ? image : `${SITE_URL}${image}`
      upsertMeta('meta[property="og:image"]', { property: 'og:image', content: absolute })
      upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: absolute })
    }

    if (publishedAt) {
      upsertMeta('meta[property="article:published_time"]', {
        property: 'article:published_time',
        content: new Date(publishedAt).toISOString(),
      })
    }
    if (author) {
      upsertMeta('meta[property="article:author"]', {
        property: 'article:author',
        content: author,
      })
    }

    let ld
    if (schema) {
      ld = document.createElement('script')
      ld.type = 'application/ld+json'
      ld.setAttribute(MANAGED, '')
      ld.textContent = JSON.stringify(schema)
      document.head.appendChild(ld)
    }

    return () => {
      document.title = previousTitle
      ld?.remove()
      // Article-only tags must not leak onto the next route.
      document.head
        .querySelectorAll('meta[property^="article:"]')
        .forEach((el) => el.remove())
    }
  }, [title, description, path, image, type, publishedAt, author, schema])

  return null
}

/** schema.org Article for a blog post. */
export function articleSchema(post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage
      ? [post.coverImage.startsWith('http') ? post.coverImage : `${SITE_URL}${post.coverImage}`]
      : undefined,
    datePublished: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
    dateModified: post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined,
    author: {
      '@type': 'Person',
      name: post.author?.name ?? 'My Expansive Life',
    },
    publisher: {
      '@type': 'Organization',
      name: 'My Expansive Life',
      url: SITE_URL,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blogs/${post.slug}`,
    },
    keywords: post.tags?.join(', '),
    articleSection: post.category,
  }
}
