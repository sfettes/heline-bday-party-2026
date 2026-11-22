/**
 * Party wall Firestore client. Firebase is loaded lazily (dynamic import) so it lands
 * in its own chunk and quiz-takers who never post don't download it.
 * Posting uses Firestore Lite; only the wall screen pulls in the realtime SDK.
 * Nothing here throws into the UI: every call resolves to a status object.
 */
import { firebaseConfig } from './firebaseConfig'
import { dedupeGuests, toGuest, type Guest } from './stats'
import { cleanCode, cleanName, normalizeParty } from './validate'

type FullModule = typeof import('firebase/firestore')
type LiteModule = typeof import('firebase/firestore/lite')

const loadApp = () =>
  import('firebase/app').then((app) => app.getApps()[0] ?? app.initializeApp(firebaseConfig))

/** Retry-friendly memoised loader: a failed import (e.g. offline) is forgotten. */
function memo<T>(fn: () => Promise<T>): () => Promise<T> {
  let p: Promise<T> | null = null
  return () => (p ??= fn().catch((e) => { p = null; throw e }))
}

/** Full Firestore (realtime listeners) for the wall screen. */
const loadFull = memo(async () => {
  const [app, fs] = await Promise.all([loadApp(), import('firebase/firestore')])
  return { fs: fs as FullModule, db: fs.getFirestore(app) }
})

/** Firestore Lite (one-shot writes, much smaller) for guests posting from their phone. */
const loadLite = memo(async () => {
  const [app, fs] = await Promise.all([loadApp(), import('firebase/firestore/lite')])
  return { fs: fs as LiteModule, db: fs.getFirestore(app) }
})

/** Warm the Firebase chunk ahead of a likely post (e.g. when the button appears). */
export function preloadWall(): void {
  loadLite().catch(() => { /* reported on use */ })
}

const isOffline = () => typeof navigator !== 'undefined' && navigator.onLine === false

function errCode(e: unknown): string {
  return (e && typeof e === 'object' && 'code' in e && typeof e.code === 'string') ? e.code : ''
}

export type PostResult =
  | { ok: true; id: string; name: string; code: string }
  | { ok: false; reason: 'invalid-party' | 'invalid-name' | 'invalid-code' | 'offline' | 'timeout' | 'error'; message: string }

export interface PostOptions {
  /**
   * Reuse a document id from an earlier attempt. The rules allow create only, so a
   * retry with the same id can never produce a second entry: if the first attempt
   * already landed, the retry is rejected as an update and we report success.
   */
  id?: string
  timeoutMs?: number
}

/** Make a fresh Firestore auto-id without loading Firebase. */
export function newDocId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const bytes = new Uint8Array(20)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => chars[b % chars.length]).join('')
}

export async function postResult(party: string, name: string, code: string, opts: PostOptions = {}): Promise<PostResult> {
  const p = normalizeParty(party)
  if (!p) return { ok: false, reason: 'invalid-party', message: 'That party id isn’t valid.' }
  const n = cleanName(name)
  if (!n) return { ok: false, reason: 'invalid-name', message: 'Add a name first.' }
  const c = cleanCode(code)
  if (!c) return { ok: false, reason: 'invalid-code', message: 'That result code isn’t valid.' }
  if (isOffline()) return { ok: false, reason: 'offline', message: 'You’re offline. Try again when you’re back on Wi-Fi or data.' }

  const id = opts.id ?? newDocId()
  try {
    const { fs, db } = await loadLite()
    const ref = fs.doc(db, 'parties', p, 'results', id)
    const write = fs.setDoc(ref, { name: n, code: c, createdAt: fs.serverTimestamp() })
    let timer: ReturnType<typeof setTimeout> | undefined
    const timeout = new Promise<'timeout'>((res) => { timer = setTimeout(() => res('timeout'), opts.timeoutMs ?? 12000) })
    const outcome = await Promise.race([write.then(() => 'ok' as const), timeout])
    clearTimeout(timer)
    if (outcome === 'timeout') {
      return { ok: false, reason: 'timeout', message: 'The wall is taking a while to answer. Try again in a moment.' }
    }
    return { ok: true, id, name: n, code: c }
  } catch (e) {
    // Data is validated above, so a denial on a reused id means the earlier attempt landed.
    if (opts.id && errCode(e) === 'permission-denied') return { ok: true, id, name: n, code: c }
    if (isOffline() || errCode(e) === 'unavailable') {
      return { ok: false, reason: 'offline', message: 'Couldn’t reach the wall. Check your connection and try again.' }
    }
    return { ok: false, reason: 'error', message: 'Something went wrong posting to the wall. Try again?' }
  }
}

export type FeedStatus = 'connecting' | 'live' | 'offline' | 'error' | 'invalid-party'

export interface Feed {
  status: FeedStatus
  guests: Guest[]
  message?: string
}

/**
 * Live, arrival-ordered results for a party. Calls `cb` on every change.
 * Returns an unsubscribe function that is safe to call at any time.
 */
export function subscribeResults(party: string, cb: (feed: Feed) => void, max = 300): () => void {
  const p = normalizeParty(party)
  if (!p) {
    cb({ status: 'invalid-party', guests: [], message: 'Party ids use a–z, 0–9 and dashes (up to 32).' })
    return () => {}
  }
  let stopped = false
  let unsub: (() => void) | null = null
  let guests: Guest[] = []
  let wasLive = false
  cb({ status: 'connecting', guests })

  loadFull()
    .then(({ fs, db }) => {
      if (stopped) return
      const q = fs.query(fs.collection(db, 'parties', p, 'results'), fs.orderBy('createdAt'), fs.limit(max))
      unsub = fs.onSnapshot(
        q,
        { includeMetadataChanges: true },
        (snap) => {
          guests = dedupeGuests(
            snap.docs
              .map((d) => {
                const data = d.data({ serverTimestamps: 'estimate' })
                const ts = data.createdAt as { toMillis?: () => number } | null | undefined
                return toGuest(d.id, data, ts?.toMillis?.() ?? 0)
              })
              .filter((g): g is Guest => g !== null),
          )
          if (!snap.metadata.fromCache) wasLive = true
          cb({ status: snap.metadata.fromCache ? (wasLive ? 'offline' : 'connecting') : 'live', guests })
        },
        (e) => {
          cb({
            status: 'error',
            guests,
            message: errCode(e) === 'permission-denied' ? 'The wall isn’t allowed to read this party.' : 'Lost the connection to the wall. Reload to retry.',
          })
        },
      )
    })
    .catch(() => {
      if (!stopped) cb({ status: 'error', guests, message: 'Couldn’t load the wall. Check the connection and reload.' })
    })

  return () => {
    stopped = true
    unsub?.()
  }
}
