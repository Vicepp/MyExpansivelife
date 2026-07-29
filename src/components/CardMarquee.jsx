import { Container, Button } from './primitives'
import Reveal from './Reveal'

/**
 * Heading plus a row of cards drifting continuously to the left.
 *
 * The list is rendered twice and the track animates to -50%, so the loop is
 * seamless. Hovering pauses it, and prefers-reduced-motion stops it entirely —
 * the cards are still readable and scrollable by hand either way.
 */
export default function CardMarquee({
  eyebrow,
  title,
  body,
  items,
  ctaLabel,
  ctaTo,
  duration = '46s',
}) {
  return (
    <section className="overflow-hidden bg-cream py-20 lg:py-24">
      <Container>
        <div className="max-w-[620px]">
          {eyebrow && (
            <Reveal>
              <p className="text-[14px] font-semibold text-gold">{eyebrow}</p>
            </Reveal>
          )}
          <Reveal delay={90}>
            <h2 className="mt-3 font-display text-[30px] leading-[1.18] text-forest lg:text-[42px]">
              {title}
            </h2>
          </Reveal>
          {body && (
            <Reveal delay={150}>
              <p className="mt-5 text-[15px] leading-relaxed text-ink/75">{body}</p>
            </Reveal>
          )}
        </div>
      </Container>

      <div className="marquee mt-12" style={{ '--marquee-duration': duration }}>
        <div className="marquee-track gap-6 pr-6">
          {/* Rendered twice: the second pass is what makes the loop seamless. */}
          {[0, 1].flatMap((pass) =>
            items.map((item, i) => (
              <article
                key={`${pass}-${item.title}`}
                aria-hidden={pass === 1}
                className="flex w-[280px] shrink-0 flex-col rounded-2xl bg-white p-7 shadow-[0_10px_30px_-22px_rgb(43_34_25/0.5)] sm:w-[330px]"
              >
                <span className="text-[13px] font-bold text-gold">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-4 text-[17px] font-bold leading-snug text-forest-deep">
                  {item.title}
                </h3>
                <p className="mt-3 text-[13.5px] leading-relaxed text-ink/75">
                  {item.body}
                </p>
              </article>
            )),
          )}
        </div>
      </div>

      {ctaLabel && (
        <Container>
          <Reveal delay={120}>
            <Button variant="solid" to={ctaTo} icon className="mt-12">
              {ctaLabel}
            </Button>
          </Reveal>
        </Container>
      )}
    </section>
  )
}
