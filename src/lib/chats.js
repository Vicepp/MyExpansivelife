import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDocs,
  increment,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { db, isFirebaseConfigured } from './firebase'
import { toDate } from './posts'

/**
 * Chat transcripts.
 *
 * One document per conversation:
 *
 *   chats/{id} = {
 *     name, email, page, source,
 *     messages: [{ role, content, at }],   // the whole conversation, in order
 *     messageCount, unread,
 *     startedAt, lastMessageAt
 *   }
 *
 * The transcript lives in a single document rather than a subcollection so the
 * admin can read a whole conversation in one request.
 *
 * Reading is admin-only (see firestore.rules), so a returning visitor resumes
 * from their own copy in localStorage rather than from here — this is the
 * archive, not their working copy.
 *
 * Every write is best-effort: a chat that cannot be saved must still be a chat
 * the visitor can have. Callers get `false`/`null` rather than a throw.
 */

export const CHATS = 'chats'

/** Per-message cap. The 60-message ceiling is enforced in firestore.rules. */
const MAX_CONTENT = 4000

const sample = (id, name, email, page, minutesAgo, unread, messages) => ({
  id,
  name,
  email,
  page,
  source: 'AI chat',
  unread,
  messageCount: messages.length,
  messages,
  startedAt: new Date(Date.now() - minutesAgo * 60000),
  lastMessageAt: new Date(Date.now() - minutesAgo * 60000),
})

/** Shown before Firebase is connected, so the page is never an empty shell. */
export const SAMPLE_CHATS = [
  sample('c1', 'Amara Obi', 'amara.obi@gmail.com', '/courses/linkedin-unlocked', 3, true, [
    { role: 'user', content: 'Is LinkedIn Unlocked suitable for someone in healthcare?' },
    {
      role: 'assistant',
      content:
        'Very much so — Dr. Nkem built the whole system while working as an ER physician, so it is designed around people with demanding jobs and little spare time.',
    },
    { role: 'user', content: 'And when is the next free webinar?' },
  ]),
  sample('c2', 'Daniel Okafor', 'daniel@brightpath.co', '/', 190, true, [
    { role: 'user', content: 'What is the difference between the cohort and the done-with-you option?' },
    {
      role: 'assistant',
      content:
        'The cohort is the six modules plus weekly live Q&A calls — you implement it yourself. The done-with-you option includes everything in the cohort, and the team builds your profile, writes your starter posts and maps your lead pipeline for you.',
    },
  ]),
  sample('c3', 'Ruth Adeyemi', 'ruth.a@outlook.com', '/affiliate', 1500, false, [
    { role: 'user', content: 'How much do affiliates earn?' },
    {
      role: 'assistant',
      content: 'Affiliates earn 20% on every enrolment they bring in. You can apply on the affiliate page.',
    },
  ]),
]

function fromDoc(snapshot) {
  const data = snapshot.data()
  return {
    id: snapshot.id,
    ...data,
    messages: data.messages ?? [],
    startedAt: toDate(data.startedAt),
    lastMessageAt: toDate(data.lastMessageAt),
  }
}

function trim(message) {
  return {
    role: message.role === 'user' ? 'user' : 'assistant',
    content: String(message.content ?? '').slice(0, MAX_CONTENT),
    at: Date.now(),
  }
}

/* ------------------------------------------------------------------ */
/* Public site                                                         */
/* ------------------------------------------------------------------ */

/**
 * Opens a transcript when a visitor completes the name/email gate.
 * @returns the new document id, or null if it could not be saved.
 */
export async function startChat({ name, email, page }) {
  if (!isFirebaseConfigured) return null

  try {
    const created = await addDoc(collection(db, CHATS), {
      name: String(name).slice(0, 120),
      email: String(email).slice(0, 200),
      page: String(page ?? '').slice(0, 200),
      source: 'AI chat',
      messages: [],
      messageCount: 0,
      unread: true,
      startedAt: serverTimestamp(),
      lastMessageAt: serverTimestamp(),
    })
    return created.id
  } catch (error) {
    console.error('Could not open the chat transcript:', error)
    return null
  }
}

/**
 * Appends one turn. `unread` is only raised by the visitor's own messages, so
 * reading a conversation in the admin does not immediately mark itself new
 * again when the assistant's reply lands.
 */
export async function appendTurn(chatId, message) {
  if (!isFirebaseConfigured || !chatId) return false

  const turn = trim(message)
  try {
    await updateDoc(doc(db, CHATS, chatId), {
      messages: arrayUnion(turn),
      messageCount: increment(1),
      lastMessageAt: serverTimestamp(),
      ...(turn.role === 'user' ? { unread: true } : {}),
    })
    return true
  } catch (error) {
    console.error('Could not save the chat message:', error)
    return false
  }
}

/* ------------------------------------------------------------------ */
/* Admin                                                               */
/* ------------------------------------------------------------------ */

/**
 * Every conversation, newest activity first.
 *
 * Sorted in JavaScript rather than with orderBy so no composite index is
 * needed — the same approach the posts listing uses.
 */
export async function listChats() {
  if (!isFirebaseConfigured) return [...SAMPLE_CHATS]
  const snap = await getDocs(collection(db, CHATS))
  return snap.docs
    .map(fromDoc)
    .sort((a, b) => (b.lastMessageAt?.getTime() ?? 0) - (a.lastMessageAt?.getTime() ?? 0))
}

/** Drives the notification badge in the admin header. */
export async function countUnreadChats() {
  if (!isFirebaseConfigured) return SAMPLE_CHATS.filter((c) => c.unread).length
  try {
    const snap = await getDocs(collection(db, CHATS))
    return snap.docs.filter((d) => d.data().unread === true).length
  } catch {
    return 0
  }
}

export async function markChatRead(chatId, unread = false) {
  if (!isFirebaseConfigured) return
  await updateDoc(doc(db, CHATS, chatId), { unread })
}

export async function deleteChat(chatId) {
  if (!isFirebaseConfigured) return
  await deleteDoc(doc(db, CHATS, chatId))
}

/** A conversation as plain text, for copying into an email or a CRM. */
export function asTranscript(chat) {
  const header = `Chat with ${chat.name} <${chat.email}>\nStarted on ${chat.page || '/'}\n`
  const body = (chat.messages ?? [])
    .map((m) => `${m.role === 'user' ? chat.name : 'Assistant'}: ${m.content}`)
    .join('\n\n')
  return `${header}\n${body}`
}
