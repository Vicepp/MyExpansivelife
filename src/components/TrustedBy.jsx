import { Container } from './primitives'
import Reveal from './Reveal'
import someDocs from '../assets/press/somedocs.png'
import ceoTimes from '../assets/press/ceo-times.png'
import topListings from '../assets/press/toplistings.png'
import bizWeekly from '../assets/press/biz-weekly.png'
import usaNews from '../assets/press/usa-news.png'

/**
 * Press features, as shown on phcinvest.com. Heights are set per logo so the
 * marks read at a similar visual weight: very wide wordmarks sit shorter,
 * compact ones taller.
 */
const PRESS = [
  { name: 'SoMeDocs', src: someDocs, h: 'h-7 lg:h-8' },
  { name: 'CEO Times', src: ceoTimes, h: 'h-5 lg:h-6' },
  { name: 'toplistings', src: topListings, h: 'h-8 lg:h-9' },
  { name: 'BizWeekly', src: bizWeekly, h: 'h-4 lg:h-5' },
  { name: 'USA News', src: usaNews, h: 'h-6 lg:h-7' },
]

export default function TrustedBy() {
  return (
    <section className="bg-white py-8">
      <Container>
        <Reveal
          y={14}
          className="flex flex-col items-center gap-6 lg:flex-row lg:gap-12"
        >
          <p className="shrink-0 text-[13px] font-semibold text-ink">As featured in</p>

          {/*
            Continuous strip; the set repeats twice so the loop is seamless
            (the animation moves the track by exactly half its width, so both
            halves carry the same trailing gap).
            w-full is load-bearing: the track is max-content wide, and in the
            mobile column layout the element would otherwise size to it and
            push the whole page wider than the viewport.
          */}
          <div className="marquee w-full min-w-0 lg:grow">
            <div className="marquee-track">
              {[0, 1].map((copy) => (
                <ul
                  key={copy}
                  aria-hidden={copy === 1}
                  className="flex shrink-0 items-center gap-14 pr-14 lg:gap-16 lg:pr-16"
                >
                  {PRESS.map((p) => (
                    <li key={p.name} className="shrink-0">
                      <img
                        src={p.src}
                        alt={copy === 0 ? p.name : ''}
                        className={`${p.h} w-auto max-w-none object-contain`}
                      />
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
