import { Button } from './primitives'
import Reveal from './Reveal'
import groupPhoto from '../assets/design/group-photo.jpg'
import awardBadge from '../assets/design/award-badge.png'

export default function Ceiling() {
  return (
    <section className="bg-cream">
      <div className="grid lg:grid-cols-[minmax(0,42%)_minmax(0,58%)]">
        {/* No overflow-hidden here — the award badge deliberately overhangs. */}
        <div className="relative">
          <img
            src={groupPhoto}
            alt="The My Expansive Life community at a live event"
            className="h-64 w-full object-cover sm:h-96 lg:h-full"
          />
          <img
            src={awardBadge}
            alt="Number one best award, 2023"
            className="absolute right-0 top-[68%] w-24 -translate-y-1/2 translate-x-1/2 lg:w-32"
          />
        </div>

        <div className="flex items-center px-6 py-16 lg:px-16 lg:py-24">
          <div className="max-w-[560px]">
            <Reveal>
              <h2 className="font-display text-[30px] leading-[1.22] text-forest lg:text-[40px]">
                A great career can be the floor of your life. It was never meant to
                be the ceiling.
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <p className="mt-6 text-[15px] leading-relaxed text-ink/80">
                We&rsquo;re not here to talk anyone out of the career they&rsquo;ve
                worked hard for. We&rsquo;re here to help them see that it
                doesn&rsquo;t have to be the limit of their income, their
                visibility, or their identity. An expansive life still includes the
                career. It just isn&rsquo;t only the career.
              </p>
            </Reveal>
            <Reveal delay={220}>
              <Button variant="solid" to="/community" icon className="mt-8">
                Join Circle
              </Button>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
