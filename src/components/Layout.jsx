import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import EventBar from './EventBar'
import ChatWidget from './ChatWidget'
import { trackPageView } from '../lib/track'

export default function Layout() {
  const { pathname } = useLocation()

  // Each route is a full landing page; always land at the top on navigation.
  useEffect(() => {
    window.scrollTo(0, 0)
    trackPageView(pathname)
  }, [pathname])

  return (
    <>
      <Header />
      {/* Keyed on pathname so each route replays the entrance animation. */}
      <main key={pathname} className="page-enter">
        <Outlet />
      </main>
      <Footer />
      <EventBar />
      {/* Public pages only — Layout does not wrap /admin, so the assistant
          never appears inside the studio. */}
      <ChatWidget />
    </>
  )
}
