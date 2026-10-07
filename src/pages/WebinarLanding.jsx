import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import { Button } from '../components/primitives'
import {
  WebinarHero,
  WebinarStats,
  WebinarLearn,
  WebinarFamiliar,
  WebinarAbout,
  WebinarTestimonials,
  WebinarPlaybook,
  WebinarRegister,
} from '../components/Webinar'
import { trackPageView } from '../lib/track'
import logo from '../assets/design/logo.svg'

/*
 * Standalone landing page for the free webinar, "How a Single LinkedIn Post
 * Turned Into a Six Figure Partnership". Routed outside the site Layout so it
 * carries no site navigation, event bar or chat — one page, one ask: every
 * button leads to #register.
 */
export default function WebinarLanding() {
  useEffect(() => {
    window.scrollTo(0, 0)
    trackPageView('/linkedin-unlocked')
  }, [])

  return (
    <>
      <Seo
        title="LinkedIn Unlocked — Free Live Webinar"
        description="Free live webinar with Dr. Nkem Ezeamama: how a single LinkedIn post turned into a six figure partnership, and how to apply the same thinking to your own LinkedIn presence."
        path="/linkedin-unlocked"
      />

      <header className="bg-cream">
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-4 border-b border-gold/20 px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-4" aria-label="My Expansive Life home">
            <img src={logo} alt="My Expansive Life" className="h-11 w-auto lg:h-12" />
            <span className="hidden h-8 w-px bg-gold/30 sm:block" />
            <span className="hidden flex-col leading-tight sm:flex">
              <span className="font-display text-[17px] text-forest">LinkedIn Unlocked</span>
              <span className="text-[10.5px] tracking-[0.16em] text-ink/60">BY DR. NKEM</span>
            </span>
          </Link>
          <Button variant="solid" to="#register" icon className="px-5! py-2.5! text-[14px]">
            Save My Seat
          </Button>
        </div>
      </header>

      <main className="page-enter">
        <WebinarHero />
        <WebinarStats />
        <WebinarLearn />
        <WebinarFamiliar />
        <WebinarAbout />
        <WebinarTestimonials />
        <WebinarPlaybook />
        <WebinarRegister />
      </main>

      <footer className="bg-cream pb-8">
        <div className="mx-auto flex w-full max-w-[1440px] flex-wrap items-center justify-between gap-4 border-t border-gold/20 px-4 pt-6 text-[13px] text-ink/60 sm:px-6 lg:px-8">
          <span>LinkedIn Unlocked is a program of My Expansive Life.</span>
          <span>© {new Date().getFullYear()} My Expansive Life. All rights reserved.</span>
        </div>
      </footer>
    </>
  )
}
