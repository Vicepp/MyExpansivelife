import BlogHero from '../components/BlogHero'
import BlogIndex from '../components/BlogIndex'
import UpcomingEvents from '../components/UpcomingEvents'
import { Newsletter } from '../components/Footer'

export default function Blogs() {
  return (
    <>
      <BlogHero />
      <BlogIndex />
      <UpcomingEvents />
      <Newsletter tone="gold" />
    </>
  )
}
