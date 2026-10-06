import Seo from '../components/Seo'
import {
  WebinarHero,
  WebinarStats,
  WebinarLearn,
  WebinarFamiliar,
  WebinarAbout,
  WebinarTestimonials,
  WebinarPlaybook,
  WebinarRegister,
} from '../components/Webinar'

/*
 * The free webinar, "How a Single LinkedIn Post Turned Into a Six Figure
 * Partnership": hook, what you'll learn, the pain, who is teaching it, proof,
 * the registration bonus, then the sign-up. Every button leads to #register.
 */
export default function Course() {
  return (
    <>
      <Seo
        title="LinkedIn Unlocked — Free Live Webinar"
        description="Free live webinar with Dr. Nkem Ezeamama: how a single LinkedIn post turned into a six figure partnership, and how to apply the same thinking to your own LinkedIn presence."
        path="/courses/linkedin-unlocked"
      />
      <WebinarHero />
      <WebinarStats />
      <WebinarLearn />
      <WebinarFamiliar />
      <WebinarAbout />
      <WebinarTestimonials />
      <WebinarPlaybook />
      <WebinarRegister />
    </>
  )
}
