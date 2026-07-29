import CourseHero, { CourseStats } from '../components/CourseHero'
import SageFeature from '../components/SageFeature'
import TrustedBy from '../components/TrustedBy'
import Process from '../components/Process'
import GrowthBanner from '../components/GrowthBanner'
import Testimonials from '../components/Testimonials'
import Blog from '../components/Blog'
import { Newsletter } from '../components/Footer'
import { COURSE_URL } from '../lib/links'

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
        ctaTo={COURSE_URL}
      />
      <Testimonials />
      <Newsletter />
      <Blog />
    </>
  )
}
