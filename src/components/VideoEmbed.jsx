/**
 * Privacy-friendly YouTube embed.
 *
 * Renders a facade first — poster image and play button — and only loads the
 * iframe once someone presses play. Keeps the page fast and avoids YouTube
 * cookies for visitors who never watch.
 */
import { useState } from 'react'

/** Accepts a watch URL, youtu.be link, or a bare id. */
export function youtubeId(input = '') {
  const value = String(input).trim()
  if (/^[\w-]{11}$/.test(value)) return value
  const match = value.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|live\/)|youtu\.be\/)([\w-]{11})/,
  )
  return match?.[1] ?? ''
}

export default function VideoEmbed({ url, title = 'Video', className = '' }) {
  const [playing, setPlaying] = useState(false)
  const id = youtubeId(url)

  if (!id) return null

  return (
    <div
      className={`relative aspect-video w-full overflow-hidden rounded-2xl bg-ink/90 ${className}`}
    >
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 size-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play: ${title}`}
          className="group absolute inset-0 size-full"
        >
          <img
            src={`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`}
            alt=""
            loading="lazy"
            onError={(e) => {
              // Not every video has a maxres thumbnail.
              e.currentTarget.src = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
            }}
            className="size-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
          />
          <span className="absolute inset-0 bg-ink/25 transition-colors group-hover:bg-ink/15" />
          <span className="absolute left-1/2 top-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/95 shadow-lg transition-transform duration-300 group-hover:scale-110 lg:size-20">
            <svg viewBox="0 0 24 24" className="ml-1 size-7 fill-brown-deep lg:size-8">
              <path d="M8 5v14l11-7L8 5Z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  )
}
