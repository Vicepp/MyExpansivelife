import { Container } from './primitives'
import Reveal from './Reveal'

const ICONS = {
  box: 'M12 3.5 20 8v8l-8 4.5L4 16V8l8-4.5Zm0 2.3L6 9.2v5.6l6 3.4 6-3.4V9.2l-6-3.4Z',
  megaphone: 'M4 10v4h3l5 4V6L7 10H4Zm12.5 2a4 4 0 0 0-1.8-3.3v6.6a4 4 0 0 0 1.8-3.3Z',
  shield: 'M12 3 5 6v5c0 4.2 2.9 8 7 9 4.1-1 7-4.8 7-9V6l-7-3Zm-1 12-3-3 1.4-1.4L11 12.2l4.6-4.6L17 9l-6 6Z',
  dollar:
    'M12.6 11.3c-1.8-.5-2.4-.9-2.4-1.6 0-.8.8-1.4 2-1.4 1.3 0 1.8.6 1.9 1.5h1.7c0-1.3-.9-2.5-2.5-2.9V5h-2.3v1.9c-1.5.3-2.7 1.3-2.7 2.9 0 1.8 1.5 2.7 3.7 3.2 2 .5 2.4 1.2 2.4 1.9 0 .5-.4 1.4-2 1.4-1.6 0-2.2-.7-2.3-1.6H8.4c.1 1.6 1.3 2.6 2.8 2.9V19h2.3v-1.9c1.5-.3 2.8-1.2 2.8-2.9 0-2.2-1.9-3-3.7-3.4Z',
  trend: 'M4 17.5 9.5 12l3 3L20 7.5 18.6 6l-6.1 6.2-3-3L2.6 16l1.4 1.5ZM15 6h5v5h-2V8h-3V6Z',
}

const STEPS = [
  {
    icon: 'box',
    tint: 'bg-[#F6F1FF]',
    title: 'Submit your request',
    body: 'Fill in your name, phone number and email on the affiliate page.',
  },
  {
    icon: 'megaphone',
    tint: 'bg-[#FFFAEC]',
    title: 'Join the MXL Circle',
    body: 'This is where every affiliate announcement, resource and update lives.',
  },
  {
    icon: 'shield',
    tint: 'bg-[#F0FFF8]',
    title: 'Accept your invitation',
    body: 'Watch for an email from My Expansive Life Community, check spam and promotions.',
  },
  {
    icon: 'dollar',
    tint: 'bg-[#EEF9FF]',
    title: 'Add your PayPal email',
    body: "This is the step people skip and shouldn't. Enter it correctly the first time. Miss it, and your setup may need to start over.",
    wide: true,
  },
  {
    icon: 'trend',
    tint: 'bg-white',
    title: 'Track referrals, get paid',
    body: 'Watch visits, leads and enrolments roll in from your dashboard. Commissions are processed every 30 days through PayPal.',
    wide: true,
  },
]

export default function StepsGrid() {
  return (
    <section className="bg-cream py-20 lg:py-24">
      <Container>
        <Reveal>
          <h2 className="text-center text-[30px] font-bold tracking-tight text-gold lg:text-[40px]">
            5 steps, start to first commission.
          </h2>
          <p className="mx-auto mt-4 max-w-[620px] text-center text-[15px] leading-relaxed text-ink/80">
            Because modern businesses need more than just a payment processor. We
            combines secure technology, simple tools, and real support to help you
            grow.
          </p>
        </Reveal>

        {/* Three across, then two wider cards — matches the board layout. */}
        <div className="mt-12 grid gap-6 md:grid-cols-6">
          {STEPS.map((s, i) => (
            <Reveal
              key={s.title}
              delay={(i % 3) * 120}
              className={`flex ${s.wide ? 'md:col-span-3' : 'md:col-span-2'}`}
            >
              <article className={`card-lift grow rounded-2xl p-7 ${s.tint}`}>
                <span className="grid size-11 place-items-center rounded-full bg-white/70">
                  <svg viewBox="0 0 24 24" className="size-5" fill="currentColor">
                    <path d={ICONS[s.icon]} />
                  </svg>
                </span>
                <h3 className="mt-6 text-[19px] font-bold text-ink">{s.title}</h3>
                <p className="mt-3 text-[13.5px] leading-relaxed text-ink/75">
                  {s.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
