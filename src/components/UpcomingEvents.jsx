import { Container, Button } from './primitives'
import Reveal from './Reveal'
import webinarPromo from '../assets/design/webinar-promo.jpg'

function CarouselButton({ dir }) {
  const isPrev = dir === 'prev'
  return (
    <button
      type="button"
      aria-label={isPrev ? 'Previous event' : 'Next event'}
      className={`absolute top-1/2 hidden size-11 -translate-y-1/2 place-items-center rounded-full bg-white shadow-md transition-shadow hover:shadow-lg lg:grid ${
        isPrev ? '-left-5' : '-right-5'
      }`}
    >
      <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
        <path
          d={isPrev ? 'm14 6-6 6 6 6' : 'm10 6 6 6-6 6'}
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}

export default function UpcomingEvents() {
  return (
    <section id="events" className="bg-cream py-20 lg:py-24">
      <Container>
        <div className="relative">
          <CarouselButton dir="prev" />
          <CarouselButton dir="next" />

          <Reveal className="grid items-center gap-10 rounded-3xl bg-white p-8 lg:grid-cols-2 lg:gap-14 lg:p-14">
            <div>
              <h2 className="text-[30px] font-bold uppercase tracking-tight text-gold lg:text-[40px]">
                Upcoming Events
              </h2>

              <span className="mt-6 inline-block rounded-full bg-mint px-4 py-1.5 text-[13px] font-semibold text-white">
                Free Webinar
              </span>

              <h3 className="mt-5 text-[24px] font-bold leading-snug text-forest-deep lg:text-[28px]">
                $153M In Real Estate While Still Practicing Medicine: How Did I Do
                It?
              </h3>

              <Button variant="solid" to="/community" icon className="mt-8">
                Register now
              </Button>
            </div>

            <img
              src={webinarPromo}
              alt="Free live webinar with Dr Nkem Ezeamama, Thursday 13th August 2026"
              className="w-full rounded-2xl"
            />
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
