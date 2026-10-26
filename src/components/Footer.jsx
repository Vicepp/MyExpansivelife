import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Container, ArrowIcon } from './primitives'
import { LeadFormModal } from './LeadForm'
import Reveal from './Reveal'
import { SOCIALS } from '../lib/links'
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


/** The "Financial Investor" list in LeadConnector — the newsletter signup. */
const NEWSLETTER_FORM = { formId: 'O5wCfFErBHBHRAZjgp2N', name: 'Financial Investor', height: 566 }

/** Brown on the home and course pages, gold on the blog index. */
export function Newsletter({ tone = 'brown' }) {
  const [open, setOpen] = useState(false)
  // Same look as <Button variant="solid|gold" icon>, but a real button: it
  // opens the signup form in a popup rather than navigating.
  const colours =
    tone === 'gold'
      ? 'bg-brown-deep px-7 py-3.5 hover:bg-brown'
      : 'bg-gold px-8 py-4 hover:bg-gold-text'

  return (
    <section
      className={`py-20 text-center lg:py-24 ${tone === 'gold' ? 'bg-gold' : 'bg-brown'}`}
    >
      <Container>
        <Reveal>
          <h2 className="mx-auto max-w-[520px] text-[30px] font-bold leading-headline text-white lg:text-[40px]">
            Stay Connected to What&rsquo;s Next
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="mx-auto mt-5 max-w-[470px] text-[15px] leading-relaxed text-white/85">
            Get the latest news, opportunities, events, and updates from My
            Expansive Life delivered straight to your inbox.
          </p>
        </Reveal>
        <Reveal delay={220}>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className={`group mt-8 inline-flex items-center gap-3 rounded-full text-[15px] font-semibold text-white transition-colors duration-200 ${colours}`}
          >
            Keep me in the loop
            <span className="grid size-6 shrink-0 place-items-center overflow-hidden rounded-full bg-white/25">
              <ArrowIcon className="size-3.5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-4" />
            </span>
          </button>
        </Reveal>
      </Container>

      <LeadFormModal
        open={open}
        onClose={() => setOpen(false)}
        title="Stay connected to what’s next"
        {...NEWSLETTER_FORM}
      />
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
