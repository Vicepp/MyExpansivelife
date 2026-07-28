import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listEvents, nextEvent, statusOf } from '../lib/events'
import { EVENT_TZ_LABEL, breakdown, formatEventTime } from '../lib/eventTime'

function Unit({ value, label }) {
  return (
    <div className="text-center leading-none">
      <span className="block text-[15px] font-bold tabular-nums text-forest-deep">
        {value}
      </span>
      <span className="mt-0.5 block text-[9px] uppercase tracking-wide text-ink/50">
        {label}
      </span>
    </div>
  )
}

/**
 * Bar pinned to the bottom of the viewport advertising the next event.
 *
 * Deliberately not dismissible: it shows on every public page while an event
 * is upcoming or running, and removes itself only once that event has ended.
 * When the last event finishes, nothing renders at all.
 */
export default function EventBar() {
  const [event, setEvent] = useState(null)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    let cancelled = false
    listEvents()
      .then((events) => {
        if (cancelled) return
        setEvent(nextEvent(events, Date.now()))
      })
      .catch((e) => console.error('Could not load events:', e))
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!event) return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [event])

  if (!event) return null

  const status = statusOf(event, now)
  if (status === 'past') return null

  const left = breakdown(event.startsAt - now)
  const date = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'America/Chicago',
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(event.startsAt)

  const badge = (
    <span
      className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white sm:px-3 sm:py-1 sm:text-[10.5px] ${
        status === 'live' ? 'bg-red-600' : 'bg-mint'
      }`}
    >
      {status === 'live' ? 'Live now' : event.badge}
    </span>
  )

  const registerLink = (
    <Link
      to={event.registerUrl || '/community'}
      className="shrink-0 rounded-full bg-gold px-4 py-2 text-center text-[12.5px] font-semibold text-white transition-colors hover:bg-gold-text"
    >
      Register
    </Link>
  )

  return (
    <>
      {/* Keeps the end of the footer clear of the fixed bar. */}
      <div aria-hidden="true" className="h-[100px] sm:h-[76px]" />

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gold/30 bg-cream-card/95 shadow-[0_-8px_24px_-16px_rgb(43_34_25/0.4)] backdrop-blur-sm">
        <div className="mx-auto w-full max-w-[1200px] px-4 py-2.5 lg:px-10">
          {/* Mobile: two tidy rows — one line cannot hold this at 390px. */}
          <div className="sm:hidden">
            <div className="flex items-center gap-2">
              {badge}
              <p className="min-w-0 flex-1 truncate text-[12.5px] font-bold text-forest-deep">
                {event.title}
              </p>
            </div>
            <div className="mt-2 flex items-center gap-3">
              <p className="min-w-0 flex-1 truncate text-[11px] text-ink/60">
                {status === 'upcoming'
                  ? `Starts in ${left.days}d ${left.hours}h ${left.minutes}m`
                  : `${date} · ${formatEventTime(event.startsAt)} ${EVENT_TZ_LABEL}`}
              </p>
              {registerLink}
            </div>
          </div>

          {/* Tablet and up: single row with the full countdown. */}
          <div className="hidden items-center gap-3 sm:flex lg:gap-5">
            {badge}

            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-bold leading-tight text-forest-deep">
                {event.title}
              </p>
              <p className="truncate text-[11px] text-ink/60">
                {date} · {formatEventTime(event.startsAt)} {EVENT_TZ_LABEL}
              </p>
            </div>

            {status === 'upcoming' && (
              <div className="hidden shrink-0 items-center gap-3 md:flex">
                <Unit value={left.days} label="days" />
                <Unit value={left.hours} label="hrs" />
                <Unit value={left.minutes} label="min" />
                <Unit value={left.seconds} label="sec" />
              </div>
            )}

            {registerLink}
          </div>
        </div>
      </div>
    </>
  )
}
