/**
 * Meta Pixel (id 1022146413497241), for the Meta ads.
 *
 * The base code in index.html loads fbevents.js and records the PageView for
 * the first page. These helpers cover what a single page app needs on top:
 * a PageView per client-side navigation, and conversion events. Every call is
 * a no-op when the pixel is missing (ad blockers, privacy extensions).
 */
function fbq(...args) {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq(...args)
  }
}

export function trackPixelPageView() {
  fbq('track', 'PageView')
}

export function trackPixelLead(contentName) {
  fbq('track', 'Lead', { content_name: contentName })
}
