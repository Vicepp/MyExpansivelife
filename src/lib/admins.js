/**
 * Who may use the admin panel (and trigger rebuilds through /api/rebuild):
 * the comma-separated VITE_ADMIN_EMAILS set on the host.
 *
 * Fails closed. An unset variable on Vercel once left the panel accepting any
 * signed-in account; now an empty list admits nobody, and the login page says
 * the variable is missing.
 *
 * To add an admin: add their email to VITE_ADMIN_EMAILS (then redeploy) and
 * create their account in Firebase Console → Authentication → Users → Add user.
 */
export function adminEmails(fromEnv = '') {
  return String(fromEnv ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
}
