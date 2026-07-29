import { Container, TextLink } from './primitives'
import Reveal from './Reveal'
import { COMMUNITY_URL, COURSE_URL } from '../lib/links'

const HOME_WAYS = [
  {
    n: '01',
    title: 'Community',
    body: 'A private home base for learning, connection and weekly accountability, including our live Monday Momentum session.',
    cta: 'Explore the Circle',
    to: COMMUNITY_URL,
  },
  {
    n: '02',
    title: 'LinkedIn Unlocked',
    body: 'A practical, step-by-step system for turning your LinkedIn presence into real visibility, leads and revenue.',
    cta: 'Explore the Course',
    to: '/courses/linkedin-unlocked',
  },
  {
    n: '03',
    title: 'Affiliate Programme',
    body: "Share LinkedIn Unlocked with people who'd genuinely benefit, and earn 20% on every enrolment you bring in.",
    cta: 'Become an affiliate',
    to: '/affiliate',
  },
]

/** The three enrolment routes, for the course page. */
export const COURSE_WAYS = [
  {
    n: '01',
    title: 'Cohort programme — $2,497',
    body: 'Six modules, templates, Sales Navigator setup, the AI toolkit, weekly live Q&A calls and peer community access. One-time investment, lifetime access, 30-day guarantee.',
    cta: 'Enroll Now',
    to: COURSE_URL,
  },
  {
    n: '02',
    title: 'Done-for-you',
    body: 'Our team builds the whole system: full LinkedIn setup, starter posts and DM sequences, Sales Navigator filters, an analytics dashboard, then ongoing monitoring and scaling support.',
    cta: 'Schedule a Strategy Call',
    to: COURSE_URL,
  },
  {
    n: '03',
    title: 'Start free',
    body: 'Not ready to enrol? Join the next live webinar, see the system in full, and decide afterwards. No cost and nothing to cancel.',
    cta: 'Join the Free Webinar',
    to: '#events',
  },
]

export default function ThreeWays({
  title = 'Three ways to get in.',
  ways = HOME_WAYS,
}) {
  return (
    <section className="bg-gold py-20 lg:py-24">
      <Container>
        <Reveal>
          <h2 className="text-center text-[30px] font-bold uppercase tracking-tight text-white lg:text-[40px]">
            {title}
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {ways.map((w, i) => (
            <Reveal key={w.n} delay={i * 120} className="flex">
              <article className="card-lift flex grow flex-col rounded-2xl bg-white p-8 lg:p-9">
                <p className="text-right text-[64px] font-bold leading-none text-gold lg:text-[76px]">
                  {w.n}
                </p>
                <h3 className="mt-4 text-[19px] font-bold text-forest-deep">
                  {w.title}
                </h3>
                <p className="mt-3 grow text-[13.5px] leading-relaxed text-ink/75">
                  {w.body}
                </p>
                <TextLink to={w.to} className="mt-7">
                  {w.cta}
                </TextLink>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
