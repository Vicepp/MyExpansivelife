import Hero from '../components/Hero'
import Pillars from '../components/Pillars'
import TrustedBy from '../components/TrustedBy'
import Problem from '../components/Problem'
import Ceiling from '../components/Ceiling'
import ThreeWays from '../components/ThreeWays'
import UpcomingEvents from '../components/UpcomingEvents'
import Blog from '../components/Blog'
import GrowthBanner from '../components/GrowthBanner'
import Testimonials from '../components/Testimonials'
import { Newsletter } from '../components/Footer'

export default function Home() {
  return (
    <>
      <Hero />
      {/* The six pillars sit straight under the hero — everything below is one
          of them, so the reader meets the map before the detail. */}
      <Pillars />
      <TrustedBy />
      <Problem />
      <Ceiling />
      <ThreeWays />
      <UpcomingEvents />
      <Blog />
      <GrowthBanner
        tone="sage"
        wide
        title="Turn Your LinkedIn Into an Opportunity Magnet"
        body="Learn how to position your expertise, tell stories that build trust, and create content that attracts the right opportunities, without pretending to be an influencer."
        ctaLabel="Join the next cohort"
        ctaTo="/courses/linkedin-unlocked"
      />
      <Testimonials />
      <Newsletter />
    </>
  )
}
