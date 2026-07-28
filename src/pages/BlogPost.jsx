import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Container, Button, TextLink } from '../components/primitives'
import Reveal from '../components/Reveal'
import Testimonials from '../components/Testimonials'
import { Newsletter } from '../components/Footer'
import {
  getPostBySlug,
  listPosts,
  formatDate,
  recordView,
  toggleLike,
  compact,
} from '../lib/posts'
import articleFallback from '../assets/design/article-img.jpg'

export default function BlogPost() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [more, setMore] = useState([])
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const counted = useRef(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setLiked(false)

    getPostBySlug(slug)
      .then((found) => {
        if (cancelled) return
        setPost(found)
        // Count a view once per article per page load.
        if (found && counted.current !== found.id) {
          counted.current = found.id
          recordView(found.id)
        }
      })
      .catch(() => !cancelled && setPost(null))
      .finally(() => !cancelled && setLoading(false))

    listPosts({ status: 'published', max: 4 })
      .then((rows) => !cancelled && setMore(rows.filter((p) => p.slug !== slug).slice(0, 3)))
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [slug])

  const like = () => {
    if (!post || liked) return
    setLiked(true)
    setPost((p) => ({ ...p, likes: (p.likes || 0) + 1 }))
    toggleLike(post.id, 1)
  }

  if (loading) {
    return (
      <section className="bg-cream py-24">
        <Container>
          <div className="mx-auto max-w-[760px] space-y-4">
            <div className="h-10 w-2/3 animate-pulse rounded-lg bg-ink/10" />
            <div className="h-64 animate-pulse rounded-2xl bg-ink/10" />
            <div className="h-4 animate-pulse rounded bg-ink/10" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-ink/10" />
          </div>
        </Container>
      </section>
    )
  }

  if (!post) {
    return (
      <section className="bg-cream py-28 text-center lg:py-36">
        <Container>
          <h1 className="font-display text-[38px] text-forest lg:text-[48px]">
            Article not found
          </h1>
          <p className="mx-auto mt-4 max-w-[420px] text-[15px] leading-relaxed text-ink/75">
            This piece may have been moved or unpublished.
          </p>
          <Button variant="solid" to="/blogs" className="mt-8">
            Back to all articles
          </Button>
        </Container>
      </section>
    )
  }

  return (
    <>
      <article className="bg-cream pb-16 pt-10 lg:pb-20">
        <Container>
          <div className="mx-auto max-w-[760px]">
            <Reveal>
              <Link
                to="/blogs"
                className="text-[13px] font-semibold text-gold-text hover:underline"
              >
                ← All articles
              </Link>

              <p className="mt-6 text-[12px] font-semibold uppercase tracking-[0.2em] text-gold">
                {post.category}
              </p>

              <h1 className="mt-3 font-display text-[34px] leading-display text-forest lg:text-[48px]">
                {post.title}
              </h1>

              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13.5px] text-ink/65">
                <span className="font-semibold text-forest-deep">
                  {post.author?.name ?? 'MXL Team'}
                </span>
                <span>{formatDate(post.publishedAt ?? post.createdAt)}</span>
                <span>{post.readMinutes ?? 4} min read</span>
                <span>{compact(post.views ?? 0)} views</span>
              </div>
            </Reveal>

            {post.coverImage && (
              <Reveal delay={120} className="media-reveal mt-10 overflow-hidden rounded-2xl">
                <img src={post.coverImage} alt="" className="w-full object-cover" />
              </Reveal>
            )}

            {/* Content is authored in the admin editor and stored as HTML. */}
            <Reveal delay={80}>
              <div
                className="prose-mxl mt-10"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </Reveal>

            {post.tags?.length > 0 && (
              <ul className="mt-10 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full bg-cream-card px-3.5 py-1.5 text-[12.5px] text-ink/70"
                  >
                    #{tag}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-ink/10 pt-8">
              <button
                type="button"
                onClick={like}
                disabled={liked}
                className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[14px] font-semibold transition-colors ${
                  liked
                    ? 'bg-gold text-white'
                    : 'border border-brown-deep/30 text-brown-deep hover:bg-brown-deep hover:text-white'
                }`}
              >
                <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
                  <path d="M12 20s-7-4.4-7-9.3A4.2 4.2 0 0 1 12 8a4.2 4.2 0 0 1 7 2.7C19 15.6 12 20 12 20Z" />
                </svg>
                {liked ? 'Thanks!' : 'Like this'} · {compact(post.likes ?? 0)}
              </button>

              <TextLink to="/community" className="ml-auto">
                Join the Circle
              </TextLink>
            </div>
          </div>
        </Container>
      </article>

      {more.length > 0 && (
        <section className="bg-white py-16 lg:py-20">
          <Container>
            <h2 className="font-display text-[26px] text-gold-text lg:text-[32px]">
              Keep reading
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {more.map((item, i) => (
                <Reveal key={item.id} delay={i * 120} className="flex">
                  <article className="card-lift img-zoom flex grow flex-col overflow-hidden rounded-2xl border border-ink/10">
                    <Link to={`/blogs/${item.slug}`} className="block overflow-hidden">
                      <img
                        src={item.coverImage || articleFallback}
                        alt=""
                        className="aspect-[674/467] w-full object-cover"
                      />
                    </Link>
                    <div className="flex grow flex-col p-6">
                      <p className="text-[11.5px] font-medium text-gold-text">
                        {formatDate(item.publishedAt ?? item.createdAt)}
                      </p>
                      <h3 className="mt-2 text-[17px] font-bold leading-snug text-forest-deep">
                        <Link to={`/blogs/${item.slug}`} className="hover:text-gold-text">
                          {item.title}
                        </Link>
                      </h3>
                      <TextLink to={`/blogs/${item.slug}`} className="mt-5">
                        Read Story
                      </TextLink>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      <Testimonials />
      <Newsletter tone="gold" />
    </>
  )
}
