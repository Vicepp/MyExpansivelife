import { Container } from './primitives'
import Reveal from './Reveal'
import VideoEmbed from './VideoEmbed'

/**
 * Sage band: a claim on the left, supporting copy on the right, and a video
 * beneath. Text and video are supplied by the page so the same design carries
 * different arguments.
 */
export default function SageFeature({
  title = 'Built for people with something worth saying, and no system for being heard.',
  body = 'You don’t need more motivation you need a space where your ideas can be challenged, refined, and turned into clear action alongside people who are building just like you.',
  videoUrl = 'https://www.youtube.com/watch?v=8znehZDXdaY',
  videoTitle = 'LinkedIn Unlocked — course introduction',
  videoCaption,
}) {
  return (
    <section className="bg-sage py-16 lg:py-20">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-16">
          <Reveal>
            <h2 className="font-display text-[30px] leading-[1.2] text-white lg:text-[40px]">
              {title}
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="max-w-[420px] text-[14px] leading-relaxed text-white/85 lg:mt-2">
              {body}
            </p>
          </Reveal>
        </div>

        <Reveal delay={100} className="mt-12 overflow-hidden rounded-3xl">
          <VideoEmbed url={videoUrl} title={videoTitle} />
        </Reveal>

        {videoCaption && (
          <Reveal delay={160}>
            <p className="mt-4 text-center text-[13.5px] text-white/80">
              {videoCaption}
            </p>
          </Reveal>
        )}
      </Container>
    </section>
  )
}
