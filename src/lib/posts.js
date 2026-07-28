import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit as fbLimit,
  increment,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage, isFirebaseConfigured } from './firebase'
import { isCloudinaryConfigured, uploadToCloudinary } from './cloudinary'

export const POSTS = 'posts'

export const CATEGORIES = [
  'Personal Branding',
  'LinkedIn Strategy',
  'Investing',
  'Career',
  'Mindset',
  'Community',
]

export const STATUSES = ['draft', 'scheduled', 'published']

export function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

/** Rough reading time from rendered HTML. */
export function readingMinutes(html = '') {
  const words = html
    .replace(/<[^>]*>/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

export function excerptFrom(html = '', length = 160) {
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return text.length > length ? `${text.slice(0, length).trim()}…` : text
}

/** Firestore Timestamp | Date | ISO string -> Date */
export function toDate(value) {
  if (!value) return null
  if (value instanceof Timestamp) return value.toDate()
  if (value instanceof Date) return value
  if (typeof value?.toDate === 'function') return value.toDate()
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

export function formatDate(value) {
  const date = toDate(value)
  if (!date) return '—'
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

/* ------------------------------------------------------------------ */
/* Sample content                                                      */
/*                                                                     */
/* Used only while Firebase is unconfigured, so the site and the admin */
/* panel are both explorable before the database exists.               */
/* ------------------------------------------------------------------ */

const sample = (id, title, category, days, views, likes, status = 'published') => ({
  id,
  title,
  slug: slugify(title),
  category,
  status,
  excerpt:
    'A practical look at building visibility, income and identity beyond a single job title.',
  content: `<h2>Why this matters</h2><p>You built a career worth being proud of. The next step is building everything else, on your own terms.</p><p>This is sample content shown because Firebase has not been connected yet. Once you add your credentials, real posts from Firestore appear here instead.</p><h3>Where to start</h3><ul><li>Get clear on who you serve</li><li>Make your profile do the explaining</li><li>Turn conversations into opportunities</li></ul>`,
  coverImage: '',
  author: { name: 'Dr. Nkem Ezeamama', uid: 'sample' },
  tags: ['sample'],
  views,
  likes,
  readMinutes: 4,
  createdAt: new Date(Date.now() - days * 86400000),
  updatedAt: new Date(Date.now() - days * 86400000),
  publishedAt: status === 'published' ? new Date(Date.now() - days * 86400000) : null,
})

export const SAMPLE_POSTS = [
  sample('s1', 'What Makes An Authentic Employee Profile?', 'Personal Branding', 2, 6500, 3400),
  sample('s2', 'How Airbnb Drives Users Actions With Their Landing Page', 'LinkedIn Strategy', 5, 5300, 3100),
  sample('s3', 'It’s Time For Tech To Ask Should We Instead Of Could We', 'Career', 9, 3100, 2200),
  sample('s4', 'Turning Income Into Ownership: A Beginner’s Guide', 'Investing', 14, 2800, 1700),
  sample('s5', 'The Hidden Cost Of Decision Fatigue', 'Mindset', 20, 2100, 900),
  sample('s6', 'Building A Room Where Your Ideas Get Tested', 'Community', 26, 1500, 640, 'draft'),
]

/* ------------------------------------------------------------------ */
/* Reads                                                               */
/* ------------------------------------------------------------------ */

function fromDoc(snapshot) {
  const data = snapshot.data()
  return {
    id: snapshot.id,
    ...data,
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
    publishedAt: toDate(data.publishedAt),
    publishAt: toDate(data.publishAt),
  }
}

/** The moment a post is meant to go live. */
export function goLiveAt(post) {
  return post.publishAt ?? post.publishedAt ?? post.createdAt ?? null
}

/**
 * Is this post visible to the public right now?
 *
 * `scheduled` becomes live on its own once publishAt passes, so nothing has to
 * run on a server to flip it.
 */
export function isLive(post, now = Date.now()) {
  if (post.status === 'published') return true
  if (post.status !== 'scheduled') return false
  const at = post.publishAt
  return at ? at.getTime() <= now : false
}

function sortNewestFirst(rows) {
  return rows.sort((a, b) => (goLiveAt(b)?.getTime() ?? 0) - (goLiveAt(a)?.getTime() ?? 0))
}

/**
 * All posts, newest first.
 *
 * Deliberately never combines `where` with `orderBy` — that needs a composite
 * index, and a missing one throws at runtime. Single-field indexes are created
 * by Firestore automatically, so filtering is done here and sorting in JS.
 */
export async function listPosts({ status, max } = {}) {
  if (!isFirebaseConfigured) {
    let rows = [...SAMPLE_POSTS]
    if (status) rows = rows.filter((p) => p.status === status)
    return max ? rows.slice(0, max) : rows
  }

  const snap = status
    ? await getDocs(query(collection(db, POSTS), where('status', '==', status)))
    : await getDocs(query(collection(db, POSTS), orderBy('createdAt', 'desc')))

  const rows = sortNewestFirst(snap.docs.map(fromDoc))
  return max ? rows.slice(0, max) : rows
}

/**
 * What the public blog shows.
 *
 * Only `published` — the security rules cannot express "scheduled and due"
 * without breaking the query, so due posts are flipped to published by
 * publishDueScheduled() instead. Errors are thrown, not swallowed, so the page
 * can explain why it is empty rather than looking like there is no content.
 */
export async function listLive({ max } = {}) {
  if (!isFirebaseConfigured) {
    const rows = SAMPLE_POSTS.filter((p) => p.status === 'published')
    return max ? rows.slice(0, max) : rows
  }

  const snap = await getDocs(
    query(collection(db, POSTS), where('status', '==', 'published')),
  )

  const rows = sortNewestFirst(snap.docs.map(fromDoc))
  return max ? rows.slice(0, max) : rows
}

/**
 * Publishes any scheduled post whose time has passed.
 *
 * Runs when an admin opens the panel. A true cron would need Cloud Functions
 * (paid tier), so this is the free equivalent: posts go live on their date as
 * long as the panel is opened at some point after it.
 * Returns the number published.
 */
export async function publishDueScheduled() {
  if (!isFirebaseConfigured) return 0

  const snap = await getDocs(
    query(collection(db, POSTS), where('status', '==', 'scheduled')),
  )

  const now = Date.now()
  const due = snap.docs
    .map(fromDoc)
    .filter((p) => p.publishAt && p.publishAt.getTime() <= now)

  await Promise.all(
    due.map((p) =>
      updateDoc(doc(db, POSTS, p.id), {
        status: 'published',
        publishedAt: p.publishAt,
        updatedAt: serverTimestamp(),
      }),
    ),
  )

  return due.length
}

export async function getPost(id) {
  if (!isFirebaseConfigured) {
    return SAMPLE_POSTS.find((p) => p.id === id) ?? null
  }
  const snap = await getDoc(doc(db, POSTS, id))
  return snap.exists() ? fromDoc(snap) : null
}

export async function getPostBySlug(slug) {
  if (!isFirebaseConfigured) {
    return SAMPLE_POSTS.find((p) => p.slug === slug) ?? null
  }
  const snap = await getDocs(
    query(collection(db, POSTS), where('slug', '==', slug), fbLimit(1)),
  )
  return snap.empty ? null : fromDoc(snap.docs[0])
}

/* ------------------------------------------------------------------ */
/* Writes                                                              */
/* ------------------------------------------------------------------ */

function assertConfigured() {
  if (!isFirebaseConfigured) {
    throw new Error(
      'Firebase is not connected. Add your credentials to .env — see docs/FIREBASE.md.',
    )
  }
}

/** Shared field shaping for create and update. */
function shape(data) {
  return {
    ...data,
    slug: data.slug || slugify(data.title),
    excerpt: data.excerpt || excerptFrom(data.content),
    readMinutes: readingMinutes(data.content),
    // Scheduling only means anything for scheduled posts.
    publishAt:
      data.status === 'scheduled' && data.publishAt ? new Date(data.publishAt) : null,
  }
}

export async function createPost(data) {
  assertConfigured()
  const now = serverTimestamp()
  const created = await addDoc(collection(db, POSTS), {
    ...shape(data),
    views: 0,
    likes: 0,
    createdAt: now,
    updatedAt: now,
    publishedAt: data.status === 'published' ? now : null,
  })
  return created.id
}

export async function updatePost(id, data) {
  assertConfigured()
  const payload = {
    ...shape(data),
    updatedAt: serverTimestamp(),
  }
  // Stamp the publish date the first time a post actually goes live.
  if (data.status === 'published' && !data.publishedAt) {
    payload.publishedAt = serverTimestamp()
  }
  await updateDoc(doc(db, POSTS, id), payload)
}

/** Formats a Date for a datetime-local input, in the browser's timezone. */
export function toLocalInput(date) {
  const d = toDate(date)
  if (!d) return ''
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export async function deletePost(id) {
  assertConfigured()
  await deleteDoc(doc(db, POSTS, id))
}

/** Fire-and-forget: a failed view count must never break the article page. */
export async function recordView(id) {
  if (!isFirebaseConfigured) return
  try {
    await updateDoc(doc(db, POSTS, id), { views: increment(1) })
  } catch {
    /* ignore */
  }
}

export async function toggleLike(id, delta = 1) {
  if (!isFirebaseConfigured) return
  try {
    await updateDoc(doc(db, POSTS, id), { likes: increment(delta) })
  } catch {
    /* ignore */
  }
}

/**
 * Cloudinary is the image host. Firebase Storage stays as a fallback for
 * projects already using it, so neither service is mandatory.
 */
export async function uploadImage(file, onProgress) {
  if (isCloudinaryConfigured) {
    return uploadToCloudinary(file, onProgress)
  }

  if (isFirebaseConfigured) {
    const safe = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '-')
    const fileRef = ref(storage, `posts/${Date.now()}-${safe}`)
    await uploadBytes(fileRef, file)
    return getDownloadURL(fileRef)
  }

  throw new Error(
    'No image host configured. Add your Cloudinary details to .env — see docs/CLOUDINARY.md.',
  )
}

/** True when an image can actually be uploaded from the browser right now. */
export const canUploadImages = isCloudinaryConfigured || isFirebaseConfigured

/* ------------------------------------------------------------------ */
/* Aggregates for the dashboard                                        */
/* ------------------------------------------------------------------ */

export function summarise(posts) {
  const published = posts.filter((p) => p.status === 'published')
  return {
    total: posts.length,
    published: published.length,
    drafts: posts.filter((p) => p.status === 'draft').length,
    scheduled: posts.filter((p) => p.status === 'scheduled').length,
    views: posts.reduce((sum, p) => sum + (p.views || 0), 0),
    likes: posts.reduce((sum, p) => sum + (p.likes || 0), 0),
  }
}

export function compact(n = 0) {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(n)
}
