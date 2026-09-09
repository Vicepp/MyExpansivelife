import Seo from '../components/Seo'
import PageHero from '../components/PageHero'
import TrustedBy from '../components/TrustedBy'
import Problem from '../components/Problem'
import BulletSplit from '../components/BulletSplit'
import AccessGrid from '../components/AccessGrid'
import WhatChanges from '../components/WhatChanges'

const FITS = [
  'Want to grow personally, professionally and financially, not just one of the three',
  "Are exploring what's possible beyond their primary career",
  'Want a stronger personal brand and more visibility in their industry',
  'Are curious about entrepreneurship, investing or a second income',
  'Need real accountability, not just more information',
  'Are tired of trying to figure it all out on their own',
]

/*
 * One page, one ask: join the Circle. The course cross-sell, the stats strip,
 * the video, the testimonials and the newsletter were all cut so the page runs
 * straight from "what this is" to "what changes for you".
 */
export default function Community() {
  return (
    <>
      <Seo
        title="The Circle Community"
        description="The private membership where ambitious professionals stop building alone: clarity, visibility, financial confidence and a network that shows up."
        path="/community"
      />
      <PageHero
        cluster
        courseCta={false}
        lead="The room where ambitious people stop"
        accent="building alone."
        body="The Circle is the private membership where the My Expansive Life mission gets practical."
      />
      <TrustedBy />
      <Problem tone="gold" media={false} stats={false} />
      <BulletSplit
        eyebrow="Is this you?"
        title="The Circle is built for professionals who:"
        items={FITS}
        badge={false}
      />
      <AccessGrid />
      <WhatChanges />
    </>
  )
}
