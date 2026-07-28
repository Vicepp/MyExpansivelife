import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Container, TextLink } from './primitives'
import Reveal from './Reveal'
import { listLive, formatDate } from '../lib/posts'
import articleFallback from '../assets/design/article-img.jpg'

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
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <h2 className="font-display text-[30px] leading-[1.25] text-gold-text lg:text-[38px]">
                Ideas For The Life You&rsquo;re Building Beyond Your Title.
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="max-w-[480px] text-[15px] leading-relaxed text-ink/80 lg:mt-2">
                Straightforward, practical writing on personal branding, LinkedIn
                strategy, investing and building a career that expands instead of
                confines. New articles every week.
              </p>
            </Reveal>
          </div>
        )}

        {loading ? (
          <div className={`grid gap-6 md:grid-cols-3 ${showIntro ? 'mt-14' : ''}`}>
            {Array.from({ length: Math.min(count, 3) }).map((_, i) => (
              <div
                key={i}
                className="h-[380px] animate-pulse rounded-2xl border border-ink/10 bg-cream-card"
              />
            ))}
          </div>
        ) : error ? (
          <div className="mt-14 rounded-2xl border border-amber-300 bg-amber-50 px-6 py-8 text-center">
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
          <p className="mt-14 rounded-2xl border border-dashed border-ink/15 px-6 py-14 text-center text-[15px] text-ink/60">
            New articles are on the way. Check back shortly.
          </p>
        ) : (
          <div className={`grid gap-6 md:grid-cols-3 ${showIntro ? 'mt-14' : ''}`}>
            {posts.map((post, i) => (
              <Reveal key={post.id} delay={(i % 3) * 120} className="flex">
                <article className="card-lift img-zoom flex grow flex-col overflow-hidden rounded-2xl border border-ink/10">
                  <Link to={`/blogs/${post.slug}`} className="block overflow-hidden">
                    <img
                      src={post.coverImage || articleFallback}
                      alt=""
                      className="aspect-[674/467] w-full object-cover"
                    />
                  </Link>
                  <div className="flex grow flex-col p-6">
                    <p className="text-[11.5px] font-medium text-gold-text">
                      {formatDate(post.publishedAt ?? post.createdAt)}
                      {post.author?.name ? `, By ${post.author.name}` : ''}
                    </p>
                    <h3 className="mt-2 text-[18px] font-bold leading-snug text-forest-deep">
                      <Link to={`/blogs/${post.slug}`} className="hover:text-gold-text">
                        {post.title}
                      </Link>
                    </h3>
                    <p className="mt-3 grow text-[13.5px] leading-relaxed text-ink/75">
                      {post.excerpt}
                    </p>
                    <TextLink to={`/blogs/${post.slug}`} className="mt-6">
                      Read Story
                    </TextLink>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <TextLink to="/blogs">See All</TextLink>
        </div>
      </Container>
    </section>
  )
}
