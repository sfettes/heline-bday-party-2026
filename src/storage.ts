import type { Session } from './engine/session'

// Browser storage can throw (private mode, blocked site data); every access is guarded.
const SESSION_KEY = 'sinners.session.v1'
const RESULT_KEY = 'sinners.myResult.v1'
const NAME_KEY = 'sinners.name.v1'

function get(key: string): string | null {
  try { return localStorage.getItem(key) } catch { return null }
}
function set(key: string, value: string | null) {
  try { value === null ? localStorage.removeItem(key) : localStorage.setItem(key, value) } catch { /* ignore */ }
}

export function loadSession(): Session | null {
  try {
    const s = JSON.parse(get(SESSION_KEY) ?? 'null') as Session | null
    return s && s.version === 1 ? s : null
  } catch { return null }
}
export const saveSession = (s: Session | null) => set(SESSION_KEY, s ? JSON.stringify(s) : null)

export const loadMyResult = () => get(RESULT_KEY)
export const saveMyResult = (code: string) => set(RESULT_KEY, code)

export const loadName = () => get(NAME_KEY) ?? ''
export const saveName = (name: string) => set(NAME_KEY, name)
