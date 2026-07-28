import { useEffect, useMemo, useState } from 'react'
import { Btn, Card, EmptyState, PageHead, SetupNotice, Spinner, Input } from './ui'
import { IconTrash } from './icons'
import { isFirebaseConfigured } from '../lib/firebase'
import {
  deleteMessage,
  listMessages,
  markRead,
} from '../lib/messages'
import { formatDate } from '../lib/posts'

export default function Inbox() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeId, setActiveId] = useState(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    listMessages()
      .then((rows) => {
        setMessages(rows)
        setActiveId(rows[0]?.id ?? null)
      })
      .catch(() => setMessages([]))
      .finally(() => setLoading(false))
  }, [])

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase()
    return messages.filter(
      (m) =>
        (filter === 'all' || (filter === 'unread' ? !m.read : m.read)) &&
        (!term ||
          m.name?.toLowerCase().includes(term) ||
          m.email?.toLowerCase().includes(term) ||
          m.body?.toLowerCase().includes(term)),
    )
  }, [messages, search, filter])

  const active = messages.find((m) => m.id === activeId) ?? null
  const unread = messages.filter((m) => !m.read).length

  const open = async (message) => {
    setActiveId(message.id)
    if (!message.read) {
      setMessages((list) =>
        list.map((m) => (m.id === message.id ? { ...m, read: true } : m)),
      )
      await markRead(message.id, true).catch(() => {})
    }
  }

  const remove = async (message) => {
    if (!window.confirm(`Delete the message from ${message.name}?`)) return
    setMessages((list) => list.filter((m) => m.id !== message.id))
    if (activeId === message.id) setActiveId(null)
    await deleteMessage(message.id).catch(() => {})
  }

  if (loading) return <Spinner label="Loading messages…" />

  return (
    <div>
      <PageHead
        title="Inbox"
        subtitle={`${unread} unread of ${messages.length} message${messages.length === 1 ? '' : 's'}`}
      />

      {!isFirebaseConfigured && <SetupNotice what="These messages" />}

      {messages.length === 0 ? (
        <EmptyState
          title="No messages yet"
          body="Affiliate applications submitted on the public site arrive here."
        />
      ) : (
        <div className="grid gap-5 lg:grid-cols-[340px_minmax(0,1fr)]">
          <Card className="!p-0">
            <div className="space-y-3 border-b border-forest-deep/10 p-4">
              <Input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search messages…"
              />
              <div className="flex gap-1.5">
                {['all', 'unread', 'read'].map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setFilter(key)}
                    className={`rounded-lg px-3 py-1.5 text-[12.5px] font-semibold capitalize transition-colors ${
                      filter === key
                        ? 'bg-forest-deep text-white'
                        : 'text-forest-deep/60 hover:bg-forest-deep/5'
                    }`}
                  >
                    {key}
                  </button>
                ))}
              </div>
            </div>

            <ul className="max-h-[560px] overflow-y-auto">
              {rows.length === 0 ? (
                <li className="px-4 py-10 text-center text-[13.5px] text-forest-deep/50">
                  Nothing matches that filter.
                </li>
              ) : (
                rows.map((m) => (
                  <li key={m.id}>
                    <button
                      type="button"
                      onClick={() => open(m)}
                      className={`flex w-full gap-3 border-b border-forest-deep/5 px-4 py-3.5 text-left transition-colors last:border-0 ${
                        activeId === m.id ? 'bg-cream' : 'hover:bg-cream'
                      }`}
                    >
                      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gold-tint text-[13px] font-bold text-forest-deep">
                        {m.name.slice(0, 1)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span
                            className={`truncate text-[13.5px] ${m.read ? 'font-medium text-forest-deep/75' : 'font-bold text-forest-deep'}`}
                          >
                            {m.name}
                          </span>
                          {!m.read && (
                            <span className="size-2 shrink-0 rounded-full bg-gold" />
                          )}
                        </span>
                        <span className="mt-0.5 line-clamp-2 block text-[12.5px] text-forest-deep/50">
                          {m.body}
                        </span>
                      </span>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </Card>

          {active ? (
            <Card>
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-forest-deep/10 pb-5">
                <div>
                  <h2 className="text-[19px] font-bold text-forest-deep">{active.subject}</h2>
                  <p className="mt-1 text-[13.5px] text-forest-deep/60">
                    {active.name} ·{' '}
                    <a
                      href={`mailto:${active.email}`}
                      className="underline hover:text-forest-deep"
                    >
                      {active.email}
                    </a>
                  </p>
                  {active.phone && (
                    <p className="text-[13.5px] text-forest-deep/60">{active.phone}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-[12.5px] text-forest-deep/50">
                    {formatDate(active.createdAt)}
                  </p>
                  <p className="mt-1 text-[12px] text-forest-deep/40">{active.source}</p>
                </div>
              </div>

              <p className="whitespace-pre-line py-6 text-[14.5px] leading-relaxed text-forest-deep/85">
                {active.body}
              </p>

              <div className="flex flex-wrap gap-2 border-t border-forest-deep/10 pt-5">
                <Btn
                  as="a"
                  href={`mailto:${active.email}?subject=Re: ${encodeURIComponent(active.subject)}`}
                >
                  Reply by email
                </Btn>
                <Btn
                  variant="ghost"
                  onClick={() => {
                    setMessages((list) =>
                      list.map((m) =>
                        m.id === active.id ? { ...m, read: !m.read } : m,
                      ),
                    )
                    markRead(active.id, !active.read).catch(() => {})
                  }}
                >
                  Mark as {active.read ? 'unread' : 'read'}
                </Btn>
                <Btn variant="danger" className="ml-auto" onClick={() => remove(active)}>
                  <IconTrash className="size-4" />
                  Delete
                </Btn>
              </div>
            </Card>
          ) : (
            <EmptyState
              title="No message selected"
              body="Choose a message from the list to read it."
            />
          )}
        </div>
      )}
    </div>
  )
}
