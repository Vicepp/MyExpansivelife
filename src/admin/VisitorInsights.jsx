import { useMemo } from 'react'
import { Card } from './ui'
import { WORLD_LAND_PATH } from './worldLand'
import { cityCoordinates, mergeMaps, splitCityKey } from '../lib/track'

/**
 * Where visitors come from and what they use, for the selected date range.
 * Counted once per browser session (see src/lib/track.js); city-level only,
 * no IP addresses. Recording started in October 2026, so earlier ranges are
 * empty.
 */

const regionNames = (() => {
  try {
    return new Intl.DisplayNames(['en'], { type: 'region' })
  } catch {
    return null
  }
})()

function countryName(code) {
  try {
    return regionNames?.of(code) ?? code
  } catch {
    return code
  }
}

/** Two-letter country code → flag emoji. */
function flag(code) {
  return /^[A-Z]{2}$/.test(code)
    ? String.fromCodePoint(...[...code].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65))
    : '🌐'
}

function percent(n, total) {
  return total ? Math.round((n / total) * 100) : 0
}

function Bar({ label, count, total, lead }) {
  return (
    <li className="flex items-center gap-3 text-[13.5px]">
      {lead && <span className="w-6 shrink-0 text-center">{lead}</span>}
      <span className="w-[42%] min-w-0 truncate text-forest-deep">{label}</span>
      <span className="relative h-2 flex-1 overflow-hidden rounded-full bg-forest-deep/8">
        <span
          className="absolute inset-y-0 left-0 rounded-full bg-gold"
          style={{ width: `${percent(count, total)}%` }}
        />
      </span>
      <span className="w-14 shrink-0 text-right tabular-nums text-forest-deep/70">
        {count} · {percent(count, total)}%
      </span>
    </li>
  )
}

function project(lat, lon) {
  return [((lon + 180) / 360) * 1000, ((90 - lat) / 180) * 500]
}

function WorldMap({ points }) {
  const max = Math.max(1, ...points.map((p) => p.count))
  return (
    <svg
      viewBox="0 0 1000 500"
      className="h-auto w-full overflow-hidden rounded-xl bg-cream"
      role="img"
      aria-label="Map of visitor locations"
    >
      <path d={WORLD_LAND_PATH} className="fill-sage/35" />
      {points
        .slice()
        .sort((a, b) => b.count - a.count)
        .map((p) => {
          const [x, y] = project(p.lat, p.lon)
          const r = 4 + 14 * Math.sqrt(p.count / max)
          return (
            <circle key={p.key} cx={x} cy={y} r={r} className="fill-brown/70 stroke-white" strokeWidth="1.5">
              <title>{`${p.city}, ${countryName(p.country)} — ${p.count} visit${p.count === 1 ? '' : 's'}`}</title>
            </circle>
          )
        })}
    </svg>
  )
}

const DEVICE_LABELS = { desktop: 'Desktop', mobile: 'Mobile', tablet: 'Tablet' }

export default function VisitorInsights({ rows }) {
  const data = useMemo(() => {
    const visits = rows.reduce((s, r) => s + (Number(r.visits) || 0), 0)
    const countries = mergeMaps(rows, 'countries')
    const cities = mergeMaps(rows, 'cities')
    const coords = cityCoordinates(rows)
    const points = cities
      .filter((c) => coords.has(c.key))
      .map((c) => {
        const [lat, lon] = coords.get(c.key)
        return { ...c, ...splitCityKey(c.key), lat, lon }
      })
    const devices = mergeMaps(rows, 'devices')
    return { visits, countries, cities, points, devices }
  }, [rows])

  const countryTotal = data.countries.reduce((s, c) => s + c.count, 0)
  const cityTotal = data.cities.reduce((s, c) => s + c.count, 0)
  const deviceTotal = data.devices.reduce((s, d) => s + d.count, 0)

  if (!data.visits && !deviceTotal) {
    return (
      <Card>
        <h2 className="text-[16px] font-bold text-forest-deep">Where visitors come from</h2>
        <p className="mt-2 text-[13.5px] leading-relaxed text-forest-deep/60">
          No location or device data in this range yet. Visitor location (city and country)
          and device type are recorded from late October 2026 onwards, once per visit — choose
          a recent range to see them.
        </p>
      </Card>
    )
  }

  return (
    <div className="grid gap-5">
      <Card>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-[16px] font-bold text-forest-deep">Where visitors come from</h2>
          <p className="text-[12.5px] text-forest-deep/55">
            {data.visits} visit{data.visits === 1 ? '' : 's'} · {data.countries.length}{' '}
            countr{data.countries.length === 1 ? 'y' : 'ies'} · hover a dot for details
          </p>
        </div>
        <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <WorldMap points={data.points} />
          <div>
            <h3 className="text-[12px] font-semibold uppercase tracking-wide text-forest-deep/50">
              Top countries
            </h3>
            <ul className="mt-3 space-y-2.5">
              {data.countries.slice(0, 8).map((c) => (
                <Bar
                  key={c.key}
                  lead={flag(c.key)}
                  label={countryName(c.key)}
                  count={c.count}
                  total={countryTotal}
                />
              ))}
            </ul>
          </div>
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <h2 className="text-[16px] font-bold text-forest-deep">Top cities</h2>
          <ul className="mt-4 space-y-2.5">
            {data.cities.slice(0, 10).map((c) => {
              const { city, country } = splitCityKey(c.key)
              return (
                <Bar
                  key={c.key}
                  lead={flag(country)}
                  label={city}
                  count={c.count}
                  total={cityTotal}
                />
              )
            })}
            {!data.cities.length && (
              <li className="text-[13px] text-forest-deep/55">No city data in this range.</li>
            )}
          </ul>
        </Card>

        <Card>
          <h2 className="text-[16px] font-bold text-forest-deep">Devices</h2>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {['desktop', 'mobile', 'tablet'].map((key) => {
              const count = data.devices.find((d) => d.key === key)?.count ?? 0
              return (
                <div key={key} className="rounded-xl bg-cream px-4 py-4 text-center">
                  <p className="text-[24px] font-bold leading-none text-forest-deep">
                    {percent(count, deviceTotal)}%
                  </p>
                  <p className="mt-1.5 text-[12.5px] text-forest-deep/60">
                    {DEVICE_LABELS[key]} · {count}
                  </p>
                </div>
              )
            })}
          </div>
          <div className="mt-5 flex h-3 overflow-hidden rounded-full bg-forest-deep/8">
            <span className="bg-forest-deep" style={{ width: `${percent(data.devices.find((d) => d.key === 'desktop')?.count ?? 0, deviceTotal)}%` }} />
            <span className="bg-gold" style={{ width: `${percent(data.devices.find((d) => d.key === 'mobile')?.count ?? 0, deviceTotal)}%` }} />
            <span className="bg-sage" style={{ width: `${percent(data.devices.find((d) => d.key === 'tablet')?.count ?? 0, deviceTotal)}%` }} />
          </div>
          <p className="mt-2 text-[12px] text-forest-deep/50">Desktop · Mobile · Tablet, per visit</p>
        </Card>
      </div>
    </div>
  )
}
