import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import RichTextEditor from './RichTextEditor'
import {
  Btn,
  Card,
  Field,
  Input,
  Select,
  Spinner,
  Textarea,
  StatusPill,
} from './ui'
import { IconTrash, IconExternal } from './icons'
import { useAuth } from '../context/AuthContext'
import {
  CATEGORIES,
  STATUSES,
  canUploadImages,
  createPost,
  deletePost,
  getPost,
  slugify,
  updatePost,
  uploadImage,
  excerptFrom,
  readingMinutes,
} from '../lib/posts'

const BLANK = {
  title: '',
  slug: '',
  category: CATEGORIES[0],
  status: 'draft',
  excerpt: '',
  coverImage: '',
  tags: '',
  content: '',
}

export default function PostEditor() {
  const { id } = useParams()
  const isNew = !id
  const navigate = useNavigate()
  const { user } = useAuth()

  const [form, setForm] = useState(BLANK)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [slugTouched, setSlugTouched] = useState(false)
  const [coverProgress, setCoverProgress] = useState(0)
  const coverInput = useRef(null)

  useEffect(() => {
    if (isNew) return
    let cancelled = false
    getPost(id)
      .then((post) => {
        if (cancelled) return
        if (!post) {
          setError('That post no longer exists.')
        } else {
          setForm({
            ...BLANK,
            ...post,
            tags: Array.isArray(post.tags) ? post.tags.join(', ') : '',
          })
          setSlugTouched(true)
        }
      })
      .catch((e) => !cancelled && setError(e.message))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [id, isNew])

  const set = (key) => (e) => {
    const value = e?.target ? e.target.value : e
    setForm((f) => ({
      ...f,
      [key]: value,
      // Keep the slug tracking the title until it is edited by hand.
      ...(key === 'title' && !slugTouched ? { slug: slugify(value) } : {}),
    }))
  }

  const onCover = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!canUploadImages) {
      setError(
        'No image host configured yet. Add Cloudinary to .env (see docs/CLOUDINARY.md), or paste an image URL instead.',
      )
      return
    }
    try {
      setError('')
      setCoverProgress(1)
      const url = await uploadImage(file, setCoverProgress)
      setForm((f) => ({ ...f, coverImage: url }))
    } catch (e) {
      setError(e.message)
    } finally {
      setCoverProgress(0)
    }
  }

  const save = async (status) => {
    setError('')
    setMessage('')

    if (!form.title.trim()) {
      setError('Give the article a title before saving.')
      return
    }

    const payload = {
      title: form.title.trim(),
      slug: (form.slug || slugify(form.title)).trim(),
      category: form.category,
      status,
      excerpt: form.excerpt.trim() || excerptFrom(form.content),
      coverImage: form.coverImage.trim(),
      content: form.content,
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      author: {
        name: user?.displayName || user?.email || 'MXL Team',
        uid: user?.uid ?? 'unknown',
      },
      publishedAt: form.publishedAt ?? null,
    }

    setSaving(true)
    try {
      if (isNew) {
        const newId = await createPost(payload)
        navigate(`/admin/posts/${newId}/edit`, { replace: true })
        setMessage(status === 'published' ? 'Published.' : 'Draft saved.')
      } else {
        await updatePost(id, payload)
        setForm((f) => ({ ...f, status }))
        setMessage(status === 'published' ? 'Published.' : 'Saved.')
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  const remove = async () => {
    if (!window.confirm('Delete this post permanently? This cannot be undone.')) return
    try {
      await deletePost(id)
      navigate('/admin/posts', { replace: true })
    } catch (e) {
      setError(e.message)
    }
  }

  if (loading) return <Spinner label="Loading post…" />

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="mr-auto">
          <Link to="/admin/posts" className="text-[13px] text-navy/55 hover:text-navy">
            ← All articles
          </Link>
          <h1 className="mt-1 flex items-center gap-3 text-[24px] font-bold text-navy">
            {isNew ? 'New article' : 'Edit article'}
            {!isNew && <StatusPill status={form.status} />}
          </h1>
        </div>

        {!isNew && form.slug && (
          <Btn as="link" to={`/blogs/${form.slug}`} variant="ghost">
            <IconExternal className="size-4" />
            View
          </Btn>
        )}
        <Btn variant="ghost" disabled={saving} onClick={() => save('draft')}>
          Save draft
        </Btn>
        <Btn variant="sun" disabled={saving} onClick={() => save('published')}>
          {saving ? 'Saving…' : 'Publish'}
        </Btn>
      </div>

      {error && (
        <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-[13.5px] text-red-700">
          {error}
        </p>
      )}
      {message && (
        <p className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-[13.5px] text-emerald-700">
          {message}
        </p>
      )}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          <Card>
            <Field label="Title">
              <Input
                value={form.title}
                onChange={set('title')}
                placeholder="What makes an authentic employee profile?"
              />
            </Field>
          </Card>

          <RichTextEditor value={form.content} onChange={set('content')} />
        </div>

        <div className="space-y-5">
          <Card>
            <h2 className="mb-4 text-[15px] font-bold text-navy">Publishing</h2>
            <div className="space-y-4">
              <Field label="Status">
                <Select value={form.status} onChange={set('status')}>
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s[0].toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label="Category">
                <Select value={form.category} onChange={set('category')}>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field
                label="URL slug"
                hint={`/blogs/${form.slug || 'your-post-title'}`}
              >
                <Input
                  value={form.slug}
                  onChange={(e) => {
                    setSlugTouched(true)
                    setForm((f) => ({ ...f, slug: slugify(e.target.value) }))
                  }}
                />
              </Field>

              <Field label="Tags" hint="Comma separated">
                <Input
                  value={form.tags}
                  onChange={set('tags')}
                  placeholder="linkedin, branding"
                />
              </Field>
            </div>
          </Card>

          <Card>
            <h2 className="mb-4 text-[15px] font-bold text-navy">Cover image</h2>
            {form.coverImage ? (
              <img
                src={form.coverImage}
                alt=""
                className="mb-3 aspect-[16/10] w-full rounded-xl object-cover"
              />
            ) : (
              <div className="mb-3 grid aspect-[16/10] w-full place-items-center rounded-xl border border-dashed border-navy/20 text-[13px] text-navy/45">
                No cover yet
              </div>
            )}
            <Input
              value={form.coverImage}
              onChange={set('coverImage')}
              placeholder="https://…"
            />
            <div className="mt-3 flex gap-2">
              <Btn
                variant="ghost"
                className="flex-1"
                disabled={coverProgress > 0}
                onClick={() => coverInput.current?.click()}
              >
                {coverProgress > 0 ? `Uploading ${coverProgress}%` : 'Upload'}
              </Btn>
              {form.coverImage && (
                <Btn
                  variant="ghost"
                  onClick={() => setForm((f) => ({ ...f, coverImage: '' }))}
                >
                  Clear
                </Btn>
              )}
            </div>
            <input
              ref={coverInput}
              type="file"
              accept="image/*"
              onChange={onCover}
              className="hidden"
            />
          </Card>

          <Card>
            <Field
              label="Excerpt"
              hint="Shown on the blog index. Left blank, it is taken from the opening lines."
            >
              <Textarea rows={4} value={form.excerpt} onChange={set('excerpt')} />
            </Field>
          </Card>

          <Card>
            <h2 className="mb-3 text-[15px] font-bold text-navy">Details</h2>
            <dl className="space-y-2 text-[13px]">
              <div className="flex justify-between">
                <dt className="text-navy/55">Reading time</dt>
                <dd className="font-semibold text-navy">
                  {readingMinutes(form.content)} min
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-navy/55">Views</dt>
                <dd className="font-semibold text-navy">{form.views ?? 0}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-navy/55">Likes</dt>
                <dd className="font-semibold text-navy">{form.likes ?? 0}</dd>
              </div>
            </dl>

            {!isNew && (
              <Btn variant="danger" className="mt-5 w-full" onClick={remove}>
                <IconTrash className="size-4" />
                Delete post
              </Btn>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
