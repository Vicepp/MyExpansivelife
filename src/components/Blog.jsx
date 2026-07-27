import { Container, TextLink } from './primitives'
import Reveal from './Reveal'
import articleImg from '../assets/design/article-img.jpg'

const POST = {
  meta: '23 Nov 2022, By Amanda Hugh',
  title: 'What Makes An Authentic Employee Profile?',
  excerpt:
    "I'm Totally Unconvinced That Two People Can Find A Person They Haven't Known Previously...",
}

export default function Blog({ count = 3, showIntro = true }) {
  const posts = Array.from({ length: count }, (_, i) => ({ ...POST, id: i }))

  return (
    <section className="bg-white py-20 lg:py-24">
      <Container>
        {showIntro && (
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <h2 className="font-display text-[30px] leading-[1.25] text-gold-text lg:text-[38px]">
                Ideas For The Life You&rsquo;re Building Beyond Your Title.
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="max-w-[480px] text-[15px] leading-relaxed text-ink/80 lg:mt-2">
                Straightforward, practical writing on personal branding, LinkedIn
                strategy, investing and building a career that expands instead of
                confines. New articles every week.
              </p>
            </Reveal>
          </div>
        )}

        <div className={`grid gap-6 md:grid-cols-3 ${showIntro ? 'mt-14' : ''}`}>
          {posts.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 120} className="flex">
              <article className="card-lift img-zoom flex grow flex-col overflow-hidden rounded-2xl border border-ink/10">
                <div className="overflow-hidden">
                  <img
                    src={articleImg}
                    alt=""
                    className="aspect-[674/467] w-full object-cover"
                  />
                </div>
                <div className="flex grow flex-col p-6">
                  <p className="text-[11.5px] font-medium text-gold-text">{p.meta}</p>
                  <h3 className="mt-2 text-[18px] font-bold leading-snug text-forest-deep">
                    {p.title}
                  </h3>
                  <p className="mt-3 grow text-[13.5px] leading-relaxed text-ink/75">
                    {p.excerpt}
                  </p>
                  <TextLink to="/blogs" className="mt-6">
                    Read Story
                  </TextLink>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <TextLink to="/blogs">See All</TextLink>
        </div>
      </Container>
    </section>
  )
}
