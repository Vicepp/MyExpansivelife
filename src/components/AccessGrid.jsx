import { Container, TextLink } from './primitives'
import Reveal from './Reveal'

const SPACES = [
  {
    title: 'Introduce Yourself',
    body: "A warm welcome space to share who you are, what you're building, and what you're hoping to get out of being here, from day one.",
  },
  {
    title: 'General Topics',
    body: 'The main conversation feed: career, business, wealth and life decisions, worked through in the open with people who get it.',
  },
  {
    title: 'Daily Inspirations',
    body: 'Short prompts to start your day with more focus. Less "motivational quote," more "actually make you think."',
  },
  {
    title: 'Wins & Celebrations',
    body: 'A place to post the launch, the offer, the milestone, the decision. Every kind of progress is worth marking here.',
  },
  {
    title: 'Investing Basics',
    body: 'Plain-language lessons on turning income into ownership, assets and long-term financial confidence.',
  },
  {
    title: 'Resource Hub',
    body: "A warm welcome space to share who you are, what you're building, and what you're hoping to get out of being here, from day one.",
  },
]

/** Oversized watermark arrow sitting behind each card's top-right corner. */
function ArrowWatermark() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="pointer-events-none absolute -top-1 right-4 size-28 text-gold/20"
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

export default function AccessGrid() {
  return (
    <section className="bg-brown py-20 lg:py-24">
      <Container>
        <Reveal>
          <h2 className="text-center text-[30px] font-bold tracking-tight text-white lg:text-[40px]">
            What You Get Access To.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SPACES.map((s, i) => (
            <Reveal key={s.title} delay={(i % 3) * 120} className="flex">
              <article className="card-lift relative grow overflow-hidden rounded-2xl bg-white p-7">
                <ArrowWatermark />
                <h3 className="relative text-[19px] font-bold text-brown">
                  {s.title}
                </h3>
                <p className="relative mt-3 text-[13px] leading-relaxed text-ink/75">
                  {s.body}
                </p>
                <TextLink to="/community" className="relative mt-6">
                  Explore the Circle
                </TextLink>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <TextLink to="/community" className="!text-white">
            See All
          </TextLink>
        </div>
      </Container>
    </section>
  )
}
