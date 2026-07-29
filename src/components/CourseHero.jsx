import { Container, Button } from './primitives'
import Reveal, { CountUp, TextReveal } from './Reveal'
import { COURSE_URL } from '../lib/links'
import cluster from '../assets/design/course-hero-cluster.png'

/** Figures from the LinkedIn Unlocked sales page. */
const STATS = [
  { value: '15,000+', label: 'Followers built organically' },
  { value: '$40M+', label: 'Capital raised' },
  { value: '120+', label: 'Investors attracted' },
  { value: '41', label: 'Lessons, start to finish' },
]

export function CourseStats({ eyebrow, stats = STATS }) {
  return (
    <section className="bg-white py-12 lg:py-14">
      <Container>
        {eyebrow && (
          <Reveal>
            <p className="mb-8 text-center text-[12px] font-semibold uppercase tracking-[0.2em] text-ink/55">
              {eyebrow}
            </p>
          </Reveal>
        )}
        <dl
          className={`grid gap-y-10 ${stats.length === 3 ? 'sm:grid-cols-3' : 'grid-cols-2 lg:grid-cols-4'}`}
        >
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 90} className="px-4 text-center">
              <dt className="text-[34px] font-bold leading-none text-gold lg:text-[42px]">
                <CountUp value={s.value} />
              </dt>
              <dd className="mx-auto mt-2 max-w-[230px] text-[14px] leading-snug text-ink/80">
                {s.label}
              </dd>
            </Reveal>
          ))}
        </dl>
      </Container>
    </section>
  )
}

export default function CourseHero() {
  return (
    <section className="bg-cream pb-12 pt-6 lg:pb-16">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
          <div>
            <Reveal>
              <p className="text-[12px] font-medium uppercase tracking-[0.28em] text-ink/60">
                MXL Course: LinkedIn Unlocked
              </p>
            </Reveal>
            <TextReveal
              as="h1"
              delay={90}
              className="mt-5 font-display text-[38px] leading-display text-forest sm:text-[48px] lg:text-[56px]"
              segments={[
                { text: 'Get known for what you do' },
                { text: 'best.', className: 'text-gold-text' },
              ]}
            />
            <Reveal delay={180}>
              <p className="mt-5 max-w-[480px] text-[15px] leading-relaxed text-ink/80">
                Transform your LinkedIn profile to attract the opportunities that
                match your expertise.
              </p>
            </Reveal>
            <Reveal delay={270}>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button variant="solid" to={COURSE_URL}>
                  Enroll Now
                </Button>
                <Button variant="outline" to="#events">
                  Join the Free Webinar
                </Button>
              </div>
            </Reveal>
            <Reveal delay={330}>
              <p className="mt-6 text-[13.5px] text-ink/65">
                One-time investment · Lifetime access · 30-day guarantee
              </p>
            </Reveal>
          </div>

          <Reveal delay={200} className="hidden lg:block">
            <img src={cluster} alt="" aria-hidden="true" className="w-full" />
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
