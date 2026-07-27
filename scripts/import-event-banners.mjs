/**
 * Imports webinar banner artwork into public/events/.
 *
 * The card places the banner in a portrait slot beside the copy, so this uses
 * the square "SM" artwork rather than the wide 1437x518 strips. The real-estate
 * flyer is lifted out of the original 2962x1196 "Frame 12167" export at native
 * resolution — the copy previously in src/assets was a much smaller crop taken
 * off the board and looked soft.
 *
 * Run with: node scripts/import-event-banners.mjs
 */
import { mkdir, stat } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import sharp from 'sharp'

const DOWNLOADS = path.join(os.homedir(), 'Downloads')
const OUT = path.join(process.cwd(), 'public', 'events')

const BANNERS = [
  ['20TH JULY  SM.jpg', 'decision-fatigue.jpg'],
  ['27TH JULY SM.jpg', 'financial-habits.jpg'],
]

const kb = (n) => `${(n / 1024).toFixed(0)} KB`

await mkdir(OUT, { recursive: true })

for (const [from, to] of BANNERS) {
  const src = path.join(DOWNLOADS, from)
  try {
    await stat(src)
  } catch {
    console.log(`skip   ${from} (not found)`)
    continue
  }

  const dest = path.join(OUT, to)
  await sharp(src)
    .resize({ width: 900, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(dest)

  console.log(`ok     ${to.padEnd(24)} ${kb((await stat(dest)).size)}`)
}

// The flyer sits on the right-hand side of the original section export.
const FRAME = path.join(DOWNLOADS, 'Frame 12167.png')
const flyerDest = path.join(OUT, 'real-estate.jpg')

await sharp(FRAME)
  .extract({ left: 1720, top: 40, width: 1242, height: 1130 })
  .resize({ width: 900, fit: 'inside', withoutEnlargement: true })
  .jpeg({ quality: 86, mozjpeg: true, chromaSubsampling: '4:4:4' })
  .toFile(flyerDest)

console.log(
  `ok     ${'real-estate.jpg'.padEnd(24)} ${kb((await stat(flyerDest)).size)}  (from the original frame, not the board crop)`,
)
