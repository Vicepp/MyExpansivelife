import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Blogs from './pages/Blogs'
import Course from './pages/Course'
import Community from './pages/Community'
import Affiliate from './pages/Affiliate'
import ComingSoon from './pages/ComingSoon'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/courses/linkedin-unlocked" element={<Course />} />
        <Route
          path="/courses/investment-101"
          element={<ComingSoon title="Investment 101" />}
        />
        <Route
          path="/courses/personal-branding"
          element={<ComingSoon title="Personal Branding" />}
        />
        <Route path="/community" element={<Community />} />
        <Route path="/affiliate" element={<Affiliate />} />
        <Route path="*" element={<ComingSoon title="Page not found" />} />
      </Route>
    </Routes>
  )
}

export default App
