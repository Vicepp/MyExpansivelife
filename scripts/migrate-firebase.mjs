/**
 * Copies every Firestore collection from one Firebase project to another.
 *
 * Written for the move from myexpansivelife-a8bec to mxl-website. Document IDs
 * are preserved, so slugs, event links and chat threads keep working.
 *
 * Both projects need the same admin account (same email and password) because
 * firestore.rules gates every read and write behind signedIn(). Create the user
 * in the target project's Authentication tab before running this.
 *
 *   SEED_EMAIL=you@example.com SEED_PASSWORD=... node scripts/migrate-firebase.mjs --dry-run
 *   SEED_EMAIL=you@example.com SEED_PASSWORD=... node scripts/migrate-firebase.mjs
 *
 * Flags:
 *   --dry-run   read the source, report counts, write nothing
 *   --only=a,b  limit to named collections
 *   --force     overwrite documents that already exist in the target
 *
 * Source config comes from VITE_FIREBASE_* in .env, target from
 * MIGRATE_TO_FIREBASE_* in the same file. A backup of everything read is
 * written to backup/ before a single write happens.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { initializeApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore'

const COLLECTIONS = ['posts', 'events', 'settings', 'messages', 'chats', 'analytics']

async function loadEnv() {
  try {
    const raw = await readFile('.env', 'utf8')
    for (const line of raw.split(/\r?\n/)) {
      const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)$/.exec(line)
      if (m && !(m[1] in process.env)) {
        process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '')
      }
    }
  } catch {
    /* fine */
  }
  try {
    const raw = await readFile('.env.local', 'utf8')
    for (const line of raw.split(/\r?\n/)) {
      const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)$/.exec(line)
      if (m) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '')
    }
  } catch {
    /* fine */
  }
}

await loadEnv()

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const force = args.includes('--force')
const onlyArg = args.find((a) => a.startsWith('--only='))
const targets = onlyArg ? onlyArg.slice('--only='.length).split(',') : COLLECTIONS

const configFrom = (prefix) => ({
  apiKey: process.env[`${prefix}API_KEY`],
  authDomain: process.env[`${prefix}AUTH_DOMAIN`],
  projectId: process.env[`${prefix}PROJECT_ID`],
  storageBucket: process.env[`${prefix}STORAGE_BUCKET`],
  messagingSenderId: process.env[`${prefix}MESSAGING_SENDER_ID`],
  appId: process.env[`${prefix}APP_ID`],
})

const sourceConfig = configFrom('VITE_FIREBASE_')
const targetConfig = configFrom('MIGRATE_TO_FIREBASE_')

if (!sourceConfig.projectId) {
  console.error('Source project missing — check VITE_FIREBASE_* in .env')
  process.exit(1)
}
if (!targetConfig.projectId) {
  console.error(
    'Target project missing. Add these to .env:\n\n' +
      '  MIGRATE_TO_FIREBASE_API_KEY=...\n' +
      '  MIGRATE_TO_FIREBASE_AUTH_DOMAIN=...\n' +
      '  MIGRATE_TO_FIREBASE_PROJECT_ID=...\n' +
      '  MIGRATE_TO_FIREBASE_STORAGE_BUCKET=...\n' +
      '  MIGRATE_TO_FIREBASE_MESSAGING_SENDER_ID=...\n' +
      '  MIGRATE_TO_FIREBASE_APP_ID=...\n',
  )
  process.exit(1)
}

const email = process.env.SEED_EMAIL
const password = process.env.SEED_PASSWORD
if (!email || !password) {
  console.error('Set SEED_EMAIL and SEED_PASSWORD (an admin account in BOTH projects).')
  process.exit(1)
}

console.log(`\n${sourceConfig.projectId}  →  ${targetConfig.projectId}`)
console.log(`collections: ${targets.join(', ')}${dryRun ? '   (dry run)' : ''}\n`)

/* ---------------------------------------------------------------- */
/* Read everything from the source                                   */
/* ---------------------------------------------------------------- */

const sourceApp = initializeApp(sourceConfig, 'source')
const sourceDb = getFirestore(sourceApp)
await signInWithEmailAndPassword(getAuth(sourceApp), email, password)
console.log(`signed in to ${sourceConfig.projectId}`)

const exported = {}
for (const name of targets) {
  try {
    const snap = await getDocs(collection(sourceDb, name))
    exported[name] = snap.docs.map((d) => ({ id: d.id, data: d.data() }))
    console.log(`  read ${String(exported[name].length).padStart(4)}  ${name}`)
  } catch (e) {
    exported[name] = []
    console.log(`  read    ?  ${name}  — ${e.message}`)
  }
}

const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
await mkdir('backup', { recursive: true })
const backupPath = `backup/${sourceConfig.projectId}-${stamp}.json`
await writeFile(backupPath, JSON.stringify(exported, null, 2), 'utf8')
console.log(`\nbackup written to ${backupPath}`)

if (dryRun) {
  console.log('\nDry run — nothing written to the target.')
  process.exit(0)
}

/* ---------------------------------------------------------------- */
/* Write everything into the target                                  */
/* ---------------------------------------------------------------- */

const targetApp = initializeApp(targetConfig, 'target')
const targetDb = getFirestore(targetApp)
await signInWithEmailAndPassword(getAuth(targetApp), email, password)
console.log(`\nsigned in to ${targetConfig.projectId}\n`)

let written = 0
let skipped = 0

for (const [name, docs] of Object.entries(exported)) {
  for (const row of docs) {
    const ref = doc(targetDb, name, row.id)
    if (!force) {
      const existing = await getDoc(ref)
      if (existing.exists()) {
        skipped++
        continue
      }
    }
    await setDoc(ref, row.data)
    written++
  }
  console.log(`  wrote ${name}`)
}

console.log(`\n${written} documents written, ${skipped} skipped (already present).`)
console.log('\nNext: point VITE_FIREBASE_* at the new project, update the same')
console.log('variables in Netlify, then redeploy.')
process.exit(0)
