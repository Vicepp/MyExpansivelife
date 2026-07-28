import { useEffect, useMemo, useState } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, PageHead, Select, SetupNotice, Spinner, StatCard } from './ui'
import { IconEye, IconPen, IconChart, IconMoney } from './icons'
import { isFirebaseConfigured } from '../lib/firebase'
import { listEvents } from '../lib/events'
import {
  dayKey,
  fillDays,
  listAnalytics,
  mergeMaps,
  prettyPath,
} from '../lib/track'

const axis = { stroke: '#183734', fontSize: 12, tickLine: false, axisLine: false }
const grid = 'rgb(24 55 52 / 0.08)'
const tooltipStyle = {
  borderRadius: 12,
  border: '1px solid rgb(24 55 52 / 0.12)',
  fontSize: 13,
}

const RANGES = [
  { value: '7', label: 'Last 7 days' },
  { value: '30', label: 'Last 30 days' },
  { value: '90', label: 'Last 90 days' },
]

function Panel({ title, hint, children }) {
  return (
    <Card>
      <h2 className="text-[16px] font-bold text-forest-deep">{title}</h2>
      {hint && <p className="mt-1 text-[12.5px] text-forest-deep/55">{hint}</p>}
      <div className="mt-5">{children}</div>
    </Card>
  )
}

/** Simple ranked bar list — clearer than a chart for a handful of labels. */
function Bars({ rows, labeller = (k) => k, empty }) {
  if (rows.length === 0) {
    return <p className="py-10 text-center text-[13.5px] text-forest-deep/50">{empty}</p>
  }
  const top = Math.max(...rows.map((r) => r.count))
  return (
    <ul className="space-y-3">
      {rows.slice(0, 8).map((row) => (
        <li key={row.key}>
          <div className="flex items-baseline justify-between gap-3">
            <span className="truncate text-[13px] text-forest-deep/80">
              {labeller(row.key)}
            </span>
            <span className="shrink-0 text-[13px] font-bold text-forest-deep">
              {row.count.toLocaleString()}
            </span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-forest-deep/10">
            <div
              className="h-full rounded-full bg-gold"
              style={{ width: `${Math.max(3, (row.count / top) * 100)}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}

export default function PageAnalytics() {
  const [rows, setRows] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [range, setRange] = useState('30')
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    const to = new Date()
    const from = new Date()
    from.setDate(to.getDate() - (Number(range) - 1))

    Promise.all([listAnalytics(dayKey(from), dayKey(to)), listEvents()])
      .then(([analytics, eventRows]) => {
        setRows(analytics)
        setEvents(eventRows)
        setError('')
      })
      .catch((e) => setError(e.message ?? 'Could not load analytics.'))
      .finally(() => setLoading(false))
  }, [range])

  const series = useMemo(() => {
    const to = new Date()
    const from = new Date()
    from.setDate(to.getDate() - (Number(range) - 1))
    return fillDays(rows, from, to)
  }, [rows, range])

  const totals = useMemo(
    () => ({
      views: series.reduce((s, d) => s + d.views, 0),
      registers: series.reduce((s, d) => s + d.registers, 0),
      popups: series.reduce((s, d) => s + d.popups, 0),
      ctas: series.reduce((s, d) => s + d.ctas, 0),
    }),
    [series],
  )

  const pages = useMemo(() => mergeMaps(rows, 'pages'), [rows])
  const ctas = useMemo(() => mergeMaps(rows, 'ctas'), [rows])

  const eventLeads = useMemo(() => {
    const clicks = new Map(mergeMaps(rows, 'eventClicks').map((r) => [r.key, r.count]))
    const popups = new Map(mergeMaps(rows, 'eventPopups').map((r) => [r.key, r.count]))
    const ids = new Set([...clicks.keys(), ...popups.keys()])

    return [...ids]
      .map((id) => ({
        id,
        title: events.find((e) => e.id === id)?.title ?? id,
        clicks: clicks.get(id) ?? 0,
        popups: popups.get(id) ?? 0,
      }))
      .sort((a, b) => b.clicks - a.clicks)
  }, [rows, events])

  if (loading) return <Spinner label="Crunching numbers…" />

  const conversion = totals.views
    ? ((totals.registers / totals.views) * 100).toFixed(1)
    : '0.0'

  const hasData = totals.views + totals.registers + totals.ctas > 0

  return (
    <div>
      <PageHead
        title="Page analytics"
        subtitle="Traffic, calls to action and event leads"
        action={
          <div className="w-[170px]">
            <Select value={range} onChange={(e) => setRange(e.target.value)}>
              {RANGES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </Select>
          </div>
        }
      />

      {!isFirebaseConfigured && <SetupNotice what="Page analytics" />}

      {error && (
        <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-[13.5px] text-red-700">
          {error}
        </p>
      )}

      {isFirebaseConfigured && !hasData && (
        <p className="mb-5 rounded-2xl border border-gold/30 bg-cream-card px-5 py-4 text-[13.5px] text-forest-deep/75">
          No activity recorded in this range yet. Numbers appear as soon as visitors
          browse the site — page views, button presses and event registrations are
          all counted automatically.
        </p>
      )}

      <div className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          tone="sage"
          icon={<IconEye />}
          value={totals.views.toLocaleString()}
          label="Page views"
        />
        <StatCard
          tone="gold"
          icon={<IconMoney />}
          value={totals.registers.toLocaleString()}
          label="Register clicks (leads)"
        />
        <StatCard
          tone="brown"
          icon={<IconPen />}
          value={totals.popups.toLocaleString()}
          label="Booking popups opened"
        />
        <StatCard
          tone="sand"
          icon={<IconChart />}
          value={`${conversion}%`}
          label="Views that clicked register"
        />
      </div>

      <Card className="mb-5">
        <h2 className="text-[16px] font-bold text-forest-deep">Activity over time</h2>
        <p className="mt-1 text-[12.5px] text-forest-deep/55">
          Every day in the range, including quiet ones.
        </p>
        <div className="mt-5 h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series} margin={{ left: -18, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="vFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#183734" stopOpacity={0.32} />
                  <stop offset="100%" stopColor="#183734" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="rFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#b3803f" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#b3803f" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
              <XAxis dataKey="label" {...axis} minTickGap={22} />
              <YAxis {...axis} width={54} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
              <Area
                type="monotone"
                dataKey="views"
                name="Page views"
                stroke="#183734"
                strokeWidth={2}
                fill="url(#vFill)"
              />
              <Area
                type="monotone"
                dataKey="registers"
                name="Register clicks"
                stroke="#b3803f"
                strokeWidth={2}
                fill="url(#rFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="mb-5 grid gap-5 lg:grid-cols-2">
        <Panel title="Most visited pages" hint="Across the selected range.">
          <Bars rows={pages} labeller={prettyPath} empty="No page views yet." />
        </Panel>

        <Panel
          title="Button clicks"
          hint="Every tracked call to action on the public site."
        >
          <Bars
            rows={ctas}
            labeller={(k) => k.replace(/_/g, ' ')}
            empty="No button clicks recorded yet."
          />
        </Panel>
      </div>

      <Card>
        <h2 className="text-[16px] font-bold text-forest-deep">Event leads</h2>
        <p className="mt-1 text-[12.5px] text-forest-deep/55">
          How many people pressed Register for each event, and how many reached the
          booking popup.
        </p>

        {eventLeads.length === 0 ? (
          <p className="py-10 text-center text-[13.5px] text-forest-deep/50">
            No event registrations recorded in this range.
          </p>
        ) : (
          <>
            <div className="mt-5 h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={eventLeads.map((e) => ({
                    name: e.title.length > 22 ? `${e.title.slice(0, 22)}…` : e.title,
                    clicks: e.clicks,
                    popups: e.popups,
                  }))}
                  margin={{ left: -18, right: 8, top: 8, bottom: 18 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
                  <XAxis dataKey="name" {...axis} interval={0} height={60} />
                  <YAxis {...axis} width={54} allowDecimals={false} />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    cursor={{ fill: 'rgb(24 55 52 / 0.04)' }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar
                    dataKey="clicks"
                    name="Register clicks"
                    fill="#183734"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={38}
                  />
                  <Bar
                    dataKey="popups"
                    name="Popups opened"
                    fill="#b3803f"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={38}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[520px] text-left">
                <thead>
                  <tr className="border-b border-forest-deep/10 text-[12px] uppercase tracking-wide text-forest-deep/50">
                    <th className="py-3 font-semibold">Event</th>
                    <th className="py-3 font-semibold">Register clicks</th>
                    <th className="py-3 font-semibold">Popups opened</th>
                  </tr>
                </thead>
                <tbody>
                  {eventLeads.map((e) => (
                    <tr
                      key={e.id}
                      className="border-b border-forest-deep/5 last:border-0"
                    >
                      <td className="max-w-[320px] py-3 pr-4">
                        <span className="line-clamp-1 text-[13.5px] font-semibold text-forest-deep">
                          {e.title}
                        </span>
                      </td>
                      <td className="py-3 text-[13.5px] font-bold text-forest-deep">
                        {e.clicks.toLocaleString()}
                      </td>
                      <td className="py-3 text-[13.5px] text-forest-deep/70">
                        {e.popups.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}
