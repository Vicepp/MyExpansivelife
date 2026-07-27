import { Container, Button } from './primitives'
import Reveal, { CountUp, TextReveal } from './Reveal'
import cluster from '../assets/design/course-hero-cluster.png'

const STATS = [
  { value: '09', label: 'Core teaching areas' },
  { value: '41', label: 'Lessons, start to finish' },
  { value: '$153.5M', label: 'Deals traced' },
  { value: '73K+', label: 'Impressions' },
]

export function CourseStats() {
  return (
    <section className="bg-white py-12 lg:py-14">
      <Container>
        <dl className="grid grid-cols-2 gap-y-10 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 90} className="text-center">
              <dt className="text-[34px] font-bold leading-none text-gold lg:text-[40px]">
                <CountUp value={s.value} />
              </dt>
              <dd className="mt-2 text-[15px] text-ink/80">{s.label}</dd>
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
              segments={[{ text: 'Stop being your industry’s best-kept secret.' }]}
            />
            <Reveal delay={180}>
              <p className="mt-5 max-w-[480px] text-[15px] leading-relaxed text-ink/80">
                A practical system for turning your LinkedIn profile into a working
                business tool, one that leads to real conversations and real
                opportunities.
              </p>
            </Reveal>
            <Reveal delay={270}>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button variant="solid" to="/courses/linkedin-unlocked">
                  Enroll Now
                </Button>
                <Button variant="outline" to="/affiliate">
                  Earn 20% promoting it
                </Button>
              </div>
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
