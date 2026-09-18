/**
 * Stores the admin password in .env.local, then checks it actually works.
 *
 * Typing it here beats editing the file by hand: the input is hidden, it never
 * reaches your shell history, and the password is verified against both Firebase
 * projects before you walk away thinking it is set.
 *
 *   node scripts/set-password.mjs
 *
 * The value is written to .env.local, which is gitignored. Nothing is printed
 * but the character count and whether sign-in succeeded.
 */
import { readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { stdin, stdout } from 'node:process'

/* ---------------------------------------------------------------- */
/* Hidden prompt                                                     */
/* ---------------------------------------------------------------- */

function askHidden(question) {
  return new Promise((resolve, reject) => {
    if (!stdin.isTTY) {
      reject(
        new Error(
          'No interactive terminal. Run this yourself in a terminal:\n' +
            '  cd "' + process.cwd() + '"\n' +
            '  node scripts/set-password.mjs',
        ),
      )
      return
    }

    stdout.write(question)
    stdin.setRawMode(true)
    stdin.resume()
    stdin.setEncoding('utf8')

    let value = ''
    const onData = (char) => {
      switch (char) {
        case '\n':
        case '\r':
        case '': // Ctrl-D
          stdin.setRawMode(false)
          stdin.pause()
          stdin.removeListener('data', onData)
          stdout.write('\n')
          resolve(value)
          break
        case '': // Ctrl-C
          stdin.setRawMode(false)
          stdout.write('\n')
          process.exit(130)
          break
        case '': // backspace
        case '\b':
          if (value.length) {
            value = value.slice(0, -1)
            stdout.write('\b \b')
          }
          break
        default:
          // Ignore other control characters, including pasted escape sequences.
          if (char >= ' ') {
            value += char
            stdout.write('*')
          }
      }
    }

    stdin.on('data', onData)
  })
}

/* ---------------------------------------------------------------- */
/* Env handling                                                      */
/* ---------------------------------------------------------------- */

async function readEnvFile(path) {
  if (!existsSync(path)) return ''
  return readFile(path, 'utf8')
}

function parseEnv(raw) {
  const out = {}
  for (const line of raw.split(/\r?\n/)) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)$/.exec(line)
    if (m) out[m[1]] = m[2].trim().replace(/^["']|["']$/g, '')
  }
  return out
}

/** Replaces SEED_PASSWORD if present (commented or not), otherwise appends. */
function upsertPassword(raw, password) {
  const lines = raw.split(/\r?\n/)
  const line = `SEED_PASSWORD=${password}`
  const index = lines.findIndex((l) => /^\s*#?\s*SEED_PASSWORD\s*=/.test(l))

  if (index >= 0) {
    lines[index] = line
    return lines.join('\n')
  }

  const body = raw.endsWith('\n') || raw === '' ? raw : raw + '\n'
  return body + line + '\n'
}

/* ---------------------------------------------------------------- */

const envLocalPath = '.env.local'
const localRaw = await readEnvFile(envLocalPath)
const env = { ...parseEnv(await readEnvFile('.env')), ...parseEnv(localRaw) }

const email = env.SEED_EMAIL
if (!email) {
  console.error('SEED_EMAIL is not set in .env.local. Add it first:\n  SEED_EMAIL=you@example.com')
  process.exit(1)
}

console.log(`\nAdmin account: ${email}`)
console.log('The password is hidden as you type. Press Enter when done.\n')

const password = await askHidden('Password: ')

if (!password) {
  console.error('\nNothing entered — no change made.')
  process.exit(1)
}
if (password.length < 6) {
  console.error(`\nFirebase requires at least 6 characters (got ${password.length}).`)
  process.exit(1)
}

await writeFile(envLocalPath, upsertPassword(localRaw, password), 'utf8')
console.log(`\nSaved to ${envLocalPath} (${password.length} characters).`)

/* ---------------------------------------------------------------- */
/* Verify against both projects                                      */
/* ---------------------------------------------------------------- */

async function trySignIn(label, apiKey) {
  if (!apiKey) {
    console.log(`  ${label.padEnd(26)} skipped — no API key configured`)
    return false
  }
  try {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
      },
    )
    if (res.ok) {
      console.log(`  ${label.padEnd(26)} sign-in OK`)
      return true
    }
    const body = await res.json()
    console.log(`  ${label.padEnd(26)} FAILED — ${body.error?.message ?? res.status}`)
    return false
  } catch (e) {
    console.log(`  ${label.padEnd(26)} FAILED — ${e.message}`)
    return false
  }
}

console.log('\nChecking the password against both projects:\n')
const oldOk = await trySignIn(
  `old  ${env.VITE_FIREBASE_PROJECT_ID ?? '?'}`,
  env.VITE_FIREBASE_API_KEY,
)
const newOk = await trySignIn(
  `new  ${env.MIGRATE_TO_FIREBASE_PROJECT_ID ?? '?'}`,
  env.MIGRATE_TO_FIREBASE_API_KEY,
)

console.log()
if (oldOk && newOk) {
  console.log('Both projects accept it — publishing and migration are both possible.')
} else if (oldOk || newOk) {
  console.log('One project accepts it. Publishing into that one is possible;')
  console.log('migrating needs the same password to work in both.')
} else {
  console.log('Neither project accepted it. Check the password in the Firebase')
  console.log('Console under Authentication > Users, or reset it there.')
}
console.log('\nTell Claude the result — the password itself never needs to be shared.')
