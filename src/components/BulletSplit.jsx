import { Button } from './primitives'
import Reveal from './Reveal'
import groupPhoto from '../assets/design/group-photo.jpg'
import awardBadge from '../assets/design/award-badge.png'

/**
 * Cream copy column with a checklist beside the full-bleed community photo.
 * Shared by the community ("Is this you?") and affiliate ("What you receive")
 * pages, which differ only in wording.
 */
export default function BulletSplit({
  eyebrow,
  title,
  items,
  ctaLabel = 'Join Our Community',
  ctaTo = '/community',
}) {
  return (
    <section className="bg-cream">
      <div className="grid lg:grid-cols-[minmax(0,56%)_minmax(0,44%)]">
        <div className="flex items-center px-6 py-16 lg:py-24 lg:pl-[max(2.5rem,calc((100vw-1200px)/2+2.5rem))] lg:pr-16">
          <div className="max-w-[560px]">
            <Reveal>
              <p className="text-[14px] font-semibold text-gold">{eyebrow}</p>
            </Reveal>
            <Reveal delay={90}>
              <h2 className="mt-3 font-display text-[30px] leading-[1.18] text-forest lg:text-[42px]">
                {title}
              </h2>
            </Reveal>
            <Reveal delay={170}>
              <ul className="mt-7 space-y-3">
                {items.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-[14.5px] leading-relaxed text-ink/85"
                  >
                    <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-ink/60" />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={250}>
              <Button variant="solid" to={ctaTo} icon className="mt-9">
                {ctaLabel}
              </Button>
            </Reveal>
          </div>
        </div>

        {/* No overflow-hidden — the award badge deliberately overhangs the edge. */}
        <div className="relative">
          <img
            src={groupPhoto}
            alt="The My Expansive Life community at a live event"
            className="h-64 w-full object-cover sm:h-96 lg:h-full"
          />
          <img
            src={awardBadge}
            alt="Number one best award, 2023"
            // clipped to a circle: the crop carries cream corners that would
            // otherwise show as a square against the photo
            className="absolute left-0 top-[72%] aspect-square w-24 -translate-x-1/2 -translate-y-1/2 rounded-full object-cover lg:w-32"
          />
        </div>
      </div>
    </section>
  )
}
