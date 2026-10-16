import { auth } from './firebase'

/**
 * Asks the server to redeploy the site (api/rebuild.js), so a post that was
 * just published, changed, unpublished or deleted gets its prerendered page,
 * sitemap entry and search-engine pings.
 *
 * Fire-and-forget: saving a post must never fail because of this, so errors
 * are logged, not thrown. Resolves to true when a rebuild was started.
 */
export async function requestRebuild(reason) {
  try {
    const token = await auth?.currentUser?.getIdToken()
    if (!token) return false
    const res = await fetch('/api/rebuild', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    })
    if (!res.ok) console.warn('Site rebuild not started:', res.status, await res.text())
    return res.ok
  } catch (e) {
    console.warn('Site rebuild not started:', e.message)
    return false
  }
}
