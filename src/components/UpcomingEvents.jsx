import { useEffect, useRef, useState } from 'react'
import { Container, Button } from './primitives'
import Reveal from './Reveal'
import { listEvents, statusOf, nextEventIndex } from '../lib/events'
import { breakdown, formatEventDate } from '../lib/eventTime'
import logo from '../assets/design/logo.svg'

const STATUS_STYLES = {
  upcoming: 'bg-mint text-white',
  live: 'bg-red-600 text-white',
  past: 'bg-ink/10 text-ink/70',
}

/** Vertical gap between stacked banners. */
const STEP_PX = 24
const VISIBLE = 2

function StepButton({ dir, onClick, disabled, label }) {
  const isUp = dir === 'up'
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`absolute left-1/2 z-40 grid size-9 -translate-x-1/2 place-items-center rounded-full bg-white shadow-md transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:shadow-md ${
        isUp ? 'top-0' : 'bottom-0'
      }`}
    >
      <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden="true">
        <path
          d={isUp ? 'm6 14 6-6 6 6' : 'm6 10 6 6 6-6'}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}

/** Banner artwork, uncropped inside a portrait frame. */
function Banner({ event }) {
  const [failed, setFailed] = useState(false)
  const src = event.image ?? event.publicImage

  if (!src || failed) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-5 text-center">
        <img src={logo} alt="" aria-hidden="true" className="h-8 w-auto" />
        <p className="font-display text-[17px] leading-tight text-forest">
          {event.title}
        </p>
        <p className="text-[11px] text-ink/55">{formatEventDate(event.startsAt)}</p>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={`${event.title} — ${formatEventDate(event.startsAt)}`}
      onError={() => setFailed(true)}
      className="h-full w-full object-contain"
    />
  )
}

function CountdownCell({ value, label }) {
  return (
    <div className="rounded-xl bg-white px-2 py-3 text-center">
      <p className="text-[20px] font-bold leading-none tabular-nums text-gold">
        {value}
      </p>
      <p className="mt-1.5 text-[10px] uppercase tracking-wider text-ink/55">
        {label}
      </p>
    </div>
  )
}

function Countdown({ event, now }) {
  const status = statusOf(event, now)
  const parts = breakdown(event.startsAt - now)

  return (
    <aside className="self-start rounded-3xl bg-cream-card p-5 ring-1 ring-gold/15">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/55">
        {status === 'upcoming' && 'Starts in'}
        {status === 'live' && 'Happening now'}
        {status === 'past' && 'Event ended'}
      </p>

      {status === 'upcoming' ? (
        <div className="mt-3 grid grid-cols-4 gap-2">
          <CountdownCell value={parts.days} label="Days" />
          <CountdownCell value={parts.hours} label="Hrs" />
          <CountdownCell value={parts.minutes} label="Min" />
          <CountdownCell value={parts.seconds} label="Sec" />
        </div>
      ) : (
        <p
          className={`mt-3 rounded-xl bg-white px-4 py-4 text-center text-[16px] font-bold ${
            status === 'live' ? 'text-red-600' : 'text-ink/60'
          }`}
        >
          {status === 'live' ? 'Live now' : 'Replay coming soon'}
        </p>
      )}
    </aside>
  )
}

export default function UpcomingEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [now, setNow] = useState(() => Date.now())
  const [index, setIndex] = useState(0)
  // Once the visitor navigates we stop re-selecting the next event for them.
  const browsing = useRef(false)

  useEffect(() => {
    let cancelled = false
    listEvents()
      .then((rows) => {
        if (cancelled) return
        setEvents(rows)
        setIndex(nextEventIndex(rows, Date.now()))
      })
      .catch((e) => console.error('Could not load events:', e))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (events.length === 0) return
    const id = setInterval(() => {
      const t = Date.now()
      setNow(t)
      if (!browsing.current) setIndex(nextEventIndex(events, t))
    }, 1000)
    return () => clearInterval(id)
  }, [events])

  const event = events[index]

  const go = (delta) => {
    browsing.current = true
    setIndex((i) => Math.min(events.length - 1, Math.max(0, i + delta)))
  }

  // Nothing scheduled: drop the whole section rather than show an empty frame.
  if (loading || !event) return null

  const status = statusOf(event, now)

  return (
    <section id="events" className="bg-cream py-20 lg:py-24">
      <Container>
        <Reveal>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_230px]">
            <div className="grid items-center gap-8 rounded-3xl bg-white p-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-10 lg:p-10">
              <div>
                <h2 className="text-[26px] font-bold uppercase tracking-tight text-gold lg:text-[32px]">
                  Upcoming Events
                </h2>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <span
                    className={`rounded-full px-4 py-1.5 text-[13px] font-semibold ${STATUS_STYLES[status]}`}
                  >
                    {status === 'past' ? 'Past event' : event.badge}
                  </span>
                  <span className="text-[13px] text-ink/55">
                    {index + 1} / {events.length}
                  </span>
                </div>

                <h3 className="mt-4 text-[20px] font-bold leading-snug text-forest-deep lg:text-[24px]">
                  {event.title}
                </h3>

                <Button
                  variant="solid"
                  to={event.registerUrl || '/community'}
                  icon
                  className="mt-6"
                >
                  {status === 'past' ? 'Watch replay' : 'Register now'}
                </Button>
              </div>

              {/*
                Vertical stage: later events sit above the centre banner and
                earlier ones below, so the whole artwork reads on every layer.
              */}
              <div className="relative h-[300px] sm:h-[350px] lg:h-[370px]">
                <StepButton
                  dir="up"
                  label="Show the next event"
                  onClick={() => go(1)}
                  disabled={index === events.length - 1}
                />
                <StepButton
                  dir="down"
                  label="Show the previous event"
                  onClick={() => go(-1)}
                  disabled={index === 0}
                />

                {events.map((item, i) => {
                  const offset = i - index
                  const distance = Math.abs(offset)
                  if (distance > VISIBLE) return null

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        browsing.current = true
                        setIndex(i)
                      }}
                      aria-label={item.title}
                      aria-current={offset === 0}
                      tabIndex={offset === 0 ? -1 : 0}
                      className="absolute left-0 top-1/2 w-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                      style={{
                        transform: `translateY(calc(-50% - ${offset * STEP_PX}px)) scale(${1 - distance * 0.06})`,
                        opacity: distance === 0 ? 1 : distance === 1 ? 0.45 : 0.2,
                        zIndex: 30 - distance * 10,
                        filter: distance ? `blur(${distance}px)` : 'none',
                        cursor: offset === 0 ? 'default' : 'pointer',
                      }}
                    >
                      <span className="block aspect-[0.95] overflow-hidden rounded-2xl bg-cream-card shadow-[0_16px_40px_-20px_rgb(43_34_25/0.45)]">
                        <Banner event={item} />
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <Countdown event={event} now={now} />
          </div>
        </Reveal>

        <div className="mt-6 flex items-center justify-center gap-2">
          {events.map((e, i) => (
            <button
              key={e.id}
              type="button"
              aria-label={`Show ${e.title}`}
              aria-current={i === index}
              onClick={() => {
                browsing.current = true
                setIndex(i)
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? 'w-8 bg-gold' : 'w-2 bg-gold/40 hover:bg-gold/70'
              }`}
            />
          ))}
        </div>
      </Container>
    </section>
  )
}
