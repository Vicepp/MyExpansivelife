import { Link } from 'react-router-dom'
import { formatDate } from '../lib/posts'

/*
 * The article card used by the home/course journal strip and the blog index.
 *
 * A post without a cover image gets a flat colour block with a category glyph
 * instead of a placeholder photo — that is the treatment on the design board,
 * and it keeps a fresh blog from looking broken before any art exists.
 */

const ICONS = {
  investing: 'M3 17l6-6 4 4 7-7m0 0h-5m5 0v5',
  career: 'M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z',
  community: 'M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm8 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM2 20c0-3 2.7-5 6-5s6 2 6 5m2-5c3 0 6 2 6 5',
  mindset: 'M12 3a5 5 0 0 1 5 5c0 2-1 3-1.5 4.5S15 15 15 16H9c0-1 0-2-.5-3.5S7 10 7 8a5 5 0 0 1 5-5zm-3 16h6m-5 2h4',
  default: 'M5 4h14v16H5zM8 9h8M8 13h8M8 17h5',
}

const TONES = [
  { block: 'bg-forest-deep', pill: 'bg-sage-tint text-forest-deep' },
  { block: 'bg-sage', pill: 'bg-sage-tint text-forest-deep' },
  { block: 'bg-gold', pill: 'bg-gold-tint text-gold-text' },
]

function glyphFor(category = '') {
  const key = category.toLowerCase()
  if (key.includes('invest')) return ICONS.investing
  if (key.includes('career')) return ICONS.career
  if (key.includes('community') || key.includes('win')) return ICONS.community
  if (key.includes('mindset')) return ICONS.mindset
  return ICONS.default
}

/** Deterministic so a card keeps its colour between renders and pages. */
export function toneFor(index = 0) {
  return TONES[index % TONES.length]
}

function CoverBlock({ post, tone, className }) {
  if (post.coverImage) {
    return (
      <img
        src={post.coverImage}
        alt=""
        loading="lazy"
        className={`w-full object-cover ${className}`}
      />
    )
  }

  return (
    <div className={`grid place-items-center ${tone.block} ${className}`}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="size-8 text-white/90"
      >
        <path
          d={glyphFor(post.category)}
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}

export default function PostCard({ post, index = 0 }) {
  const tone = toneFor(index)
  const href = `/blogs/${post.slug}`

  return (
    <article className="card-lift img-zoom flex grow flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white">
      <Link to={href} className="block overflow-hidden" aria-hidden="true" tabIndex={-1}>
        <CoverBlock post={post} tone={tone} className="h-[132px]" />
      </Link>

      <div className="flex grow flex-col p-6">
        {post.category && (
          <span
            className={`self-start rounded-full px-3 py-1 text-[10.5px] font-semibold uppercase tracking-[0.08em] ${tone.pill}`}
          >
            {post.category}
          </span>
        )}
        <h3 className="mt-3 text-[17px] font-bold leading-snug text-forest-deep">
          <Link to={href} className="hover:text-gold-text">
            {post.title}
          </Link>
        </h3>
        <p className="mt-2 grow text-[13.5px] leading-relaxed text-ink/70">
          {post.excerpt}
        </p>

        <div className="mt-6 flex items-center justify-between border-t border-ink/10 pt-4 text-[12px] text-ink/60">
          <span>{formatDate(post.publishedAt ?? post.createdAt)}</span>
          <span>{post.readMinutes ?? 4} min read</span>
        </div>
      </div>
    </article>
  )
}

/** Wide variant for the one featured post at the top of the blog index. */
export function FeaturedPostCard({ post }) {
  const tone = toneFor(0)
  const href = `/blogs/${post.slug}`

  return (
    <article className="card-lift img-zoom grid overflow-hidden rounded-2xl border border-ink/10 bg-white lg:grid-cols-[minmax(0,40%)_minmax(0,60%)]">
      <Link to={href} className="block overflow-hidden" aria-hidden="true" tabIndex={-1}>
        <CoverBlock post={post} tone={tone} className="h-[200px] lg:h-full" />
      </Link>

      <div className="p-7 lg:p-10">
        {post.category && (
          <span
            className={`inline-block rounded-full px-3 py-1 text-[10.5px] font-semibold uppercase tracking-[0.08em] ${tone.pill}`}
          >
            {post.category}
          </span>
        )}
        <h3 className="mt-4 font-display text-[24px] leading-snug text-forest-deep lg:text-[30px]">
          <Link to={href} className="hover:text-gold-text">
            {post.title}
          </Link>
        </h3>
        <p className="mt-3 max-w-[620px] text-[14.5px] leading-relaxed text-ink/70">
          {post.excerpt}
        </p>
        <p className="mt-6 text-[12.5px] text-ink/60">
          {post.author?.name ? `${post.author.name} · ` : ''}
          {formatDate(post.publishedAt ?? post.createdAt)} ·{' '}
          {post.readMinutes ?? 4} min read
        </p>
      </div>
    </article>
  )
}
