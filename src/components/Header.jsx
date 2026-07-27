import { useState, useRef, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Container } from './primitives'
import logo from '../assets/design/logo.svg'

export const COURSES = [
  { label: 'Linkedin Unlocked', to: '/courses/linkedin-unlocked' },
  { label: 'Investment 101', to: '/courses/investment-101', soon: true },
  { label: 'Personal Branding', to: '/courses/personal-branding', soon: true },
]

const NAV = [
  { label: 'Community', to: '/community' },
  { label: 'Courses', to: '/courses/linkedin-unlocked', menu: COURSES },
  { label: 'Affiliate', to: '/affiliate' },
  { label: 'Blogs', to: '/blogs' },
]

function ComingSoonTag() {
  return (
    <span className="rounded-full bg-[#FCF0CE] px-2.5 py-0.5 text-[11px] font-medium text-gold-text">
      coming soon
    </span>
  )
}

function CoursesMenu({ onNavigate }) {
  const [open, setOpen] = useState(false)
  const wrap = useRef(null)

  useEffect(() => {
    function onDocClick(e) {
      if (wrap.current && !wrap.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  return (
    <div
      ref={wrap}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        className="flex items-center gap-1.5 text-[15px] text-ink hover:text-brown-deep"
      >
        Courses
        <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden="true">
          <path
            d="m6 9 6 6 6-6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute left-1/2 top-full z-20 w-[290px] -translate-x-1/2 pt-4">
          <ul className="rounded-2xl bg-white p-4 shadow-[0_18px_50px_-12px_rgba(43,34,25,0.25)]">
            {COURSES.map((c) => (
              <li key={c.label}>
                <Link
                  to={c.to}
                  onClick={() => {
                    setOpen(false)
                    onNavigate?.()
                  }}
                  className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-[15px] text-ink hover:bg-cream hover:text-gold-text"
                >
                  {c.label}
                  {c.soon && <ComingSoonTag />}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-30 transition-[background-color,box-shadow] duration-300 ${
        scrolled
          ? 'bg-cream/85 shadow-[0_10px_30px_-18px_rgb(43_34_25/0.45)] backdrop-blur-md'
          : 'bg-cream'
      }`}
    >
      <Container
        className={`flex items-center justify-between transition-[padding] duration-300 ${
          scrolled ? 'py-3' : 'py-6'
        }`}
      >
        <Link to="/" className="shrink-0">
          <img src={logo} alt="My Expansive Life" className="h-14 w-auto" />
        </Link>

        <nav className="hidden items-center gap-10 lg:flex">
          {NAV.map((item) =>
            item.menu ? (
              <CoursesMenu key={item.label} />
            ) : (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  `text-[15px] hover:text-brown-deep ${
                    isActive ? 'text-brown-deep' : 'text-ink'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ),
          )}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/community"
            className="hidden rounded-full border border-gold px-6 py-2.5 text-sm font-semibold text-gold-text transition-colors hover:bg-gold hover:text-white sm:inline-flex"
          >
            Join Circle
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            className="grid size-10 place-items-center rounded-full border border-brown-deep/20 lg:hidden"
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
              <path
                d={mobileOpen ? 'M6 6l12 12M18 6L6 18' : 'M4 7h16M4 12h16M4 17h16'}
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </Container>

      {mobileOpen && (
        <Container className="pb-6 lg:hidden">
          <nav className="flex flex-col gap-4 border-t border-brown-deep/10 pt-4">
            <Link to="/community" onClick={() => setMobileOpen(false)}>
              Community
            </Link>
            <p className="text-[13px] font-semibold uppercase tracking-wide text-ink/50">
              Courses
            </p>
            {COURSES.map((c) => (
              <Link
                key={c.label}
                to={c.to}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5 pl-3 text-[15px]"
              >
                {c.label}
                {c.soon && <ComingSoonTag />}
              </Link>
            ))}
            <Link to="/affiliate" onClick={() => setMobileOpen(false)}>
              Affiliate
            </Link>
            <Link to="/blogs" onClick={() => setMobileOpen(false)}>
              Blogs
            </Link>
          </nav>
        </Container>
      )}
    </header>
  )
}
