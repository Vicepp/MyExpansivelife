import {
  collection,
  doc,
  getDocs,
  increment,
  query,
  setDoc,
  where,
} from 'firebase/firestore'
import { db, isFirebaseConfigured } from './firebase'

export const ANALYTICS = 'analytics'

/**
 * Lightweight first-party analytics.
 *
 * One document per day holds counter maps, incremented atomically. That keeps
 * writes tiny — a busy day is a handful of writes rather than one per view —
 * which matters on Firestore's free tier.
 *
 *   analytics/2026-07-28 = {
 *     day, views, pages: { _blogs: 12 }, ctas: { hero_get_started: 4 },
 *     eventClicks: { <eventId>: 7 }, eventPopups: { <eventId>: 5 },
 *     visits, devices: { mobile: 9, desktop: 5 }, countries: { US: 11 },
 *     cities: { Houston__US: 4 }, cityCoords: { Houston__US: "29.76,-95.36" }
 *   }
 *
 * Visits, devices and locations are counted once per browser session (not per
 * page). Location is city-level, from /api/geo; no IP address is stored.
 * Crawlers and headless browsers are not counted at all.
 */

/** Firestore map keys cannot contain dots or slashes. */
export function safeKey(value) {
  return (
    String(value || 'unknown')
      .replace(/[.#$/[\]]/g, '_')
      .slice(0, 100) || 'unknown'
  )
}

export function dayKey(date = new Date()) {
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

function bump(payload) {
  if (!isFirebaseConfigured) return Promise.resolve(false)
  const day = dayKey()
  // merge:true creates the document on the first hit of the day.
  return setDoc(doc(db, ANALYTICS, day), { day, ...payload }, { merge: true })
    .then(() => true)
    .catch((error) => {
      // Never let a metric break the page.
      console.debug('analytics skipped:', error?.code ?? error)
      return false
    })
}

const BOT = /bot|crawl|spider|slurp|headless|lighthouse|prerender|preview/i

function isBot() {
  try {
    return Boolean(navigator.webdriver) || BOT.test(navigator.userAgent)
  } catch {
    return false
  }
}

/** 'mobile' | 'tablet' | 'desktop' for the current browser. */
export function deviceType() {
  try {
    const ua = navigator.userAgent
    if (/iPad|Tablet|PlayBook|Silk|Android(?!.*Mobi)/i.test(ua)) return 'tablet'
    // iPadOS reports itself as a Mac; touch support gives it away.
    if (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1) return 'tablet'
    if (navigator.userAgentData?.mobile || /Mobi|iPhone|iPod|Android/i.test(ua)) return 'mobile'
  } catch {
    /* fall through */
  }
  return 'desktop'
}

/** Once per browser session: device, country, city and the city's coordinates. */
async function trackVisit() {
  try {
    if (sessionStorage.getItem('mxl_visit')) return false
    sessionStorage.setItem('mxl_visit', '1')
  } catch {
    /* storage blocked (private mode): count this page load as the visit */
  }

  const payload = { visits: increment(1), devices: { [deviceType()]: increment(1) } }

  try {
    const res = await fetch('/api/geo')
    const geo = res.ok ? await res.json() : null
    if (geo?.country) {
      payload.countries = { [safeKey(geo.country)]: increment(1) }
      if (geo.city) {
        const key = safeKey(`${geo.city}__${geo.country}`)
        payload.cities = { [key]: increment(1) }
        if (Number.isFinite(geo.lat) && Number.isFinite(geo.lon)) {
          payload.cityCoords = { [key]: `${geo.lat.toFixed(2)},${geo.lon.toFixed(2)}` }
        }
      }
    }
  } catch {
    /* no location (e.g. local dev): device is still counted */
  }

  return bump(payload)
}

/** A visit to a route. */
export function trackPageView(path) {
  if (isBot()) return Promise.resolve(false)
  trackVisit()
  return bump({ views: increment(1), pages: { [safeKey(path)]: increment(1) } })
}

/** Any call-to-action press worth counting. */
export function trackCta(label) {
  return bump({ ctas: { [safeKey(label)]: increment(1) } })
}

/** Register button pressed for a specific event. */
export function trackEventRegister(eventId) {
  return bump({
    eventClicks: { [safeKey(eventId)]: increment(1) },
    ctas: { register_now: increment(1) },
  })
}

/** Registration popup actually opened and shown. */
export function trackEventPopup(eventId) {
  return bump({ eventPopups: { [safeKey(eventId)]: increment(1) } })
}

/* ------------------------------------------------------------------ */
/* Reads (admin only)                                                  */
/* ------------------------------------------------------------------ */

/** Daily documents between two YYYY-MM-DD keys, oldest first. */
export async function listAnalytics(fromDay, toDay) {
  if (!isFirebaseConfigured) return []
  const snap = await getDocs(
    query(
      collection(db, ANALYTICS),
      where('day', '>=', fromDay),
      where('day', '<=', toDay),
    ),
  )
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })).sort((a, b) => (a.day < b.day ? -1 : 1))
}

/** Fills gaps so a chart shows every day in the range, not just active ones. */
export function fillDays(rows, fromDate, toDate) {
  const byDay = new Map(rows.map((r) => [r.day, r]))
  const out = []
  const cursor = new Date(fromDate)
  cursor.setHours(0, 0, 0, 0)

  while (cursor <= toDate) {
    const key = dayKey(cursor)
    const row = byDay.get(key)
    out.push({
      day: key,
      label: new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'short',
      }).format(cursor),
      views: row?.views ?? 0,
      registers: sumMap(row?.eventClicks),
      popups: sumMap(row?.eventPopups),
      ctas: sumMap(row?.ctas),
    })
    cursor.setDate(cursor.getDate() + 1)
  }
  return out
}

export function sumMap(map) {
  if (!map) return 0
  return Object.values(map).reduce((total, n) => total + (Number(n) || 0), 0)
}

/** Merges a counter map across many days into a sorted [key, count] list. */
export function mergeMaps(rows, field) {
  const totals = new Map()
  for (const row of rows) {
    for (const [key, value] of Object.entries(row?.[field] ?? {})) {
      totals.set(key, (totals.get(key) ?? 0) + (Number(value) || 0))
    }
  }
  return [...totals.entries()]
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count)
}

/** Latest coordinates per city key ("City__CC" → [lat, lon]) across the rows. */
export function cityCoordinates(rows) {
  const coords = new Map()
  for (const row of rows) {
    for (const [key, value] of Object.entries(row?.cityCoords ?? {})) {
      const [lat, lon] = String(value).split(',').map(Number)
      if (Number.isFinite(lat) && Number.isFinite(lon)) coords.set(key, [lat, lon])
    }
  }
  return coords
}

/** "Houston__US" → { city: "Houston", country: "US" }. */
export function splitCityKey(key) {
  const i = key.lastIndexOf('__')
  return i === -1 ? { city: key, country: '' } : { city: key.slice(0, i), country: key.slice(i + 2) }
}

/** Turns a sanitised page key back into something readable. */
export function prettyPath(key) {
  const path = key.replace(/_/g, '/')
  return path === '/' ? '/ (home)' : path
}
