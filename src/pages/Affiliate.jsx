import PageHero from '../components/PageHero'
import TrustedBy from '../components/TrustedBy'
import Problem from '../components/Problem'
import StepsGrid from '../components/StepsGrid'
import BulletSplit from '../components/BulletSplit'
import GrowthBanner from '../components/GrowthBanner'
import AffiliateForm from '../components/AffiliateForm'
import Testimonials from '../components/Testimonials'
import { Newsletter } from '../components/Footer'

const RECEIVE = [
  'Want to grow personally, professionally and financially, not just one of the three',
  "Are exploring what's possible beyond their primary career",
  'Want a stronger personal brand and more visibility in their industry',
  'Are curious about entrepreneurship, investing or a second income',
  'Need real accountability, not just more information',
  'Are tired of trying to figure it all out on their own',
]

export default function Affiliate() {
  return (
    <>
      <PageHero
        lead="Recommend it because you believe in it."
        accent="Get paid because it works."
        body="This time, get paid for it. Share LinkedIn Unlocked with your audience and earn 20% on every enrolment that comes through your personal link."
      />
      <TrustedBy />
      <Problem tone="gold" />
      <StepsGrid />
      <BulletSplit
        eyebrow="What you receive"
        title="Everything you need to promote with confidence."
        items={RECEIVE}
      />
      <GrowthBanner
        tone="sage"
        title="You'll Leave With A Plan, Not Just More To Read."
        ctaLabel="Get 14 Days Free"
      />
      <AffiliateForm />
      <Testimonials />
      <Newsletter tone="gold" />
    </>
  )
}
