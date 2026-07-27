/**
 * One-off optimiser for the assets cropped out of the Figma board export.
 *
 * Photos that fill their own box become JPEG. Anything whose baked-in
 * background has to blend seamlessly into a flat section colour stays PNG
 * (JPEG ringing would show as a seam) and is quantised instead.
 *
 * Run with: node scripts/optimize-images.mjs
 */
import { readdir, stat, unlink } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const DIR = path.join(process.cwd(), 'src', 'assets', 'design')

/** name -> { jpeg?, width?, height? } */
const PLAN = {
  'video-thumb.png': { jpeg: true },
  'group-photo.png': { jpeg: true, width: 1210 },
  'article-img.png': { jpeg: true },
  'webinar-promo.png': { jpeg: true },

  'growth-art.png': { height: 1132 },
  'course-gold-art.png': {},
  'course-hero-cluster.png': {},
  'hero-cluster-left.png': {},
  'hero-cluster-right.png': {},
  'award-badge.png': {},
  'trusted-logos.png': {},
  'testimonial-av.png': {},
}

const kb = (n) => `${(n / 1024).toFixed(0)} KB`

let before = 0
let after = 0

for (const [name, opts] of Object.entries(PLAN)) {
  const src = path.join(DIR, name)

  let original
  try {
    original = (await stat(src)).size
  } catch {
    console.log(`skip   ${name} (missing)`)
    continue
  }
  before += original

  let pipeline = sharp(src)
  if (opts.width || opts.height) {
    pipeline = pipeline.resize({
      width: opts.width,
      height: opts.height,
      fit: 'inside',
      withoutEnlargement: true,
    })
  }

  const outName = opts.jpeg ? name.replace(/\.png$/, '.jpg') : name
  const dest = path.join(DIR, outName)

  if (opts.jpeg) {
    // flatten onto white: these all sit inside opaque containers
    await pipeline
      .flatten({ background: '#ffffff' })
      .jpeg({ quality: 84, mozjpeg: true, chromaSubsampling: '4:4:4' })
      .toFile(dest)
    await unlink(src)
  } else {
    const buf = await pipeline
      .png({ palette: true, quality: 88, effort: 10, dither: 1 })
      .toBuffer()
    await sharp(buf).toFile(dest)
  }

  const size = (await stat(dest)).size
  after += size
  console.log(
    `${opts.jpeg ? 'jpeg' : 'png '}   ${name.padEnd(26)} ${kb(original).padStart(9)} -> ${kb(size).padStart(9)}`,
  )
}

console.log(`\ntotal  ${kb(before)} -> ${kb(after)}`)

const remaining = await readdir(DIR)
console.log(`\nfiles in ${path.relative(process.cwd(), DIR)}:`)
for (const f of remaining.sort()) {
  console.log(`  ${f.padEnd(28)} ${kb((await stat(path.join(DIR, f))).size)}`)
}
