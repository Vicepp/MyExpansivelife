import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { db, isFirebaseConfigured } from './firebase'
import { toDate } from './posts'

export const MESSAGES = 'messages'

const sample = (id, name, email, subject, body, days, read) => ({
  id,
  name,
  email,
  phone: '',
  subject,
  body,
  source: 'Affiliate application',
  read,
  createdAt: new Date(Date.now() - days * 86400000),
})

export const SAMPLE_MESSAGES = [
  sample(
    'm1',
    'Andrew Wilkins',
    'andrew@yesscompany.com',
    'Affiliate application',
    'I run a newsletter for mid-career professionals and would love to share LinkedIn Unlocked with them. Roughly 4,000 subscribers, strong open rates.',
    0,
    false,
  ),
  sample(
    'm2',
    'Priya Nandakumar',
    'priya@northlight.io',
    'Affiliate application',
    'Interested in the affiliate programme. I coach clinicians moving into consulting and this looks like a natural fit for them.',
    1,
    false,
  ),
  sample(
    'm3',
    'Tunde Bakare',
    'tunde.b@gmail.com',
    'Affiliate application',
    'Please send over the details. I want to understand the commission structure before I commit to promoting it.',
    3,
    true,
  ),
  sample(
    'm4',
    'Grace Mensah',
    'grace@thecircle.africa',
    'Affiliate application',
    'Applying on behalf of our community team. We have around 1,200 members who would benefit from the course.',
    6,
    true,
  ),
]

export async function listMessages() {
  if (!isFirebaseConfigured) return [...SAMPLE_MESSAGES]
  const snap = await getDocs(
    query(collection(db, MESSAGES), orderBy('createdAt', 'desc')),
  )
  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    createdAt: toDate(d.data().createdAt),
  }))
}

/** Called by the public affiliate form. Silent no-op without Firebase. */
export async function sendMessage(payload) {
  if (!isFirebaseConfigured) return false
  await addDoc(collection(db, MESSAGES), {
    ...payload,
    read: false,
    createdAt: serverTimestamp(),
  })
  return true
}

export async function markRead(id, read = true) {
  if (!isFirebaseConfigured) return
  await updateDoc(doc(db, MESSAGES, id), { read })
}

export async function deleteMessage(id) {
  if (!isFirebaseConfigured) return
  await deleteDoc(doc(db, MESSAGES, id))
}
