import { PLACEMENTS, SIN_IDS, type Likert, type Placement, type SinId, type Statement } from '../content/types'

export type Answers = Record<string, Likert>
export type SinScores = Record<SinId, number>

export interface PlacementScore {
  placement: Placement
  /** Mean keyed score per sin, in [-3, 3] (reverse items already flipped). */
  raw: SinScores
  /** 0..100 display strength, centred on this person's own average so "agree to everything" still shows a spread. */
  strength: SinScores
  /** Sins sharing the top raw score (length > 1 means a tiebreaker is needed). */
  top: SinId[]
}

const EPS = 1e-9

export function keyed(st: Statement, v: Likert): number {
  return st.reverse ? -v : v
}

export function scorePlacement(placement: Placement, statements: readonly Statement[], answers: Answers): PlacementScore {
  const raw = {} as SinScores
  for (const sin of SIN_IDS) {
    const items = statements.filter((s) => s.placement === placement && s.sin === sin && answers[s.id] !== undefined)
    raw[sin] = items.length ? items.reduce((sum, s) => sum + keyed(s, answers[s.id]), 0) / items.length : 0
  }
  const vals = SIN_IDS.map((s) => raw[s])
  const mean = vals.reduce((a, b) => a + b, 0) / vals.length
  const strength = {} as SinScores
  // Centred value lies in [-6, 6]; map to 0..100 with 50 = this person's average.
  for (const sin of SIN_IDS) strength[sin] = Math.round(Math.max(0, Math.min(100, 50 + ((raw[sin] - mean) / 6) * 50)))
  const max = Math.max(...vals)
  const top = SIN_IDS.filter((s) => Math.abs(raw[s] - max) < EPS)
  return { placement, raw, strength, top }
}

export function scoreAll(statements: readonly Statement[], answers: Answers): Record<Placement, PlacementScore> {
  return Object.fromEntries(PLACEMENTS.map((p) => [p, scorePlacement(p, statements, answers)])) as Record<Placement, PlacementScore>
}

/**
 * Pick the winning sin for a placement.
 * 1. Unique top raw score wins.
 * 2. Otherwise the tiebreaker pick, if it is among the tied sins.
 * 3. Otherwise the tied sin with the most extreme single keyed answer (+3 beats +2…).
 * 4. Otherwise canonical SIN_IDS order (deterministic).
 */
export function resolvePlacement(
  score: PlacementScore,
  statements: readonly Statement[],
  answers: Answers,
  tiebreak?: SinId,
): SinId {
  if (score.top.length === 1) return score.top[0]
  if (tiebreak && score.top.includes(tiebreak)) return tiebreak
  const peak = (sin: SinId) =>
    Math.max(-3, ...statements.filter((s) => s.placement === score.placement && s.sin === sin && answers[s.id] !== undefined).map((s) => keyed(s, answers[s.id])))
  const best = Math.max(...score.top.map(peak))
  return score.top.find((s) => peak(s) === best)!
}
