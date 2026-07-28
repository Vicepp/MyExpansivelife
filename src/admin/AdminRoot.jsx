import { Outlet } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'

/**
 * Wraps every /admin route in one auth provider.
 *
 * Kept out of main.jsx on purpose: mounting it here means firebase/auth is
 * pulled into the lazy admin chunk rather than the bundle every public visitor
 * downloads.
 */
export default function AdminRoot() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  )
}
