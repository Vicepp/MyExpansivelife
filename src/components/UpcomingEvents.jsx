import { useEffect, useRef, useState } from 'react'
import { Container, Button } from './primitives'
import Reveal from './Reveal'
import { EVENTS, statusOf, nextEventIndex } from '../data/events'
import {
  EVENT_TZ_LABEL,
  breakdown,
  formatEventDate,
  formatEventTime,
} from '../lib/eventTime'
import logo from '../assets/design/logo.svg'

const STATUS_STYLES = {
  upcoming: 'bg-mint text-white',
  live: 'bg-red-600 text-white',
  past: 'bg-ink/10 text-ink/70',
}

function NavButton({ dir, onClick, disabled }) {
  const isPrev = dir === 'prev'
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={isPrev ? 'Previous event' : 'Next event'}
      className={`absolute top-1/2 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white shadow-md transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:shadow-md ${
        isPrev ? 'left-0 lg:-left-5' : 'right-0 lg:-right-5'
      }`}
    >
      <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
        <path
          d={isPrev ? 'm14 6-6 6 6 6' : 'm10 6 6 6-6 6'}
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}

function CountdownCell({ value, label }) {
  return (
    <div className="rounded-xl bg-white px-2 py-3 text-center">
      <p className="font-sans text-[22px] font-bold leading-none tabular-nums text-gold">
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
    <aside className="rounded-3xl bg-cream-card p-6 ring-1 ring-gold/15">
      <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-ink/55">
        {status === 'upcoming' && 'Starts in'}
        {status === 'live' && 'Happening now'}
        {status === 'past' && 'This event has ended'}
      </p>

      {status === 'upcoming' ? (
        <div className="mt-4 grid grid-cols-4 gap-2">
          <CountdownCell value={parts.days} label="Days" />
          <CountdownCell value={parts.hours} label="Hrs" />
          <CountdownCell value={parts.minutes} label="Min" />
          <CountdownCell value={parts.seconds} label="Sec" />
        </div>
      ) : (
        <p
          className={`mt-4 rounded-xl bg-white px-4 py-5 text-center text-[18px] font-bold ${
            status === 'live' ? 'text-red-600' : 'text-ink/60'
          }`}
        >
          {status === 'live' ? 'Live now' : 'Replay coming soon'}
        </p>
      )}

      <dl className="mt-6 space-y-3 border-t border-ink/10 pt-5 text-[13px]">
        <div>
          <dt className="text-ink/55">Date</dt>
          <dd className="mt-0.5 font-semibold text-forest-deep">
            {formatEventDate(event.startsAt)}
          </dd>
        </div>
        <div>
          <dt className="text-ink/55">Time</dt>
          <dd className="mt-0.5 font-semibold text-forest-deep">
            {formatEventTime(event.startsAt)} {EVENT_TZ_LABEL}
          </dd>
        </div>
        <div>
          <dt className="text-ink/55">Speaker</dt>
          <dd className="mt-0.5 font-semibold text-forest-deep">{event.speaker}</dd>
        </div>
      </dl>
    </aside>
  )
}

function Banner({ event }) {
  if (event.image) {
    return (
      <img
        src={event.image}
        alt={`${event.title} — ${formatEventDate(event.startsAt)}`}
        // Wide banners keep their own ratio; square ones fill the side column.
        className={
          event.wide
            ? 'w-full rounded-2xl'
            : 'h-full w-full rounded-2xl object-cover'
        }
      />
    )
  }

  // Branded stand-in until this event's banner artwork is supplied.
  return (
    <div className="flex h-full min-h-[220px] flex-col justify-center gap-4 rounded-2xl bg-gold/10 p-8 ring-1 ring-gold/20">
      <img src={logo} alt="" aria-hidden="true" className="h-10 w-auto" />
      <p className="font-display text-[24px] leading-tight text-forest">
        {event.title}
      </p>
      <p className="text-[13px] text-ink/60">
        {formatEventDate(event.startsAt)}
      </p>
    </div>
  )
}

export default function UpcomingEvents() {
  const [now, setNow] = useState(() => Date.now())
  const [index, setIndex] = useState(() => nextEventIndex(Date.now()))
  // Once the visitor uses the arrows we stop re-selecting the next event.
  const browsing = useRef(false)

  useEffect(() => {
    const id = setInterval(() => {
      const t = Date.now()
      setNow(t)
      if (!browsing.current) setIndex(nextEventIndex(t))
    }, 1000)
    return () => clearInterval(id)
  }, [])

  const event = EVENTS[index]
  const status = statusOf(event, now)
  const behind = EVENTS.length - 1 - index

  const go = (delta) => {
    browsing.current = true
    setIndex((i) => Math.min(EVENTS.length - 1, Math.max(0, i + delta)))
  }

  return (
    <section id="events" className="bg-cream py-20 lg:py-24">
      <Container>
        <Reveal>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_270px]">
            <div className="relative px-6 lg:px-0">
              <NavButton dir="prev" onClick={() => go(-1)} disabled={index === 0} />
              <NavButton
                dir="next"
                onClick={() => go(1)}
                disabled={index === EVENTS.length - 1}
              />

              {/* Cards still to come peek out from under the active one. */}
              {behind > 0 && (
                <div className="pointer-events-none absolute inset-x-4 -bottom-2 h-10 rounded-3xl bg-white/55" />
              )}
              {behind > 1 && (
                <div className="pointer-events-none absolute inset-x-8 -bottom-4 h-10 rounded-3xl bg-white/35" />
              )}

              <article
                key={event.id}
                className={`page-enter relative rounded-3xl bg-white p-8 lg:p-12 ${
                  event.wide
                    ? ''
                    : 'grid items-center gap-8 lg:grid-cols-2 lg:gap-12'
                }`}
              >
                <div>
                  <h2 className="text-[26px] font-bold uppercase tracking-tight text-gold lg:text-[34px]">
                    Upcoming Events
                  </h2>

                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-4 py-1.5 text-[13px] font-semibold ${STATUS_STYLES[status]}`}
                    >
                      {status === 'past' ? 'Past event' : event.badge}
                    </span>
                    <span className="text-[13px] text-ink/55">
                      {index + 1} / {EVENTS.length}
                    </span>
                  </div>

                  <h3 className="mt-4 text-[21px] font-bold leading-snug text-forest-deep lg:text-[26px]">
                    {event.title}
                  </h3>

                  <p className="mt-3 text-[13.5px] text-ink/70">
                    {formatEventDate(event.startsAt)} &middot;{' '}
                    {formatEventTime(event.startsAt)} {EVENT_TZ_LABEL}
                  </p>

                  <Button
                    variant="solid"
                    to="/community"
                    icon
                    className="mt-7"
                  >
                    {status === 'past' ? 'Watch replay' : 'Register now'}
                  </Button>
                </div>

                <div className={event.wide ? 'mt-8' : ''}>
                  <Banner event={event} />
                </div>
              </article>
            </div>

            <Countdown event={event} now={now} />
          </div>
        </Reveal>

        <div className="mt-8 flex items-center justify-center gap-2">
          {EVENTS.map((e, i) => (
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
