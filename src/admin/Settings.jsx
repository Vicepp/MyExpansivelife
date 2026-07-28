import { useState } from 'react'
import { Btn, Card, Field, Input, PageHead, Select, Textarea } from './ui'
import { useAuth } from '../context/AuthContext'
import { isFirebaseConfigured } from '../lib/firebase'
import { CATEGORIES } from '../lib/posts'

const SITE_KEY = 'mxl.site-settings'

const DEFAULTS = {
  siteName: 'My Expansive Life',
  tagline: 'Your career was never meant to be the whole story.',
  contactEmail: 'info@phcinvest.com',
  defaultCategory: CATEGORIES[0],
  postsPerPage: '6',
  metaDescription:
    'A growth community for professionals building beyond a single career, income stream or definition of success.',
}

export default function Settings() {
  const { user, updateDisplayName, signOut } = useAuth()

  const [profile, setProfile] = useState({
    displayName: user?.displayName ?? '',
    email: user?.email ?? '',
  })
  const [site, setSite] = useState(() => {
    try {
      return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(SITE_KEY) ?? '{}') }
    } catch {
      return DEFAULTS
    }
  })
  const [saved, setSaved] = useState('')
  const [error, setError] = useState('')

  const saveProfile = async (e) => {
    e.preventDefault()
    setError('')
    setSaved('')
    try {
      await updateDisplayName(profile.displayName)
      setSaved('Profile updated.')
    } catch (err) {
      setError(err.message)
    }
  }

  const saveSite = (e) => {
    e.preventDefault()
    localStorage.setItem(SITE_KEY, JSON.stringify(site))
    setSaved('Site settings saved to this browser.')
  }

  const set = (key) => (e) => setSite((s) => ({ ...s, [key]: e.target.value }))

  return (
    <div>
      <PageHead title="Settings" subtitle="Your account and site preferences" />

      {saved && (
        <p className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-[13.5px] text-emerald-700">
          {saved}
        </p>
      )}
      {error && (
        <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-[13.5px] text-red-700">
          {error}
        </p>
      )}

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <h2 className="mb-5 text-[16px] font-bold text-navy">Your profile</h2>
          <form onSubmit={saveProfile} className="space-y-4">
            <Field label="Display name" hint="Shown as the author on published posts.">
              <Input
                value={profile.displayName}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, displayName: e.target.value }))
                }
                placeholder="Dr. Nkem Ezeamama"
              />
            </Field>
            <Field label="Email" hint="Change this in the Firebase console.">
              <Input value={profile.email} readOnly className="opacity-70" />
            </Field>
            <Btn type="submit" disabled={!isFirebaseConfigured}>
              Save profile
            </Btn>
            {!isFirebaseConfigured && (
              <p className="text-[12.5px] text-navy/50">
                Connect Firebase to edit your profile.
              </p>
            )}
          </form>
        </Card>

        <Card>
          <h2 className="mb-5 text-[16px] font-bold text-navy">Site details</h2>
          <form onSubmit={saveSite} className="space-y-4">
            <Field label="Site name">
              <Input value={site.siteName} onChange={set('siteName')} />
            </Field>
            <Field label="Tagline">
              <Input value={site.tagline} onChange={set('tagline')} />
            </Field>
            <Field label="Contact email">
              <Input type="email" value={site.contactEmail} onChange={set('contactEmail')} />
            </Field>
            <Field label="Meta description" hint="Used by search engines and link previews.">
              <Textarea rows={3} value={site.metaDescription} onChange={set('metaDescription')} />
            </Field>
            <Btn type="submit">Save site settings</Btn>
          </form>
        </Card>

        <Card>
          <h2 className="mb-5 text-[16px] font-bold text-navy">Publishing defaults</h2>
          <div className="space-y-4">
            <Field label="Default category for new posts">
              <Select value={site.defaultCategory} onChange={set('defaultCategory')}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Articles per page on the blog index">
              <Select value={site.postsPerPage} onChange={set('postsPerPage')}>
                {['3', '6', '9', '12'].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </Select>
            </Field>
            <Btn onClick={saveSite}>Save defaults</Btn>
          </div>
        </Card>

        <Card>
          <h2 className="mb-5 text-[16px] font-bold text-navy">Database</h2>
          <div className="flex items-center gap-3 rounded-xl border border-navy/10 p-4">
            <span
              className={`size-2.5 shrink-0 rounded-full ${
                isFirebaseConfigured ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            />
            <div>
              <p className="text-[14px] font-semibold text-navy">
                {isFirebaseConfigured ? 'Firebase connected' : 'Firebase not connected'}
              </p>
              <p className="mt-0.5 text-[12.5px] text-navy/55">
                {isFirebaseConfigured
                  ? `Project ${import.meta.env.VITE_FIREBASE_PROJECT_ID}`
                  : 'Running on sample data. Nothing you change is saved.'}
              </p>
            </div>
          </div>

          <p className="mt-4 text-[13px] leading-relaxed text-navy/60">
            Setup instructions live in <code className="rounded bg-admin-bg px-1.5 py-0.5">docs/FIREBASE.md</code>.
            Credentials go in <code className="rounded bg-admin-bg px-1.5 py-0.5">.env</code> locally, and in
            your hosting provider’s environment variables for the live site.
          </p>

          <Btn variant="danger" className="mt-6" onClick={signOut}>
            Sign out
          </Btn>
        </Card>
      </div>
    </div>
  )
}
