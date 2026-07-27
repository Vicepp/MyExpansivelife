import { Container } from './primitives'
import Reveal from './Reveal'

const STEPS = [
  {
    n: '01',
    title: 'Positioning & Profile',
    body: 'Get clear on who you serve and how you want to be known, then rebuild your profile into a persuasive introduction: banner, headline, Featured section and booking link included.',
  },
  {
    n: '02',
    title: 'Lead Magnets & Content',
    body: 'Give people a reason to take the next step. Learn the five post types built to convert, plus a 30-day content system so you’re never starting from a blank page.',
  },
  {
    n: '03',
    title: 'Network & Discovery',
    body: 'Use the Network tab, profile viewers, search and Sales Navigator to find the people who are actually a fit, instead of collecting random connections.',
  },
  {
    n: '04',
    title: 'Messaging & Relationships',
    body: 'A five-part DM framework for opening conversations that don’t sound automated, and knowing exactly when someone’s ready to talk further.',
  },
  {
    n: '05',
    title: 'Lead Tracking',
    body: 'A simple CRM-style system so no promising conversation gets lost in your inbox again.',
  },
  {
    n: '06',
    title: 'Calls, Objections & Conversion',
    body: 'How to run a discovery call, handle hesitation with confidence, spot red flags early, and close the loop clearly either way.',
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
      </Container>
    </section>
  )
}
