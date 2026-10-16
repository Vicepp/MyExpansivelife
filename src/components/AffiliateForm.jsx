import { useEffect } from 'react'
import { Container } from './primitives'
import Reveal from './Reveal'

/**
 * Affiliate applications go to the "LinkedIn Affiliate Support" form in
 * LeadConnector (GoHighLevel), so they land in the CRM with the rest of the
 * pipeline rather than in the site's own inbox.
 */
const FORM_ID = 'aex5atZbDDaLMpNIfuDI'
const EMBED_SCRIPT = 'https://link.msgsndr.com/js/form_embed.js'

/**
 * LeadConnector's helper sizes the iframe to the form and handles its
 * cookie-consent and redirect behaviour. Added once per page load; React
 * re-mounts on navigation must not stack copies.
 */
function useFormEmbedScript() {
  useEffect(() => {
    if (document.querySelector(`script[src="${EMBED_SCRIPT}"]`)) return
    const script = document.createElement('script')
    script.src = EMBED_SCRIPT
    script.async = true
    document.body.appendChild(script)
  }, [])
}

export default function AffiliateForm() {
  useFormEmbedScript()

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

        {/*
          Attributes are LeadConnector's embed code verbatim; form_embed.js
          reads them. The 490px starting height is the form's data-height, so
          the page doesn't jump before the script resizes it.
        */}
        <div className="mt-14">
          <iframe
            src={`https://api.leadconnectorhq.com/widget/form/${FORM_ID}`}
            id={`inline-${FORM_ID}`}
            title="LinkedIn Affiliate Support"
            style={{ width: '100%', height: '490px', border: 'none', borderRadius: '20px' }}
            data-layout="{'id':'INLINE'}"
            data-trigger-type="alwaysShow"
            data-trigger-value=""
            data-activation-type="alwaysActivated"
            data-activation-value=""
            data-deactivation-type="neverDeactivate"
            data-deactivation-value=""
            data-form-name="LinkedIn Affiliate Support"
            data-height="490"
            data-layout-iframe-id={`inline-${FORM_ID}`}
            data-form-id={FORM_ID}
            data-cookie-consent="true"
            data-cookie-consent-provider="auto"
          />
        </div>
      </Container>
    </section>
  )
}
