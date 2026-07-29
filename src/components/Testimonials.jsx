import { useState } from 'react'
import { Container } from './primitives'
import Reveal from './Reveal'

/**
 * Real member results. Photos live in /public/testimonials so they can be
 * swapped without a code change; a member without a photo shows their initials.
 */
const QUOTES = [
  {
    id: 'leslie',
    name: 'Leslie Awason',
    role: 'Managing Partner, XSITE Capital',
    photo: '/testimonials/leslie-awason.jpg',
    body: 'I watched Dr. Nkem go from zero presence to building a powerful thought leadership platform that drove real capital. Her strategy helped us raise $30M and close $70M in deals.',
  },
  {
    id: 'jovi',
    name: 'Jovi Stevenson',
    role: 'Founder, BestView LLC',
    photo: '/testimonials/jovi-stevenson.jpg',
    body: 'I posted my first post under Nkem’s guidance, and it received 85 engagements, 30 comments, and 1,337 impressions. Not bad for a first post out of the gate.',
  },
  {
    id: 'moses',
    name: 'Moses Ajayi, MBA, FACHE',
    role: 'Healthcare Executive',
    photo: '/testimonials/moses-ajayi.jpg',
    body: 'In a week, I posted six posts, received over 7,000 impressions, and got direct messages for future engagements. I found the courage to publish three posts in just two days.',
  },
  {
    id: 'uzoamaka',
    name: 'Uzoamaka Eke, MD',
    role: 'Financial Professional',
    photo: '/testimonials/uzoamaka-eke.jpg',
    body: 'I booked two appointments without selling a single thing. The mindset shift from consistently showing up on LinkedIn has been truly remarkable.',
  },
  {
    id: 'oge',
    name: 'Oge Ozimakor, MD, MBA, FAPA',
    role: 'Physician Leader',
    photo: '/testimonials/oge-ozimakor.jpg',
    body: 'I am thoroughly enjoying the modules. The assessment quizzes really inspire one to take action. The course is beautifully composed!',
  },
]

function initials(name) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

function Avatar({ quote }) {
  const [failed, setFailed] = useState(false)

  if (!quote.photo || failed) {
    return (
      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-gold/20 text-[13px] font-bold text-gold-text">
        {initials(quote.name)}
      </span>
    )
  }

  return (
    <img
      src={quote.photo}
      alt={quote.name}
      loading="lazy"
      onError={() => setFailed(true)}
      className="size-11 shrink-0 rounded-full object-cover"
    />
  )
}

export default function Testimonials() {
  return (
    <section className="bg-white py-20 lg:py-24">
      <Container>
        <Reveal>
          <p className="text-center text-[13px] font-semibold uppercase tracking-[0.2em] text-gold">
            What students say
          </p>
          <h2 className="mt-3 text-center font-display text-[30px] text-forest lg:text-[36px]">
            Real professionals. Real results.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {QUOTES.map((quote, i) => (
            <Reveal key={quote.id} delay={(i % 3) * 110} className="flex">
              <figure className="card-lift flex grow flex-col rounded-xl bg-cream-card p-7">
                <span
                  aria-hidden="true"
                  className="block font-display text-[44px] leading-none text-gold"
                >
                  &ldquo;
                </span>
                <blockquote className="mt-2 grow text-[14px] leading-relaxed text-ink/85">
                  {quote.body}
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-ink/10 pt-5">
                  <Avatar quote={quote} />
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold leading-tight text-forest-deep">
                      {quote.name}
                    </p>
                    <p className="mt-0.5 text-[12px] text-ink/65">{quote.role}</p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
