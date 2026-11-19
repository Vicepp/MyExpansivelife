import { useEffect, useRef } from 'react'
import { trackPixelLead } from '../lib/pixel'

/**
 * LeadConnector (GoHighLevel) forms, embedded as the CRM provides them, so
 * submissions land in the pipeline rather than the site's own inbox.
 */

const EMBED_SCRIPT = 'https://link.msgsndr.com/js/form_embed.js'

/**
 * LeadConnector's helper sizes the iframe to the form and handles its
 * cookie-consent and redirect behaviour. Added once per page load; React
 * re-mounts on navigation must not stack copies.
 */
function useFormEmbedScript() {
  useEffect(() => {
    if (document.querySelector(`script[src="${EMBED_SCRIPT}"]`)) return
    const script = document.createElement('script')
    script.src = EMBED_SCRIPT
    script.async = true
    document.body.appendChild(script)
  }, [])
}

/**
 * Calls `onSubmitted` once each time the form inside `iframeRef` is submitted
 * successfully. The form posts "set-sticky-contacts" to the parent page only
 * after LeadConnector has accepted the submission (validation passed, contact
 * saved), just before it shows its thank-you or starts its redirect. It posts
 * that message twice per submission, hence the short de-duplication window.
 */
function useFormSubmitted(iframeRef, onSubmitted) {
  const callback = useRef(onSubmitted)
  callback.current = onSubmitted

  const enabled = Boolean(onSubmitted)
  useEffect(() => {
    if (!enabled) return
    let last = 0
    const onMessage = (e) => {
      if (!Array.isArray(e.data) || e.data[0] !== 'set-sticky-contacts') return
      if (e.source !== iframeRef.current?.contentWindow) return
      const now = Date.now()
      if (now - last < 5000) return
      last = now
      callback.current?.()
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [iframeRef, enabled])
}

/**
 * One inline LeadConnector form. Attributes mirror LeadConnector's embed code;
 * form_embed.js reads them. `height` is the form's data-height, used as the
 * starting height so the layout doesn't jump before the script resizes it.
 * `pixelLead` names the Meta Pixel Lead event sent on each successful submit.
 */
export function LeadConnectorForm({ formId, name, height, radius = 20, pixelLead }) {
  useFormEmbedScript()
  const iframe = useRef(null)
  useFormSubmitted(iframe, pixelLead ? () => trackPixelLead(pixelLead) : null)

  return (
    <iframe
      ref={iframe}
      src={`https://api.leadconnectorhq.com/widget/form/${formId}`}
      id={`inline-${formId}`}
      title={name}
      style={{ width: '100%', height: `${height}px`, border: 'none', borderRadius: `${radius}px` }}
      data-layout="{'id':'INLINE'}"
      data-trigger-type="alwaysShow"
      data-trigger-value=""
      data-activation-type="alwaysActivated"
      data-activation-value=""
      data-deactivation-type="neverDeactivate"
      data-deactivation-value=""
      data-form-name={name}
      data-height={String(height)}
      data-layout-iframe-id={`inline-${formId}`}
      data-form-id={formId}
      data-cookie-consent="true"
      data-cookie-consent-provider="auto"
    />
  )
}

/** A LeadConnector form in a dismissible popup (Esc, backdrop or ×). */
export function LeadFormModal({ open, onClose, title, ...form }) {
  const dialog = useRef(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [open, onClose])

  if (!open) return null

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
        aria-label={title}
        tabIndex={-1}
        className="relative flex max-h-[92dvh] w-full max-w-[560px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl outline-none"
      >
        <div className="flex items-center justify-between gap-4 border-b border-ink/10 px-5 py-4">
          <h2 className="text-[17px] font-bold text-forest-deep">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid size-9 shrink-0 place-items-center rounded-full text-ink/60 transition hover:bg-ink/5 hover:text-ink"
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto">
          <LeadConnectorForm {...form} radius={0} />
        </div>
      </div>
    </div>
  )
}
