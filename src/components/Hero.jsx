import { Container, Button } from './primitives'
import Reveal, { TextReveal } from './Reveal'
import clusterLeft from '../assets/design/hero-cluster-left.png'
import clusterRight from '../assets/design/hero-cluster-right.png'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-cream pb-20 pt-8 lg:pb-28">
      {/* Photo clusters are baked onto the same cream as the section, so they sit flush. */}
      <Reveal
        delay={250}
        y={0}
        className="pointer-events-none absolute left-0 top-16 hidden w-[200px] xl:block 2xl:left-12"
      >
        <img src={clusterLeft} alt="" aria-hidden="true" className="w-full" />
      </Reveal>
      <Reveal
        delay={350}
        y={0}
        className="pointer-events-none absolute right-0 top-14 hidden w-[170px] xl:block 2xl:right-12"
      >
        <img src={clusterRight} alt="" aria-hidden="true" className="w-full" />
      </Reveal>

      <Container className="relative">
        <div className="mx-auto max-w-[720px] text-center">
          {/* Line breaks are set by hand to match the three-line ragging in the design. */}
          <TextReveal
            as="h1"
            className="font-display text-[42px] leading-[1.08] text-forest sm:text-[56px] lg:text-[64px]"
            segments={[
              { text: 'Your career was' },
              { br: true, className: 'hidden lg:inline' },
              { text: 'never meant to be the' },
              { br: true, className: 'hidden lg:inline' },
              { text: 'whole story.', className: 'text-gold-text' },
            ]}
          />
          <Reveal delay={120}>
            <p className="mx-auto mt-7 max-w-[540px] text-[16px] leading-relaxed text-ink/75">
              You built a career worth being proud of. Now it&rsquo;s time to build
              everything else, on your own terms.
            </p>
          </Reveal>
          <Reveal delay={220}>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Button variant="solid" to="/community">
                Get started
              </Button>
              <Button variant="outline" to="/courses/linkedin-unlocked">
                Explore Course
              </Button>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
