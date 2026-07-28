import { Container } from './primitives'
import Reveal from './Reveal'
import trustedLogos from '../assets/design/trusted-logos.png'

export default function TrustedBy() {
  return (
    <section className="bg-white py-8">
      <Container>
        <Reveal
          y={14}
          className="flex flex-col items-center gap-6 lg:flex-row lg:gap-12"
        >
          <p className="shrink-0 text-[13px] font-semibold text-ink">
            Trusted by the best in the world
          </p>

          {/*
            Continuous strip; the image repeats twice so the loop is seamless.
            w-full is load-bearing: the track is max-content wide, and in the
            mobile column layout the element would otherwise size to it and
            push the whole page wider than the viewport.
          */}
          <div className="marquee w-full min-w-0 lg:grow">
            <div className="marquee-track gap-16 pr-16">
              {[0, 1].map((i) => (
                <img
                  key={i}
                  src={trustedLogos}
                  alt={i === 0 ? 'Google, Atlassian, Canon, Walmart and Amazon' : ''}
                  aria-hidden={i === 1}
                  className="h-6 w-auto max-w-none object-contain lg:h-7"
                />
              ))}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
