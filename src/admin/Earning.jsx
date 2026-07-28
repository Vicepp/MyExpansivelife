import { useEffect, useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, PageHead, SetupNotice, Spinner, StatCard } from './ui'
import { IconMoney, IconEye, IconChart, IconDoc } from './icons'
import { isFirebaseConfigured } from '../lib/firebase'
import { compact, formatDate, listPosts, summarise } from '../lib/posts'

/** Illustrative rate until real billing data is connected. */
const RATE_PER_VIEW = 0.012
const COMMISSION = 0.2
const COURSE_PRICE = 297

const axis = { stroke: '#232b4a', fontSize: 12, tickLine: false, axisLine: false }
const tooltipStyle = {
  borderRadius: 12,
  border: '1px solid rgb(35 43 74 / 0.12)',
  fontSize: 13,
}

export default function Earning() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listPosts()
      .then(setPosts)
      .catch(() => setPosts([]))
      .finally(() => setLoading(false))
  }, [])

  const stats = useMemo(() => summarise(posts), [posts])

  const monthly = useMemo(() => {
    const map = new Map()
    for (const post of posts) {
      const date = post.publishedAt ?? post.createdAt
      if (!date) continue
      const key = new Intl.DateTimeFormat('en-GB', {
        month: 'short',
        year: '2-digit',
      }).format(date)
      map.set(key, (map.get(key) ?? 0) + (post.views || 0) * RATE_PER_VIEW)
    }
    return [...map.entries()]
      .map(([label, amount]) => ({ label, amount: Number(amount.toFixed(2)) }))
      .slice(-8)
  }, [posts])

  const ledger = useMemo(
    () =>
      [...posts]
        .filter((p) => p.status === 'published')
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 8)
        .map((p) => ({
          ...p,
          amount: (p.views || 0) * RATE_PER_VIEW,
        })),
    [posts],
  )

  if (loading) return <Spinner label="Adding it up…" />

  const total = stats.views * RATE_PER_VIEW
  const referrals = Math.max(1, Math.round(stats.likes / 400))
  const affiliate = referrals * COURSE_PRICE * COMMISSION

  return (
    <div>
      <PageHead title="Earning" subtitle="Revenue from articles and affiliate referrals" />

      {!isFirebaseConfigured && <SetupNotice what="These figures" />}

      <div className="mb-5 rounded-2xl border border-navy/10 bg-white px-5 py-4 text-[13px] text-navy/65">
        Article revenue is modelled at{' '}
        <strong className="text-navy">${RATE_PER_VIEW.toFixed(3)} per view</strong> and
        affiliate income at <strong className="text-navy">{COMMISSION * 100}%</strong> of a
        ${COURSE_PRICE} course. Swap these for real numbers once a payment provider is
        connected — they live at the top of{' '}
        <code className="rounded bg-admin-bg px-1.5 py-0.5">src/admin/Earning.jsx</code>.
      </div>

      <div className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          tone="mint"
          icon={<IconMoney />}
          value={`$${total.toFixed(2)}`}
          label="Article revenue"
        />
        <StatCard
          tone="lilac"
          icon={<IconChart />}
          value={`$${affiliate.toFixed(2)}`}
          label="Affiliate commission"
        />
        <StatCard
          tone="blush"
          icon={<IconEye />}
          value={compact(stats.views)}
          label="Billable views"
        />
        <StatCard
          tone="sun"
          icon={<IconDoc />}
          value={stats.published}
          label="Earning articles"
        />
      </div>

      <Card className="mb-5">
        <h2 className="mb-5 text-[16px] font-bold text-navy">Revenue by month</h2>
        {monthly.length === 0 ? (
          <p className="py-10 text-center text-[14px] text-navy/50">
            No published articles yet.
          </p>
        ) : (
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthly} margin={{ left: -16, right: 8, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(35 43 74 / 0.08)" vertical={false} />
                <XAxis dataKey="label" {...axis} />
                <YAxis {...axis} width={56} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  cursor={{ fill: 'rgb(35 43 74 / 0.04)' }}
                  formatter={(v) => [`$${v}`, 'Revenue']}
                />
                <Bar dataKey="amount" fill="#232b4a" radius={[8, 8, 0, 0]} maxBarSize={44} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      <Card className="overflow-x-auto p-0">
        <div className="px-5 pt-5">
          <h2 className="text-[16px] font-bold text-navy">Earning by article</h2>
        </div>
        {ledger.length === 0 ? (
          <p className="px-5 py-10 text-center text-[14px] text-navy/50">
            Publish an article to start earning.
          </p>
        ) : (
          <table className="mt-4 w-full min-w-[600px] text-left">
            <thead>
              <tr className="border-b border-navy/10 text-[12px] uppercase tracking-wide text-navy/50">
                <th className="px-5 py-3.5 font-semibold">Article</th>
                <th className="px-4 py-3.5 font-semibold">Published</th>
                <th className="px-4 py-3.5 font-semibold">Views</th>
                <th className="px-5 py-3.5 text-right font-semibold">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {ledger.map((row) => (
                <tr key={row.id} className="border-b border-navy/5 last:border-0">
                  <td className="max-w-[320px] px-5 py-3.5">
                    <span className="line-clamp-1 text-[13.5px] font-semibold text-navy">
                      {row.title}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-[13px] text-navy/65">
                    {formatDate(row.publishedAt ?? row.createdAt)}
                  </td>
                  <td className="px-4 py-3.5 text-[13px] text-navy/65">
                    {compact(row.views)}
                  </td>
                  <td className="px-5 py-3.5 text-right text-[13.5px] font-bold text-navy">
                    ${row.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  )
}
