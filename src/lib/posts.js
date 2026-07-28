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
  }
}

/** All posts, newest first. `status` narrows to one workflow state. */
export async function listPosts({ status, max } = {}) {
  if (!isFirebaseConfigured) {
    let rows = [...SAMPLE_POSTS]
    if (status) rows = rows.filter((p) => p.status === status)
    return max ? rows.slice(0, max) : rows
  }

  const clauses = []
  if (status) clauses.push(where('status', '==', status))
  clauses.push(orderBy('createdAt', 'desc'))
  if (max) clauses.push(fbLimit(max))

  const snap = await getDocs(query(collection(db, POSTS), ...clauses))
  return snap.docs.map(fromDoc)
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

export async function createPost(data) {
  assertConfigured()
  const now = serverTimestamp()
  const payload = {
    ...data,
    slug: data.slug || slugify(data.title),
    excerpt: data.excerpt || excerptFrom(data.content),
    readMinutes: readingMinutes(data.content),
    views: 0,
    likes: 0,
    createdAt: now,
    updatedAt: now,
    publishedAt: data.status === 'published' ? now : null,
  }
  const created = await addDoc(collection(db, POSTS), payload)
  return created.id
}

export async function updatePost(id, data) {
  assertConfigured()
  const payload = {
    ...data,
    slug: data.slug || slugify(data.title),
    excerpt: data.excerpt || excerptFrom(data.content),
    readMinutes: readingMinutes(data.content),
    updatedAt: serverTimestamp(),
  }
  // Stamp the publish date the first time a post actually goes live.
  if (data.status === 'published' && !data.publishedAt) {
    payload.publishedAt = serverTimestamp()
  }
  await updateDoc(doc(db, POSTS, id), payload)
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

export async function uploadImage(file) {
  assertConfigured()
  const safe = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '-')
  const path = `posts/${Date.now()}-${safe}`
  const fileRef = ref(storage, path)
  await uploadBytes(fileRef, file)
  return getDownloadURL(fileRef)
}

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
