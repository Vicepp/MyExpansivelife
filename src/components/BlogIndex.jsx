import { useEffect, useMemo, useState } from 'react'
import { Container } from './primitives'
import Reveal from './Reveal'
import PostCard, { FeaturedPostCard } from './PostCard'
import { listLive } from '../lib/posts'

const PAGE = 6

/**
 * The blog index: search, category filters, one featured article and a paged
 * grid beneath it. Filtering happens in the browser — the whole published set
 * is a single read, and the list is small enough that paging it server-side
 * would cost more requests than it saves.
 */
export default function BlogIndex() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [term, setTerm] = useState('')
  const [category, setCategory] = useState('All')
  const [shown, setShown] = useState(PAGE)

  useEffect(() => {
    let cancelled = false
    listLive()
      .then((rows) => !cancelled && setPosts(rows))
      .catch((e) => {
        if (cancelled) return
        console.error('Could not load posts:', e)
        setError(e.message ?? 'Could not load posts.')
      })
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [])

  // Only the categories that actually have published articles behind them.
  const categories = useMemo(() => {
    const seen = []
    posts.forEach((p) => {
      if (p.category && !seen.includes(p.category)) seen.push(p.category)
    })
    return ['All', ...seen]
  }, [posts])

  const matches = useMemo(() => {
    const needle = term.trim().toLowerCase()
    return posts.filter((p) => {
      if (category !== 'All' && p.category !== category) return false
      if (!needle) return true
      return [p.title, p.excerpt, p.category, p.author?.name]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(needle))
    })
  }, [posts, term, category])

  // The featured slot only makes sense on the unfiltered list — once someone
  // searches, every result should be weighted the same.
  const browsing = !term.trim() && category === 'All'
  const featured = browsing ? matches[0] : null
  const rest = browsing ? matches.slice(1) : matches

  useEffect(() => setShown(PAGE), [term, category])

  return (
    <section className="bg-cream pb-24">
      <Container>
        <Reveal>
          <div className="mx-auto max-w-[520px]">
            <label htmlFor="blog-search" className="sr-only">
              Search articles
            </label>
            <input
              id="blog-search"
              type="search"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Search articles, topics or authors"
              className="w-full rounded-full border border-ink/15 bg-white px-6 py-3.5 text-[14px] text-ink placeholder:text-ink/45 focus:border-gold focus:outline-none"
            />
          </div>
        </Reveal>

        {categories.length > 1 && (
          <Reveal delay={100}>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  aria-pressed={c === category}
                  className={`rounded-full border px-5 py-2 text-[13px] font-medium transition-colors ${
                    c === category
                      ? 'border-forest-deep bg-forest-deep text-white'
                      : 'border-ink/15 bg-white text-ink/75 hover:border-forest-deep/40'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </Reveal>
        )}

        {loading ? (
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-[340px] animate-pulse rounded-2xl border border-ink/10 bg-cream-card"
              />
            ))}
          </div>
        ) : error ? (
          <div className="mt-16 rounded-2xl border border-amber-300 bg-amber-50 px-6 py-8 text-center">
            <p className="text-[15px] font-semibold text-amber-900">
              Articles couldn’t be loaded
            </p>
            <p className="mx-auto mt-2 max-w-[520px] text-[13.5px] leading-relaxed text-amber-900/80">
              {error}
            </p>
          </div>
        ) : matches.length === 0 ? (
          <p className="mt-16 rounded-2xl border border-dashed border-ink/15 px-6 py-14 text-center text-[15px] text-ink/60">
            {posts.length === 0
              ? 'New articles are on the way. Check back shortly.'
              : 'Nothing matches that search yet. Try another word or category.'}
          </p>
        ) : (
          <>
            {featured && (
              <div className="mt-14">
                <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-gold">
                  Featured
                </p>
                <Reveal className="mt-4">
                  <FeaturedPostCard post={featured} />
                </Reveal>
              </div>
            )}

            {rest.length > 0 && (
              <div className="mt-14">
                <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-gold">
                  {browsing ? 'Latest articles' : `${rest.length} article${rest.length === 1 ? '' : 's'}`}
                </p>
                <div className="mt-5 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {rest.slice(0, shown).map((post, i) => (
                    <Reveal key={post.id} delay={(i % 3) * 110} className="flex">
                      <PostCard post={post} index={i} />
                    </Reveal>
                  ))}
                </div>

                {rest.length > shown && (
                  <div className="mt-12 flex justify-center">
                    <button
                      type="button"
                      onClick={() => setShown((n) => n + PAGE)}
                      className="rounded-full border border-ink/15 bg-white px-7 py-3 text-[14px] font-semibold text-forest-deep transition-colors hover:border-forest-deep/40"
                    >
                      Load more articles
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </Container>
    </section>
  )
}
