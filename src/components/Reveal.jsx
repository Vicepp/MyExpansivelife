import { useEffect, useRef, useState } from 'react'

/**
 * Fades and lifts its children into place the first time they scroll into view.
 * Honours prefers-reduced-motion by showing content immediately.
 */
export default function Reveal({
  children,
  delay = 0,
  y = 26,
  className = '',
  as: Tag = 'div',
}) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
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
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // A transform on the wrapper would become the containing block for any
  // absolutely-positioned child, so y={0} opts into a transform-free fade.
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
    if (!match || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

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
