import { Container, Button } from './primitives'
import Reveal from './Reveal'
import sageArt from '../assets/design/growth-art.png'
import goldArt from '../assets/design/course-gold-art.png'

/**
 * The wide CTA band. Two colourways exist on the board — sage on the marketing
 * pages, gold on the course page — sharing the same photo treatment.
 */
const TONES = {
  sage: { bg: 'bg-sage', art: sageArt, button: 'gold' },
  gold: { bg: 'bg-gold', art: goldArt, button: 'dark' },
}

export default function GrowthBanner({
  tone = 'sage',
  title,
  body = "We're not here to talk anyone out of the career they've worked hard for.",
  ctaLabel,
  ctaTo = '/community',
  wide = false,
}) {
  const t = TONES[tone]

  return (
    <section
      className={`relative flex items-center overflow-hidden lg:min-h-[566px] ${t.bg}`}
    >
      {/* Artwork carries its own backdrop, so it blends into the section fill. */}
      <Reveal
        delay={150}
        y={0}
        className="pointer-events-none absolute inset-y-0 right-0 hidden lg:block"
      >
        <img
          src={t.art}
          alt=""
          aria-hidden="true"
          className="h-full w-auto max-w-none object-cover object-left"
        />
      </Reveal>

      <Container className="relative">
        <div className={`py-16 lg:py-24 ${wide ? 'max-w-[620px]' : 'max-w-[460px]'}`}>
          <Reveal>
            <h2 className="text-[32px] font-bold leading-headline text-white lg:text-[42px]">
              {title}
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-4 max-w-[360px] text-[15px] leading-relaxed text-white/90">
              {body}
            </p>
          </Reveal>
          <Reveal delay={220}>
            <Button variant={t.button} to={ctaTo} className="mt-8">
              {ctaLabel}
            </Button>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
