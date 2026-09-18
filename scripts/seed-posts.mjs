/**
 * Pushes the twelve seed articles in scripts/content into Firestore.
 *
 * Writing to /posts requires a signed-in admin (see firestore.rules), so this
 * signs in with an admin account read from the environment at run time. The
 * credentials are never written to disk and never committed:
 *
 *   SEED_EMAIL=you@example.com SEED_PASSWORD=... node scripts/seed-posts.mjs
 *
 * Flags:
 *   --to-new   write into MIGRATE_TO_FIREBASE_* instead of the live project
 *   --draft    write as drafts instead of published (safe first run)
 *   --dry-run  print what would happen and write nothing
 *   --force    overwrite a post whose slug already exists
 *
 * Re-running is safe: a slug that already exists is skipped unless --force.
 */
import { readFile } from 'node:fs/promises'
import { initializeApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  query,
  where,
  limit,
} from 'firebase/firestore'
import { buildPosts } from './content/index.mjs'

/** .env for project config, .env.local for credentials — local wins. */
async function loadEnv() {
  for (const file of ['.env', '.env.local']) {
    try {
      const raw = await readFile(file, 'utf8')
      for (const line of raw.split(/\r?\n/)) {
        const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*)$/.exec(line)
        if (!match) continue
        process.env[match[1]] = match[2].trim().replace(/^["']|["']$/g, '')
      }
    } catch {
      /* a missing file is fine */
    }
  }
}

await loadEnv()

const args = new Set(process.argv.slice(2))
const dryRun = args.has('--dry-run')
const force = args.has('--force')
const status = args.has('--draft') ? 'draft' : 'published'

// --to-new writes into the migration target (MIGRATE_TO_FIREBASE_*) instead of
// the project the site currently reads from. Useful while the two coexist.
const toNew = args.has('--to-new')
const prefix = toNew ? 'MIGRATE_TO_FIREBASE_' : 'VITE_FIREBASE_'

const posts = buildPosts({ status })

console.log(`\n${posts.length} articles, writing as "${status}"${dryRun ? ' (dry run)' : ''}\n`)

if (dryRun) {
  for (const p of posts) {
    console.log(
      `${String(p.words).padStart(4)}w  ${p.publishedAt.toISOString().slice(0, 10)}  ${p.category.padEnd(18)} ${p.slug}`,
    )
  }
  console.log('\nDry run — nothing written.')
  process.exit(0)
}

const email = process.env.SEED_EMAIL
const password = process.env.SEED_PASSWORD
if (!email || !password) {
  console.error(
    'Set SEED_EMAIL and SEED_PASSWORD to an admin account listed in VITE_ADMIN_EMAILS.\n' +
      'Example: SEED_EMAIL=you@example.com SEED_PASSWORD=... node scripts/seed-posts.mjs',
  )
  process.exit(1)
}

const app = initializeApp({
  apiKey: process.env[`${prefix}API_KEY`],
  authDomain: process.env[`${prefix}AUTH_DOMAIN`],
  projectId: process.env[`${prefix}PROJECT_ID`],
  storageBucket: process.env[`${prefix}STORAGE_BUCKET`],
  messagingSenderId: process.env[`${prefix}MESSAGING_SENDER_ID`],
  appId: process.env[`${prefix}APP_ID`],
})

console.log(`target project: ${process.env[`${prefix}PROJECT_ID`]}\n`)

const auth = getAuth(app)
const db = getFirestore(app)

const credential = await signInWithEmailAndPassword(auth, email, password)
console.log(`Signed in as ${credential.user.email}\n`)

let created = 0
let updated = 0
let skipped = 0

for (const post of posts) {
  const { words, coverAlt, ...fields } = post

  const existing = await getDocs(
    query(collection(db, 'posts'), where('slug', '==', post.slug), limit(1)),
  )

  if (!existing.empty) {
    if (!force) {
      console.log(`skip     ${post.slug} (already exists)`)
      skipped++
      continue
    }
    await updateDoc(doc(db, 'posts', existing.docs[0].id), fields)
    console.log(`update   ${post.slug}`)
    updated++
    continue
  }

  await addDoc(collection(db, 'posts'), fields)
  console.log(`create   ${post.slug}`)
  created++
}

console.log(`\n${created} created, ${updated} updated, ${skipped} skipped.`)
console.log('Run `npm run build` to regenerate dist/sitemap.xml with the new URLs.')
process.exit(0)
