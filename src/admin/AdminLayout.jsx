import { Suspense, useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Spinner } from './ui'
import { publishDueScheduled } from '../lib/posts'
import {
  IconGrid,
  IconDoc,
  IconChart,
  IconInbox,
  IconCalendar,
  IconMoney,
  IconCog,
  IconSearch,
  IconBell,
  IconChat,
  IconLogout,
  IconExternal,
} from './icons'
import logo from '../assets/design/logo.svg'

const NAV = [
  { to: '/admin', label: 'Dashboard', Icon: IconGrid, end: true },
  { to: '/admin/posts', label: 'My Articles', Icon: IconDoc },
  { to: '/admin/events', label: 'Events', Icon: IconCalendar },
  { to: '/admin/analytics', label: 'Analytics', Icon: IconChart },
  { to: '/admin/inbox', label: 'Inbox', Icon: IconInbox },
  { to: '/admin/post-plan', label: 'Post Plan', Icon: IconCalendar },
  { to: '/admin/earning', label: 'Earning', Icon: IconMoney },
  { to: '/admin/settings', label: 'Settings', Icon: IconCog },
]

function Sidebar({ onNavigate }) {
  return (
    <div className="flex h-full flex-col bg-forest-deep px-5 py-7 text-white">
      <Link to="/admin" onClick={onNavigate} className="mb-10 flex items-center gap-3 px-2">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gold">
          <img src={logo} alt="" className="size-7" />
        </span>
        <span className="font-display text-[19px] leading-tight">
          MXL
          <br />
          admin
        </span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1.5">
        {NAV.map(({ to, label, Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-[14.5px] transition-colors ${
                isActive
                  ? 'bg-sand font-semibold text-forest-deep'
                  : 'text-white/75 hover:bg-forest-soft hover:text-white'
              }`
            }
          >
            <Icon />
            {label}
          </NavLink>
        ))}
      </nav>

      <Link
        to="/"
        onClick={onNavigate}
        className="mt-6 flex items-center gap-2 rounded-xl px-4 py-3 text-[13.5px] text-white/60 transition-colors hover:bg-forest-soft hover:text-white"
      >
        <IconExternal className="size-4" />
        View live site
      </Link>
      <p className="px-4 pt-3 text-[12px] text-white/35">Version 1.0.1</p>
    </div>
  )
}

export default function AdminLayout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [justPublished, setJustPublished] = useState(0)

  // Anything scheduled for a moment that has now passed goes live here.
  useEffect(() => {
    publishDueScheduled()
      .then((n) => n > 0 && setJustPublished(n))
      .catch((e) => console.error('Could not publish due posts:', e))
  }, [])

  const name = user?.displayName || user?.email?.split('@')[0] || 'Admin'

  const handleSignOut = async () => {
    await signOut()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="min-h-dvh bg-gold/25 p-0 lg:p-5">
      <div className="mx-auto flex min-h-dvh w-full max-w-[1500px] overflow-hidden bg-forest-deep lg:min-h-[calc(100dvh-2.5rem)] lg:rounded-[28px]">
        <aside className="hidden w-[248px] shrink-0 lg:block">
          <Sidebar />
        </aside>

        {menuOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div className="w-[268px]">
              <Sidebar onNavigate={() => setMenuOpen(false)} />
            </div>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
              className="flex-1 bg-forest-deep/60"
            />
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center gap-3 px-4 py-4 lg:px-6">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="grid size-10 shrink-0 place-items-center rounded-xl bg-forest-soft text-white lg:hidden"
            >
              <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>

            <label className="relative min-w-0 flex-1 max-w-[420px]">
              <span className="sr-only">Search</span>
              <IconSearch className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-white/45" />
              <input
                type="search"
                placeholder="Search"
                className="w-full rounded-xl bg-forest-soft py-2.5 pl-10 pr-4 text-[14px] text-white outline-none placeholder:text-white/45 focus:ring-1 focus:ring-white/25"
              />
            </label>

            <div className="ml-auto flex items-center gap-2.5">
              <button
                type="button"
                aria-label="Messages"
                onClick={() => navigate('/admin/inbox')}
                className="grid size-10 place-items-center rounded-xl bg-forest-soft text-white/80 hover:text-white"
              >
                <IconChat />
              </button>
              <button
                type="button"
                aria-label="Notifications"
                className="relative grid size-10 place-items-center rounded-xl bg-forest-soft text-white/80 hover:text-white"
              >
                <IconBell />
                <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-gold" />
              </button>

              <div className="flex items-center gap-2.5 pl-1">
                <span className="hidden text-[14px] font-medium text-white sm:block">
                  {name}
                </span>
                <span className="grid size-10 place-items-center rounded-xl bg-sand text-[14px] font-bold text-forest-deep">
                  {name.slice(0, 1).toUpperCase()}
                </span>
                <button
                  type="button"
                  onClick={handleSignOut}
                  aria-label="Sign out"
                  title="Sign out"
                  className="grid size-10 place-items-center rounded-xl bg-forest-soft text-white/80 hover:text-white"
                >
                  <IconLogout />
                </button>
              </div>
            </div>
          </header>

          <main className="min-w-0 flex-1 overflow-x-hidden bg-cream p-5 lg:m-2 lg:mt-0 lg:rounded-[22px] lg:p-7">
            {justPublished > 0 && (
              <p className="mb-5 rounded-xl bg-emerald-50 px-4 py-3 text-[13.5px] text-emerald-800">
                {justPublished} scheduled{' '}
                {justPublished === 1 ? 'post was' : 'posts were'} due and{' '}
                {justPublished === 1 ? 'has' : 'have'} just gone live.
              </p>
            )}
            <Suspense fallback={<Spinner label="Loading…" />}>
              <Outlet />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  )
}
