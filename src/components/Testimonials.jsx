import { Container, TextLink } from './primitives'
import Reveal from './Reveal'
import avatar from '../assets/design/testimonial-av.png'

const QUOTES = [1, 2, 3].map((id) => ({
  id,
  body: "I'm totally unconvinced that two people can find a person they haven't known previously, and become an effective co-founder",
  name: 'Andrew Wilkins',
  role: 'Managing Director, Yess Company',
}))

export default function Testimonials() {
  return (
    <section className="bg-white py-20 lg:py-24">
      <Container>
        <Reveal>
          <h2 className="text-center font-display text-[30px] text-forest lg:text-[36px]">
            We Believe People We Trust
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {QUOTES.map((q, i) => (
            <Reveal key={q.id} delay={i * 120} className="flex">
              <figure className="card-lift grow rounded-xl bg-cream-card p-7">
                <span
                  aria-hidden="true"
                  className="block font-display text-[44px] leading-none text-gold"
                >
                  &ldquo;
                </span>
                <blockquote className="mt-2 text-[14.5px] leading-relaxed text-ink/85">
                  {q.body}
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <img
                    src={avatar}
                    alt=""
                    className="size-9 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-[13.5px] font-semibold text-forest-deep">
                      {q.name}
                    </p>
                    <p className="text-[12.5px] text-ink/65">{q.role}</p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 flex items-center justify-center gap-2">
          <span className="h-1.5 w-2 rounded-full bg-gold/50" />
          <span className="h-1.5 w-8 rounded-full bg-gold" />
          <span className="h-1.5 w-2 rounded-full bg-gold/50" />
          <span className="h-1.5 w-2 rounded-full bg-gold/50" />
        </div>

        <div className="-mt-6 flex justify-end">
          <TextLink to="/blogs">See All</TextLink>
        </div>
      </Container>
    </section>
  )
}
