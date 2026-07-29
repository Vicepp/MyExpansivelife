import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { isExternal } from '../lib/links'

/**
 * Renders an assistant reply, turning links into things you can press.
 *
 * The assistant is asked for markdown links — [label](/path) — and sometimes
 * writes a bare URL anyway, so both are handled.
 *
 * Only http, https and site-relative paths are ever rendered as links. A model
 * cannot be trusted not to produce a `javascript:` URL, and a chat bubble is
 * not the place to find out.
 */

const PATTERN = /\[([^\]\n]{1,80})\]\((\S+?)\)|(https?:\/\/[^\s<>"')]+)/g

function safe(href) {
  const url = String(href ?? '').trim()
  if (/^https?:\/\//i.test(url)) return url
  // Site-relative, but not protocol-relative "//evil.com".
  if (/^\/(?!\/)/.test(url)) return url
  return null
}

/** Shortens a bare URL so it cannot blow out the bubble's width. */
function label(url) {
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '').slice(0, 42)
}

function ChatLink({ href, children }) {
  const className =
    'font-semibold text-brown-deep underline decoration-gold/60 underline-offset-2 hover:text-brown'

  if (isExternal(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    )
  }

  return (
    <Link to={href} className={className}>
      {children}
    </Link>
  )
}

export default function ChatText({ text }) {
  const source = String(text ?? '')
  const out = []
  let cursor = 0

  PATTERN.lastIndex = 0
  let match = PATTERN.exec(source)

  while (match) {
    if (match.index > cursor) out.push(source.slice(cursor, match.index))

    const [whole, markdownLabel, markdownUrl, bareUrl] = match
    const href = safe(markdownUrl ?? bareUrl)

    if (href) {
      out.push(
        <ChatLink key={match.index} href={href}>
          {markdownLabel ?? label(bareUrl)}
        </ChatLink>,
      )
    } else {
      // Not a link we are willing to render — keep the visible text, drop the
      // linking. The visitor still sees what was said.
      out.push(markdownLabel ?? whole)
    }

    cursor = match.index + whole.length
    match = PATTERN.exec(source)
  }

  if (cursor < source.length) out.push(source.slice(cursor))

  return (
    <>
      {out.map((chunk, i) => (
        <Fragment key={i}>{chunk}</Fragment>
      ))}
    </>
  )
}
