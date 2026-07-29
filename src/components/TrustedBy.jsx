import { useState } from 'react'
import { Container } from './primitives'
import Reveal from './Reveal'
import { trackCta } from '../lib/track'

/**
 * Press coverage. Each logo links to the article it came from.
 *
 * Logos live in /public/press so they can be swapped without touching code;
 * until a file is there the publication name renders as a wordmark instead, so
 * the section never shows a broken image.
 */
const PRESS = [
  {
    id: 'usa-news',
    name: 'USA News',
    logo: '/press/usa-news.png',
    href: 'https://usanews.com/newsroom/how-pheenyx-capital-redefines-wealth-for-high-achievers',
  },
  {
    id: 'somedocs',
    name: 'SoMeDocs',
    logo: '/press/somedocs.png',
    href: 'https://doctorsonsocialmedia.com/finances-investing-real-estate/?mc_cid=f8af9b2d26&mc_eid=5e6e1350a6',
  },
  {
    id: 'ceo-times',
    name: 'CEO Times',
    logo: '/press/ceo-times.png',
    href: 'https://ceotimes.com/how-pheenyx-capital-helps-high-achievers-build-wealth-that-works-for-them/',
  },
]

function PressLogo({ item }) {
  const [failed, setFailed] = useState(false)

  return (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackCta(`press_${item.id}`)}
      title={`Read the ${item.name} feature`}
      className="inline-flex shrink-0 items-center opacity-75 transition-opacity duration-300 hover:opacity-100"
    >
      {failed ? (
        <span className="font-display text-[19px] tracking-tight text-ink lg:text-[22px]">
          {item.name}
        </span>
      ) : (
        <img
          src={item.logo}
          alt={`${item.name} — read the feature`}
          onError={() => setFailed(true)}
          className="h-7 w-auto object-contain lg:h-9"
        />
      )}
    </a>
  )
}

export default function TrustedBy() {
  return (
    <section className="bg-white py-8">
      <Container>
        <Reveal
          y={14}
          className="flex flex-col items-center gap-5 lg:flex-row lg:justify-between lg:gap-10"
        >
          <p className="shrink-0 text-[13px] font-semibold text-ink">As featured in</p>

          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5 lg:gap-x-14">
            {PRESS.map((item) => (
              <PressLogo key={item.id} item={item} />
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
