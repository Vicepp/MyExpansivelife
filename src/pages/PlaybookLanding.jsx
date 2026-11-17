import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import { Button } from '../components/primitives'
import Reveal from '../components/Reveal'
import { WEBINAR, CLICKMEETING_URL } from '../components/Webinar'
import { trackPageView } from '../lib/track'
import logo from '../assets/design/logo.svg'
import logoMark from '../assets/design/logo-mark.png'
import logoLight from '../assets/design/logo-light.png'
import playbookPreview from '../assets/design/playbook-preview.jpg'
import playbookBanner from '../assets/design/playbook-banner.jpg'
import authorPhoto from '../assets/design/playbook-author.jpg'

/*
 * Standalone landing page for the free Personal Brand Playbook (the LinkedIn
 * ebook). Like the webinar page it sits outside the site Layout: no site
 * navigation, event bar or chat, and every button leads to #download, where
 * the free webinar's ClickMeeting registration form sits: registrants are sent
 * the Playbook right after they register.
 */

function Wide({ children, className = '' }) {
  return (
    <div className={`mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  )
}

function Eyebrow({ children, className = 'text-brown' }) {
  return (
    <p className={`text-[12.5px] font-semibold uppercase tracking-[0.22em] ${className}`}>
      {children}
    </p>
  )
}

/* --- hero ----------------------------------------------------------------- */

function Hero() {
  return (
    <section className="bg-cream py-16 lg:py-24">
      <Wide>
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          <Reveal>
            <Eyebrow>Free Personal Brand Playbook</Eyebrow>
            <h1 className="mt-6 font-display text-[40px] leading-[1.08] text-forest sm:text-[52px] lg:text-[60px]">
              Turn your LinkedIn into the place where opportunities find you.
            </h1>
            <p className="mt-6 max-w-[520px] text-[16px] leading-relaxed text-ink/75">
              The Personal Brand Playbook is the same system Dr. Nkem Ezeamama teaches
              inside LinkedIn Unlocked. It was written for people with full careers who
              want their work noticed by the right rooms, and it fits around a busy
              calendar.
            </p>
            <Button variant="solid" to="#download" icon className="mt-8">
              Send me the playbook
            </Button>
            <p className="mt-4 text-[13.5px] text-ink/60">
              Free. Sent to you as soon as you register.
            </p>
          </Reveal>

          <Reveal y={0} delay={150} className="mx-auto w-full max-w-[560px]">
            <span className="block rotate-[-4deg] font-script text-[44px] leading-none text-gold">
              Free to download
            </span>
            <img
              src={playbookPreview}
              alt="LinkedIn Unlocked: Your Personal Brand Playbook by Dr. Nkem Ezeamama, shown on a tablet"
              width="1400"
              height="777"
              className="mt-5 w-full rounded-3xl shadow-[0_30px_60px_-20px_rgb(24_55_52/0.35)]"
            />
          </Reveal>
        </div>
      </Wide>
    </section>
  )
}

/* --- why this exists ------------------------------------------------------ */

function Why() {
  return (
    <section className="bg-sand py-20 lg:py-24">
      <Wide>
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <Eyebrow>Why this exists</Eyebrow>
            <h2 className="mt-5 font-display text-[34px] leading-[1.12] text-forest lg:text-[46px]">
              Good work stays invisible when nobody can find it.
            </h2>
          </Reveal>
          <Reveal delay={120} className="space-y-5 text-[16px] leading-relaxed text-ink/75 lg:pt-10">
            <p>
              Most professionals treat LinkedIn like a CV they update once a year. Then
              a recruiter, investor or client goes looking, and the profile says almost
              nothing about the person behind it.
            </p>
            <p>
              Being findable has little to do with posting every day or chasing likes.
              It comes down to a clear profile, a handful of post types that show how
              you think, and a routine small enough to keep.
            </p>
            <p className="font-semibold text-brown">This playbook lays out all three, step by step.</p>
          </Reveal>
        </div>
      </Wide>
    </section>
  )
}

/* --- inside the playbook -------------------------------------------------- */

const PARTS = [
  {
    title: 'Five Shifts That Quietly Change Your LinkedIn',
    body: 'The small habits that hold most professionals back, and how to fix each one in your own profile and posts.',
  },
  {
    title: 'The Five Post Rotation',
    body: 'Transformation stories, behind the scenes moments, contrarian takes, frameworks and honest posts. Five types on rotation, so the blank page stops winning.',
  },
  {
    title: 'The 90 Minute Daily Rhythm',
    body: 'A simple routine for creating, connecting and engaging that fits around a demanding career.',
  },
  {
    title: 'The Hands On Workbook',
    body: 'Six exercises to rewrite your headline and About section, choose your Featured pieces and plan your first five posts.',
  },
]

function Inside() {
  return (
    <section className="bg-forest py-20 text-cream lg:py-24">
      <Wide>
        <Reveal className="flex items-end justify-between gap-8">
          <div>
            <Eyebrow className="text-gold">Inside the playbook</Eyebrow>
            <h2 className="mt-5 max-w-[640px] font-display text-[34px] leading-[1.12] lg:text-[46px]">
              Four parts, in the order they get used.
            </h2>
          </div>
          <img
            src={logoMark}
            alt=""
            aria-hidden="true"
            className="hidden h-20 w-auto opacity-25 brightness-0 invert md:block"
          />
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {PARTS.map((p, i) => (
            <Reveal
              key={p.title}
              delay={i * 80}
              as="article"
              className="rounded-3xl border border-gold/35 p-8 lg:p-10"
            >
              <span className="font-display text-[34px] leading-none text-gold">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-4 text-[19px] font-semibold leading-snug">{p.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-cream/80">{p.body}</p>
            </Reveal>
          ))}
        </div>
        <a
          href="#download"
          className="group mt-10 inline-flex items-center gap-3 rounded-full bg-cream px-7 py-3.5 text-[15px] font-semibold text-forest transition-colors hover:bg-white"
        >
          Get the free playbook
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
            →
          </span>
        </a>
      </Wide>
    </section>
  )
}

/* --- who it is for -------------------------------------------------------- */

const AUDIENCE = [
  'Professionals whose reputation offline is far stronger than their profile online',
  'Founders and business owners who want clients and partners to find them first',
  'Anyone building something outside their 9 to 5 who needs the right people paying attention',
  'Doctors, lawyers and other specialists with expertise worth sharing and very little spare time',
]

function Audience() {
  return (
    <section className="bg-cream py-20 lg:py-24">
      <Wide>
        <Reveal>
          <Eyebrow>Who it is for</Eyebrow>
          <h2 className="mt-5 max-w-[700px] font-display text-[34px] leading-[1.12] text-forest lg:text-[46px]">
            Made for people who are good at what they do and quiet online.
          </h2>
        </Reveal>
        <ul className="mt-12 grid gap-x-14 md:grid-cols-2">
          {AUDIENCE.map((line, i) => (
            <Reveal
              key={line}
              as="li"
              delay={i * 70}
              className="flex items-start gap-4 border-t border-gold/25 py-6 text-[16px] leading-relaxed text-ink/80 md:[&:nth-last-child(-n+2)]:border-b"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mt-0.5 size-6 shrink-0 text-gold"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M8 12.5l2.8 2.8L16 9.8" />
              </svg>
              {line}
            </Reveal>
          ))}
        </ul>
      </Wide>
    </section>
  )
}

/* --- author --------------------------------------------------------------- */

function Author() {
  return (
    <section className="bg-sage-tint py-20 lg:py-24">
      <Wide>
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-20">
          <Reveal y={0} className="mx-auto w-full max-w-[440px]">
            <img
              src={authorPhoto}
              alt="Dr. Nkem Ezeamama"
              width="900"
              height="1124"
              loading="lazy"
              className="aspect-[4/5] w-full rounded-t-[220px] rounded-b-3xl object-cover shadow-[0_30px_60px_-20px_rgb(24_55_52/0.35)]"
            />
          </Reveal>
          <Reveal delay={120}>
            <Eyebrow>From the author</Eyebrow>
            <h2 className="mt-5 font-display text-[34px] leading-[1.12] text-forest lg:text-[46px]">
              Meet Dr. Nkem Ezeamama
            </h2>
            <div className="mt-6 space-y-5 text-[16px] leading-relaxed text-ink/75">
              <p>
                Dr. Nkem is a physician who went on to build a million dollar business,
                and LinkedIn played a real part in how she did it. She is the founder of
                Pheenyx Capital and My Expansive Life, and the instructor behind{' '}
                <Link to="/courses/linkedin-unlocked" className="text-brown underline underline-offset-4">
                  LinkedIn Unlocked
                </Link>
                .
              </p>
              <p>
                This playbook is the condensed version of what she teaches her students:
                the same shifts, post types and daily rhythm she uses herself.
              </p>
            </div>
            <p className="mt-8 font-script text-[44px] leading-none text-brown">
              Dr. Nkem Ezeamama, MD
            </p>
          </Reveal>
        </div>
      </Wide>
    </section>
  )
}

/* --- download ------------------------------------------------------------- */

function Download() {
  return (
    <section id="download" className="scroll-mt-4 bg-forest py-20 text-cream lg:py-24">
      <Wide>
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          <Reveal className="lg:sticky lg:top-10">
            <Eyebrow className="text-gold">Free download</Eyebrow>
            <h2 className="mt-5 font-display text-[36px] leading-[1.1] lg:text-[50px]">
              Get the Personal Brand Playbook
            </h2>
            <p className="mt-5 max-w-[500px] text-[16.5px] leading-relaxed text-cream/85">
              Register for my free live webinar and I’ll send you the Playbook right
              after. No card, no catch.
            </p>
            <p className="mt-4 max-w-[500px] text-[15px] leading-relaxed text-cream/75">
              <strong className="font-semibold text-cream">{WEBINAR.title}</strong>
              <br />
              {WEBINAR.date} · {WEBINAR.times}
            </p>
            <img
              src={playbookBanner}
              alt="Your Personal Brand Playbook: Five Mindset Shifts, Five-Post Content Plan, 90-Minute Daily Routine and Hands-On Workbook"
              width="789"
              height="259"
              loading="lazy"
              className="mt-8 w-full max-w-[540px] rounded-2xl"
            />
          </Reveal>
          <Reveal delay={150}>
            <div className="overflow-hidden rounded-3xl bg-cream p-4 text-forest shadow-[0_30px_60px_-20px_rgb(0_0_0/0.45)] sm:p-6">
              <h3 className="px-2 pt-2 font-display text-[26px] leading-tight">
                Where should we send it?
              </h3>
              <p className="mt-2 px-2 text-[14px] leading-relaxed text-ink/70">
                You’ll receive the ClickMeeting link and the Personal Brand Playbook
                right after you register.
              </p>
              <iframe
                src={CLICKMEETING_URL}
                title={`Register for ${WEBINAR.title}`}
                allow="microphone; camera; fullscreen; autoplay"
                allowFullScreen
                className="mt-4 block h-[1480px] w-full rounded-2xl border-0"
              />
            </div>
          </Reveal>
        </div>
      </Wide>
    </section>
  )
}

/* --- FAQ ------------------------------------------------------------------ */

const FAQ = [
  ['Is it really free?', 'Yes. There is no card to enter and nothing to cancel later.'],
  [
    'Do I need a big following for this to work?',
    'Not at all. The playbook is about being found by the right people, and a small, well chosen audience is often worth more than a large one.',
  ],
  [
    'How much time will it take?',
    'The daily rhythm is built around 90 minutes. The workbook exercises can be done at whatever pace suits your week.',
  ],
  [
    'How is this different from LinkedIn Unlocked?',
    'The playbook gives you the system to follow on your own. LinkedIn Unlocked is the full course, where Dr. Nkem walks through each part in depth with a cohort of members.',
  ],
]

function Faq() {
  return (
    <section className="bg-cream py-20 lg:py-24">
      <div className="mx-auto w-full max-w-[840px] px-4 sm:px-6">
        <Reveal>
          <h2 className="text-center font-display text-[34px] leading-[1.12] text-forest lg:text-[46px]">
            Questions people ask
          </h2>
        </Reveal>
        <dl className="mt-12 border-t border-gold/25">
          {FAQ.map(([q, a]) => (
            <Reveal key={q} className="border-b border-gold/25 py-7">
              <dt className="text-[18px] font-semibold text-forest">{q}</dt>
              <dd className="mt-2.5 text-[15.5px] leading-relaxed text-ink/75">{a}</dd>
            </Reveal>
          ))}
        </dl>
        <div className="mt-12 text-center">
          <Button variant="solid" to="#download" icon>
            Send me the playbook
          </Button>
        </div>
      </div>
    </section>
  )
}

/* --- page ----------------------------------------------------------------- */

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map(([q, a]) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
}

export default function PlaybookLanding() {
  useEffect(() => {
    window.scrollTo(0, 0)
    trackPageView('/linkedin-playbook')
  }, [])

  return (
    <>
      <Seo
        title="Free LinkedIn Personal Brand Playbook"
        description="Dr. Nkem Ezeamama's free Personal Brand Playbook: the profile shifts, five post types and 90 minute daily rhythm that get your work found on LinkedIn."
        path="/linkedin-playbook"
        image={playbookPreview}
        schema={faqSchema}
      />

      <header className="border-b border-gold/20 bg-cream">
        <Wide className="flex items-center justify-between gap-4 py-4">
          <Link to="/" aria-label="My Expansive Life home">
            <img src={logo} alt="My Expansive Life" className="h-11 w-auto lg:h-12" />
          </Link>
          <a
            href="#download"
            className="rounded-full border border-brown/50 px-5 py-2.5 text-[14.5px] font-semibold text-brown transition-colors hover:bg-brown hover:text-white"
          >
            Get the free playbook
          </a>
        </Wide>
      </header>

      <main className="page-enter">
        <Hero />
        <Why />
        <Inside />
        <Audience />
        <Author />
        <Download />
        <Faq />
      </main>

      <footer className="bg-brown py-10 text-cream">
        <Wide className="flex flex-wrap items-center justify-between gap-6">
          <img src={logoLight} alt="My Expansive Life, Life Beyond Boundaries" className="w-[170px]" />
          <span className="text-[13.5px] text-cream/80">
            © {new Date().getFullYear()} My Expansive Life
          </span>
        </Wide>
      </footer>
    </>
  )
}
