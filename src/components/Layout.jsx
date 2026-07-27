import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

export default function Layout() {
  const { pathname } = useLocation()

  // Each route is a full landing page; always land at the top on navigation.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
      <Header />
      {/* Keyed on pathname so each route replays the entrance animation. */}
      <main key={pathname} className="page-enter">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
