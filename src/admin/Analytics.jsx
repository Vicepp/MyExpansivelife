import { useEffect, useMemo, useState } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, PageHead, SetupNotice, Spinner, StatCard, Select } from './ui'
import { IconEye, IconHeart, IconDoc, IconChart } from './icons'
import { isFirebaseConfigured } from '../lib/firebase'
import { compact, listPosts, summarise } from '../lib/posts'

const SERIES_COLOURS = ['#183734', '#b3803f', '#87492c', '#7d886e', '#40b487', '#712806']

const axis = { stroke: '#183734', fontSize: 12, tickLine: false, axisLine: false }

const tooltipStyle = {
  borderRadius: 12,
  border: '1px solid rgb(24 55 52 / 0.12)',
  fontSize: 13,
  boxShadow: '0 10px 30px -12px rgb(24 55 52 / 0.3)',
}

export default function Analytics() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [range, setRange] = useState('30')

  useEffect(() => {
    listPosts()
      .then(setPosts)
      .catch(() => setPosts([]))
      .finally(() => setLoading(false))
  }, [])

  const stats = useMemo(() => summarise(posts), [posts])

  /** Views per day, spread across the selected window. */
  const trend = useMemo(() => {
    const days = Number(range)
    const out = []
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const inDay = posts.filter((p) => {
        const d = p.publishedAt ?? p.createdAt
        return d && d.toDateString() === date.toDateString()
      })
      out.push({
        label: new Intl.DateTimeFormat('en-GB', {
          day: 'numeric',
          month: 'short',
        }).format(date),
        views: inDay.reduce((s, p) => s + (p.views || 0), 0),
        likes: inDay.reduce((s, p) => s + (p.likes || 0), 0),
      })
    }
    return out
  }, [posts, range])

  const byCategory = useMemo(() => {
    const map = new Map()
    for (const p of posts) {
      map.set(p.category ?? 'Uncategorised', (map.get(p.category) ?? 0) + (p.views || 0))
    }
    return [...map.entries()]
      .map(([name, value]) => ({ name, value }))
      .filter((d) => d.value > 0)
      .sort((a, b) => b.value - a.value)
  }, [posts])

  const topPosts = useMemo(
    () =>
      [...posts]
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 6)
        .map((p) => ({
          name: p.title.length > 26 ? `${p.title.slice(0, 26)}…` : p.title,
          views: p.views || 0,
        })),
    [posts],
  )

  if (loading) return <Spinner label="Crunching numbers…" />

  const engagement = stats.views ? Math.round((stats.likes / stats.views) * 100) : 0

  return (
    <div>
      <PageHead
        title="Analytics"
        subtitle="How your writing is performing"
        action={
          <div className="w-[170px]">
            <Select value={range} onChange={(e) => setRange(e.target.value)}>
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </Select>
          </div>
        }
      />

      {!isFirebaseConfigured && <SetupNotice what="These analytics" />}

      <div className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard tone="sage" icon={<IconEye />} value={compact(stats.views)} label="Total views" />
        <StatCard tone="gold" icon={<IconHeart />} value={compact(stats.likes)} label="Total likes" />
        <StatCard tone="brown" icon={<IconDoc />} value={stats.published} label="Published" />
        <StatCard tone="sand" icon={<IconChart />} value={`${engagement}%`} label="Engagement rate" />
      </div>

      <Card className="mb-5">
        <h2 className="mb-5 text-[16px] font-bold text-forest-deep">Views and likes over time</h2>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend} margin={{ left: -18, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="viewsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#183734" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#183734" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="likesFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#b3803f" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#b3803f" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgb(24 55 52 / 0.08)" vertical={false} />
              <XAxis dataKey="label" {...axis} minTickGap={24} />
              <YAxis {...axis} width={56} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area
                type="monotone"
                dataKey="views"
                stroke="#183734"
                strokeWidth={2}
                fill="url(#viewsFill)"
              />
              <Area
                type="monotone"
                dataKey="likes"
                stroke="#b3803f"
                strokeWidth={2}
                fill="url(#likesFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <h2 className="mb-5 text-[16px] font-bold text-forest-deep">Most read articles</h2>
          {topPosts.length === 0 ? (
            <p className="py-10 text-center text-[14px] text-forest-deep/50">No data yet.</p>
          ) : (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topPosts} layout="vertical" margin={{ left: 12, right: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgb(24 55 52 / 0.08)" horizontal={false} />
                  <XAxis type="number" {...axis} />
                  <YAxis type="category" dataKey="name" {...axis} width={150} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgb(24 55 52 / 0.04)' }} />
                  <Bar dataKey="views" fill="#183734" radius={[0, 8, 8, 0]} barSize={18} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        <Card>
          <h2 className="mb-5 text-[16px] font-bold text-forest-deep">Views by category</h2>
          {byCategory.length === 0 ? (
            <p className="py-10 text-center text-[14px] text-forest-deep/50">No data yet.</p>
          ) : (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={byCategory}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={62}
                    outerRadius={104}
                    paddingAngle={2}
                  >
                    {byCategory.map((entry, i) => (
                      <Cell key={entry.name} fill={SERIES_COLOURS[i % SERIES_COLOURS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
            {byCategory.map((entry, i) => (
              <li key={entry.name} className="flex items-center gap-2 text-[12.5px] text-forest-deep/70">
                <span
                  className="size-2.5 rounded-full"
                  style={{ background: SERIES_COLOURS[i % SERIES_COLOURS.length] }}
                />
                {entry.name}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}
