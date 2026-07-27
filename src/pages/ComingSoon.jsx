import { Container, Button } from '../components/primitives'

/**
 * Placeholder for routes that exist in the navigation but have no design on the
 * board yet (Community, Affiliate, the two unreleased courses).
 */
export default function ComingSoon({ title }) {
  return (
    <section className="bg-cream py-28 text-center lg:py-36">
      <Container>
        <p className="text-[12px] font-medium uppercase tracking-[0.28em] text-ink/60">
          My Expansive Life
        </p>
        <h1 className="mx-auto mt-5 max-w-[620px] font-display text-[38px] leading-[1.1] text-forest lg:text-[52px]">
          {title}
        </h1>
        <p className="mx-auto mt-5 max-w-[420px] text-[15px] leading-relaxed text-ink/75">
          This page hasn&rsquo;t been designed yet. In the meantime, explore the
          course or read the latest writing.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button variant="solid" to="/courses/linkedin-unlocked">
            Explore Course
          </Button>
          <Button variant="outline" to="/blogs">
            Read the blog
          </Button>
        </div>
      </Container>
    </section>
  )
}
