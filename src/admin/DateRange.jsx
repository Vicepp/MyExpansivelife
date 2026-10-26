import { useMemo, useState } from 'react'
import { Input, Select } from './ui'
import { dayKey } from '../lib/track'

/**
 * Date range for the analytics pages: quick presets plus a custom From/To.
 *
 *   const range = useDateRange()        // { from, to, label, … }
 *   <DateRangePicker range={range} />
 *
 * `from` is the start of its day and `to` the end of its day, both local time.
 */

const PRESETS = [
  { value: 'today', label: 'Today' },
  { value: '7', label: 'Last 7 days' },
  { value: '30', label: 'Last 30 days' },
  { value: '90', label: 'Last 90 days' },
  { value: 'month', label: 'This month' },
  { value: 'lastMonth', label: 'Last month' },
  { value: 'year', label: 'This year' },
  { value: 'custom', label: 'Custom range…' },
]

function startOfDay(d) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

function endOfDay(d) {
  const x = new Date(d)
  x.setHours(23, 59, 59, 999)
  return x
}

/** "2026-10-26" from a date input → local midnight (not UTC). */
function fromInput(value) {
  const [y, m, d] = String(value).split('-').map(Number)
  return y ? new Date(y, m - 1, d) : null
}

function presetBounds(preset, now = new Date()) {
  const today = startOfDay(now)
  switch (preset) {
    case 'today':
      return [today, now]
    case 'month':
      return [new Date(now.getFullYear(), now.getMonth(), 1), now]
    case 'lastMonth':
      return [
        new Date(now.getFullYear(), now.getMonth() - 1, 1),
        endOfDay(new Date(now.getFullYear(), now.getMonth(), 0)),
      ]
    case 'year':
      return [new Date(now.getFullYear(), 0, 1), now]
    default: {
      const from = new Date(today)
      from.setDate(from.getDate() - (Number(preset) - 1))
      return [from, now]
    }
  }
}

export function useDateRange(initial = '30') {
  const [preset, setPreset] = useState(initial)
  const [customFrom, setCustomFrom] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() - 29)
    return dayKey(d)
  })
  const [customTo, setCustomTo] = useState(() => dayKey(new Date()))

  const { from, to } = useMemo(() => {
    if (preset === 'custom') {
      const a = fromInput(customFrom) ?? new Date()
      const b = fromInput(customTo) ?? new Date()
      // Tolerate a reversed pair rather than showing an empty chart.
      const [lo, hi] = a <= b ? [a, b] : [b, a]
      return { from: startOfDay(lo), to: endOfDay(hi) }
    }
    const [a, b] = presetBounds(preset)
    return { from: startOfDay(a), to: b }
  }, [preset, customFrom, customTo])

  return {
    preset,
    setPreset,
    customFrom,
    setCustomFrom,
    customTo,
    setCustomTo,
    from,
    to,
    /** A stable string that changes whenever the window does (for effects). */
    key: `${dayKey(from)}_${dayKey(to)}`,
  }
}

export function DateRangePicker({ range }) {
  const today = dayKey(new Date())
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <div className="w-[170px]">
        <Select
          value={range.preset}
          onChange={(e) => range.setPreset(e.target.value)}
          aria-label="Date range"
        >
          {PRESETS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </Select>
      </div>
      {range.preset === 'custom' && (
        <div className="flex items-center gap-2">
          <Input
            type="date"
            aria-label="From"
            value={range.customFrom}
            max={range.customTo || today}
            onChange={(e) => range.setCustomFrom(e.target.value)}
            className="w-[150px]"
          />
          <span className="text-[13px] text-forest-deep/50">to</span>
          <Input
            type="date"
            aria-label="To"
            value={range.customTo}
            min={range.customFrom}
            max={today}
            onChange={(e) => range.setCustomTo(e.target.value)}
            className="w-[150px]"
          />
        </div>
      )}
    </div>
  )
}
