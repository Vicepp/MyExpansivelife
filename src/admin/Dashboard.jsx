import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Btn, Card, SetupNotice, Spinner, StatCard, StatusPill } from './ui'
import { IconEye, IconHeart, IconMoney, IconPen, IconClock, IconPlus } from './icons'
import { useAuth } from '../context/AuthContext'
import { isFirebaseConfigured } from '../lib/firebase'
import { compact, formatDate, listPosts, summarise } from '../lib/posts'

const WEEK = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

function CalendarStrip() {
  const today = new Date()
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - today.getDay() + i)
    return d
  })

  return (
    <div className="flex items-center justify-between gap-1">
      {days.map((d, i) => {
        const isToday = d.toDateString() === today.toDateString()
        return (
          <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
            <span className="text-[11px] text-forest-deep/45">{WEEK[i]}</span>
            <span
              className={`grid size-8 place-items-center rounded-full text-[13px] font-semibold ${
                isToday ? 'bg-forest-deep text-white' : 'text-forest-deep/70'
              }`}
            >
              {d.getDate()}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listPosts()
      .then(setPosts)
      .catch(() => setPosts([]))
      .finally(() => setLoading(false))
  }, [])

  const stats = useMemo(() => summarise(posts), [posts])

  const top = useMemo(
    () => [...posts].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 4),
    [posts],
  )

  const upcoming = useMemo(
    () =>
      posts
        .filter((p) => p.status !== 'published')
        .slice(0, 3)
        .map((p, i) => ({ ...p, slot: ['12:30', '14:15', '17:30'][i] })),
    [posts],
  )

  const name = user?.displayName || user?.email?.split('@')[0] || 'there'
  // Rough revenue signal so the tile is meaningful before real billing exists.
  const earning = Math.round(stats.views * 0.012)

  if (loading) return <Spinner label="Loading dashboard…" />

  return (
    <div>
      {!isFirebaseConfigured && <SetupNotice what="Everything on this dashboard" />}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-5">
          <div className="relative overflow-hidden rounded-2xl bg-gold px-7 py-8">
            <div className="relative z-10 max-w-[440px]">
              <h1 className="font-display text-[30px] leading-tight text-forest-deep">
                Hello {name}!
              </h1>
              <p className="mt-2 text-[14.5px] leading-relaxed text-forest-deep/75">
                {stats.drafts > 0
                  ? `You have ${stats.drafts} draft${stats.drafts === 1 ? '' : 's'} waiting. Pick one up, or start something new.`
                  : 'Everything is published. A good day to start the next piece.'}
              </p>
              <Btn as="link" to="/admin/posts/new" className="mt-6">
                <IconPlus className="size-4" />
                Write new post
              </Btn>
            </div>
            <div className="pointer-events-none absolute -right-10 -top-16 size-56 rounded-full bg-white/25" />
            <div className="pointer-events-none absolute -bottom-20 right-24 size-44 rounded-full bg-forest-deep/10" />
          </div>

          <Card>
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="font-display text-[20px] text-forest-deep">Top articles</h2>
              <Link
                to="/admin/posts"
                className="text-[13px] font-semibold text-forest-deep/60 hover:text-forest-deep"
              >
                View all
              </Link>
            </div>

            {top.length === 0 ? (
              <p className="py-8 text-center text-[14px] text-forest-deep/50">
                No articles yet. Your best performers will show up here.
              </p>
            ) : (
              <ul className="space-y-1">
                {top.map((post, i) => (
                  <li key={post.id}>
                    <Link
                      to={`/admin/posts/${post.id}/edit`}
                      className="flex items-center gap-4 rounded-xl px-2 py-3 transition-colors hover:bg-cream"
                    >
                      <span className="w-6 shrink-0 text-[14px] font-semibold text-forest-deep/35">
                        {String(i + 1).padStart(2, '0')}
                      </span>

                      {post.coverImage ? (
                        <img
                          src={post.coverImage}
                          alt=""
                          className="size-12 shrink-0 rounded-xl object-cover"
                        />
                      ) : (
                        <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-gold-tint text-[13px] font-bold text-forest-deep">
                          {post.title.slice(0, 2).toUpperCase()}
                        </span>
                      )}

                      <span className="min-w-0 flex-1">
                        <span className="line-clamp-2 block text-[14px] font-semibold text-forest-deep">
                          {post.title}
                        </span>
                        <span className="mt-0.5 block text-[12px] text-forest-deep/45">
                          {formatDate(post.publishedAt ?? post.createdAt)}
                        </span>
                      </span>

                      <span className="hidden shrink-0 items-center gap-5 text-[13px] text-forest-deep/65 sm:flex">
                        <span className="inline-flex items-center gap-1.5">
                          <IconEye className="size-4" />
                          {compact(post.views)}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <IconHeart className="size-4" />
                          {compact(post.likes)}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <div className="space-y-4">
          <StatCard
            tone="sage"
            icon={<IconMoney />}
            value={`$${earning.toLocaleString()}`}
            label="Total earning"
          />
          <StatCard
            tone="gold"
            icon={<IconPen />}
            value={stats.published}
            label="Published articles"
          />
          <StatCard
            tone="brown"
            icon={<IconClock />}
            value={String(stats.drafts).padStart(2, '0')}
            label="Pending articles"
          />

          <Card className="!p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[15px] font-bold text-forest-deep">Today’s articles</h2>
              <span className="text-[12.5px] text-forest-deep/50">
                {new Intl.DateTimeFormat('en-GB', { month: 'long' }).format(new Date())}
              </span>
            </div>

            <CalendarStrip />

            <ul className="mt-5 space-y-3 border-t border-forest-deep/10 pt-4">
              {upcoming.length === 0 ? (
                <li className="py-3 text-center text-[13px] text-forest-deep/50">
                  Nothing scheduled. Drafts you create will queue up here.
                </li>
              ) : (
                upcoming.map((post) => (
                  <li key={post.id} className="flex gap-3">
                    <span className="shrink-0 text-[12.5px] font-semibold text-forest-deep/60">
                      {post.slot}
                    </span>
                    <span className="min-w-0">
                      <Link
                        to={`/admin/posts/${post.id}/edit`}
                        className="line-clamp-2 block text-[13px] font-medium text-forest-deep hover:text-forest-deep/70"
                      >
                        {post.title}
                      </Link>
                      <span className="mt-1 inline-block">
                        <StatusPill status={post.status} />
                      </span>
                    </span>
                  </li>
                ))
              )}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}
