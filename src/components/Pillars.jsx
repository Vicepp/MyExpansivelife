import { useEffect, useRef, useState } from 'react'
import { Container } from './primitives'
import Reveal from './Reveal'

/**
 * The six growth pillars everything on the site maps back to. Sits directly
 * under the home hero — the stats strip counts these, so the "6 Growth Pillars"
 * figure in Problem.jsx and the length of this list have to stay in step.
 *
 * The cards stack: each one is sticky at a slightly lower offset than the last,
 * so scrolling deals them over each other and leaves the previous headings
 * visible as a rail down the top. Photos are read from /public/pillars — a
 * missing file falls back to the tinted art panel, so the section is never
 * broken while the photography is still being shot.
 */
const PILLARS = [
  {
    n: '01',
    label: 'Career & Identity',
    title: 'You are more than your job title.',
    body: "Clarity on what's next, how to reposition your expertise, and how to leave room for more than one ambition at a time.",
    image: '/pillars/career-identity.jpg',
    tone: 'forest',
  },
  {
    n: '02',
    label: 'Brand & Visibility',
    title: "Being good at your job isn't the same as being known for it.",
    body: 'Personal brand, LinkedIn strategy and storytelling that turn your experience into something people recognise and trust.',
    image: '/pillars/brand-visibility.jpg',
    tone: 'gold',
  },
  {
    n: '03',
    label: 'Entrepreneurship',
    title: 'Turn what you know into something that runs without you.',
    body: 'Building an offer, a service or a product alongside a demanding career, and testing it before you bet everything on it.',
    image: '/pillars/entrepreneurship.jpg',
    tone: 'sage',
  },
  {
    n: '04',
    label: 'Wealth & Ownership',
    title: 'A high income is not the same as financial freedom.',
    body: 'Straight talk on investing, ownership and building income that keeps working after you clock out.',
    image: '/pillars/wealth-ownership.jpg',
    tone: 'brown',
  },
  {
    n: '05',
    label: 'Sustainable Growth',
    title: "Ambition shouldn't cost you your health.",
    body: 'Building without burning out, and giving yourself permission to move at the pace this season of life allows.',
    image: '/pillars/sustainable-growth.jpg',
    tone: 'sage',
  },
  {
    n: '06',
    label: 'Community',
    title: 'Nobody builds an expansive life alone.',
    body: 'Real relationships with people at your level: for advice, referrals, accountability and the occasional reality check.',
    image: '/pillars/community.jpg',
    tone: 'forest',
  },
]

const TONES = {
  forest: { panel: 'bg-forest-deep', glyph: 'text-white/15', wash: 'from-forest-deep/70' },
  sage: { panel: 'bg-sage', glyph: 'text-white/20', wash: 'from-sage/70' },
  gold: { panel: 'bg-gold', glyph: 'text-white/20', wash: 'from-gold/70' },
  brown: { panel: 'bg-brown', glyph: 'text-white/15', wash: 'from-brown/70' },
}

/* Where each card pins, and how far each one is dealt below the last. */
const TOP = 104
const STEP = 14

function ArtPanel({ pillar, tone }) {
  const [failed, setFailed] = useState(false)

  if (pillar.image && !failed) {
    return (
      <div className="relative h-56 overflow-hidden lg:h-full">
        <img
          src={pillar.image}
          alt=""
          loading="lazy"
          onError={() => setFailed(true)}
          className="size-full object-cover"
        />
        {/* Keeps the numeral legible whatever the photo is doing underneath. */}
        <div
          className={`absolute inset-0 bg-gradient-to-t ${tone.wash} to-transparent`}
        />
        <span className="absolute bottom-5 right-7 font-display text-[64px] leading-none text-white/70">
          {pillar.n}
        </span>
      </div>
    )
  }

  return (
    <div
      className={`relative grid h-56 place-items-center overflow-hidden lg:h-full ${tone.panel}`}
    >
      {/* Concentric rings, drawn rather than shipped as an asset. */}
      <svg
        viewBox="0 0 200 200"
        aria-hidden="true"
        className="absolute -right-10 -top-10 size-[280px] text-white/10"
        fill="none"
      >
        <circle cx="100" cy="100" r="40" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="100" cy="100" r="66" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="100" cy="100" r="92" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <span className={`font-display text-[96px] leading-none ${tone.glyph}`}>
        {pillar.n}
      </span>
      <span className="absolute bottom-6 left-7 text-[11.5px] font-semibold uppercase tracking-[0.2em] text-white/70">
        {pillar.label}
      </span>
    </div>
  )
}

export default function Pillars() {
  const stackRef = useRef(null)

  // Cards that have been covered recede slightly, so the stack reads as depth
  // rather than as six identical panels pinned to the same spot.
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const stack = stackRef.current
    if (reduced || !stack) return

    const cards = Array.from(stack.querySelectorAll('[data-pillar-card]'))
    if (cards.length < 2) return

    // Matches the `lg:sticky` breakpoint — nothing stacks below it, so nothing
    // should be scaled either.
    const stacking = window.matchMedia('(min-width: 1024px)')
    let frame = 0

    const clear = () =>
      cards.forEach((card) => {
        card.firstElementChild.style.transform = ''
        card.firstElementChild.style.opacity = ''
      })

    const paint = () => {
      frame = 0
      if (!stacking.matches) return clear()
      cards.forEach((card, i) => {
        const inner = card.firstElementChild
        const next = cards[i + 1]
        if (!next) {
          inner.style.transform = ''
          inner.style.opacity = ''
          return
        }

        // Once a sticky card is pinned it stops moving, so the amount it has
        // been covered is read from how close the *next* card is to its own
        // resting offset.
        const height = card.offsetHeight || 1
        const travel = next.getBoundingClientRect().top - (TOP + (i + 1) * STEP)
        const covered = Math.min(Math.max(1 - travel / height, 0), 1)

        inner.style.transform = `scale(${(1 - covered * 0.05).toFixed(4)})`
        inner.style.opacity = `${(1 - covered * 0.3).toFixed(3)}`
      })
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(paint)
    }

    paint()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    stacking.addEventListener('change', onScroll)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      stacking.removeEventListener('change', onScroll)
    }
  }, [])

  return (
    <section className="bg-sand py-20 lg:py-24">
      <Container>
        <Reveal>
          <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-gold">
            Six ways we help you grow
          </p>
          <h2 className="mt-4 max-w-[620px] font-display text-[30px] leading-[1.18] text-ink lg:text-[42px]">
            Everything here points back to one of six areas.
          </h2>
        </Reveal>

        <div ref={stackRef} className="mt-14">
          {PILLARS.map((p, i) => {
            const tone = TONES[p.tone]
            return (
              <div
                key={p.n}
                data-pillar-card
                className="pb-6 lg:sticky"
                style={{ top: `${TOP + i * STEP}px` }}
              >
                <article
                  className="grid origin-top overflow-hidden rounded-3xl border border-ink/10 bg-cream-card shadow-[0_24px_60px_-30px_rgba(43,34,25,0.45)] will-change-transform lg:min-h-[360px] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]"
                  style={{ transition: 'transform 120ms linear, opacity 120ms linear' }}
                >
                  <div className="flex flex-col justify-center p-8 lg:p-12">
                    <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-gold">
                      {p.n}: {p.label}
                    </p>
                    <h3 className="mt-5 max-w-[460px] font-display text-[24px] leading-[1.22] text-ink lg:text-[30px]">
                      {p.title}
                    </h3>
                    <p className="mt-4 max-w-[480px] text-[14.5px] leading-relaxed text-ink/70">
                      {p.body}
                    </p>
                    <span className="mt-8 h-px w-16 bg-gold/50" />
                  </div>

                  <ArtPanel pillar={p} tone={tone} />
                </article>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
