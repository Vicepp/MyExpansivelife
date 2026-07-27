/**
 * Event times are authored as Central wall-clock time.
 *
 * The banners label everything "CST". Central actually switches to CDT between
 * March and November, so a literal UTC-6 reading would place a July event an
 * hour late. We resolve against the IANA zone (which handles the switch) and
 * keep the brand's "CST" wording in the UI — see EVENT_TZ_LABEL.
 */
export const EVENT_TZ = 'America/Chicago'
export const EVENT_TZ_LABEL = 'CST'

function tzOffsetMs(date, timeZone) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(date)

  const v = {}
  for (const part of parts) {
    if (part.type !== 'literal') v[part.type] = Number(part.value)
  }

  const asUTC = Date.UTC(
    v.year,
    v.month - 1,
    v.day,
    v.hour % 24, // some engines report hour 24 for midnight
    v.minute,
    v.second,
  )

  return asUTC - date.getTime()
}

/** Converts a wall-clock ISO string in `timeZone` to a real UTC timestamp. */
export function zonedToUtc(localIso, timeZone = EVENT_TZ) {
  const guess = Date.parse(`${localIso}Z`)
  // Two passes so times near a DST boundary settle on the right offset.
  let ts = guess - tzOffsetMs(new Date(guess), timeZone)
  ts = guess - tzOffsetMs(new Date(ts), timeZone)
  return ts
}

export function formatEventDate(ts, timeZone = EVENT_TZ) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(ts)
}

export function formatEventTime(ts, timeZone = EVENT_TZ) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: 'numeric',
    minute: '2-digit',
  }).format(ts)
}

/** Breaks a millisecond span into padded day/hour/minute/second parts. */
export function breakdown(ms) {
  const total = Math.max(0, Math.floor(ms / 1000))
  return {
    days: String(Math.floor(total / 86400)).padStart(2, '0'),
    hours: String(Math.floor((total % 86400) / 3600)).padStart(2, '0'),
    minutes: String(Math.floor((total % 3600) / 60)).padStart(2, '0'),
    seconds: String(total % 60).padStart(2, '0'),
  }
}
