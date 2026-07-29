import { Container, Button } from './primitives'
import Reveal, { TextReveal } from './Reveal'
import { COMMUNITY_URL } from '../lib/links'

export default function BlogHero() {
  return (
    <section className="bg-cream pb-20 pt-10 lg:pb-24 lg:pt-14">
      <Container>
        <div className="mx-auto max-w-[760px] text-center">
          <TextReveal
            as="h1"
            className="font-display text-[38px] leading-display text-forest sm:text-[50px] lg:text-[58px]"
            segments={[
              { text: 'Ideas for the life you’re' },
              { br: true, className: 'hidden lg:inline' },
              { text: 'building beyond', className: 'text-gold-text' },
              { text: 'your title.' },
            ]}
          />
          <Reveal delay={120}>
            <p className="mx-auto mt-6 max-w-[560px] text-[15px] leading-relaxed text-ink/75">
              Straightforward, practical writing on personal branding, LinkedIn
              strategy, investing and building a career that expands instead of
              confines.
            </p>
          </Reveal>
          <Reveal delay={220}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button variant="solid" to={COMMUNITY_URL}>
                Join Our Community
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
