import { LINKEDIN_POSTS } from './posts-linkedin.mjs'
import { MXL_POSTS } from './posts-mxl.mjs'

/**
 * The twelve seed articles, interleaved and dated.
 *
 * MXL and LinkedIn posts alternate so the blog index never shows six of the
 * same flavour in a row, and publish dates are spread backwards from the run
 * date at a steady cadence — a batch that all shares one timestamp looks
 * exactly like what it is.
 */

/** Days between consecutive posts, newest first. */
const CADENCE_DAYS = 4

function interleave(a, b) {
  const out = []
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if (a[i]) out.push(a[i])
    if (b[i]) out.push(b[i])
  }
  return out
}

/** Strips tags and counts words, so the 1000-word ceiling can be checked. */
export function wordCount(html) {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean).length
}

export function buildPosts({ from = new Date(), status = 'published' } = {}) {
  return interleave(MXL_POSTS, LINKEDIN_POSTS).map((post, i) => {
    const publishedAt = new Date(from)
    publishedAt.setDate(publishedAt.getDate() - i * CADENCE_DAYS)
    publishedAt.setHours(9, 0, 0, 0)

    return {
      ...post,
      status,
      coverImage: `/blog/${post.slug}.jpg`,
      publishedAt,
      createdAt: publishedAt,
      updatedAt: publishedAt,
      publishAt: null,
      views: 0,
      likes: 0,
      words: wordCount(post.content),
    }
  })
}

export const POSTS = buildPosts()
