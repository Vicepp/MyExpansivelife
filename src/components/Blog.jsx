import { useEffect, useState } from 'react'
import { Container, TextLink } from './primitives'
import Reveal from './Reveal'
import PostCard from './PostCard'
import { listLive } from '../lib/posts'

export default function Blog({ count = 3, showIntro = true }) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    listLive({ max: count })
      .then((rows) => !cancelled && setPosts(rows))
      .catch((e) => {
        if (cancelled) return
        // Surfaced rather than swallowed: an empty blog caused by a permissions
        // or index problem should say so, not look like there is no content.
        console.error('Could not load posts:', e)
        setError(e.message ?? 'Could not load posts.')
        setPosts([])
      })
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [count])

  return (
    <section className="bg-white py-20 lg:py-24">
      <Container>
        {showIntro && (
          <div className="flex flex-wrap items-end justify-between gap-6">
            <Reveal>
              <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-gold">
                The Expansive Journal
              </p>
              <p className="mt-4 max-w-[560px] text-[15px] leading-relaxed text-ink/80">
                Ideas on personal branding, LinkedIn strategy, investing and
                building a life that feels fulfilling in every area.
              </p>
            </Reveal>
            <Reveal delay={120}>
              <TextLink to="/blogs">Read the journal</TextLink>
            </Reveal>
          </div>
        )}

        {loading ? (
          <div className={`grid gap-6 md:grid-cols-3 ${showIntro ? 'mt-12' : ''}`}>
            {Array.from({ length: Math.min(count, 3) }).map((_, i) => (
              <div
                key={i}
                className="h-[340px] animate-pulse rounded-2xl border border-ink/10 bg-cream-card"
              />
            ))}
          </div>
        ) : error ? (
          <div className="mt-12 rounded-2xl border border-amber-300 bg-amber-50 px-6 py-8 text-center">
            <p className="text-[15px] font-semibold text-amber-900">
              Articles couldn’t be loaded
            </p>
            <p className="mx-auto mt-2 max-w-[520px] text-[13.5px] leading-relaxed text-amber-900/80">
              {error}
            </p>
            <p className="mx-auto mt-3 max-w-[520px] text-[12.5px] text-amber-900/70">
              Check the browser console for the full error. If it mentions
              permissions, publish the rules from <code>firestore.rules</code>.
            </p>
          </div>
        ) : posts.length === 0 ? (
          <p className="mt-12 rounded-2xl border border-dashed border-ink/15 px-6 py-14 text-center text-[15px] text-ink/60">
            New articles are on the way. Check back shortly.
          </p>
        ) : (
          <div className={`grid gap-6 md:grid-cols-3 ${showIntro ? 'mt-12' : ''}`}>
            {posts.map((post, i) => (
              <Reveal key={post.id} delay={(i % 3) * 120} className="flex">
                <PostCard post={post} index={i} />
              </Reveal>
            ))}
          </div>
        )}
      </Container>
    </section>
  )
}
