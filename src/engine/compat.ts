import { COMPAT } from '../content/compat'
import { PLACEMENTS, type Placement } from '../content/types'
import type { Placements } from './code'

export interface CompatResult {
  /** 0..1 weighted score. */
  score: number
  percent: number
  parts: Record<Placement, number>
  band: (typeof COMPAT.bands)[number]
}

export function compatibility(a: Placements, b: Placements): CompatResult {
  const parts = Object.fromEntries(PLACEMENTS.map((p) => [p, COMPAT.matrices[p].scores[a[p]][b[p]]])) as Record<Placement, number>
  const score = PLACEMENTS.reduce((sum, p) => sum + COMPAT.weights[p] * parts[p], 0)
  const band = [...COMPAT.bands].reverse().find((x) => score >= x.min) ?? COMPAT.bands[0]
  return { score, percent: Math.round(score * 100), parts, band }
}
