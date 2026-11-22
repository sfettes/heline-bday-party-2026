// Remembers this device's wall post per party, so a refresh never double-posts.
// Storage access is guarded: private mode or blocked storage just means no memory.

export interface PostRecord {
  /** Firestore doc id, reused on retries so a post can only ever land once. */
  id: string
  code: string
  name: string
  done: boolean
}

const key = (party: string) => `sinners.wall.post.v1.${party}`

export function loadPostRecord(party: string): PostRecord | null {
  try {
    const r = JSON.parse(localStorage.getItem(key(party)) ?? 'null') as Partial<PostRecord> | null
    if (r && typeof r.id === 'string' && typeof r.code === 'string' && typeof r.name === 'string') {
      return { id: r.id, code: r.code, name: r.name, done: r.done === true }
    }
  } catch { /* ignore */ }
  return null
}

export function savePostRecord(party: string, rec: PostRecord): void {
  try { localStorage.setItem(key(party), JSON.stringify(rec)) } catch { /* ignore */ }
}
