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

/** The two enrolment paths, for the course page. */
export const COURSE_WAYS = [
  {
    n: '01',
    title: 'Cohort',
    includes: [
      '6 modules: positioning, profile, content, network, DMs, and lead pipeline',
      'Post templates, DM scripts, and swipe files — ready to use',
      'Sales Navigator setup and mini CRM to track warm leads',
      'AI toolkit: a week of content in under 2 hours',
      'Weekly live Q&A calls with Dr. Nkem and the team',
      'Peer community for accountability, networking, and momentum',
    ],
    cta: 'Join the Free Webinar',
    to: '#events',
  },
  {
    n: '02',
    title: 'Let’s talk',
    includes: [
      'Everything in the Cohort Program',
      'Full LinkedIn profile and branding setup, built by our team to position you as the authority',
      'Starter posts, DM sequences, and repurposing flow, written and scheduled to launch your strategy',
      'Sales Navigator filters, lead engagement system, and full pipeline mapped for you',
      'Analytics dashboard, post-engagement workflow, and complete operating manual',
      'Ongoing system monitoring and scaling support',
    ],
    cta: 'Schedule a Strategy Call',
    to: COURSE_URL,
  },
]

export default function ThreeWays({
  eyebrow,
  title = 'Three ways to get in.',
  body,
  ways = HOME_WAYS,
}) {
  return (
    <section className="bg-gold py-20 lg:py-24">
      <Container>
        <Reveal>
          {eyebrow && (
            <p className="text-center text-[13px] font-semibold uppercase tracking-[0.2em] text-white/75">
              {eyebrow}
            </p>
          )}
          <h2 className="mt-3 text-center text-[30px] font-bold uppercase tracking-tight text-white lg:text-[40px]">
            {title}
          </h2>
          {body && (
            <p className="mx-auto mt-4 max-w-[520px] text-center text-[15px] leading-relaxed text-white/85">
              {body}
            </p>
          )}
        </Reveal>

        <div
          className={`mt-12 grid gap-6 ${ways.length === 2 ? 'mx-auto max-w-[860px] md:grid-cols-2' : 'md:grid-cols-3'}`}
        >
          {ways.map((w, i) => (
            <Reveal key={w.n} delay={i * 120} className="flex">
              <article className="card-lift flex grow flex-col rounded-2xl bg-white p-8 lg:p-9">
                <p className="text-right text-[64px] font-bold leading-none text-gold lg:text-[76px]">
                  {w.n}
                </p>
                <h3 className="mt-4 text-[19px] font-bold text-forest-deep">
                  {w.title}
                </h3>
                {w.body && (
                  <p className="mt-3 text-[13.5px] leading-relaxed text-ink/75">
                    {w.body}
                  </p>
                )}
                {w.includes && (
                  <ul className="mt-4 grow space-y-2.5">
                    {w.includes.map((item) => (
                      <li
                        key={item}
                        className="flex gap-2.5 text-[13px] leading-relaxed text-ink/80"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="mt-0.5 size-4 shrink-0 text-gold"
                          fill="none"
                          aria-hidden="true"
                        >
                          <path
                            d="m5 13 4 4L19 7"
                            stroke="currentColor"
                            strokeWidth="2.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
                {!w.includes && <span className="grow" />}
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
