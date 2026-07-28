import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  GoogleAuthProvider,
  OAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as fbSignOut,
  updateProfile,
} from 'firebase/auth'
import { auth, isFirebaseConfigured } from '../lib/firebase'

const AuthContext = createContext(null)

const DEMO_KEY = 'mxl.demo-admin'

/**
 * Optional allowlist. Set VITE_ADMIN_EMAILS to a comma-separated list and only
 * those addresses can hold an admin session — whichever method they sign in
 * with. Leave it unset and anyone who reaches /admin/login can create an
 * account, which is almost never what you want in production.
 */
const ALLOWED = (import.meta.env.VITE_ADMIN_EMAILS ?? '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean)

export function isAllowed(email) {
  if (ALLOWED.length === 0) return true
  return ALLOWED.includes(String(email ?? '').toLowerCase())
}

export const hasAllowlist = ALLOWED.length > 0

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isFirebaseConfigured) {
      // Preview mode: lets the panel be explored before the database exists.
      // ?preview=1 is honoured only here, so it can never bypass a real login.
      if (new URLSearchParams(window.location.search).has('preview')) {
        sessionStorage.setItem(DEMO_KEY, '1')
      }
      setUser(
        sessionStorage.getItem(DEMO_KEY)
          ? {
              uid: 'demo',
              email: 'preview@myexpansivelife.com',
              displayName: 'Preview User',
              demo: true,
            }
          : null,
      )
      setLoading(false)
      return
    }

    return onAuthStateChanged(auth, async (next) => {
      // An account outside the allowlist is signed straight back out.
      if (next && !isAllowed(next.email)) {
        await fbSignOut(auth)
        setUser(null)
      } else {
        setUser(next)
      }
      setLoading(false)
    })
  }, [])

  const value = useMemo(() => {
    const requireConfig = () => {
      if (!isFirebaseConfigured) {
        throw new Error(
          'Firebase is not connected yet. Use “Preview the panel” below, or add your credentials to .env — see docs/FIREBASE.md.',
        )
      }
    }

    const guard = (email) => {
      if (!isAllowed(email)) {
        throw new Error(
          `${email} is not on the admin allowlist. Ask the site owner to add it to VITE_ADMIN_EMAILS.`,
        )
      }
    }

    const popup = async (provider) => {
      requireConfig()
      const result = await signInWithPopup(auth, provider)
      try {
        guard(result.user.email)
      } catch (err) {
        await fbSignOut(auth)
        throw err
      }
      return result.user
    }

    return {
      user,
      loading,
      isFirebaseConfigured,
      hasAllowlist,

      async signIn(email, password) {
        requireConfig()
        guard(email)
        await signInWithEmailAndPassword(auth, email, password)
      },

      async signUp(name, email, password) {
        requireConfig()
        guard(email)
        const { user: created } = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        )
        if (name) {
          await updateProfile(created, { displayName: name })
          setUser({ ...auth.currentUser })
        }
      },

      signInWithGoogle() {
        const provider = new GoogleAuthProvider()
        provider.setCustomParameters({ prompt: 'select_account' })
        return popup(provider)
      },

      signInWithMicrosoft() {
        // Covers Outlook, Hotmail, Live and Microsoft 365 accounts.
        const provider = new OAuthProvider('microsoft.com')
        provider.setCustomParameters({ prompt: 'select_account' })
        return popup(provider)
      },

      startPreview() {
        sessionStorage.setItem(DEMO_KEY, '1')
        setUser({
          uid: 'demo',
          email: 'preview@myexpansivelife.com',
          displayName: 'Preview User',
          demo: true,
        })
      },

      async resetPassword(email) {
        requireConfig()
        await sendPasswordResetEmail(auth, email)
      },

      async updateDisplayName(name) {
        if (!isFirebaseConfigured || !auth.currentUser) return
        await updateProfile(auth.currentUser, { displayName: name })
        setUser({ ...auth.currentUser })
      },

      async signOut() {
        sessionStorage.removeItem(DEMO_KEY)
        if (isFirebaseConfigured) await fbSignOut(auth)
        setUser(null)
      },
    }
  }, [user, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
