import { Container } from './primitives'
import Reveal from './Reveal'
import { LeadConnectorForm } from './LeadForm'

/**
 * Affiliate applications go to the "LinkedIn Affiliate Support" form in
 * LeadConnector (GoHighLevel), so they land in the CRM with the rest of the
 * pipeline rather than in the site's own inbox.
 */
const AFFILIATE_FORM = { formId: 'aex5atZbDDaLMpNIfuDI', name: 'LinkedIn Affiliate Support', height: 490 }

export default function AffiliateForm() {
  return (
    <section className="bg-cream py-20 lg:py-24">
      <Container>
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <p className="text-[15px] text-ink/70">Chat with our support</p>
            <h2 className="mt-3 text-[32px] font-bold leading-[1.15] text-gold lg:text-[44px]">
              Apply to become an affiliate.
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="max-w-[480px] text-[15px] leading-relaxed text-ink/80 lg:mt-4">
              Fill in your details below to submit your request. Once it&rsquo;s
              reviewed, we&rsquo;ll send you an invitation to join the MXL Circle
              Community, where the rest of your affiliate setup happens.
            </p>
          </Reveal>
        </div>

        <div className="mt-14">
          <LeadConnectorForm {...AFFILIATE_FORM} />
        </div>
      </Container>
    </section>
  )
}
