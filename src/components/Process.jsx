import { Container } from './primitives'
import Reveal from './Reveal'
import VideoEmbed from './VideoEmbed'

/** The six modules, worded as they appear on the LinkedIn Unlocked page. */
const STEPS = [
  {
    n: '01',
    title: 'Personal Brand Strategy',
    body: 'Define your niche, your voice, and your positioning so that every piece of content you create is working toward the same goal.',
  },
  {
    n: '02',
    title: 'Profile Optimization for Trust',
    body: 'Transform your profile from a resume into a trust-building landing page that compels the right people to reach out to you.',
  },
  {
    n: '03',
    title: 'Content Creation System',
    body: '5-post system. Content calendar. Done-for-you templates. Consistent 5,000+ impressions.',
  },
  {
    n: '04',
    title: 'Growth & Engagement Strategy',
    body: 'How to grow strategically, engage authentically, and build a network of people who actually want what you’re offering.',
  },
  {
    n: '05',
    title: 'DM Scripts & Conversion Psychology',
    body: 'Word-for-word scripts to open conversations, spot real intent, and guide relationships from a comment to a committed call.',
  },
  {
    n: '06',
    title: 'Mini CRM & Email Integration',
    body: 'Build a simple pipeline to track leads, set up your Mailchimp sequences, and never let a warm connection fall through the cracks.',
  },
]

/** Oversized watermark arrow sitting behind each card's top-right corner. */
function ArrowWatermark() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="pointer-events-none absolute right-5 top-3 size-24 text-gold/12"
      fill="none"
    >
      <path
        d="M7 17 17 7m0 0H8m9 0v9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function Process() {
  return (
    <section className="bg-cream py-20 lg:py-24">
      <Container>
        <Reveal>
          <p className="text-center text-[16px] font-semibold text-gold">
            The LinkedIn Unlocked process
          </p>
          <h2 className="mt-3 text-center font-display text-[32px] leading-[1.2] text-forest lg:text-[42px]">
            One connected journey, <br className="hidden sm:inline" />
            not a pile of tips.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={(i % 3) * 120} className="flex">
              <article className="card-lift relative grow overflow-hidden rounded-2xl bg-white p-7">
                <ArrowWatermark />
                <p className="relative text-[22px] font-bold text-forest-deep">
                  {s.n}
                </p>
                <h3 className="relative mt-6 text-[17px] font-bold text-gold">
                  {s.title}
                </h3>
                <p className="relative mt-3 text-[13px] leading-relaxed text-ink/75">
                  {s.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={140} className="mx-auto mt-14 max-w-[860px]">
          <VideoEmbed
            url="https://www.youtube.com/watch?v=sbLVlEW_ibU"
            title="LinkedIn Unlocked — the strategy in action"
          />
        </Reveal>
      </Container>
    </section>
  )
}
