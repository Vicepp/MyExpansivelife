import { useEffect, useRef, useState } from 'react'
import {
  Btn,
  Card,
  EmptyState,
  Field,
  Input,
  PageHead,
  Select,
  SetupNotice,
  Spinner,
  Textarea,
} from './ui'
import { IconPlus, IconTrash, IconCalendar } from './icons'
import { isFirebaseConfigured } from '../lib/firebase'
import { canUploadImages, uploadImage } from '../lib/posts'
import {
  BLANK_EVENT,
  EVENT_BADGES,
  createEvent,
  deleteEvent,
  duplicateEvent,
  listAllEvents,
  seedEvents,
  statusOf,
  updateEvent,
} from '../lib/events'
import { EVENT_TZ_LABEL, formatEventDate, formatEventTime } from '../lib/eventTime'

const STATUS_TONES = {
  upcoming: 'bg-emerald-100 text-emerald-700',
  live: 'bg-red-100 text-red-700',
  past: 'bg-forest-deep/10 text-forest-deep/60',
}

/** Central wall-clock string <-> datetime-local input value. */
const toInput = (start) => (start ? start.slice(0, 16) : '')
const fromInput = (value) => (value ? `${value}:00` : '')

export default function Events() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(BLANK_EVENT)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [progress, setProgress] = useState(0)
  const fileInput = useRef(null)

  const refresh = () =>
    listAllEvents()
      .then(setEvents)
      .catch((e) => setError(e.message))

  useEffect(() => {
    refresh().finally(() => setLoading(false))
  }, [])

  const startNew = () => {
    setEditing('new')
    setForm(BLANK_EVENT)
    setError('')
    setMessage('')
  }

  const startEdit = (event) => {
    setEditing(event.id)
    setForm({
      title: event.title ?? '',
      badge: event.badge ?? EVENT_BADGES[0],
      speaker: event.speaker ?? '',
      role: event.role ?? '',
      start: event.start ?? '',
      durationMinutes: event.durationMinutes ?? 60,
      image: event.image ?? event.publicImage ?? '',
      registerMode: event.registerMode ?? 'link',
      embedCode: event.embedCode ?? '',
      registerUrl: event.registerUrl ?? '/community',
      hidden: event.hidden ?? false,
    })
    setError('')
    setMessage('')
  }

  const set = (key) => (e) =>
    setForm((f) => ({
      ...f,
      [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    }))

  const onBanner = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (!canUploadImages) {
      setError('No image host configured. Paste a banner URL instead.')
      return
    }
    try {
      setError('')
      setProgress(1)
      const url = await uploadImage(file, setProgress)
      setForm((f) => ({ ...f, image: url }))
    } catch (err) {
      setError(err.message)
    } finally {
      setProgress(0)
    }
  }

  const save = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!form.title.trim()) return setError('Give the event a title.')
    if (!form.start) return setError('Pick the date and time the event starts.')

    setBusy(true)
    try {
      if (editing === 'new') {
        await createEvent({ ...form, title: form.title.trim() })
        setMessage('Event created.')
      } else {
        await updateEvent(editing, { ...form, title: form.title.trim() })
        setMessage('Event updated.')
      }
      await refresh()
      setEditing(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const onDuplicate = async (event) => {
    setError('')
    try {
      const id = await duplicateEvent(event)
      await refresh()
      const copy = { ...event, id }
      startEdit({
        ...copy,
        title: `${event.title} (copy)`,
        start: `${new Date(event.startsAt + 7 * 86400000).toISOString().slice(0, 10)}T${event.start.slice(11)}`,
        hidden: true,
      })
      setEditing(id)
      setMessage('Duplicated a week later and hidden — edit and unhide when ready.')
    } catch (err) {
      setError(err.message)
    }
  }

  const onDelete = async (event) => {
    if (!window.confirm(`Delete “${event.title}”? This cannot be undone.`)) return
    try {
      await deleteEvent(event.id)
      await refresh()
    } catch (err) {
      setError(err.message)
    }
  }

  const onSeed = async () => {
    try {
      const n = await seedEvents()
      await refresh()
      setMessage(n ? `Imported ${n} events.` : 'The collection already has events.')
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <Spinner label="Loading events…" />

  const now = Date.now()

  return (
    <div>
      <PageHead
        title="Events"
        subtitle="Webinars and sessions shown on the site and in the bottom banner"
        action={
          <Btn variant="gold" onClick={startNew}>
            <IconPlus className="size-4" />
            New event
          </Btn>
        }
      />

      {!isFirebaseConfigured && <SetupNotice what="This event list" />}

      {error && (
        <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-[13.5px] text-red-700">
          {error}
        </p>
      )}
      {message && (
        <p className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-[13.5px] text-emerald-700">
          {message}
        </p>
      )}

      {editing && (
        <Card className="mb-5">
          <h2 className="mb-5 text-[16px] font-bold text-forest-deep">
            {editing === 'new' ? 'New event' : 'Edit event'}
          </h2>

          <form onSubmit={save} className="grid gap-4 lg:grid-cols-2">
            <Field label="Title" className="lg:col-span-2">
              <Input
                value={form.title}
                onChange={set('title')}
                placeholder="The Financial Habits That Separate Freedom from Frustration"
              />
            </Field>

            <Field label="Badge">
              <Select value={form.badge} onChange={set('badge')}>
                {EVENT_BADGES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </Select>
            </Field>

            <Field
              label={`Starts (${EVENT_TZ_LABEL} — Central time)`}
              hint="Entered as Central wall-clock time, exactly as printed on the banner."
            >
              <Input
                type="datetime-local"
                value={toInput(form.start)}
                onChange={(e) =>
                  setForm((f) => ({ ...f, start: fromInput(e.target.value) }))
                }
              />
            </Field>

            <Field label="Speaker">
              <Input value={form.speaker} onChange={set('speaker')} />
            </Field>

            <Field label="Role">
              <Input value={form.role} onChange={set('role')} />
            </Field>

            <Field label="Duration (minutes)">
              <Input
                type="number"
                min="15"
                step="15"
                value={form.durationMinutes}
                onChange={set('durationMinutes')}
              />
            </Field>

            <Field
              label="Registration method"
              hint="Popup keeps people on the site; link sends them away in a new tab."
            >
              <Select value={form.registerMode} onChange={set('registerMode')}>
                <option value="link">Link — opens in a new tab</option>
                <option value="embed">Popup — embedded booking form</option>
              </Select>
            </Field>

            {form.registerMode === 'embed' ? (
              <Field
                label="Embed code"
                className="lg:col-span-2"
                hint="Paste the provider's snippet, e.g. the ClickMeeting <script> tag. It runs inside the popup."
              >
                <Textarea
                  rows={4}
                  value={form.embedCode}
                  onChange={set('embedCode')}
                  placeholder='<script type="text/javascript" src="https://embed.clickmeeting.com/embed_conference.html?r=…"></script>'
                  className="font-mono text-[12px]"
                />
              </Field>
            ) : (
              <Field
                label="Register link"
                hint="A site path like /community, or a full URL to open in a new tab."
              >
                <Input value={form.registerUrl} onChange={set('registerUrl')} />
              </Field>
            )}

            <Field label="Banner image" className="lg:col-span-2">
              <Input
                value={form.image}
                onChange={set('image')}
                placeholder="/events/financial-habits.jpg or https://…"
              />
            </Field>

            <div className="flex flex-wrap items-center gap-3 lg:col-span-2">
              <Btn
                variant="ghost"
                type="button"
                disabled={progress > 0}
                onClick={() => fileInput.current?.click()}
              >
                {progress > 0 ? `Uploading ${progress}%` : 'Upload banner'}
              </Btn>
              {form.image && (
                <img
                  src={form.image}
                  alt=""
                  className="h-16 w-auto rounded-lg object-contain"
                />
              )}
              <label className="ml-auto flex items-center gap-2 text-[13px] text-forest-deep/70">
                <input
                  type="checkbox"
                  checked={form.hidden}
                  onChange={set('hidden')}
                  className="size-4 accent-current"
                />
                Hidden from the site
              </label>
            </div>

            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              onChange={onBanner}
              className="hidden"
            />

            <div className="flex gap-2 lg:col-span-2">
              <Btn type="submit" disabled={busy}>
                {busy ? 'Saving…' : editing === 'new' ? 'Create event' : 'Save changes'}
              </Btn>
              <Btn variant="ghost" type="button" onClick={() => setEditing(null)}>
                Cancel
              </Btn>
            </div>
          </form>
        </Card>
      )}

      {events.length === 0 ? (
        <EmptyState
          title="No events yet"
          body="Add one and it appears in the Upcoming Events section and the sticky banner."
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <Btn variant="gold" onClick={startNew}>
                New event
              </Btn>
              {isFirebaseConfigured && (
                <Btn variant="ghost" onClick={onSeed}>
                  Import the 3 bundled events
                </Btn>
              )}
            </div>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => {
            const status = statusOf(event, now)
            return (
              <Card key={event.id} className="flex flex-col !p-0">
                {event.image || event.publicImage ? (
                  <img
                    src={event.image || event.publicImage}
                    alt=""
                    className="aspect-[2/1] w-full rounded-t-2xl bg-cream object-contain"
                  />
                ) : (
                  <div className="grid aspect-[2/1] w-full place-items-center rounded-t-2xl bg-cream text-forest-deep/30">
                    <IconCalendar className="size-8" />
                  </div>
                )}

                <div className="flex grow flex-col p-5">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${STATUS_TONES[status]}`}
                    >
                      {status}
                    </span>
                    <span className="text-[11.5px] text-forest-deep/55">
                      {event.badge}
                    </span>
                    {event.hidden && (
                      <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
                        Hidden
                      </span>
                    )}
                  </div>

                  <h3 className="line-clamp-2 text-[15px] font-bold text-forest-deep">
                    {event.title}
                  </h3>

                  <p className="mt-1.5 text-[12.5px] text-forest-deep/60">
                    {formatEventDate(event.startsAt)} ·{' '}
                    {formatEventTime(event.startsAt)} {EVENT_TZ_LABEL}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2 pt-1">
                    <Btn variant="ghost" onClick={() => startEdit(event)}>
                      Edit
                    </Btn>
                    <Btn variant="ghost" onClick={() => onDuplicate(event)}>
                      Duplicate
                    </Btn>
                    <button
                      type="button"
                      onClick={() => onDelete(event)}
                      aria-label={`Delete ${event.title}`}
                      className="ml-auto grid size-9 place-items-center rounded-xl border border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <IconTrash className="size-4" />
                    </button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
