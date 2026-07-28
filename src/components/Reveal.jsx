import { Fragment, useEffect, useRef, useState } from 'react'

const reducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Fires once, the first time the element scrolls into view. */
function useInView({ threshold = 0.12, rootMargin = '0px 0px -60px 0px' } = {}) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (reducedMotion()) {
      setShown(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          observer.unobserve(el)
        }
      },
      { threshold, rootMargin },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return [ref, shown]
}

/**
 * Fades, lifts and un-blurs its children the first time they scroll into view.
 * `y={0}` opts into a transform- and filter-free fade, which is required
 * whenever the wrapper contains absolutely-positioned children.
 */
export default function Reveal({
  children,
  delay = 0,
  y = 26,
  className = '',
  as: Tag = 'div',
}) {
  const [ref, shown] = useInView()
  const fade = y === 0

  return (
    <Tag
      ref={ref}
      className={`reveal ${fade ? 'reveal-fade' : ''} ${shown ? 'reveal-in' : ''} ${className}`}
      style={{ '--reveal-delay': `${delay}ms`, '--reveal-y': `${y}px` }}
    >
      {children}
    </Tag>
  )
}

/**
 * Headline reveal: each word rises out of its own mask on a stagger.
 *
 * `segments` is an ordered list of `{ text, className }`, so a heading can mix
 * colours, plus `{ br: true }` to force the line breaks the design specifies.
 */
export function TextReveal({
  segments,
  className = '',
  as: Tag = 'h2',
  step = 42,
  delay = 0,
}) {
  const [ref, shown] = useInView({ threshold: 0.2 })
  let index = 0

  return (
    <Tag ref={ref} className={className}>
      {segments.flatMap((segment, si) => {
        if (segment.br) {
          return [<br key={`br-${si}`} className={segment.className} />]
        }

        return segment.text.split(' ').map((word, wi) => {
          const wordDelay = delay + index++ * step
          return (
            // The space must sit OUTSIDE the mask. Inside it the run of
            // inline-blocks has no break opportunity, and the heading
            // refuses to wrap on narrow screens.
            <Fragment key={`${si}-${wi}`}>
              <span className="word-mask">
                <span
                  className={`word ${shown ? 'word-in' : ''} ${segment.className ?? ''}`}
                  style={{ '--word-delay': `${wordDelay}ms` }}
                >
                  {word}
                </span>
              </span>{' '}
            </Fragment>
          )
        })
      })}
    </Tag>
  )
}

/**
 * Counts up to a number when scrolled into view. `value` keeps any prefix or
 * suffix in the design ("$153.5M", "73K+") and only the digits animate.
 */
export function CountUp({ value, className = '' }) {
  const ref = useRef(null)
  const [display, setDisplay] = useState(value)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const match = String(value).match(/^(\D*)([\d.]+)(.*)$/)
    if (!match || reducedMotion()) return

    const [, prefix, digits, suffix] = match
    const target = parseFloat(digits)
    const decimals = (digits.split('.')[1] || '').length
    // "09" must not render as "9" mid-count
    const pad = digits.split('.')[0].length

    const format = (n) => {
      const [whole, frac] = n.toFixed(decimals).split('.')
      const padded = whole.padStart(pad, '0')
      return `${prefix}${frac ? `${padded}.${frac}` : padded}${suffix}`
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.unobserve(el)

        const duration = 1400
        const start = performance.now()

        const tick = (now) => {
          const t = Math.min((now - start) / duration, 1)
          // easeOutExpo keeps the number moving fast then settling
          const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
          setDisplay(format(target * eased))
          if (t < 1) requestAnimationFrame(tick)
        }

        setDisplay(format(0))
        requestAnimationFrame(tick)
      },
      { threshold: 0.5 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [value])

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  )
}
