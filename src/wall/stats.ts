import { PLACEMENTS, SIN_IDS, type Placement, type SinId } from '../content/types'
import { compatibility, type Placements } from '../engine'
import { cleanName, parseCode } from './validate'

/** One validated wall entry. */
export interface Guest {
  id: string
  name: string
  code: string
  p: Placements
  /** ms since epoch; server estimate for pending writes, 0 if unknown. */
  at: number
}

/** Turn a raw Firestore doc into a Guest; null if it doesn't validate. */
export function toGuest(id: string, data: Record<string, unknown> | undefined, at = 0): Guest | null {
  if (!data) return null
  const name = typeof data.name === 'string' ? cleanName(data.name) : null
  const r = parseCode(data.code)
  if (!name || !r) return null
  return { id, name, code: data.code as string, p: { sun: r.sun, moon: r.moon, rising: r.rising }, at }
}

/** Same name (case-insensitive) + same code = the same person posting twice; keep the first. */
export function dedupeGuests(guests: Guest[]): Guest[] {
  const seen = new Set<string>()
  return guests.filter((g) => {
    const k = `${g.name.toLowerCase()}|${g.code}`
    if (seen.has(k)) return false
    seen.add(k)
    return true
  })
}

export type Counts = Record<Placement, Record<SinId, number>>

export function countPlacements(guests: Guest[]): Counts {
  const counts = Object.fromEntries(
    PLACEMENTS.map((p) => [p, Object.fromEntries(SIN_IDS.map((s) => [s, 0]))]),
  ) as Counts
  for (const g of guests) for (const p of PLACEMENTS) counts[p][g.p[p]]++
  return counts
}

/** Sins with the highest count in each placement (several on a tie, none when empty). */
export function dominantSins(counts: Counts): Record<Placement, SinId[]> {
  return Object.fromEntries(
    PLACEMENTS.map((p) => {
      const max = Math.max(...SIN_IDS.map((s) => counts[p][s]))
      return [p, max > 0 ? SIN_IDS.filter((s) => counts[p][s] === max) : []]
    }),
  ) as Record<Placement, SinId[]>
}

/**
 * The guest whose Sun/Moon/Rising combination is least common in the room:
 * lowest product of each placement's share. Ties go to the earlier arrival.
 * Needs at least 2 guests to mean anything.
 */
export function rarestGuest(guests: Guest[], counts = countPlacements(guests)): Guest | null {
  if (guests.length < 2) return null
  let best: Guest | null = null
  let bestScore = Infinity
  for (const g of guests) {
    const score = PLACEMENTS.reduce((acc, p) => acc * counts[p][g.p[p]], 1)
    if (score < bestScore) { best = g; bestScore = score }
  }
  return best
}

export interface Pair {
  a: Guest
  b: Guest
  score: number
}

export type PairScore = (a: Placements, b: Placements) => number
const defaultScore: PairScore = (a, b) => compatibility(a, b).score

/**
 * Highest- and lowest-scoring pairs over all guest pairs (O(n²), fine for a party).
 * Ties keep the earliest pair in arrival order. `chaos` is null when every pair scores
 * the same, since there is no meaningful "worst" then.
 */
export function extremePairs(guests: Guest[], score: PairScore = defaultScore): { best: Pair; chaos: Pair | null } | null {
  let best: Pair | null = null
  let worst: Pair | null = null
  for (let i = 0; i < guests.length; i++) {
    for (let j = i + 1; j < guests.length; j++) {
      const s = score(guests[i].p, guests[j].p)
      if (!best || s > best.score) best = { a: guests[i], b: guests[j], score: s }
      if (!worst || s < worst.score) worst = { a: guests[i], b: guests[j], score: s }
    }
  }
  if (!best || !worst) return null
  return { best, chaos: worst.score < best.score ? worst : null }
}

export interface WallStats {
  total: number
  counts: Counts
  dominant: Record<Placement, SinId[]>
  rarest: Guest | null
  pairs: { best: Pair; chaos: Pair | null } | null
}

export function computeStats(guests: Guest[], score: PairScore = defaultScore): WallStats {
  const counts = countPlacements(guests)
  return {
    total: guests.length,
    counts,
    dominant: dominantSins(counts),
    rarest: rarestGuest(guests, counts),
    pairs: extremePairs(guests, score),
  }
}
