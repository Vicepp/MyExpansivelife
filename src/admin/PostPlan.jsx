import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Btn, Card, PageHead, SetupNotice, Spinner, StatusPill } from './ui'
import { IconPlus } from './icons'
import { isFirebaseConfigured } from '../lib/firebase'
import { formatDate, listPosts } from '../lib/posts'

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'gold']

/** Monday-first grid covering the whole month. */
function monthGrid(cursor) {
  const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1)
  const start = new Date(first)
  start.setDate(first.getDate() - ((first.getDay() + 6) % 7))

  return Array.from({ length: 42 }, (_, i) => {
    const date = new Date(start)
    date.setDate(start.getDate() + i)
    return date
  })
}

export default function PostPlan() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [cursor, setCursor] = useState(() => new Date())

  useEffect(() => {
    listPosts()
      .then(setPosts)
      .catch(() => setPosts([]))
      .finally(() => setLoading(false))
  }, [])

  const days = useMemo(() => monthGrid(cursor), [cursor])

  const byDay = useMemo(() => {
    const map = new Map()
    for (const post of posts) {
      const date = post.publishedAt ?? post.createdAt
      if (!date) continue
      const key = date.toDateString()
      map.set(key, [...(map.get(key) ?? []), post])
    }
    return map
  }, [posts])

  const monthLabel = new Intl.DateTimeFormat('en-GB', {
    month: 'long',
    year: 'numeric',
  }).format(cursor)

  const shift = (delta) =>
    setCursor((c) => new Date(c.getFullYear(), c.getMonth() + delta, 1))

  const queue = useMemo(
    () =>
      posts
        .filter((p) => p.status !== 'published')
        .sort((a, b) => (a.createdAt ?? 0) - (b.createdAt ?? 0)),
    [posts],
  )

  if (loading) return <Spinner label="Building your calendar…" />

  return (
    <div>
      <PageHead
        title="Post Plan"
        subtitle="Your editorial calendar at a glance"
        action={
          <Btn as="link" to="/admin/posts/new" variant="gold">
            <IconPlus className="size-4" />
            Plan a post
          </Btn>
        }
      />

      {!isFirebaseConfigured && <SetupNotice what="This calendar" />}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <Card>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-[17px] font-bold text-forest-deep">{monthLabel}</h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => shift(-1)}
                aria-label="Previous month"
                className="grid size-9 place-items-center rounded-lg border border-forest-deep/15 text-forest-deep hover:bg-forest-deep/5"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => setCursor(new Date())}
                className="rounded-lg border border-forest-deep/15 px-3 py-1.5 text-[12.5px] font-semibold text-forest-deep hover:bg-forest-deep/5"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => shift(1)}
                aria-label="Next month"
                className="grid size-9 place-items-center rounded-lg border border-forest-deep/15 text-forest-deep hover:bg-forest-deep/5"
              >
                ›
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {WEEKDAYS.map((d) => (
              <div
                key={d}
                className="pb-2 text-center text-[11.5px] font-semibold uppercase tracking-wide text-forest-deep/45"
              >
                {d}
              </div>
            ))}

            {days.map((date) => {
              const inMonth = date.getMonth() === cursor.getMonth()
              const isToday = date.toDateString() === new Date().toDateString()
              const items = byDay.get(date.toDateString()) ?? []

              return (
                <div
                  key={date.toISOString()}
                  className={`min-h-[92px] rounded-xl border p-2 ${
                    isToday
                      ? 'border-forest-deep bg-forest-deep/5'
                      : 'border-forest-deep/10 ' + (inMonth ? 'bg-white' : 'bg-cream')
                  }`}
                >
                  <span
                    className={`text-[12px] font-semibold ${
                      inMonth ? 'text-forest-deep/70' : 'text-forest-deep/25'
                    }`}
                  >
                    {date.getDate()}
                  </span>

                  <div className="mt-1 space-y-1">
                    {items.slice(0, 2).map((post) => (
                      <Link
                        key={post.id}
                        to={`/admin/posts/${post.id}/edit`}
                        title={post.title}
                        className={`block truncate rounded-md px-1.5 py-1 text-[10.5px] font-medium ${
                          post.status === 'published'
                            ? 'bg-emerald-100 text-emerald-800'
                            : post.status === 'scheduled'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-gold-tint text-forest-deep'
                        }`}
                      >
                        {post.title}
                      </Link>
                    ))}
                    {items.length > 2 && (
                      <span className="block px-1.5 text-[10.5px] text-forest-deep/45">
                        +{items.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 text-[16px] font-bold text-forest-deep">In the queue</h2>
          {queue.length === 0 ? (
            <p className="py-8 text-center text-[13.5px] text-forest-deep/50">
              Nothing pending. Every article is published.
            </p>
          ) : (
            <ul className="space-y-3">
              {queue.map((post) => (
                <li key={post.id} className="rounded-xl border border-forest-deep/10 p-3.5">
                  <Link
                    to={`/admin/posts/${post.id}/edit`}
                    className="line-clamp-2 text-[13.5px] font-semibold text-forest-deep hover:text-forest-deep/70"
                  >
                    {post.title}
                  </Link>
                  <div className="mt-2 flex items-center justify-between">
                    <StatusPill status={post.status} />
                    <span className="text-[12px] text-forest-deep/45">
                      {formatDate(post.createdAt)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  )
}
