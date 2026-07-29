import { useState } from 'react'
import { Button } from './primitives'
import Reveal from './Reveal'
import { COMMUNITY_URL } from '../lib/links'
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
  body,
  items,
  ctaLabel = 'Join Our Community',
  ctaTo = COMMUNITY_URL,
  image = groupPhoto,
  imageAlt = 'The My Expansive Life community at a live event',
  flip = false,
  badge = true,
}) {
  const [failed, setFailed] = useState(false)

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
            {body && (
              <Reveal delay={140}>
                <p className="mt-5 max-w-[520px] text-[14.5px] leading-relaxed text-ink/75">
                  {body}
                </p>
              </Reveal>
            )}

            <Reveal delay={170}>
              {/* Items are plain strings, or { title, body } for a bold lead-in. */}
              <ul className="mt-7 space-y-3">
                {items.map((item) => {
                  const title = typeof item === 'string' ? null : item.title
                  const text = typeof item === 'string' ? item : item.body
                  return (
                    <li
                      key={title ?? text}
                      className="flex gap-3 text-[14.5px] leading-relaxed text-ink/85"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-2 size-1 shrink-0 rounded-full bg-ink/60"
                      />
                      <span>
                        {title && (
                          <strong className="block font-semibold text-forest-deep">
                            {title}
                          </strong>
                        )}
                        {text}
                      </span>
                    </li>
                  )
                })}
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
        <div className={`relative ${flip ? 'lg:order-first' : ''}`}>
          <img
            src={failed ? groupPhoto : image}
            alt={imageAlt}
            // Lets a portrait be dropped into /public without risking a broken
            // image if the file is not there yet.
            onError={() => setFailed(true)}
            className="h-64 w-full object-cover object-top sm:h-96 lg:h-full"
          />
          {badge && (
            <img
              src={awardBadge}
              alt="Number one best award, 2023"
              // clipped to a circle: the crop carries cream corners that would
              // otherwise show as a square against the photo
              className={`absolute top-[72%] aspect-square w-24 -translate-y-1/2 rounded-full object-cover lg:w-32 ${
                flip ? 'right-0 translate-x-1/2' : 'left-0 -translate-x-1/2'
              }`}
            />
          )}
        </div>
      </div>
    </section>
  )
}
