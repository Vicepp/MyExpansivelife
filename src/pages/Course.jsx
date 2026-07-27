import CourseHero, { CourseStats } from '../components/CourseHero'
import SageFeature from '../components/SageFeature'
import TrustedBy from '../components/TrustedBy'
import Process from '../components/Process'
import GrowthBanner from '../components/GrowthBanner'
import Testimonials from '../components/Testimonials'
import Blog from '../components/Blog'
import { Newsletter } from '../components/Footer'

export default function Course() {
  return (
    <>
      <CourseHero />
      <CourseStats />
      <SageFeature />
      <TrustedBy />
      <Process />
      <GrowthBanner
        tone="gold"
        wide
        title="You'll Be Able To Walk Into Any Room, Online Or Off, And Say Exactly Who You Help."
        ctaLabel="Enroll Now"
        ctaTo="/courses/linkedin-unlocked"
      />
      <Testimonials />
      <Newsletter />
      <Blog />
    </>
  )
}
