import { useEffect, useRef } from 'react'
import { formatEventDate, formatEventTime, EVENT_TZ_LABEL } from '../lib/eventTime'

/**
 * Injects provider embed markup into a container.
 *
 * `innerHTML` never executes <script> tags, so any script in the pasted code is
 * rebuilt as a real element. Non-script markup (iframes and the like) is copied
 * across as-is.
 */
function mountEmbed(container, html) {
  container.innerHTML = ''

  const parsed = new DOMParser().parseFromString(
    `<div id="__wrap">${html}</div>`,
    'text/html',
  )
  const wrap = parsed.getElementById('__wrap')
  if (!wrap) return

  for (const node of Array.from(wrap.childNodes)) {
    if (node.nodeName === 'SCRIPT') {
      const script = document.createElement('script')
      for (const attr of Array.from(node.attributes)) {
        script.setAttribute(attr.name, attr.value)
      }
      script.text = node.textContent ?? ''
      container.appendChild(script)
    } else {
      container.appendChild(node.cloneNode(true))
    }
  }
}

export default function RegisterModal({ event, onClose }) {
  const host = useRef(null)
  const dialog = useRef(null)

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog.current?.focus()

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose])

  useEffect(() => {
    if (host.current && event?.embedCode) {
      mountEmbed(host.current, event.embedCode)
    }
  }, [event])

  if (!event) return null

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm"
      role="presentation"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-label={`Register for ${event.title}`}
        tabIndex={-1}
        className="flex max-h-[90dvh] w-full max-w-[860px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl outline-none"
      >
        <div className="flex items-start gap-4 border-b border-ink/10 px-5 py-4">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-wide text-gold">
              {event.badge}
            </p>
            <h2 className="mt-1 text-[17px] font-bold leading-snug text-forest-deep">
              {event.title}
            </h2>
            <p className="mt-1 text-[12.5px] text-ink/60">
              {formatEventDate(event.startsAt)} · {formatEventTime(event.startsAt)}{' '}
              {EVENT_TZ_LABEL}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close registration"
            className="ml-auto shrink-0 rounded-full p-2 text-ink/45 transition-colors hover:bg-ink/5 hover:text-ink"
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="min-h-[360px] flex-1 overflow-y-auto bg-cream-card p-2 sm:p-4">
          <div ref={host} className="min-h-[360px] w-full [&_iframe]:w-full" />
        </div>
      </div>
    </div>
  )
}
