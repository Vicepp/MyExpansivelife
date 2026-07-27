import { Container } from './primitives'
import Reveal, { CountUp } from './Reveal'
import videoThumb from '../assets/design/video-thumb.jpg'

const STATS = [
  { value: '$153.5M', label: 'Generate Rales' },
  { value: '150+', label: 'Grew Revenue' },
  { value: '20%', label: 'Commission' },
  { value: '10+', label: 'Growth Pillars' },
]

export default function Problem() {
  return (
    <>
      <section className="bg-brown pt-20 lg:pt-24">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-16">
            <Reveal>
              <h2 className="font-display text-[32px] leading-[1.2] text-white lg:text-[42px]">
                You&rsquo;re not confused about your ambition. You&rsquo;re missing a
                room to work it out in.
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="max-w-[460px] text-[15px] leading-relaxed text-white/85 lg:mt-2">
                You don&rsquo;t need more motivation you need a space where your
                ideas can be challenged, refined, and turned into clear action
                alongside people who are building just like you.
              </p>
            </Reveal>
          </div>

          {/* Bottom edge is square in the design — the frame meets the stats strip flush. */}
          <Reveal delay={100} className="relative mt-14 overflow-hidden rounded-t-3xl">
            <img
              src={videoThumb}
              alt="Members working through ideas together"
              className="w-full object-cover"
            />
          </Reveal>
        </Container>
      </section>

      <section className="bg-white py-12 lg:py-14">
        <Container>
          <dl className="grid grid-cols-2 gap-y-10 lg:grid-cols-4">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 90} className="text-center">
                <dt className="text-[34px] font-bold leading-none text-forest-deep lg:text-[40px]">
                  <CountUp value={s.value} />
                </dt>
                <dd className="mt-2 text-[15px] text-ink/80">{s.label}</dd>
              </Reveal>
            ))}
          </dl>
        </Container>
      </section>
    </>
  )
}
