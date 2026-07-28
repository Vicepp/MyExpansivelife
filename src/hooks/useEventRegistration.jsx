import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { trackEventPopup, trackEventRegister } from '../lib/track'

/**
 * One place that decides what "Register" does for an event, and counts it.
 *
 * `registerMode: 'embed'` opens the provider's booking widget in a modal.
 * Anything else follows `registerUrl` — external URLs in a new tab, internal
 * paths through the router.
 */
export default function useEventRegistration() {
  const [modalEvent, setModalEvent] = useState(null)
  const navigate = useNavigate()

  const register = useCallback(
    (event) => {
      if (!event) return

      // Counted before branching, so a lead is recorded either way.
      trackEventRegister(event.id)

      if (event.registerMode === 'embed' && event.embedCode) {
        trackEventPopup(event.id)
        setModalEvent(event)
        return
      }

      const url = event.registerUrl || '/community'
      if (/^https?:\/\//i.test(url)) {
        window.open(url, '_blank', 'noopener,noreferrer')
      } else {
        navigate(url)
      }
    },
    [navigate],
  )

  const close = useCallback(() => setModalEvent(null), [])

  return { modalEvent, register, close }
}
