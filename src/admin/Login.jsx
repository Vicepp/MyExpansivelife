import { useState } from 'react'
import { Navigate, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Btn, Field, Input } from './ui'
import logo from '../assets/design/logo.svg'

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.2a5.3 5.3 0 0 1-2.3 3.5v2.9h3.7c2.2-2 3.4-5 3.4-8.6Z"
      />
      <path
        fill="#34A853"
        d="M12 23.5c3.1 0 5.7-1 7.6-2.8l-3.7-2.9c-1 .7-2.3 1.1-3.9 1.1-3 0-5.5-2-6.4-4.7H1.8v3A11.5 11.5 0 0 0 12 23.5Z"
      />
      <path
        fill="#FBBC05"
        d="M5.6 14.2a6.9 6.9 0 0 1 0-4.4v-3H1.8a11.5 11.5 0 0 0 0 10.4l3.8-3Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.4c1.7 0 3.2.6 4.4 1.7l3.3-3.3A11.5 11.5 0 0 0 1.8 6.8l3.8 3c.9-2.7 3.4-4.4 6.4-4.4Z"
      />
    </svg>
  )
}

function MicrosoftMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <path fill="#F25022" d="M3 3h8.5v8.5H3z" />
      <path fill="#7FBA00" d="M12.5 3H21v8.5h-8.5z" />
      <path fill="#00A4EF" d="M3 12.5h8.5V21H3z" />
      <path fill="#FFB900" d="M12.5 12.5H21V21h-8.5z" />
    </svg>
  )
}

export default function Login() {
  const {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithMicrosoft,
    resetPassword,
    startPreview,
    isFirebaseConfigured,
    hasAllowlist,
  } = useAuth()
  const navigate = useNavigate()

  const [mode, setMode] = useState('signin')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)

  if (!loading && user) return <Navigate to="/admin" replace />

  const isSignUp = mode === 'signup'

  const run = async (fn) => {
    setError('')
    setNotice('')
    setBusy(true)
    try {
      await fn()
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(friendly(err))
    } finally {
      setBusy(false)
    }
  }

  const onSubmit = (e) => {
    e.preventDefault()
    run(() =>
      isSignUp ? signUp(name, email, password) : signIn(email, password),
    )
  }

  const onReset = async () => {
    setError('')
    setNotice('')
    if (!email) {
      setError('Enter your email address first, then choose “Forgot password”.')
      return
    }
    try {
      await resetPassword(email)
      setNotice(`Password reset link sent to ${email}.`)
    } catch (err) {
      setError(friendly(err))
    }
  }

  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="flex items-center justify-center bg-admin-bg px-6 py-16">
        <div className="w-full max-w-[400px]">
          <Link to="/" className="mb-8 flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-xl bg-sun">
              <img src={logo} alt="" className="size-7" />
            </span>
            <span className="font-display text-[18px] leading-tight text-navy">
              My Expansive Life
            </span>
          </Link>

          <h1 className="text-[28px] font-bold text-navy">
            {isSignUp ? 'Create your account' : 'Sign in'}
          </h1>
          <p className="mt-2 text-[14px] text-navy/55">
            Admin access for writing and managing articles.
          </p>

          <div className="mt-6 flex gap-1 rounded-xl bg-navy/5 p-1">
            {[
              ['signin', 'Sign in'],
              ['signup', 'Create account'],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setMode(key)
                  setError('')
                  setNotice('')
                }}
                className={`flex-1 rounded-lg py-2 text-[13.5px] font-semibold transition-colors ${
                  mode === key ? 'bg-white text-navy shadow-sm' : 'text-navy/55'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => run(signInWithGoogle)}
              className="inline-flex items-center justify-center gap-2.5 rounded-xl border border-navy/15 bg-white px-4 py-2.5 text-[13.5px] font-semibold text-navy transition-colors hover:bg-navy/5 disabled:opacity-50"
            >
              <GoogleMark />
              Google
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => run(signInWithMicrosoft)}
              className="inline-flex items-center justify-center gap-2.5 rounded-xl border border-navy/15 bg-white px-4 py-2.5 text-[13.5px] font-semibold text-navy transition-colors hover:bg-navy/5 disabled:opacity-50"
            >
              <MicrosoftMark />
              Outlook
            </button>
          </div>

          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-navy/10" />
            <span className="text-[12px] uppercase tracking-wide text-navy/40">or</span>
            <span className="h-px flex-1 bg-navy/10" />
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {isSignUp && (
              <Field label="Full name">
                <Input
                  value={name}
                  autoComplete="name"
                  required
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Dr. Nkem Ezeamama"
                />
              </Field>
            )}

            <Field label="Email address">
              <Input
                type="email"
                value={email}
                autoComplete="username"
                required
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@myexpansivelife.com"
              />
            </Field>

            <Field
              label="Password"
              hint={isSignUp ? 'At least 6 characters.' : undefined}
            >
              <Input
                type="password"
                value={password}
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                required
                minLength={6}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </Field>

            {error && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-[13px] text-red-700">
                {error}
              </p>
            )}
            {notice && (
              <p className="rounded-xl bg-emerald-50 px-4 py-3 text-[13px] text-emerald-700">
                {notice}
              </p>
            )}

            <Btn type="submit" disabled={busy} className="w-full py-3">
              {busy
                ? 'Please wait…'
                : isSignUp
                  ? 'Create account'
                  : 'Sign in'}
            </Btn>

            {!isSignUp && (
              <button
                type="button"
                onClick={onReset}
                className="w-full text-center text-[13px] text-navy/60 hover:text-navy"
              >
                Forgot password?
              </button>
            )}
          </form>

          {isFirebaseConfigured && !hasAllowlist && (
            <p className="mt-6 rounded-xl bg-amber-50 px-4 py-3 text-[12.5px] leading-relaxed text-amber-900">
              <strong>Anyone who finds this page can create an admin account.</strong>{' '}
              Set <code>VITE_ADMIN_EMAILS</code> to a comma-separated list of allowed
              addresses to lock it down.
            </p>
          )}

          {!isFirebaseConfigured && (
            <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <p className="text-[13.5px] font-semibold text-amber-900">
                Firebase isn’t connected yet
              </p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-amber-900/80">
                Add your credentials to <code>.env</code> to enable real accounts,
                Google and Outlook sign-in, and saving. Until then you can explore the
                panel with sample data — nothing you change will be stored.
              </p>
              <Btn variant="sun" onClick={startPreview} className="mt-4 w-full">
                Preview the panel
              </Btn>
            </div>
          )}
        </div>
      </div>

      <div className="relative hidden items-center justify-center overflow-hidden bg-navy p-16 lg:flex">
        <div className="relative max-w-[420px] text-white">
          <p className="text-[13px] font-semibold uppercase tracking-[0.25em] text-sun">
            MXL Studio
          </p>
          <h2 className="mt-5 font-display text-[40px] leading-[1.1]">
            Write once. Reach the people building beyond their title.
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-white/70">
            Draft, schedule and publish articles, embed video, and watch what your
            audience actually reads.
          </p>
        </div>
        <div className="pointer-events-none absolute -right-24 -top-24 size-[420px] rounded-full bg-navy-soft" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 size-[320px] rounded-full bg-sun/10" />
      </div>
    </div>
  )
}

function friendly(error) {
  const code = error?.code ?? ''
  if (code.includes('invalid-credential') || code.includes('wrong-password'))
    return 'That email and password combination is not recognised.'
  if (code.includes('user-not-found')) return 'No account exists for that email.'
  if (code.includes('email-already-in-use'))
    return 'An account already exists for that email. Switch to “Sign in”.'
  if (code.includes('weak-password')) return 'Choose a password of at least 6 characters.'
  if (code.includes('popup-closed-by-user')) return 'Sign-in window closed before finishing.'
  if (code.includes('popup-blocked'))
    return 'Your browser blocked the sign-in window. Allow pop-ups and try again.'
  if (code.includes('account-exists-with-different-credential'))
    return 'That email is already registered with a different sign-in method.'
  if (code.includes('operation-not-allowed'))
    return 'That sign-in method is not enabled yet in the Firebase console.'
  if (code.includes('unauthorized-domain'))
    return 'This domain is not authorised in Firebase Auth → Settings → Authorized domains.'
  if (code.includes('too-many-requests'))
    return 'Too many attempts. Wait a moment and try again.'
  if (code.includes('invalid-email')) return 'That email address is not valid.'
  return error?.message ?? 'Something went wrong. Try again.'
}
