import { Link } from 'react-router-dom'

export function Card({ className = '', children }) {
  return (
    <div className={`rounded-2xl bg-white p-6 shadow-[0_1px_3px_rgb(35_43_74/0.06)] ${className}`}>
      {children}
    </div>
  )
}

export function PageHead({ title, subtitle, action }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-[24px] font-bold text-forest-deep">{title}</h1>
        {subtitle && <p className="mt-1 text-[14px] text-forest-deep/55">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

/** Stat card tints, all derived from the MXL palette. */
const TONES = {
  sage: 'bg-sage-tint',
  gold: 'bg-gold-tint',
  brown: 'bg-brown-tint',
  sand: 'bg-sand',
}

export function StatCard({ tone = 'sage', icon, value, label }) {
  return (
    <div className={`flex items-center gap-4 rounded-2xl p-5 ${TONES[tone]}`}>
      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-forest-deep text-white">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="truncate text-[24px] font-bold leading-none text-forest-deep">{value}</p>
        <p className="mt-1 truncate text-[13px] text-forest-deep/65">{label}</p>
      </div>
    </div>
  )
}

const BUTTONS = {
  primary: 'bg-forest-deep text-white hover:bg-forest-soft',
  gold: 'bg-gold text-forest-deep hover:brightness-95',
  ghost: 'border border-forest-deep/15 text-forest-deep hover:bg-forest-deep/5',
  danger: 'border border-red-200 text-red-600 hover:bg-red-50',
}

export function Btn({
  as = 'button',
  to,
  variant = 'primary',
  className = '',
  children,
  ...rest
}) {
  const cls = `inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[14px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${BUTTONS[variant]} ${className}`
  if (as === 'link') {
    return (
      <Link to={to} className={cls} {...rest}>
        {children}
      </Link>
    )
  }
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  )
}

export function Field({ label, hint, children, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-[13px] font-semibold text-forest-deep">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-[12px] text-forest-deep/50">{hint}</span>}
    </label>
  )
}

export const inputClass =
  'w-full rounded-xl border border-forest-deep/15 bg-white px-3.5 py-2.5 text-[14px] text-forest-deep outline-none transition-colors placeholder:text-forest-deep/35 focus:border-forest-deep/45'

// className is merged rather than spread over, so callers can add to the base
// style without silently losing it.
export function Input({ className = '', ...props }) {
  return <input className={`${inputClass} ${className}`} {...props} />
}

export function Textarea({ className = '', ...props }) {
  return <textarea className={`${inputClass} resize-y ${className}`} {...props} />
}

export function Select({ className = '', children, ...props }) {
  return (
    <select className={`${inputClass} ${className}`} {...props}>
      {children}
    </select>
  )
}

const STATUS_TONES = {
  published: 'bg-emerald-100 text-emerald-700',
  draft: 'bg-forest-deep/10 text-forest-deep/70',
  scheduled: 'bg-amber-100 text-amber-700',
}

export function StatusPill({ status }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-1 text-[11.5px] font-semibold capitalize ${STATUS_TONES[status] ?? STATUS_TONES.draft}`}
    >
      {status}
    </span>
  )
}

export function Spinner({ label = 'Loading…' }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-[14px] text-forest-deep/55">
      <span className="size-4 animate-spin rounded-full border-2 border-forest-deep/20 border-t-forest-deep" />
      {label}
    </div>
  )
}

export function EmptyState({ title, body, action }) {
  return (
    <div className="rounded-2xl border border-dashed border-forest-deep/15 bg-white px-6 py-14 text-center">
      <p className="text-[16px] font-semibold text-forest-deep">{title}</p>
      {body && <p className="mx-auto mt-2 max-w-[380px] text-[14px] text-forest-deep/55">{body}</p>}
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  )
}

/** Shown wherever a feature needs Firestore that isn't connected yet. */
export function SetupNotice({ what = 'This data' }) {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
      <span className="text-[14px] text-amber-900">
        <strong>Preview mode.</strong> {what} is sample content — connect Firebase to
        make it real.
      </span>
      <a
        href="https://console.firebase.google.com/"
        target="_blank"
        rel="noreferrer"
        className="ml-auto rounded-lg bg-amber-900 px-3 py-1.5 text-[12.5px] font-semibold text-white"
      >
        Firebase console
      </a>
    </div>
  )
}
