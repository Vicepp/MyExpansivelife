import { Link } from 'react-router-dom'
import { Container, Button } from './primitives'
import Reveal from './Reveal'
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

const SOCIALS = [
  {
    label: 'Facebook',
    d: 'M13.5 9H15V6.5h-1.8c-2 0-3.2 1.2-3.2 3.2V11H8v2.5h2V20h2.6v-6.5h2L15 11h-2.4V9.9c0-.6.3-.9.9-.9Z',
  },
  {
    label: 'Instagram',
    d: 'M12 8.6a3.4 3.4 0 1 0 0 6.8 3.4 3.4 0 0 0 0-6.8Zm0 5.6a2.2 2.2 0 1 1 0-4.4 2.2 2.2 0 0 1 0 4.4Zm4.3-5.7a.8.8 0 1 1-1.6 0 .8.8 0 0 1 1.6 0ZM9 6h6a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3Zm0 1.3A1.7 1.7 0 0 0 7.3 9v6A1.7 1.7 0 0 0 9 16.7h6A1.7 1.7 0 0 0 16.7 15V9A1.7 1.7 0 0 0 15 7.3H9Z',
  },
  {
    label: 'Twitter',
    d: 'M19 8.3c-.5.2-1.1.4-1.7.5.6-.4 1-1 1.3-1.7-.6.3-1.2.6-1.9.7A3 3 0 0 0 11.6 10 8.4 8.4 0 0 1 5.6 7a3 3 0 0 0 .9 4 3 3 0 0 1-1.3-.4 3 3 0 0 0 2.4 2.9 3 3 0 0 1-1.3 0 3 3 0 0 0 2.8 2.1A5.9 5.9 0 0 1 5 16.8 8.3 8.3 0 0 0 17.8 9.8c.5-.4 1-.9 1.2-1.5Z',
  },
  {
    label: 'LinkedIn',
    d: 'M8.3 17.5H6V10h2.3v7.5ZM7.1 9a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6Zm10.9 8.5h-2.3v-3.6c0-.9 0-2-1.2-2s-1.4 1-1.4 2v3.6h-2.3V10h2.2v1h.1a2.4 2.4 0 0 1 2.2-1.2c2.3 0 2.7 1.5 2.7 3.5v4.2Z',
  },
]

/** Brown on the home and course pages, gold on the blog index. */
export function Newsletter({ tone = 'brown' }) {
  return (
    <section
      className={`py-20 text-center lg:py-24 ${tone === 'gold' ? 'bg-gold' : 'bg-brown'}`}
    >
      <Container>
        <Reveal>
          <h2 className="mx-auto max-w-[520px] text-[30px] font-bold leading-tight text-white lg:text-[40px]">
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
            to="/community"
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
                  href="https://www.linkedin.com/"
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
