import Seo from '../components/Seo'
import BlogHero from '../components/BlogHero'
import BlogIndex from '../components/BlogIndex'
import UpcomingEvents from '../components/UpcomingEvents'
import { Newsletter } from '../components/Footer'

export default function Blogs() {
  return (
    <>
      <Seo
        title="The Expansive Journal"
        description="Practical writing on personal branding, LinkedIn strategy, investing and building a career that expands instead of confines."
        path="/blogs"
      />
      <BlogHero />
      <BlogIndex />
      <UpcomingEvents />
      <Newsletter tone="gold" />
    </>
  )
}
