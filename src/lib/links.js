/** Outbound destinations, kept in one place so they are changed once. */

export const COMMUNITY_URL = 'https://www.myexpansivelife.com/c/coaching-program'
export const COURSE_URL = 'https://linkedinunlocked.myexpansivelife.com/'

export const SOCIALS = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/myexpansivelife/',
    d: 'M13.5 9H15V6.5h-1.8c-2 0-3.2 1.2-3.2 3.2V11H8v2.5h2V20h2.6v-6.5h2L15 11h-2.4V9.9c0-.6.3-.9.9-.9Z',
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/myexpansivelife/',
    d: 'M12 8.6a3.4 3.4 0 1 0 0 6.8 3.4 3.4 0 0 0 0-6.8Zm0 5.6a2.2 2.2 0 1 1 0-4.4 2.2 2.2 0 0 1 0 4.4Zm4.3-5.7a.8.8 0 1 1-1.6 0 .8.8 0 0 1 1.6 0ZM9 6h6a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3Zm0 1.3A1.7 1.7 0 0 0 7.3 9v6A1.7 1.7 0 0 0 9 16.7h6A1.7 1.7 0 0 0 16.7 15V9A1.7 1.7 0 0 0 15 7.3H9Z',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/nkemezeamamamd/',
    d: 'M8.3 17.5H6V10h2.3v7.5ZM7.1 9a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6Zm10.9 8.5h-2.3v-3.6c0-.9 0-2-1.2-2s-1.4 1-1.4 2v3.6h-2.3V10h2.2v1h.1a2.4 2.4 0 0 1 2.2-1.2c2.3 0 2.7 1.5 2.7 3.5v4.2Z',
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@MyExpansiveLife',
    d: 'M21.2 8.4a2.4 2.4 0 0 0-1.7-1.7C18 6.3 12 6.3 12 6.3s-6 0-7.5.4A2.4 2.4 0 0 0 2.8 8.4 25 25 0 0 0 2.4 12c0 1.2.1 2.4.4 3.6a2.4 2.4 0 0 0 1.7 1.7c1.5.4 7.5.4 7.5.4s6 0 7.5-.4a2.4 2.4 0 0 0 1.7-1.7c.3-1.2.4-2.4.4-3.6a25 25 0 0 0-.4-3.6ZM10.1 14.9V9.1l5 2.9-5 2.9Z',
  },
]

/** True for anything that should leave the site in a new tab. */
export function isExternal(url) {
  return /^(https?:)?\/\//i.test(String(url ?? ''))
}
