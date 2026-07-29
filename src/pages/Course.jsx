import CourseHero, { CourseStats } from '../components/CourseHero'
import SageFeature from '../components/SageFeature'
import TrustedBy from '../components/TrustedBy'
import BulletSplit from '../components/BulletSplit'
import Process from '../components/Process'
import UpcomingEvents from '../components/UpcomingEvents'
import ThreeWays, { COURSE_WAYS } from '../components/ThreeWays'
import GrowthBanner from '../components/GrowthBanner'
import Testimonials from '../components/Testimonials'
import Blog from '../components/Blog'
import { Newsletter } from '../components/Footer'
import { COURSE_URL } from '../lib/links'

/** The four outcomes, worded as they appear on the sales page. */
const CHANGES = [
  'Position yourself as a leader in your field. Move from well-kept secret to well-known authority on your own terms.',
  'Build relationships with influential peers, investors, cross-functional teams, and industry leaders who open real doors.',
  'Clients, capital, speaking invitations, and partnerships coming to you. No cold outreach required.',
  'Earn the credibility that makes people choose you before they have even spoken to you. Reputation that compounds.',
]

/*
 * Ordered to move a visitor from problem to purchase: hook, proof, the problem
 * named, credibility, what changes, how it works, a free way in, the ways to
 * buy, social proof, then the close.
 */
export default function Course() {
  return (
    <>
      <CourseHero />
      <CourseStats />

      <SageFeature
        title="The algorithm isn’t against you. You just haven’t been given the system."
        body="Most professionals post into the void because nobody handed them a repeatable method. LinkedIn Unlocked is that method: positioning, profile, content, conversations and follow-up, in the order they actually work."
        videoUrl="https://www.youtube.com/watch?v=8znehZDXdaY"
        videoTitle="LinkedIn Unlocked — course introduction"
        videoCaption="Start here: a short introduction to how the course works."
      />

      <TrustedBy />

      <BulletSplit
        eyebrow="What changes for you"
        title="From well-kept secret to well-known authority."
        items={CHANGES}
        ctaLabel="Enroll Now"
        ctaTo={COURSE_URL}
      />

      <Process />

      {/* The free webinar is the low-friction way in, so it precedes the price. */}
      <UpcomingEvents />

      <ThreeWays title="Three ways to start." ways={COURSE_WAYS} />

      <GrowthBanner
        tone="gold"
        wide
        title="You'll Be Able To Walk Into Any Room, Online Or Off, And Say Exactly Who You Help."
        body="A walk through the profile, the posts and the conversations they start — the same approach behind 16,000+ followers and $153M+ in assets under management."
        ctaLabel="Enroll Now"
        ctaTo={COURSE_URL}
        videoUrl="https://www.youtube.com/watch?v=sbLVlEW_ibU"
        videoTitle="LinkedIn Unlocked — the strategy in action"
      />

      <Testimonials />

      <GrowthBanner
        tone="sage"
        title="You can stay the best-kept secret. Or you can become undeniable."
        body="Join the current cohort and start seeing results this week. One-time investment, lifetime access, 30-day guarantee."
        ctaLabel="I'm ready. Enroll me now"
        ctaTo={COURSE_URL}
      />

      <Newsletter />
      <Blog />
    </>
  )
}
