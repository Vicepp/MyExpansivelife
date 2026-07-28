import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db, isFirebaseConfigured } from './firebase'
import { zonedToUtc } from './eventTime'
import { SEED_EVENTS } from '../data/events'

export const EVENTS_COLLECTION = 'events'

export const EVENT_BADGES = ['Monday Momentum', 'Free Webinar', 'Workshop', 'Masterclass']

/** Adds the derived timestamps every consumer needs. */
export function hydrate(event) {
  const startsAt = zonedToUtc(event.start)
  return {
    ...event,
    startsAt,
    endsAt: startsAt + (event.durationMinutes ?? 60) * 60_000,
  }
}

function fromDoc(snapshot) {
  return hydrate({ id: snapshot.id, ...snapshot.data() })
}

/** 'past' | 'live' | 'upcoming' for a given moment. */
export function statusOf(event, now) {
  if (now >= event.endsAt) return 'past'
  if (now >= event.startsAt) return 'live'
  return 'upcoming'
}

/**
 * Every event, oldest first — the order the stacked carousel expects.
 * Falls back to the bundled seed while Firebase is unconfigured or empty, so
 * the site is never eventless.
 */
export async function listEvents() {
  if (!isFirebaseConfigured) {
    return SEED_EVENTS.map(hydrate).sort((a, b) => a.startsAt - b.startsAt)
  }

  const snap = await getDocs(collection(db, EVENTS_COLLECTION))
  if (snap.empty) {
    return SEED_EVENTS.map(hydrate).sort((a, b) => a.startsAt - b.startsAt)
  }

  return snap.docs
    .map(fromDoc)
    .filter((e) => e.hidden !== true)
    .sort((a, b) => a.startsAt - b.startsAt)
}

/** Everything, including hidden events — for the admin list. */
export async function listAllEvents() {
  if (!isFirebaseConfigured) {
    return SEED_EVENTS.map(hydrate).sort((a, b) => b.startsAt - a.startsAt)
  }
  const snap = await getDocs(collection(db, EVENTS_COLLECTION))
  return snap.docs.map(fromDoc).sort((a, b) => b.startsAt - a.startsAt)
}

export async function getEvent(id) {
  if (!isFirebaseConfigured) {
    const found = SEED_EVENTS.find((e) => e.id === id)
    return found ? hydrate(found) : null
  }
  const snap = await getDoc(doc(db, EVENTS_COLLECTION, id))
  return snap.exists() ? fromDoc(snap) : null
}

/** The next event that has not finished — what the bar and carousel feature. */
export function nextEvent(events, now = Date.now()) {
  return events.find((e) => now < e.endsAt) ?? null
}

export function nextEventIndex(events, now = Date.now()) {
  const i = events.findIndex((e) => now < e.endsAt)
  return i === -1 ? Math.max(0, events.length - 1) : i
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

export const BLANK_EVENT = {
  title: '',
  badge: EVENT_BADGES[0],
  speaker: 'Dr. Nkem Ezeamama',
  role: 'Founder & CEO',
  start: '',
  durationMinutes: 60,
  image: '',
  registerUrl: '/community',
  hidden: false,
}

export async function createEvent(data) {
  assertConfigured()
  const created = await addDoc(collection(db, EVENTS_COLLECTION), {
    ...data,
    durationMinutes: Number(data.durationMinutes) || 60,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return created.id
}

export async function updateEvent(id, data) {
  assertConfigured()
  await updateDoc(doc(db, EVENTS_COLLECTION, id), {
    ...data,
    durationMinutes: Number(data.durationMinutes) || 60,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteEvent(id) {
  assertConfigured()
  await deleteDoc(doc(db, EVENTS_COLLECTION, id))
}

/**
 * Copies an event a week later, hidden, so the next one in a series can be
 * edited without retyping the speaker, banner and format.
 */
export async function duplicateEvent(event) {
  assertConfigured()

  const nextWeek = new Date(event.startsAt + 7 * 86400000)
  const pad = (n) => String(n).padStart(2, '0')
  const start = `${nextWeek.getFullYear()}-${pad(nextWeek.getMonth() + 1)}-${pad(nextWeek.getDate())}T${event.start.slice(11)}`

  return createEvent({
    title: `${event.title} (copy)`,
    badge: event.badge,
    speaker: event.speaker,
    role: event.role ?? '',
    start,
    durationMinutes: event.durationMinutes ?? 60,
    image: event.image ?? event.publicImage ?? '',
    registerUrl: event.registerUrl ?? '/community',
    hidden: true,
  })
}

/** One-time import of the bundled events into an empty collection. */
export async function seedEvents() {
  assertConfigured()
  const existing = await getDocs(collection(db, EVENTS_COLLECTION))
  if (!existing.empty) return 0

  await Promise.all(
    SEED_EVENTS.map((e) =>
      addDoc(collection(db, EVENTS_COLLECTION), {
        title: e.title,
        badge: e.badge,
        speaker: e.speaker,
        role: e.role ?? '',
        start: e.start,
        durationMinutes: e.durationMinutes ?? 60,
        image: e.publicImage ?? e.image ?? '',
        registerUrl: '/community',
        hidden: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }),
    ),
  )
  return SEED_EVENTS.length
}
