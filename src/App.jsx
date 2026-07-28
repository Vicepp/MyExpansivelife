import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Blogs from './pages/Blogs'
import BlogPost from './pages/BlogPost'
import Course from './pages/Course'
import Community from './pages/Community'
import Affiliate from './pages/Affiliate'
import ComingSoon from './pages/ComingSoon'

/*
 * The admin panel pulls in the editor and charting libraries, which visitors to
 * the marketing site should never download. Everything under /admin is lazy so
 * it ships as its own chunk.
 */
const AdminRoot = lazy(() => import('./admin/AdminRoot'))
const AdminLayout = lazy(() => import('./admin/AdminLayout'))
const ProtectedRoute = lazy(() => import('./admin/ProtectedRoute'))
const Login = lazy(() => import('./admin/Login'))
const Dashboard = lazy(() => import('./admin/Dashboard'))
const Posts = lazy(() => import('./admin/Posts'))
const PostEditor = lazy(() => import('./admin/PostEditor'))
const Events = lazy(() => import('./admin/Events'))
const Analytics = lazy(() => import('./admin/Analytics'))
const PageAnalytics = lazy(() => import('./admin/PageAnalytics'))
const Inbox = lazy(() => import('./admin/Inbox'))
const PostPlan = lazy(() => import('./admin/PostPlan'))
const Earning = lazy(() => import('./admin/Earning'))
const Settings = lazy(() => import('./admin/Settings'))

function AdminFallback() {
  return (
    <div className="grid min-h-dvh place-items-center bg-cream">
      <div className="flex items-center gap-3 text-[14px] text-forest-deep/60">
        <span className="size-4 animate-spin rounded-full border-2 border-forest-deep/20 border-t-forest-deep" />
        Loading the studio…
      </div>
    </div>
  )
}

function App() {
  return (
    <Routes>
      {/* Public site */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:slug" element={<BlogPost />} />
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

      {/* Admin panel — deliberately unlinked from the public navigation. */}
      <Route
        element={
          <Suspense fallback={<AdminFallback />}>
            <AdminRoot />
          </Suspense>
        }
      >
        <Route path="/admin/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="posts" element={<Posts />} />
          <Route path="posts/new" element={<PostEditor />} />
          <Route path="posts/:id/edit" element={<PostEditor />} />
          <Route path="events" element={<Events />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="page-analytics" element={<PageAnalytics />} />
          <Route path="inbox" element={<Inbox />} />
          <Route path="post-plan" element={<PostPlan />} />
          <Route path="earning" element={<Earning />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
