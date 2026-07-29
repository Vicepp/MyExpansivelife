import { Link } from 'react-router-dom'
import { Container, Button } from './primitives'
import Reveal from './Reveal'
import { COMMUNITY_URL, SOCIALS } from '../lib/links'
import logo from '../assets/design/logo.svg'

const LINK_COLUMNS = [
  [
    { label: 'Community', to: '/community' },
    { label: 'Course', to: '/courses/linkedin-unlocked' },
  ],
  [
    { label: 'Affiliate Programme', to: '/affiliate' },
    { label: 'Blog', to: '/blogs' },
  ],
]


/** Brown on the home and course pages, gold on the blog index. */
export function Newsletter({ tone = 'brown' }) {
  return (
    <section
      className={`py-20 text-center lg:py-24 ${tone === 'gold' ? 'bg-gold' : 'bg-brown'}`}
    >
      <Container>
        <Reveal>
          <h2 className="mx-auto max-w-[520px] text-[30px] font-bold leading-headline text-white lg:text-[40px]">
            Want Articles Like This In Your Inbox?
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="mx-auto mt-5 max-w-[440px] text-[15px] leading-relaxed text-white/85">
            Join the Circle Community and get new articles, resources and Monday
            Momentum sessions delivered straight to you.
          </p>
        </Reveal>
        <Reveal delay={220}>
          <Button
            variant={tone === 'gold' ? 'solid' : 'gold'}
            to={COMMUNITY_URL}
            icon
            className="mt-8"
          >
            Join Community
          </Button>
        </Reveal>
      </Container>
    </section>
  )
}

export default function Footer() {
  return (
    <footer className="bg-cream pb-10 pt-16">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[260px_1fr_160px_200px]">
          <Link to="/" className="self-start">
            <img src={logo} alt="My Expansive Life" className="h-14 w-auto" />
          </Link>
          <p className="max-w-[300px] text-[13.5px] leading-relaxed text-ink/75">
            A growth community for professionals building beyond a single career,
            income stream or definition of success.
          </p>
          {LINK_COLUMNS.map((col, i) => (
            <ul key={i} className="space-y-4">
              {col.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="text-[14px] text-ink/80 hover:text-brown-deep"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          ))}
        </div>

        <hr className="mt-12 border-ink/10" />

        <div className="mt-6 flex flex-col-reverse items-center gap-6 sm:flex-row sm:justify-between">
          <p className="text-[12.5px] text-ink/70">
            &copy; 2026 My Expansive Life. All rights reserved.
          </p>
          <ul className="flex items-center gap-3">
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="grid size-8 place-items-center rounded-full bg-brown-deep text-white transition-colors hover:bg-gold"
                >
                  <svg viewBox="0 0 24 24" className="size-5" fill="currentColor">
                    <path d={s.d} />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  )
}
