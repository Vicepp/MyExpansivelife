import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Btn,
  Card,
  EmptyState,
  PageHead,
  SetupNotice,
  Spinner,
  StatusPill,
  Input,
  Select,
} from './ui'
import { IconPlus, IconEye, IconHeart, IconTrash } from './icons'
import { isFirebaseConfigured } from '../lib/firebase'
import {
  CATEGORIES,
  STATUSES,
  compact,
  deletePost,
  formatDate,
  listPosts,
} from '../lib/posts'

export default function Posts() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [category, setCategory] = useState('')

  useEffect(() => {
    listPosts()
      .then(setPosts)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase()
    return posts.filter(
      (p) =>
        (!status || p.status === status) &&
        (!category || p.category === category) &&
        (!term ||
          p.title?.toLowerCase().includes(term) ||
          p.excerpt?.toLowerCase().includes(term)),
    )
  }, [posts, search, status, category])

  const remove = async (post) => {
    if (!window.confirm(`Delete “${post.title}”? This cannot be undone.`)) return
    try {
      await deletePost(post.id)
      setPosts((list) => list.filter((p) => p.id !== post.id))
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div>
      <PageHead
        title="My Articles"
        subtitle={`${posts.length} article${posts.length === 1 ? '' : 's'} in total`}
        action={
          <Btn as="link" to="/admin/posts/new" variant="gold">
            <IconPlus className="size-4" />
            Write new post
          </Btn>
        }
      />

      {!isFirebaseConfigured && <SetupNotice what="This article list" />}

      {error && (
        <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-[13.5px] text-red-700">
          {error}
        </p>
      )}

      <Card className="mb-5">
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_170px_170px]">
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
          <table className="w-full min-w-[760px] text-left">
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
              {rows.map((post) => (
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
                    <p className="mt-0.5 text-[12px] text-forest-deep/45">/{post.slug}</p>
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
                      <Link
                        to={`/admin/posts/${post.id}/edit`}
                        className="rounded-lg border border-forest-deep/15 px-3 py-1.5 text-[12.5px] font-semibold text-forest-deep hover:bg-forest-deep/5"
                      >
                        Edit
                      </Link>
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
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  )
}
