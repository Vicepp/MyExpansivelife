# Event banners

Drop webinar banner artwork here and it appears on the site with no code change.

| File | Event | Status |
| --- | --- | --- |
| `decision-fatigue.jpg` | The Hidden Cost of Decision Fatigue — 20 Jul 2026 | **missing** |

Until a file is present the card shows a branded fallback panel instead, so a
missing banner never breaks the layout.

## Adding a new event

1. Save the banner here, or into `src/assets/design/` if you would rather Vite
   hash and cache-bust it.
2. Add a row to `src/data/events.js` with the Central wall-clock `start` time.

Ordering, the past/live/upcoming badge, which card sits in the middle of the
stack, and the countdown are all derived from the clock — nothing to maintain
by hand as events come and go.

## Artwork

Banners are shown uncropped inside a 2.6:1 frame, centred on cream. Wide
"Monday Momentum" artwork (roughly 1437x518) fills it edge to edge; squarer
artwork is centred with cream at the sides. Match ~1440x554 for the best fit.
