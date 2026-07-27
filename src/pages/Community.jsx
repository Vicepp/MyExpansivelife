import PageHero from '../components/PageHero'
import TrustedBy from '../components/TrustedBy'
import Problem from '../components/Problem'
import BulletSplit from '../components/BulletSplit'
import AccessGrid from '../components/AccessGrid'
import GrowthBanner from '../components/GrowthBanner'
import Testimonials from '../components/Testimonials'
import Blog from '../components/Blog'
import { Newsletter } from '../components/Footer'

const FITS = [
  'Want to grow personally, professionally and financially, not just one of the three',
  "Are exploring what's possible beyond their primary career",
  'Want a stronger personal brand and more visibility in their industry',
  'Are curious about entrepreneurship, investing or a second income',
  'Need real accountability, not just more information',
  'Are tired of trying to figure it all out on their own',
]

export default function Community() {
  return (
    <>
      <PageHero
        cluster
        lead="The room where ambitious people stop"
        accent="building alone."
        body="The Circle is the private membership where the My Expansive Life mission gets practical."
      />
      <TrustedBy />
      <Problem tone="gold" />
      <BulletSplit
        eyebrow="Is this you?"
        title="The Circle is built for professionals who:"
        items={FITS}
      />
      <AccessGrid />
      <GrowthBanner
        tone="sage"
        title="You'll Leave With A Plan, Not Just More To Read."
        ctaLabel="Get 14 Days Free"
      />
      <Testimonials />
      <Newsletter tone="gold" />
      <Blog />
    </>
  )
}
