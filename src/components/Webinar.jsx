import { useState } from 'react'
import { Button } from './primitives'
import Reveal, { TextReveal } from './Reveal'
import logo from '../assets/design/logo.svg'
import logoMark from '../assets/design/logo-mark.png'
import logoLight from '../assets/design/logo-light.png'

/**
 * The LinkedIn Unlocked course page: the free webinar funnel, adapted from the
 * standalone webinar landing page into the site's palette.
 *
 * The date is printed copy; registration is the embedded ClickMeeting form
 * (see WebinarRegister).
 */

/**
 * Wider than the site-wide Container (1200px) so the webinar's panels fill
 * large screens instead of floating in wide side gutters.
 */
function Wide({ children }) {
  return <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">{children}</div>
}

/** Same file the team README documents; until it exists a branded panel shows. */
const PORTRAIT = '/team/nkem-ezeamama.jpg'

function Portrait({ className = '', alt = 'Dr. Nkem Ezeamama' }) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <div className={`grid place-items-center bg-forest ${className}`}>
        <img src={logo} alt="" aria-hidden="true" className="w-1/2 brightness-0 invert opacity-80" />
      </div>
    )
  }
  return (
    <img
      src={PORTRAIT}
      alt={alt}
      onError={() => setFailed(true)}
      className={`object-cover object-top ${className}`}
    />
  )
}
const WEBINAR = {
  title: 'How a Single LinkedIn Post Turned Into a Six Figure Partnership',
  date: 'Thursday, October 29, 2026',
  times: '6:00 PM CST | 7:00 PM EST | 4:00 PM PST',
}

/* --- icons ---------------------------------------------------------------- */

function Icon({ d, className = 'size-5', strokeWidth = 1.7 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {d}
    </svg>
  )
}

const CALENDAR = (
  <>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </>
)
const CAMERA = (
  <>
    <rect x="3" y="6" width="13" height="12" rx="2" />
    <path d="M16 10l5-3v10l-5-3z" />
  </>
)
const CHECK = <path d="M5 12.5l4.5 4.5L19 7.5" />

/** Date + platform pair, shown in the hero and again beside the sign-up. */
function WebinarMeta({ dark = false }) {
  const chip = dark ? 'bg-cream text-brown' : 'bg-forest text-cream'
  const sub = dark ? 'text-cream/80' : 'text-ink/65'
  const items = [
    { icon: CALENDAR, title: WEBINAR.date, sub: WEBINAR.times },
    { icon: CAMERA, title: 'Live on ClickMeeting', sub: 'Free to attend' },
  ]
  return (
    <div className="flex flex-wrap gap-x-8 gap-y-4">
      {items.map((item) => (
        <div key={item.title} className="flex items-center gap-3.5">
          <span className={`grid size-[46px] shrink-0 place-items-center rounded-full ${chip}`}>
            <Icon d={item.icon} />
          </span>
          <span className="flex flex-col">
            <strong className="text-[15px] font-semibold">{item.title}</strong>
            <span className={`text-[14px] ${sub}`}>{item.sub}</span>
          </span>
        </div>
      ))}
    </div>
  )
}

/* --- hero ----------------------------------------------------------------- */

export function WebinarHero() {
  return (
    <section className="bg-cream pb-12 pt-6 lg:pb-16">
      <Wide>
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)]">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2.5 rounded-full border border-gold/40 px-4 py-2 text-[11.5px] font-semibold uppercase tracking-[0.18em] text-forest">
                <span className="size-2 rounded-full bg-gold" />
                Free live webinar
              </span>
            </Reveal>
            <TextReveal
              as="h1"
              delay={90}
              className="mt-6 font-display text-[38px] leading-display text-forest sm:text-[48px] lg:text-[60px]"
              segments={[
                { text: 'How a Single LinkedIn Post Turned Into a' },
                { text: 'Six Figure Partnership', className: 'text-brown' },
              ]}
            />
            <Reveal delay={180}>
              <p className="mt-6 max-w-[540px] text-[18px] font-semibold leading-snug text-forest">
                What if your next LinkedIn post could do more than collect likes?
              </p>
              <p className="mt-3 max-w-[520px] text-[15px] leading-relaxed text-ink/75">
                In this live webinar, I’ll show you exactly what I shared, why it
                started a conversation, and how you can apply the same thinking to
                your own LinkedIn presence.
              </p>
            </Reveal>
            <Reveal delay={270}>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                <Button variant="solid" to="#register" icon>
                  Save My Seat
                </Button>
                <span className="max-w-[230px] text-[13.5px] leading-snug text-ink/65">
                  Register today and get my Personal Brand Playbook free.
                </span>
              </div>
            </Reveal>
            <Reveal delay={330}>
              <div className="mt-8 border-t border-gold/20 pt-6">
                <WebinarMeta />
              </div>
            </Reveal>
          </div>

          {/* y={0}: the wrapper holds absolutely-positioned notes. */}
          <Reveal y={0} delay={200} className="relative mx-auto w-full max-w-[440px] pt-16">
            <span className="absolute right-0 top-0 z-10 rotate-[-6deg] text-right font-script text-[46px] leading-[0.9] text-brown">
              Join me live,
              <br />
              Dr. Nkem
            </span>
            <Portrait className="aspect-[4/5] w-full rounded-[28px] shadow-[0_30px_60px_-20px_rgb(24_55_52/0.4)]" />
            <div className="absolute -left-2 bottom-6 flex items-center gap-3.5 rounded-2xl bg-cream-card px-5 py-4 shadow-[0_18px_40px_-12px_rgb(24_55_52/0.25)] ring-1 ring-gold/15 sm:-left-5">
              <span className="grid size-11 place-items-center rounded-full bg-forest font-display text-[18px] text-cream">
                N
              </span>
              <span className="flex flex-col">
                <strong className="text-[14.5px] font-semibold text-forest">
                  Dr. Nkem Ezeamama
                </strong>
                <span className="text-[12.5px] text-ink/65">
                  ER physician and founder, Pheenyx Capital
                </span>
              </span>
            </div>
          </Reveal>
        </div>
      </Wide>
    </section>
  )
}

/* --- stats band ----------------------------------------------------------- */

const STATS = [
  { value: '17,000+', label: 'LinkedIn followers and a growing professional community' },
  { value: '$153M', label: 'In assets managed by Pheenyx Capital' },
  { value: '1 post', label: 'That led to a six figure partnership' },
  { value: 'Free', label: 'Live on ClickMeeting, plus my Personal Brand Playbook', accent: true },
]

export function WebinarStats() {
  return (
    <section className="bg-cream pb-6">
      <Wide>
        <Reveal>
          <dl className="grid gap-y-8 rounded-3xl bg-forest px-4 py-10 text-cream sm:grid-cols-2 lg:grid-cols-4 lg:px-8 lg:py-12">
            {STATS.map((s) => (
              <div key={s.value} className="border-l border-white/15 px-6">
                <dt
                  className={`font-display text-[40px] leading-none lg:text-[46px] ${
                    s.accent ? 'text-gold' : 'text-cream'
                  }`}
                >
                  {s.value}
                </dt>
                <dd className="mt-3 text-[14px] leading-snug text-cream/75">{s.label}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Wide>
    </section>
  )
}

/* --- what you'll learn ---------------------------------------------------- */

const LESSONS = [
  {
    title: 'Get your expertise in front of the right people',
    body: 'Your experience can only open doors when the people who need it can actually see it.',
    icon: (
      <>
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
  },
  {
    title: 'Know exactly what to post',
    body: 'Turn what you already know into content that gives people a reason to pay attention and start a conversation.',
    icon: (
      <>
        <path d="M4 20h4L19 9l-4-4L4 16v4z" />
        <path d="M13.5 6.5l4 4" />
      </>
    ),
  },
  {
    title: 'Make LinkedIn work around your career',
    body: 'Build a strong presence without spending hours on content or becoming a full time creator.',
    icon: <path d="M4 20V14M10 20V9M16 20V4M2 20h20" />,
  },
]

export function WebinarLearn() {
  return (
    <section id="learn" className="bg-cream py-20 lg:py-24">
      <Wide>
        <Reveal className="text-center">
          <img src={logoMark} alt="" aria-hidden="true" className="mx-auto mb-4 h-10 w-auto" />
          <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-brown">
            What you’ll learn
          </p>
          <h2 className="mx-auto mt-4 max-w-[720px] font-display text-[32px] leading-[1.12] text-forest lg:text-[46px]">
            On this live webinar, you’ll learn how to:
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {LESSONS.map((l, i) => (
            <Reveal
              key={l.title}
              delay={i * 90}
              as="article"
              className="flex flex-col rounded-3xl bg-cream-card p-8 ring-1 ring-gold/15"
            >
              <div className="flex items-start justify-between">
                <span className="font-display text-[40px] leading-none text-brown">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="grid size-13 place-items-center rounded-full bg-sage-tint text-forest">
                  <Icon d={l.icon} className="size-6" strokeWidth={1.6} />
                </span>
              </div>
              <h3 className="mt-7 font-display text-[24px] leading-[1.18] text-forest">
                {l.title}
              </h3>
              <p className="mt-3 text-[14.5px] leading-relaxed text-ink/70">{l.body}</p>
            </Reveal>
          ))}
        </div>
      </Wide>
    </section>
  )
}

/* --- sounds familiar ------------------------------------------------------ */

const FAMILIAR = [
  'I know I’m good at what I do, but my LinkedIn doesn’t show it.',
  'I never know what to post.',
  'I don’t have time to become a content creator.',
  'I want the right people to find me, not just more people.',
]

export function WebinarFamiliar() {
  return (
    <section className="bg-cream pb-6">
      <Wide>
        <div className="grid items-center gap-12 rounded-3xl bg-sage-tint px-6 py-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:px-14 lg:py-16">
          <Reveal>
            <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-brown">
              If any of this sounds familiar…
            </p>
            <ul className="mt-4">
              {FAMILIAR.map((line, i) => (
                <li
                  key={line}
                  className={`flex items-start gap-4 py-5 font-display text-[20px] leading-snug text-forest lg:text-[24px] ${
                    i < FAMILIAR.length - 1 ? 'border-b border-forest/15' : ''
                  }`}
                >
                  <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-forest text-cream">
                    <Icon d={CHECK} className="size-4" strokeWidth={2.6} />
                  </span>
                  {line}
                </li>
              ))}
            </ul>
            <Button variant="solid" to="#register" icon className="mt-6">
              Then this webinar is for you
            </Button>
          </Reveal>

          <Reveal y={0} delay={150} className="relative mx-auto w-full max-w-[420px]">
            <Portrait className="aspect-[4/5] w-full rounded-t-[28px] rounded-b-full" />
            <div className="absolute -left-2 top-8 rotate-[-4deg] rounded-2xl bg-cream-card px-6 pb-4 pt-5 font-script text-[40px] leading-[0.85] text-forest shadow-[0_18px_40px_-12px_rgb(24_55_52/0.25)] sm:-left-6">
              Same expertise.
              <br />
              <span className="text-brown">Bigger opportunities.</span>
            </div>
          </Reveal>
        </div>
      </Wide>
    </section>
  )
}

/* --- about ---------------------------------------------------------------- */

export function WebinarAbout() {
  return (
    <section id="about" className="bg-cream py-20 lg:py-24">
      <Wide>
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:gap-20">
          <Reveal y={0} className="relative mx-auto w-full max-w-[420px]">
            <Portrait className="aspect-[4/5] w-full rounded-t-full rounded-b-[28px]" />
            <div className="absolute -right-2 bottom-10 rounded-2xl bg-forest px-5 py-4 text-cream shadow-[0_18px_40px_-12px_rgb(24_55_52/0.4)] sm:-right-4">
              <span className="block font-display text-[32px] leading-none text-gold">$153M</span>
              <span className="mt-1 block text-[12.5px] text-cream/75">
                Assets managed at Pheenyx Capital
              </span>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-brown">
              Why I’m teaching this
            </p>
            <h2 className="mt-4 font-display text-[32px] leading-[1.12] text-forest lg:text-[46px]">
              I was an introverted ER physician who started building beyond medicine.
            </h2>
            <div className="mt-6 space-y-4 text-[15.5px] leading-relaxed text-ink/75">
              <p>
                I knew I had valuable experience, but putting myself out there didn’t
                come naturally. LinkedIn became one of the places where I learned to
                share what I was building and connect with people outside of medicine.
              </p>
              <p>
                Today, I have more than{' '}
                <strong className="font-bold text-forest">17,000 followers</strong> and a
                community of professionals I help grow on LinkedIn. My firm, Pheenyx
                Capital, manages{' '}
                <strong className="font-bold text-forest">$153 million</strong> in assets.
              </p>
              <p>And one post I shared eventually led to a six figure partnership.</p>
            </div>
            <p className="mt-7 border-l-2 border-gold pl-5 font-display text-[22px] leading-snug text-forest lg:text-[26px]">
              That’s the story I’ll share with you live.
            </p>
          </Reveal>
        </div>
      </Wide>
    </section>
  )
}

/* --- testimonials --------------------------------------------------------- */

const QUOTES = [
  {
    name: 'Moses K. Ajayi, MBA, FACHE',
    role: 'Healthcare Executive',
    body: 'In a week, I posted six posts, received over 7,000 impressions, and even got a couple of direct messages for future engagements.',
  },
  {
    name: 'Jovi Stevenson',
    role: 'Founder, BestView',
    body: 'Thanks to Nkem Ezeamama, MD, I began to understand that visibility wasn’t just about posting. It was about letting people see the person behind the business.',
  },
]

export function WebinarTestimonials() {
  return (
    <section className="bg-cream pb-20 lg:pb-24">
      <Wide>
        <Reveal className="text-center">
          <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-brown">
            Real people. Real results.
          </p>
          <h2 className="mt-4 font-display text-[32px] leading-[1.12] text-forest lg:text-[46px]">
            What professionals are saying
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {QUOTES.map((q, i) => (
            <Reveal
              key={q.name}
              delay={i * 90}
              as="figure"
              className="flex flex-col justify-between gap-8 rounded-3xl bg-cream-card p-8 ring-1 ring-gold/15 lg:p-10"
            >
              <blockquote>
                <span aria-hidden="true" className="block h-8 font-display text-[72px] leading-[0.8] text-brown">
                  “
                </span>
                <p className="mt-3 font-display text-[20px] leading-[1.45] text-forest lg:text-[22px]">
                  {q.body}
                </p>
              </blockquote>
              <figcaption className="flex items-center gap-3.5 border-t border-gold/15 pt-6">
                <span className="grid size-12 place-items-center rounded-full bg-sage-tint text-[14px] font-semibold text-forest">
                  {q.name
                    .split(' ')
                    .slice(0, 2)
                    .map((p) => p[0])
                    .join('')}
                </span>
                <span className="flex flex-col">
                  <strong className="text-[15px] font-semibold text-forest">{q.name}</strong>
                  <span className="text-[13.5px] text-ink/65">{q.role}</span>
                </span>
              </figcaption>
            </Reveal>
          ))}
        </div>
      </Wide>
    </section>
  )
}

/* --- personal brand playbook ---------------------------------------------- */

const PLAYBOOK = [
  {
    title: 'Five Shifts That Quietly Change Your LinkedIn',
    body: 'The small habits holding most professionals back, and how to fix them in your own profile and posts.',
  },
  {
    title: 'The Five Post Rotation',
    body: 'Transformation stories, behind the scenes moments, contrarian takes, frameworks and honest posts, so you never have to guess what to post again.',
  },
  {
    title: 'The 90 Minute Daily Rhythm',
    body: 'A simple routine for creating, connecting and engaging that fits around a demanding career.',
  },
  {
    title: 'Your Hands On Workbook',
    body: 'Six exercises to rewrite your headline and About section, choose your Featured pieces, and plan your first five posts.',
  },
]

export function WebinarPlaybook() {
  return (
    <section id="playbook" className="bg-cream py-6">
      <Wide>
        <div className="grid items-center gap-12 rounded-3xl bg-forest px-6 py-14 text-cream lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:px-14 lg:py-20">
          <Reveal y={0} className="relative mx-auto h-[460px] w-full max-w-[440px]">
            <span className="absolute -top-2 left-0 z-10 rotate-[-5deg] font-script text-[42px] leading-none text-gold">
              Yours when you register
            </span>
            <div className="absolute right-0 top-24 flex h-[230px] w-[170px] rotate-[8deg] flex-col gap-2.5 rounded-lg bg-cream-card p-5 text-forest shadow-xl">
              <span className="font-display text-[17px] leading-tight">
                Five Shifts That Quietly Change Your LinkedIn
              </span>
              <span className="h-1.5 rounded bg-gold/20" />
              <span className="h-1.5 w-4/5 rounded bg-gold/20" />
              <span className="h-1.5 w-3/4 rounded bg-gold/20" />
            </div>
            <div className="absolute right-[72px] top-16 flex h-[230px] w-[170px] rotate-[2deg] flex-col gap-2.5 rounded-lg bg-cream-card p-5 text-forest shadow-xl">
              <span className="font-display text-[17px] leading-tight">
                Your Workbook: Stop Reading, Start Building
              </span>
              <span className="h-1.5 rounded bg-gold/20" />
              <span className="h-1.5 w-5/6 rounded bg-gold/20" />
              <span className="h-1.5 w-2/3 rounded bg-gold/20" />
            </div>
            <div className="absolute bottom-0 left-0 flex h-[290px] w-[200px] rotate-[-4deg] flex-col justify-between rounded-l-md rounded-r-2xl border-l-[10px] border-brown-deep bg-brown p-6 shadow-2xl">
              <img src={logoLight} alt="My Expansive Life" className="w-24" />
              <span className="font-display text-[30px] leading-[1.05]">
                Your Personal Brand Playbook
              </span>
              <span className="text-[11px] uppercase tracking-[0.14em] text-cream/80">
                By Dr. Nkem Ezeamama
              </span>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-gold">
              Free registration bonus
            </p>
            <h2 className="mt-4 font-display text-[32px] leading-[1.12] lg:text-[46px]">
              Your Personal Brand Playbook
            </h2>
            <p className="mt-4 text-[15.5px] leading-relaxed text-cream/80">
              Register for the webinar and I’ll send you my Personal Brand Playbook,
              the same system I teach inside LinkedIn Unlocked. Here’s what’s inside.
            </p>
            <ol className="mt-6 border-t border-white/15">
              {PLAYBOOK.map((p, i) => (
                <li key={p.title} className="flex gap-5 border-b border-white/15 py-5">
                  <span className="w-9 shrink-0 font-display text-[26px] leading-none text-gold">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span>
                    <strong className="block text-[16px] font-semibold">{p.title}</strong>
                    <span className="mt-1 block text-[14.5px] leading-relaxed text-cream/75">
                      {p.body}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </Wide>
    </section>
  )
}

/* --- registration --------------------------------------------------------- */

/**
 * ClickMeeting's registration page for this webinar. Their embed snippet
 * (embed_conference.html?r=18245298510263239) only injects this iframe at a
 * fixed 1024x768 and forces overflow-x on <body>, so the iframe is rendered
 * directly instead, sized to the card.
 */
const CLICKMEETING_URL =
  'https://pheenyxcapital.clickmeeting.com/836413449?popup=off&lang=en&xlang=en'

export function WebinarRegister() {
  return (
    <section id="register" className="scroll-mt-24 bg-cream pb-20 pt-6 lg:pb-24">
      <Wide>
        <div className="grid items-start gap-12 rounded-3xl bg-brown px-6 py-14 text-cream lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-10 lg:px-14 lg:py-20">
          {/* Sticky so the pitch stays beside the long form while it scrolls. */}
          <Reveal className="lg:sticky lg:top-28">
            <h2 className="font-display text-[34px] leading-[1.08] lg:text-[52px]">
              One post can start a conversation.{' '}
              <span className="text-gold-tint">A conversation can change what comes next.</span>
            </h2>
            <p className="mt-5 max-w-[520px] text-[16px] leading-relaxed text-cream/85">
              Join me for {WEBINAR.title}.
            </p>
            <div className="mt-7 border-t border-[#a8694a] pt-6">
              <WebinarMeta dark />
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="overflow-hidden rounded-3xl bg-cream text-forest shadow-[0_24px_50px_-10px_rgb(60_30_15/0.35)]">
              <div className="px-7 pb-5 pt-7">
                <h3 className="font-display text-[26px] leading-[1.15]">
                  Save your seat for the free webinar.
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-ink/70">
                  You’ll receive the ClickMeeting link and the Personal Brand Playbook
                  right after you register.
                </p>
              </div>
              <iframe
                src={CLICKMEETING_URL}
                title={`Register for ${WEBINAR.title}`}
                allow="microphone; camera; fullscreen; autoplay"
                allowFullScreen
                className="block h-[1480px] w-full border-0"
              />
              <p className="px-7 pb-6 pt-4 text-center text-[12.5px] leading-relaxed text-ink/55">
                We respect your privacy. No spam. Unsubscribe anytime.
              </p>
            </div>
          </Reveal>
        </div>
      </Wide>
    </section>
  )
}

/* --- footer --------------------------------------------------------------- */

export function WebinarFooter() {
  return (
    <footer className="bg-cream pb-6">
      <Wide>
        <div className="rounded-3xl bg-forest px-6 pb-8 pt-12 text-cream lg:px-14">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <img
              src={logoLight}
              alt="My Expansive Life, Life Beyond Boundaries"
              className="w-[200px]"
            />
            <a
              href="#register"
              className="group inline-flex items-center gap-3 rounded-full bg-cream px-6 py-3.5 text-[15px] font-semibold text-forest transition-colors hover:bg-white"
            >
              Save My Seat
              <Icon d={<path d="M5 12h14M13 6l6 6-6 6" />} className="size-4" strokeWidth={2.2} />
            </a>
          </div>
          <div className="mt-8 flex flex-wrap justify-between gap-4 border-t border-white/15 pt-6 text-[13.5px] text-cream/75">
            <span>LinkedIn Unlocked is a program of My Expansive Life.</span>
            <span>© {new Date().getFullYear()} My Expansive Life. All rights reserved.</span>
          </div>
        </div>
      </Wide>
    </footer>
  )
}
