import { useEffect, useMemo, useState } from 'react'
import { Btn, Card, EmptyState, PageHead, SetupNotice, Spinner, Input } from './ui'
import { IconTrash } from './icons'
import { isFirebaseConfigured } from '../lib/firebase'
import { deleteMessage, listMessages, markRead } from '../lib/messages'
import { asTranscript, deleteChat, listChats, markChatRead } from '../lib/chats'
import { formatDate } from '../lib/posts'

/*
 * One inbox for everything a visitor sends: affiliate applications from the
 * form, and full transcripts of every conversation with the AI assistant.
 *
 * They are different shapes underneath — a message is one block of text, a chat
 * is a back-and-forth — so both are normalised into a common row for the list,
 * and the reading pane renders whichever it is.
 */

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'unread', label: 'Unread' },
  { key: 'chat', label: 'Chats' },
  { key: 'message', label: 'Messages' },
]

/** A chat is unread until opened; a form message carries `read` directly. */
function rowFromChat(chat) {
  const lastVisitorLine = [...(chat.messages ?? [])]
    .reverse()
    .find((m) => m.role === 'user')

  return {
    id: `chat:${chat.id}`,
    ref: chat.id,
    kind: 'chat',
    name: chat.name,
    email: chat.email,
    subject: 'Chat with the assistant',
    preview: lastVisitorLine?.content ?? 'Started a chat but has not asked anything yet.',
    source: `AI chat · ${chat.page || '/'}`,
    date: chat.lastMessageAt ?? chat.startedAt,
    read: !chat.unread,
    chat,
  }
}

function rowFromMessage(message) {
  return {
    id: `message:${message.id}`,
    ref: message.id,
    kind: 'message',
    name: message.name,
    email: message.email,
    phone: message.phone,
    subject: message.subject,
    preview: message.body,
    source: message.source,
    date: message.createdAt,
    read: Boolean(message.read),
    body: message.body,
  }
}

/** The conversation, laid out the way it happened. */
function Transcript({ chat }) {
  if (!chat.messages?.length) {
    return (
      <p className="py-6 text-[14px] text-forest-deep/55">
        This visitor left their details but closed the chat before asking anything.
      </p>
    )
  }

  return (
    <div className="space-y-3 py-6">
      {chat.messages.map((message, i) => (
        <div
          key={i}
          className={message.role === 'user' ? 'flex justify-end' : 'flex justify-start'}
        >
          <div
            className={`max-w-[78%] rounded-2xl px-4 py-3 ${
              message.role === 'user'
                ? 'rounded-br-sm bg-forest-deep text-white'
                : 'rounded-bl-sm bg-cream text-forest-deep'
            }`}
          >
            <p className="mb-1 text-[10.5px] font-bold uppercase tracking-[0.12em] opacity-55">
              {message.role === 'user' ? chat.name : 'Assistant'}
            </p>
            <p className="whitespace-pre-wrap text-[13.5px] leading-relaxed">
              {message.content}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Inbox() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeId, setActiveId] = useState(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Both sources load together; one failing must not blank the other.
    Promise.allSettled([listChats(), listMessages()])
      .then(([chats, messages]) => {
        const merged = [
          ...(chats.status === 'fulfilled' ? chats.value.map(rowFromChat) : []),
          ...(messages.status === 'fulfilled' ? messages.value.map(rowFromMessage) : []),
        ].sort((a, b) => (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0))

        setRows(merged)
        setActiveId(merged[0]?.id ?? null)
      })
      .finally(() => setLoading(false))
  }, [])

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase()
    return rows.filter((row) => {
      let matchesFilter = true
      if (filter === 'unread') matchesFilter = !row.read
      else if (filter !== 'all') matchesFilter = row.kind === filter

      const matchesSearch =
        !term ||
        row.name?.toLowerCase().includes(term) ||
        row.email?.toLowerCase().includes(term) ||
        row.preview?.toLowerCase().includes(term) ||
        (row.kind === 'chat' &&
          row.chat.messages?.some((m) => m.content?.toLowerCase().includes(term)))

      return matchesFilter && matchesSearch
    })
  }, [rows, search, filter])

  const active = rows.find((row) => row.id === activeId) ?? null
  const unread = rows.filter((row) => !row.read).length
  const chatCount = rows.filter((row) => row.kind === 'chat').length

  function setRead(row, read) {
    setRows((list) => list.map((r) => (r.id === row.id ? { ...r, read } : r)))
    const save = row.kind === 'chat' ? markChatRead(row.ref, !read) : markRead(row.ref, read)
    save.catch(() => {})
  }

  function open(row) {
    setActiveId(row.id)
    setCopied(false)
    if (!row.read) setRead(row, true)
  }

  async function remove(row) {
    const what = row.kind === 'chat' ? `the chat with ${row.name}` : `the message from ${row.name}`
    if (!window.confirm(`Delete ${what}? This cannot be undone.`)) return

    setRows((list) => list.filter((r) => r.id !== row.id))
    if (activeId === row.id) setActiveId(null)
    const drop = row.kind === 'chat' ? deleteChat(row.ref) : deleteMessage(row.ref)
    await drop.catch(() => {})
  }

  async function copyTranscript(row) {
    try {
      await navigator.clipboard.writeText(asTranscript(row.chat))
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  if (loading) return <Spinner label="Loading the inbox…" />

  return (
    <div>
      <PageHead
        title="Inbox"
        subtitle={`${unread} unread · ${chatCount} chat${chatCount === 1 ? '' : 's'} · ${rows.length} total`}
      />

      {!isFirebaseConfigured && <SetupNotice what="This inbox" />}

      {rows.length === 0 ? (
        <EmptyState
          title="Nothing here yet"
          body="Chats with the website assistant and affiliate applications both arrive here."
        />
      ) : (
        <div className="grid gap-5 lg:grid-cols-[340px_minmax(0,1fr)]">
          <Card className="!p-0">
            <div className="space-y-3 border-b border-forest-deep/10 p-4">
              <Input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search names, emails, anything said…"
              />
              <div className="flex flex-wrap gap-1.5">
                {FILTERS.map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setFilter(key)}
                    className={`rounded-lg px-3 py-1.5 text-[12.5px] font-semibold transition-colors ${
                      filter === key
                        ? 'bg-forest-deep text-white'
                        : 'text-forest-deep/60 hover:bg-forest-deep/5'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <ul className="max-h-[560px] overflow-y-auto">
              {visible.length === 0 ? (
                <li className="px-4 py-10 text-center text-[13.5px] text-forest-deep/50">
                  Nothing matches that filter.
                </li>
              ) : (
                visible.map((row) => (
                  <li key={row.id}>
                    <button
                      type="button"
                      onClick={() => open(row)}
                      className={`flex w-full gap-3 border-b border-forest-deep/5 px-4 py-3.5 text-left transition-colors last:border-0 ${
                        activeId === row.id ? 'bg-cream' : 'hover:bg-cream'
                      }`}
                    >
                      <span
                        className={`grid size-9 shrink-0 place-items-center rounded-full text-[13px] font-bold text-forest-deep ${
                          row.kind === 'chat' ? 'bg-sage-tint' : 'bg-gold-tint'
                        }`}
                      >
                        {row.name?.slice(0, 1) ?? '?'}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span
                            className={`truncate text-[13.5px] ${row.read ? 'font-medium text-forest-deep/75' : 'font-bold text-forest-deep'}`}
                          >
                            {row.name}
                          </span>
                          {row.kind === 'chat' && (
                            <span className="shrink-0 rounded-full bg-sage-tint px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wide text-forest-deep/70">
                              Chat
                            </span>
                          )}
                          {!row.read && (
                            <span className="ml-auto size-2 shrink-0 rounded-full bg-gold" />
                          )}
                        </span>
                        <span className="mt-0.5 line-clamp-2 block text-[12.5px] text-forest-deep/50">
                          {row.preview}
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
                    {formatDate(active.date)}
                  </p>
                  <p className="mt-1 text-[12px] text-forest-deep/40">{active.source}</p>
                </div>
              </div>

              {active.kind === 'chat' ? (
                <Transcript chat={active.chat} />
              ) : (
                <p className="whitespace-pre-line py-6 text-[14.5px] leading-relaxed text-forest-deep/85">
                  {active.body}
                </p>
              )}

              <div className="flex flex-wrap gap-2 border-t border-forest-deep/10 pt-5">
                <Btn
                  as="a"
                  href={`mailto:${active.email}?subject=Re: ${encodeURIComponent(active.subject)}`}
                >
                  Reply by email
                </Btn>
                {active.kind === 'chat' && (
                  <Btn variant="ghost" onClick={() => copyTranscript(active)}>
                    {copied ? 'Copied' : 'Copy transcript'}
                  </Btn>
                )}
                <Btn variant="ghost" onClick={() => setRead(active, !active.read)}>
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
              title="Nothing selected"
              body="Choose a conversation from the list to read it."
            />
          )}
        </div>
      )}
    </div>
  )
}
