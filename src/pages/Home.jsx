import Hero from '../components/Hero'
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
      <TrustedBy />
      <Problem />
      <Ceiling />
      <ThreeWays />
      <UpcomingEvents />
      <Blog />
      <GrowthBanner
        tone="sage"
        title="Take Your Growth To The Next Level"
        ctaLabel="Get 14 Days Free"
      />
      <Testimonials />
      <Newsletter />
    </>
  )
}
