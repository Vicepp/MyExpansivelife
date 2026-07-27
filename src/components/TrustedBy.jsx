import { Container } from './primitives'
import Reveal from './Reveal'
import trustedLogos from '../assets/design/trusted-logos.png'

export default function TrustedBy() {
  return (
    <section className="bg-white py-8">
      <Container>
        <Reveal
          y={14}
          className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 lg:justify-between"
        >
          <p className="text-[13px] font-semibold text-ink">
            Trusted by the best in the world
          </p>
          <img
            src={trustedLogos}
            alt="Google, Atlassian, Canon, Walmart and Amazon"
            className="h-6 w-auto max-w-full object-contain lg:h-7"
          />
        </Reveal>
      </Container>
    </section>
  )
}
