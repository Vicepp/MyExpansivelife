import BlogHero from '../components/BlogHero'
import TrustedBy from '../components/TrustedBy'
import UpcomingEvents from '../components/UpcomingEvents'
import Blog from '../components/Blog'
import GrowthBanner from '../components/GrowthBanner'
import Testimonials from '../components/Testimonials'
import { Newsletter } from '../components/Footer'

export default function Blogs() {
  return (
    <>
      <BlogHero />
      <TrustedBy />
      <UpcomingEvents />
      <Blog count={6} />
      <GrowthBanner
        tone="sage"
        title="You'll Leave With A Plan, Not Just More To Read."
        ctaLabel="Get 14 Days Free"
      />
      <Testimonials />
      <Newsletter tone="gold" />
    </>
  )
}
