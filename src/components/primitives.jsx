import { Link } from 'react-router-dom'
import { isExternal } from '../lib/links'

export function Container({ className = '', children }) {
  return (
    <div className={`mx-auto w-full max-w-[1200px] px-6 lg:px-10 ${className}`}>
      {children}
    </div>
  )
}

export function ArrowIcon({ className = 'size-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M5 12h14m0 0-5.5-5.5M19 12l-5.5 5.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Pill button. `variant` mirrors the button styles used across the board. */
export function Button({
  variant = 'solid',
  to = '/',
  children,
  icon = false,
  className = '',
}) {
  const base =
    'inline-flex items-center gap-3 rounded-full font-semibold transition-colors duration-200'

  const variants = {
    solid: 'bg-brown-deep text-white px-7 py-3.5 text-[15px] hover:bg-brown',
    outline:
      'border border-brown-deep/40 text-brown-deep px-7 py-3.5 text-[15px] hover:bg-brown-deep hover:text-white',
    gold: 'bg-gold text-white px-8 py-4 text-[15px] hover:bg-gold-text',
    dark: 'bg-ink text-white px-8 py-3.5 text-[15px] hover:bg-brown-deep',
  }

  const inner = (
    <>
      {children}
      {icon && (
        <span className="grid size-6 shrink-0 place-items-center overflow-hidden rounded-full bg-white/25">
          <ArrowIcon className="size-3.5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-4" />
        </span>
      )}
    </>
  )

  const cls = `group ${base} ${variants[variant]} ${className}`

  // Off-site destinations open in a new tab; internal paths use the router.
  if (isExternal(to)) {
    return (
      <a href={to} target="_blank" rel="noopener noreferrer" className={cls}>
        {inner}
      </a>
    )
  }

  return (
    <Link to={to} className={cls}>
      {inner}
    </Link>
  )
}

export function TextLink({ to = '/', children, className = '' }) {
  const cls = `group inline-flex items-center gap-2 text-sm font-semibold text-brown-deep ${className}`
  const arrow = (
    <ArrowIcon className="size-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5" />
  )

  if (isExternal(to)) {
    return (
      <a href={to} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
        {arrow}
      </a>
    )
  }

  return (
    <Link to={to} className={cls}>
      {children}
      {arrow}
    </Link>
  )
}
