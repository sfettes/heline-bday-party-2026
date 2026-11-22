import type { Placement, SinId } from '../../content'
import type { PlacementScore } from '../../engine'

/**
 * Strength bars exist only for the person who just took the quiz, so their
 * per-placement strengths are kept locally next to the result code.
 * Every storage access is guarded (private mode, blocked site data).
 */
const SCORES_KEY = 'sinners.myScores.v1'

export type Strengths = Record<Placement, Record<SinId, number>>
interface Stored { version: 1; code: string; strength: Strengths }

export function saveMyScores(code: string, scores: Record<Placement, PlacementScore>) {
  const data: Stored = {
    version: 1,
    code,
    strength: { sun: scores.sun.strength, moon: scores.moon.strength, rising: scores.rising.strength },
  }
  try { localStorage.setItem(SCORES_KEY, JSON.stringify(data)) } catch { /* ignore */ }
}

/** Strengths for this code, or null if this device didn't produce it. */
export function loadMyScores(code: string): Strengths | null {
  try {
    const s = JSON.parse(localStorage.getItem(SCORES_KEY) ?? 'null') as Stored | null
    if (!s || s.version !== 1 || s.code !== code || !s.strength?.sun || !s.strength.moon || !s.strength.rising) return null
    return s.strength
  } catch { return null }
}
