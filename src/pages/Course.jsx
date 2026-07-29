import CourseHero, { CourseStats } from '../components/CourseHero'
import SageFeature from '../components/SageFeature'
import TrustedBy from '../components/TrustedBy'
import BulletSplit from '../components/BulletSplit'
import CardMarquee from '../components/CardMarquee'
import Process from '../components/Process'
import UpcomingEvents from '../components/UpcomingEvents'
import ThreeWays, { COURSE_WAYS } from '../components/ThreeWays'
import GrowthBanner from '../components/GrowthBanner'
import Testimonials from '../components/Testimonials'
import Blog from '../components/Blog'
import { Newsletter } from '../components/Footer'
import { COURSE_URL } from '../lib/links'

const CHANGES = [
  {
    title: 'Advance your career and expertise',
    body: 'Position yourself as a leader in your field. Move from well-kept secret to well-known authority on your own terms.',
  },
  {
    title: 'Connect with the people who matter',
    body: 'Build relationships with influential peers, investors, cross-functional teams, and industry leaders who open real doors.',
  },
  {
    title: 'Attract inbound opportunities',
    body: 'Clients, capital, speaking invitations, and partnerships coming to you. No cold outreach required.',
  },
  {
    title: 'Build unmatched trust and authority',
    body: 'Earn the credibility that makes people choose you before they have even spoken to you. Reputation that compounds.',
  },
]

const CREDENTIALS = [
  {
    title: '$153M+ in assets under management',
    body: 'All capital partners found her through LinkedIn content.',
  },
  {
    title: 'Invited to the UN General Assembly',
    body: 'Recognised as a global voice in finance and leadership.',
  },
  {
    title: '16,000+ high-value followers',
    body: 'Built organically, zero paid advertising.',
  },
  {
    title: 'Secured global speaking engagements',
    body: 'All opportunities attracted through content, zero cold outreach.',
  },
]

const PROOF_STATS = [
  { value: '15K+', label: 'High-value followers built organically' },
  { value: '$40M+', label: 'Capital raised using the LinkedIn Unlocked strategy' },
  { value: '120+', label: 'Active investors attracted through content' },
]

/*
 * Ordered as a walk toward the webinar: hook, what changes, the reframe, proof,
 * who is teaching it, the curriculum, then the ways in. The free webinar is the
 * repeated ask — it is the page's real conversion, not the checkout.
 */
export default function Course() {
  return (
    <>
      <CourseHero />

      <CardMarquee
        eyebrow="What changes for you"
        title="Four things LinkedIn Unlocked delivers."
        items={CHANGES}
        ctaLabel="Join the Free Webinar"
        ctaTo="#events"
      />

      <SageFeature
        title="The algorithm isn’t against you. You just haven’t been given the system."
        body="Most professionals post into the void because nobody handed them a repeatable method. LinkedIn Unlocked is that method: positioning, profile, content, conversations and follow-up, in the order they actually work."
        videoUrl="https://www.youtube.com/watch?v=8znehZDXdaY"
        videoTitle="LinkedIn Unlocked — course introduction"
        videoCaption="Start here: a short introduction to how the course works."
      />

      <CourseStats
        eyebrow="Trusted by professionals across industries"
        stats={PROOF_STATS}
      />

      <TrustedBy />

      <BulletSplit
        flip
        badge={false}
        eyebrow="Meet your instructor"
        title="Dr. Nkem Ezeamama"
        image="/team/nkem-ezeamama.jpg"
        imageAlt="Dr. Nkem Ezeamama"
        body="Three years ago, I was an ER physician working 12-hour shifts with no audience, network, or platform. After realising expertise alone wasn’t enough, I intentionally built my presence on LinkedIn, post by post, connection by connection. That strategy helped me secure global speaking engagements, build a million-dollar real estate firm, and raise $153M AUM. Now I’m teaching the exact system I used, so other professionals can grow their influence, expand their opportunities, and achieve their biggest goals."
        items={CREDENTIALS}
        ctaLabel="Join the Free Webinar"
        ctaTo="#events"
      />

      <Process />

      <GrowthBanner
        tone="gold"
        wide
        title="Ready to build visibility that lasts?"
        body="Join the current cohort and start seeing results this week. One-time investment · Lifetime access · 30-day guarantee."
        ctaLabel="Join the Free Webinar"
        ctaTo="#events"
        videoUrl="https://www.youtube.com/watch?v=sbLVlEW_ibU"
        videoTitle="LinkedIn Unlocked — the strategy in action"
      />

      {/* The webinar itself, with its countdown, sits at the decision point. */}
      <UpcomingEvents />

      <ThreeWays
        eyebrow="Enroll today"
        title="Two paths. Same destination."
        body="Learn it yourself or have it built for you. Either way, lifetime access."
        ways={COURSE_WAYS}
      />

      <Testimonials />

      <GrowthBanner
        tone="sage"
        wide
        title="You can stay the best-kept secret. Or you can become undeniable."
        body="There is no algorithm keeping you stuck. No gatekeeper holding you back. Only a system you haven’t learned yet, and a community that’s waiting to watch you win."
        ctaLabel="Join the Free Webinar"
        ctaTo="#events"
      />

      <Newsletter />
      <Blog />
    </>
  )
}
