import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { listEvents } from '../lib/events'
import { EVENT_TZ_LABEL, formatEventTime } from '../lib/eventTime'
import { appendTurn, startChat } from '../lib/chats'
import { trackCta } from '../lib/track'
import useEventRegistration from '../hooks/useEventRegistration'
import RegisterModal from './RegisterModal'
import ChatText from './ChatText'

/*
 * Floating assistant, bottom-right of every public page.
 *
 * Four things it always does:
 *   1. Asks for a name and email before any conversation, so every chat lands
 *      in the admin Inbox as a named lead.
 *   2. Pins the next webinar above the conversation — title, date, link.
 *   3. Greets the visitor on arrival and tells them they can ask anything.
 *   4. Saves the whole transcript, and restores it when they come back.
 *
 * The model is reached through /api/chat, never directly: the API key lives on
 * the server so it cannot be read out of the browser bundle.
 */

const VISITOR_KEY = 'mxl.chat.visitor'
const GREETED_KEY = 'mxl.chat.greeted'
const THREAD_KEY = 'mxl.chat.thread'

function read(key, fallback = null) {
  try {
    return JSON.parse(localStorage.getItem(key) ?? 'null') ?? fallback
  } catch {
    return fallback
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* private browsing — the chat still works, it just won't be remembered */
  }
}

/** Remembers the visitor between pages and visits, so they sign in once. */
function loadVisitor() {
  const saved = read(VISITOR_KEY)
  return saved?.email ? saved : null
}

/**
 * The conversation so far.
 *
 * Kept in localStorage rather than re-read from Firestore: it is instant, it
 * survives a dropped connection, and the copy in the database is the archive
 * for the admin rather than the visitor's working copy.
 */
function loadThread() {
  const saved = read(THREAD_KEY)
  return {
    id: typeof saved?.id === 'string' ? saved.id : null,
    messages: Array.isArray(saved?.messages) ? saved.messages.slice(-40) : [],
  }
}

/**
 * What the assistant is told about one event.
 *
 * `registerUrl` defaults to an internal placeholder ("/community") for events
 * that register through the button's booking widget. Passing that placeholder
 * on as a registration link made the assistant tell people to sign up on the
 * community page, which is not true. So a URL is handed over only when it is a
 * genuine off-site registration page; otherwise the assistant is told to point
 * at the Register button instead.
 */
function describeEvent(event) {
  const url = event.registerUrl ?? ''
  const isRealRegistrationPage =
    event.registerMode === 'link' && /^https?:\/\//i.test(url)

  return {
    title: event.title,
    date: `${new Intl.DateTimeFormat('en-GB', {
      timeZone: 'America/Chicago',
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }).format(event.startsAt)} at ${formatEventTime(event.startsAt)} ${EVENT_TZ_LABEL}`,
    url: isRealRegistrationPage ? url : '',
  }
}

function ChatIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9.4 9.4 0 0 1-2.8-.4L4 21l1.4-4A8.2 8.2 0 0 1 4 11.5 8.4 8.4 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CloseIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="m6 6 12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** The next webinar, pinned above the conversation. Title, date, link. */
function EventPin({ event, onRegister }) {
  if (!event) return null

  const date = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'America/Chicago',
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(event.startsAt)

  return (
    <div className="shrink-0 border-b border-gold/25 bg-gold-tint px-4 py-3">
      <p className="text-[9.5px] font-bold uppercase tracking-[0.16em] text-gold-text">
        Next live session
      </p>
      <p className="mt-1 line-clamp-2 text-[13px] font-bold leading-snug text-forest-deep">
        {event.title}
      </p>
      <div className="mt-1.5 flex items-center justify-between gap-3">
        <p className="text-[11px] text-ink/65">
          {date} · {formatEventTime(event.startsAt)} {EVENT_TZ_LABEL}
        </p>
        <button
          type="button"
          onClick={onRegister}
          className="shrink-0 text-[11.5px] font-semibold text-brown-deep underline underline-offset-2 hover:text-brown"
        >
          Register free
        </button>
      </div>
    </div>
  )
}

export default function ChatWidget() {
  const { pathname } = useLocation()

  const restored = useRef(loadThread()).current

  const [open, setOpen] = useState(false)
  const [teasing, setTeasing] = useState(false)
  const [visitor, setVisitor] = useState(loadVisitor)
  const [form, setForm] = useState({ name: '', email: '' })
  const [formError, setFormError] = useState('')

  const [events, setEvents] = useState([])
  const [chatId, setChatId] = useState(restored.id)
  const [messages, setMessages] = useState(restored.messages)
  const [draft, setDraft] = useState('')
  const [thinking, setThinking] = useState(false)

  const scroller = useRef(null)
  const inputRef = useRef(null)
  const { modalEvent, register, close } = useEventRegistration()

  const event = events[0] ?? null

  /* Upcoming sessions: the first is pinned, the rest give the assistant context. */
  useEffect(() => {
    let cancelled = false
    listEvents()
      .then((all) => {
        if (cancelled) return
        const now = Date.now()
        setEvents(all.filter((e) => now < e.endsAt))
      })
      .catch((e) => console.error('Chat could not load events:', e))
    return () => {
      cancelled = true
    }
  }, [])

  /* Keep the visitor's copy of the conversation in step. */
  useEffect(() => {
    if (messages.length) write(THREAD_KEY, { id: chatId, messages: messages.slice(-40) })
  }, [chatId, messages])

  /*
   * The welcome. A moment after landing, the launcher says hello once per
   * session — enough to be noticed, not enough to be a pop-up.
   */
  useEffect(() => {
    if (sessionStorage.getItem(GREETED_KEY)) return
    const id = setTimeout(() => {
      setTeasing(true)
      sessionStorage.setItem(GREETED_KEY, '1')
    }, 3500)
    return () => clearTimeout(id)
  }, [])

  /* Opening seeds the greeting inside the panel. */
  useEffect(() => {
    if (!open || messages.length) return
    setMessages([
      {
        role: 'assistant',
        content: visitor?.name
          ? `Welcome back, ${visitor.name.split(' ')[0]}. Ask me anything about My Expansive Life — the course, the community, the live sessions, or anything else you're wondering about.`
          : "Hi, welcome to My Expansive Life. I'm here to help — you can ask me anything about the course, the community, the free webinars, or Dr. Nkem's work.",
      },
    ])
  }, [open, messages.length, visitor])

  /* Keep the newest message in view. */
  useEffect(() => {
    const el = scroller.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, thinking, open])

  useEffect(() => {
    if (open && visitor) inputRef.current?.focus()
  }, [open, visitor])

  /**
   * Clears the visitor's copy and opens a fresh transcript. The old
   * conversation stays in the database — nothing an admin has seen disappears.
   */
  async function startFresh() {
    setMessages([])
    setChatId(null)
    write(THREAD_KEY, { id: null, messages: [] })

    if (visitor) {
      const id = await startChat({ ...visitor, page: pathname })
      if (id) setChatId(id)
    }
  }

  function toggle() {
    setTeasing(false)
    setOpen((wasOpen) => {
      if (!wasOpen) trackCta('chat_opened')
      return !wasOpen
    })
  }

  /* The gate: name and email before the first question. */
  async function submitVisitor(submitEvent) {
    submitEvent.preventDefault()
    const name = form.name.trim()
    const email = form.email.trim()

    if (name.length < 2) return setFormError('Please tell me your name.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return setFormError('That email address does not look right.')
    }

    const identity = { name, email }
    setFormError('')
    setVisitor(identity)
    write(VISITOR_KEY, identity)

    trackCta('chat_lead_captured')

    setMessages((current) => [
      ...current,
      {
        role: 'assistant',
        content: `Thanks ${name.split(' ')[0]} — go ahead and ask me anything.`,
      },
    ])

    // Opening the transcript is what puts this person in the admin Inbox.
    const id = await startChat({ name, email, page: pathname })
    if (id) setChatId(id)
  }

  async function send(submitEvent) {
    submitEvent.preventDefault()
    const question = draft.trim()
    if (!question || thinking) return

    const history = [...messages, { role: 'user', content: question }]
    setMessages(history)
    setDraft('')
    setThinking(true)
    appendTurn(chatId, { role: 'user', content: question })

    let reply
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: visitor?.name ?? '',
          page: pathname,
          events: events.map(describeEvent),
          // The greeting is ours, not part of what the model needs to see.
          messages: history.filter((m, i) => !(i === 0 && m.role === 'assistant')),
        }),
      })

      const data = await response.json().catch(() => ({}))
      reply =
        data.reply ??
        data.error ??
        'Sorry — something went wrong at my end. Please try that again.'
    } catch {
      reply = "I couldn't connect just then. Please check your connection and try again."
    }

    setMessages((current) => [...current, { role: 'assistant', content: reply }])
    setThinking(false)
    appendTurn(chatId, { role: 'assistant', content: reply })
  }

  // Sits clear of the sticky event bar when there is an event running.
  const lift = event ? 'bottom-[88px] sm:bottom-[92px]' : 'bottom-5'

  return (
    <>
      {/* Launcher */}
      <div className={`fixed right-4 z-40 flex items-end gap-2 sm:right-6 ${lift}`}>
        {teasing && !open && (
          <button
            type="button"
            onClick={toggle}
            className="max-w-[210px] rounded-2xl rounded-br-sm bg-white px-4 py-3 text-left text-[12.5px] leading-snug text-ink shadow-[0_14px_38px_-16px_rgb(43_34_25/0.55)] ring-1 ring-ink/5"
          >
            <span className="font-semibold text-forest-deep">
              Welcome to My Expansive Life.
            </span>{' '}
            Ask me anything.
          </button>
        )}

        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          aria-label={open ? 'Close the chat' : 'Open the chat — ask us anything'}
          className="grid size-14 shrink-0 place-items-center rounded-full bg-forest-deep text-cream shadow-[0_14px_34px_-12px_rgb(21_52_47/0.75)] transition-transform duration-300 hover:scale-105"
        >
          {open ? <CloseIcon className="size-6" /> : <ChatIcon className="size-6" />}
        </button>
      </div>

      {/* Panel */}
      {open && (
        <div
          className={`fixed right-4 z-40 flex w-[calc(100vw-2rem)] max-w-[370px] flex-col overflow-hidden rounded-2xl bg-cream-card shadow-[0_26px_70px_-24px_rgb(43_34_25/0.6)] ring-1 ring-ink/10 sm:right-6 ${
            event
              ? 'bottom-[160px] h-[min(540px,calc(100dvh-13rem))] sm:bottom-[164px]'
              : 'bottom-24 h-[min(540px,calc(100dvh-9rem))]'
          }`}
        >
          <header className="flex shrink-0 items-center justify-between gap-3 bg-forest-deep px-4 py-3.5">
            <div>
              <p className="text-[13.5px] font-bold text-cream">Ask My Expansive Life</p>
              <p className="text-[10.5px] text-cream/60">
                Answers about the course, community and events
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              {messages.length > 1 && (
                <button
                  type="button"
                  onClick={startFresh}
                  className="rounded-full px-2.5 py-1 text-[11px] font-semibold text-cream/70 transition-colors hover:bg-white/10 hover:text-cream"
                >
                  New chat
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close the chat"
                className="grid size-7 place-items-center rounded-full text-cream/70 transition-colors hover:bg-white/10 hover:text-cream"
              >
                <CloseIcon className="size-4" />
              </button>
            </div>
          </header>

          <EventPin event={event} onRegister={() => event && register(event)} />

          <div ref={scroller} className="grow space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((message, i) => (
              <div
                key={i}
                className={message.role === 'user' ? 'flex justify-end' : 'flex justify-start'}
              >
                <p
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                    message.role === 'user'
                      ? 'rounded-br-sm bg-forest-deep text-cream'
                      : 'rounded-bl-sm bg-white text-ink ring-1 ring-ink/5'
                  }`}
                >
                  {message.role === 'user' ? (
                    message.content
                  ) : (
                    <ChatText text={message.content} />
                  )}
                </p>
              </div>
            ))}

            {thinking && (
              <div className="flex justify-start">
                <p className="rounded-2xl rounded-bl-sm bg-white px-3.5 py-3 ring-1 ring-ink/5">
                  <span className="flex gap-1">
                    {[0, 150, 300].map((delay) => (
                      <span
                        key={delay}
                        className="size-1.5 animate-bounce rounded-full bg-ink/35"
                        style={{ animationDelay: `${delay}ms` }}
                      />
                    ))}
                  </span>
                </p>
              </div>
            )}
          </div>

          {visitor ? (
            <form
              onSubmit={send}
              className="flex shrink-0 items-center gap-2 border-t border-ink/10 bg-white px-3 py-3"
            >
              <input
                ref={inputRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                maxLength={1200}
                placeholder="Ask anything…"
                aria-label="Your question"
                className="min-w-0 grow rounded-full bg-cream px-4 py-2.5 text-[13px] text-ink outline-none ring-1 ring-ink/10 placeholder:text-ink/40 focus:ring-gold"
              />
              <button
                type="submit"
                disabled={!draft.trim() || thinking}
                aria-label="Send"
                className="grid size-10 shrink-0 place-items-center rounded-full bg-gold text-white transition-colors hover:bg-gold-text disabled:opacity-40"
              >
                <svg viewBox="0 0 24 24" className="size-4.5" fill="none" aria-hidden="true">
                  <path
                    d="M5 12h14m0 0-5.5-5.5M19 12l-5.5 5.5"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </form>
          ) : (
            /* The gate. Nothing is sent to the model until this is filled in. */
            <form
              onSubmit={submitVisitor}
              className="shrink-0 space-y-2 border-t border-ink/10 bg-white px-4 py-3.5"
            >
              <p className="text-[11.5px] text-ink/65">
                Tell me who you are and we can get started.
              </p>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your name"
                aria-label="Your name"
                autoComplete="name"
                className="w-full rounded-full bg-cream px-4 py-2.5 text-[13px] text-ink outline-none ring-1 ring-ink/10 placeholder:text-ink/40 focus:ring-gold"
              />
              <input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                type="email"
                placeholder="Your email"
                aria-label="Your email"
                autoComplete="email"
                className="w-full rounded-full bg-cream px-4 py-2.5 text-[13px] text-ink outline-none ring-1 ring-ink/10 placeholder:text-ink/40 focus:ring-gold"
              />
              {formError && <p className="text-[11.5px] text-red-700">{formError}</p>}
              <button
                type="submit"
                className="w-full rounded-full bg-gold py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-gold-text"
              >
                Start chatting
              </button>
            </form>
          )}
        </div>
      )}

      {modalEvent && <RegisterModal event={modalEvent} onClose={close} />}
    </>
  )
}
