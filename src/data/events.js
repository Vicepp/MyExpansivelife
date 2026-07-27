import { zonedToUtc } from '../lib/eventTime'
import realEstate from '../assets/design/webinar-promo.jpg'
import financialHabits from '../assets/design/event-financial-habits.jpg'

/**
 * `start` is Central wall-clock time, as printed on the banners.
 * `durationMinutes` only decides how long a session counts as "live now".
 *
 * To add an event: drop its banner in src/assets/design/, import it, and add a
 * row here. Ordering and past/upcoming state are derived, not hand-maintained.
 */
const SOURCE = [
  {
    id: 'decision-fatigue',
    badge: 'Monday Momentum',
    title: 'The Hidden Cost of Decision Fatigue',
    speaker: 'Dr. Nkem Ezeamama',
    role: 'Founder & CEO',
    start: '2026-07-20T17:00:00',
    durationMinutes: 60,
    wide: true,
    // Banner not supplied yet — the card falls back to a branded panel.
    image: null,
  },
  {
    id: 'financial-habits',
    badge: 'Monday Momentum',
    title: 'The Financial Habits That Separate Freedom from Frustration',
    speaker: 'Dr. Nkem Ezeamama',
    role: 'Founder & CEO',
    start: '2026-07-27T17:00:00',
    durationMinutes: 60,
    // 1437x518 Monday Momentum banner — too wide for the side column.
    wide: true,
    image: financialHabits,
  },
  {
    id: 'real-estate',
    badge: 'Free Webinar',
    title: '$153M In Real Estate While Still Practicing Medicine: How Did I Do It?',
    speaker: 'Dr. Nkem Ezeamama',
    role: 'Founder & CEO',
    start: '2026-08-13T18:00:00',
    durationMinutes: 90,
    image: realEstate,
  },
]

export const EVENTS = SOURCE.map((event) => {
  const startsAt = zonedToUtc(event.start)
  return {
    ...event,
    startsAt,
    endsAt: startsAt + event.durationMinutes * 60_000,
  }
}).sort((a, b) => a.startsAt - b.startsAt)

/** 'past' | 'live' | 'upcoming' for a given moment. */
export function statusOf(event, now) {
  if (now >= event.endsAt) return 'past'
  if (now >= event.startsAt) return 'live'
  return 'upcoming'
}

/** Index of the next event that hasn't finished; falls back to the last one. */
export function nextEventIndex(now) {
  const i = EVENTS.findIndex((e) => now < e.endsAt)
  return i === -1 ? EVENTS.length - 1 : i
}
