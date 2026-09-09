import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import EventBar from './EventBar'
import ChatWidget from './ChatWidget'
import { trackPageView } from '../lib/track'
import { isPreviewingPosts } from '../lib/posts'

/**
 * Dev-only ribbon, so unpublished drafts showing on the real pages can never
 * be mistaken for live content. Compiled out of the production bundle with the
 * flag it depends on.
 */
function PreviewRibbon() {
  if (!isPreviewingPosts) return null
  return (
    <div className="sticky top-0 z-50 bg-brown-deep px-4 py-1.5 text-center text-[12.5px] font-semibold text-white">
      Draft preview — seed articles are showing on this site but are not
      published. Unset VITE_PREVIEW_POSTS to hide them.
    </div>
  )
}

export default function Layout() {
  const { pathname } = useLocation()

  // Each route is a full landing page; always land at the top on navigation.
  useEffect(() => {
    window.scrollTo(0, 0)
    trackPageView(pathname)
  }, [pathname])

  return (
    <>
      <PreviewRibbon />
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
