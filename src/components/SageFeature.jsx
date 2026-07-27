import { Container } from './primitives'
import Reveal from './Reveal'
import videoThumb from '../assets/design/video-thumb.jpg'

export default function SageFeature() {
  return (
    <section className="bg-sage py-16 lg:py-20">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-16">
          <Reveal>
            <h2 className="font-display text-[30px] leading-[1.2] text-white lg:text-[40px]">
              Built for people with something worth saying, and no system for being
              heard.
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="max-w-[420px] text-[14px] leading-relaxed text-white/85 lg:mt-2">
              You don&rsquo;t need more motivation you need a space where your ideas
              can be challenged, refined, and turned into clear action alongside
              people who are building just like you.
            </p>
          </Reveal>
        </div>

        <Reveal delay={100} className="mt-12 overflow-hidden rounded-3xl">
          <img
            src={videoThumb}
            alt="Members working through the course together"
            className="w-full object-cover"
          />
        </Reveal>
      </Container>
    </section>
  )
}
