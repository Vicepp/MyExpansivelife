/**
 * GET /api/geo — the visitor's approximate location, from the geolocation
 * headers Vercel adds to every request (city-level, derived from the IP).
 *
 * Used once per browser session by src/lib/track.js so the admin can show
 * where visitors come from. Nothing is stored here, and the IP address itself
 * is never returned or saved — only country, region, city and the city's
 * approximate coordinates.
 */
function header(request, name) {
  const value = request.headers.get(name) ?? ''
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

export function GET(request) {
  const lat = Number(header(request, 'x-vercel-ip-latitude'))
  const lon = Number(header(request, 'x-vercel-ip-longitude'))
  return Response.json(
    {
      country: header(request, 'x-vercel-ip-country'),
      region: header(request, 'x-vercel-ip-country-region'),
      city: header(request, 'x-vercel-ip-city'),
      lat: Number.isFinite(lat) && header(request, 'x-vercel-ip-latitude') ? lat : null,
      lon: Number.isFinite(lon) && header(request, 'x-vercel-ip-longitude') ? lon : null,
    },
    { headers: { 'Cache-Control': 'no-store' } },
  )
}
