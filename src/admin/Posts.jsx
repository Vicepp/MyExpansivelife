import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Btn,
  Card,
  EmptyState,
  PageHead,
  SetupNotice,
  Spinner,
  StatCard,
  StatusPill,
  Input,
  Select,
} from './ui'
import { IconPlus, IconEye, IconHeart, IconTrash, IconDoc, IconPen, IconExternal } from './icons'
import { isFirebaseConfigured } from '../lib/firebase'
import {
  CATEGORIES,
  STATUSES,
  compact,
  deletePost,
  formatDate,
  listPosts,
  setPostStatus,
} from '../lib/posts'
import { requestRebuild } from '../lib/rebuild'

const SORTS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'views', label: 'Most viewed' },
  { value: 'likes', label: 'Most liked' },
  { value: 'title', label: 'Title A–Z' },
]

function dateOf(p) {
  return (p.publishedAt ?? p.createdAt)?.getTime?.() ?? 0
}

const SORTERS = {
  newest: (a, b) => dateOf(b) - dateOf(a),
  oldest: (a, b) => dateOf(a) - dateOf(b),
  views: (a, b) => (b.views || 0) - (a.views || 0),
  likes: (a, b) => (b.likes || 0) - (a.likes || 0),
  title: (a, b) => String(a.title).localeCompare(String(b.title)),
}

/** The blog: every article with its numbers, and the actions on each. */
export default function Posts() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busyId, setBusyId] = useState('')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState('newest')

  useEffect(() => {
    listPosts()
      .then(setPosts)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const totals = useMemo(
    () => ({
      all: posts.length,
      published: posts.filter((p) => p.status === 'published').length,
      unpublished: posts.filter((p) => p.status !== 'published').length,
      views: posts.reduce((s, p) => s + (p.views || 0), 0),
      likes: posts.reduce((s, p) => s + (p.likes || 0), 0),
    }),
    [posts],
  )

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase()
    return posts
      .filter(
        (p) =>
          (!status || p.status === status) &&
          (!category || p.category === category) &&
          (!term ||
            p.title?.toLowerCase().includes(term) ||
            p.excerpt?.toLowerCase().includes(term)),
      )
      .sort(SORTERS[sort])
  }, [posts, search, status, category, sort])

  const remove = async (post) => {
    if (!window.confirm(`Delete “${post.title}”? This cannot be undone.`)) return
    setError('')
    try {
      await deletePost(post.id)
      setPosts((list) => list.filter((p) => p.id !== post.id))
      // A live article also has a static page, sitemap entry and search pings.
      if (post.status === 'published') requestRebuild(`post deleted: ${post.slug}`)
    } catch (e) {
      setError(e.message)
    }
  }

  const toggle = async (post) => {
    const next = post.status === 'published' ? 'draft' : 'published'
    if (
      next === 'draft' &&
      !window.confirm(`Unpublish “${post.title}”? It will disappear from the public blog.`)
    )
      return
    setError('')
    setNotice('')
    setBusyId(post.id)
    try {
      await setPostStatus(post, next)
      setPosts((list) =>
        list.map((p) =>
          p.id === post.id
            ? { ...p, status: next, publishedAt: p.publishedAt ?? (next === 'published' ? new Date() : null) }
            : p,
        ),
      )
      requestRebuild(`post ${next === 'published' ? 'published' : 'unpublished'}: ${post.slug}`)
      setNotice(
        next === 'published'
          ? `“${post.title}” is live. Search engines are notified in the next few minutes.`
          : `“${post.title}” is back in drafts.`,
      )
    } catch (e) {
      setError(e.message)
    } finally {
      setBusyId('')
    }
  }

  return (
    <div>
      <PageHead
        title="Blog"
        subtitle="Every article, how it's doing, and what to do with it"
        action={
          <Btn as="link" to="/admin/posts/new" variant="gold">
            <IconPlus className="size-4" />
            Write new post
          </Btn>
        }
      />

      {!isFirebaseConfigured && <SetupNotice what="This article list" />}

      {!loading && posts.length > 0 && (
        <div className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            tone="sage"
            icon={<IconDoc className="size-5" />}
            value={totals.all}
            label={`${totals.published} published · ${totals.unpublished} draft or scheduled`}
          />
          <StatCard
            tone="gold"
            icon={<IconEye className="size-5" />}
            value={compact(totals.views)}
            label="Total views"
          />
          <StatCard
            tone="brown"
            icon={<IconHeart className="size-5" />}
            value={compact(totals.likes)}
            label="Total likes"
          />
          <StatCard
            tone="sand"
            icon={<IconPen className="size-5" />}
            value={totals.published ? compact(Math.round(totals.views / totals.published)) : 0}
            label="Average views per article"
          />
        </div>
      )}

      {error && (
        <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-[13.5px] text-red-700">{error}</p>
      )}
      {notice && (
        <p className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-[13.5px] text-emerald-700">
          {notice}
        </p>
      )}

      <Card className="mb-5">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_160px_170px_160px]">
          <Input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or excerpt…"
          />
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s[0].toUpperCase() + s.slice(1)}
              </option>
            ))}
          </Select>
          <Select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
          <Select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort">
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </Select>
        </div>
      </Card>

      {loading ? (
        <Spinner label="Loading articles…" />
      ) : rows.length === 0 ? (
        <EmptyState
          title={posts.length ? 'Nothing matches those filters' : 'No articles yet'}
          body={
            posts.length
              ? 'Try a different search term or clear the filters.'
              : 'Write your first article and it will appear here and on the public blog.'
          }
          action={
            <Btn as="link" to="/admin/posts/new" variant="gold">
              Write new post
            </Btn>
          }
        />
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr className="border-b border-forest-deep/10 text-[12px] uppercase tracking-wide text-forest-deep/50">
                <th className="px-5 py-4 font-semibold">Article</th>
                <th className="px-4 py-4 font-semibold">Status</th>
                <th className="px-4 py-4 font-semibold">Category</th>
                <th className="px-4 py-4 font-semibold">Date</th>
                <th className="px-4 py-4 font-semibold">Views</th>
                <th className="px-4 py-4 font-semibold">Likes</th>
                <th className="px-5 py-4" />
              </tr>
            </thead>
            <tbody>
              {rows.map((post) => {
                const live = post.status === 'published'
                return (
                  <tr
                    key={post.id}
                    className="border-b border-forest-deep/5 transition-colors last:border-0 hover:bg-cream"
                  >
                    <td className="max-w-[340px] px-5 py-4">
                      <Link
                        to={`/admin/posts/${post.id}/edit`}
                        className="line-clamp-2 text-[14px] font-semibold text-forest-deep hover:text-forest-deep/70"
                      >
                        {post.title}
                      </Link>
                      <p className="mt-0.5 text-[12px] text-forest-deep/45">/blogs/{post.slug}</p>
                    </td>
                    <td className="px-4 py-4">
                      <StatusPill status={post.status} />
                    </td>
                    <td className="px-4 py-4 text-[13px] text-forest-deep/70">{post.category}</td>
                    <td className="whitespace-nowrap px-4 py-4 text-[13px] text-forest-deep/70">
                      {formatDate(post.publishedAt ?? post.createdAt)}
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-1.5 text-[13px] text-forest-deep/70">
                        <IconEye className="size-4" />
                        {compact(post.views)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-1.5 text-[13px] text-forest-deep/70">
                        <IconHeart className="size-4" />
                        {compact(post.likes)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        {live && (
                          <a
                            href={`/blogs/${post.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Open the live article"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-forest-deep/15 px-3 py-1.5 text-[12.5px] font-semibold text-forest-deep hover:bg-forest-deep/5"
                          >
                            <IconExternal className="size-3.5" />
                            View
                          </a>
                        )}
                        <Link
                          to={`/admin/posts/${post.id}/edit`}
                          className="rounded-lg border border-forest-deep/15 px-3 py-1.5 text-[12.5px] font-semibold text-forest-deep hover:bg-forest-deep/5"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          disabled={busyId === post.id}
                          onClick={() => toggle(post)}
                          className={`rounded-lg px-3 py-1.5 text-[12.5px] font-semibold disabled:opacity-50 ${
                            live
                              ? 'border border-forest-deep/15 text-forest-deep/70 hover:bg-forest-deep/5'
                              : 'bg-forest-deep text-white hover:bg-forest-soft'
                          }`}
                        >
                          {busyId === post.id ? '…' : live ? 'Unpublish' : 'Publish'}
                        </button>
                        <button
                          type="button"
                          onClick={() => remove(post)}
                          aria-label={`Delete ${post.title}`}
                          className="grid size-8 place-items-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <IconTrash className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  )
}
