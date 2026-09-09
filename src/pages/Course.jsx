import Seo from '../components/Seo'
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
  'Build a community of 16,000+ professionals',
  'Attract capital partners for a firm with $153M+ in assets under management',
  'Secure global speaking opportunities',
  'Earn an invitation to the UN General Assembly',
]

const PROOF_STATS = [
  { value: '15K+', label: 'High-value followers built organically' },
  { value: '$40M+', label: 'Capital raised using the LinkedIn Unlocked strategy' },
  { value: '150+', label: 'Active investors attracted through content' },
]

/*
 * Ordered as a walk toward the webinar: hook, what changes, the reframe, proof,
 * who is teaching it, the curriculum, then the ways in. The free webinar is the
 * repeated ask — it is the page's real conversion, not the checkout.
 */
export default function Course() {
  return (
    <>
      <Seo
        title="LinkedIn Unlocked"
        description="Position your expertise, tell stories that build trust, and create content that attracts the right opportunities — without pretending to be an influencer."
        path="/courses/linkedin-unlocked"
      />
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
        eyebrow="Meet the instructor"
        title="Dr. Nkem Ezeamama"
        image="/team/nkem-ezeamama.jpg"
        imageAlt="Dr. Nkem Ezeamama"
        body={[
          'Three years ago, Dr. Nkem Ezeamama was an ER physician working 12-hour shifts. She had the experience, but beyond the hospital walls, very few people knew her name or what she could offer.',
          'So, she began sharing her story and expertise on LinkedIn, one honest post and one genuine connection at a time. That decision helped her:',
        ]}
        items={CREDENTIALS}
        note="LinkedIn didn’t change what Dr. Nkem knew. It helped the right people see it. Now, she’s helping other professionals do the same."
        ctaLabel="Join the Free Webinar"
        ctaTo="#events"
      />

      <Process />

      <ThreeWays
        eyebrow="Enroll today"
        title="Two paths. Same destination."
        body="Learn it yourself or have it built for you. Either way, lifetime access."
        ways={COURSE_WAYS}
      />

      <GrowthBanner
        tone="gold"
        wide
        title="Ready to build visibility that lasts?"
        body="Join the current cohort and start seeing results this week. One-time investment · Lifetime access · 30-day guarantee."
        ctaLabel="Join the Free Webinar"
        ctaTo="#events"
      />

      {/* The webinar itself, with its countdown, sits at the decision point. */}
      <UpcomingEvents />

      <Testimonials />

      <Blog />
    </>
  )
}
