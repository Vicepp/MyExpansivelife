/**
 * Bundled events.
 *
 * These are the fallback the site shows before anything exists in Firestore,
 * and the source for the one-click import on the admin Events page. Once the
 * `events` collection has documents, this file is no longer read.
 *
 * `start` is Central wall-clock time, as printed on the banners.
 */
export const SEED_EVENTS = [
  {
    id: 'decision-fatigue',
    badge: 'Monday Momentum',
    title: 'The Hidden Cost of Decision Fatigue',
    speaker: 'Dr. Nkem Ezeamama',
    role: 'Founder & CEO',
    start: '2026-07-20T17:00:00',
    durationMinutes: 60,
    publicImage: '/events/decision-fatigue.jpg',
  },
  {
    id: 'financial-habits',
    badge: 'Monday Momentum',
    title: 'The Financial Habits That Separate Freedom from Frustration',
    speaker: 'Dr. Nkem Ezeamama',
    role: 'Founder & CEO',
    start: '2026-07-27T17:00:00',
    durationMinutes: 60,
    publicImage: '/events/financial-habits.jpg',
  },
  {
    id: 'real-estate',
    badge: 'Free Webinar',
    title: '$153M In Real Estate While Still Practicing Medicine: How Did I Do It?',
    speaker: 'Dr. Nkem Ezeamama',
    role: 'Founder & CEO',
    start: '2026-08-13T18:00:00',
    durationMinutes: 90,
    publicImage: '/events/real-estate.jpg',
  },
]
