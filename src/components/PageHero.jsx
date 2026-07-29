import { Container, Button } from './primitives'
import Reveal, { TextReveal } from './Reveal'
import communityCluster from '../assets/design/community-hero-cluster.png'

/**
 * Left-aligned hero used by the community and affiliate pages. The community
 * variant carries the photo cluster; the affiliate one is copy only.
 */
export default function PageHero({ lead, accent, body, cluster = false }) {
  return (
    <section className="bg-cream pb-16 pt-6 lg:pb-20">
      <Container>
        <div
          className={
            cluster
              ? 'grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,470px)]'
              : ''
          }
        >
          <div className="max-w-[620px]">
            <TextReveal
              as="h1"
              className="font-display text-[38px] leading-display text-forest sm:text-[46px] lg:text-[54px]"
              segments={[
                { text: lead },
                { text: accent, className: 'text-gold-text' },
              ]}
            />
            <Reveal delay={120}>
              <p className="mt-5 max-w-[500px] text-[15px] leading-relaxed text-ink/80">
                {body}
              </p>
            </Reveal>
            <Reveal delay={220}>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button variant="solid" to={COMMUNITY_URL}>
                  Join Our Community
                </Button>
                <Button variant="outline" to="/courses/linkedin-unlocked">
                  Explore Course
                </Button>
              </div>
            </Reveal>
          </div>

          {cluster && (
            <Reveal delay={200} className="hidden lg:block">
              <img
                src={communityCluster}
                alt=""
                aria-hidden="true"
                className="w-full"
              />
            </Reveal>
          )}
        </div>
      </Container>
    </section>
  )
}
