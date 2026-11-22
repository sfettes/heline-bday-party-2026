import { STATEMENTS } from '../content/statements'
import { PLACEMENTS, type BirthOrder, type Likert, type Placement, type SinId, type Statement } from '../content/types'
import { encodeResult, type ResultCode } from './code'
import { mulberry32, shuffle } from './rng'
import { resolvePlacement, scoreAll, type Answers, type PlacementScore } from './scoring'

/**
 * Pure, serialisable quiz state. The UI renders `currentStep(session)` and calls
 * the update functions; persist the session object to localStorage as-is.
 */
export interface Session {
  version: 1
  seed: number
  order: string[] // statement ids in display order
  answers: Answers
  tiebreaks: Partial<Record<Placement, SinId>>
  /** undefined = not asked yet; null = skipped. */
  birthOrder?: BirthOrder | null
  /** Ordered log of what was answered, used by undo(). */
  history: ({ kind: 'statement'; id: string } | { kind: 'tiebreak'; placement: Placement } | { kind: 'birthOrder' })[]
}

export type Step =
  | { kind: 'statement'; statement: Statement; index: number; total: number }
  | { kind: 'tiebreak'; placement: Placement; sins: SinId[] }
  | { kind: 'birthOrder' }
  | { kind: 'done'; result: QuizResult }

export interface QuizResult {
  code: string
  placements: ResultCode
  scores: Record<Placement, PlacementScore>
}

/**
 * Order statements so the same sin never appears twice in a row, which keeps the
 * measured sins hard to spot. Greedy pick over a seeded shuffle; retries if stuck.
 */
export function buildOrder(statements: readonly Statement[], seed: number): string[] {
  const rand = mulberry32(seed)
  for (let attempt = 0; attempt < 50; attempt++) {
    const pool = shuffle(statements, rand)
    const out: Statement[] = []
    while (pool.length) {
      const prev = out[out.length - 1]
      const i = pool.findIndex((s) => !prev || s.sin !== prev.sin)
      if (i === -1) break
      out.push(pool.splice(i, 1)[0])
    }
    if (out.length === statements.length) return out.map((s) => s.id)
  }
  return shuffle(statements, rand).map((s) => s.id)
}

export function newSession(seed = Math.floor(Math.random() * 2 ** 31), statements: readonly Statement[] = STATEMENTS): Session {
  return { version: 1, seed, order: buildOrder(statements, seed), answers: {}, tiebreaks: {}, history: [] }
}

export function currentStep(s: Session, statements: readonly Statement[] = STATEMENTS): Step {
  const byId = new Map(statements.map((x) => [x.id, x]))
  const idx = s.order.findIndex((id) => s.answers[id] === undefined)
  if (idx !== -1) return { kind: 'statement', statement: byId.get(s.order[idx])!, index: idx, total: s.order.length }

  const scores = scoreAll(statements, s.answers)
  for (const p of PLACEMENTS) {
    if (scores[p].top.length > 1 && !s.tiebreaks[p]) return { kind: 'tiebreak', placement: p, sins: scores[p].top }
  }
  if (s.birthOrder === undefined) return { kind: 'birthOrder' }

  const placements: ResultCode = {
    sun: resolvePlacement(scores.sun, statements, s.answers, s.tiebreaks.sun),
    moon: resolvePlacement(scores.moon, statements, s.answers, s.tiebreaks.moon),
    rising: resolvePlacement(scores.rising, statements, s.answers, s.tiebreaks.rising),
    ...(s.birthOrder ? { birthOrder: s.birthOrder } : {}),
  }
  return { kind: 'done', result: { code: encodeResult(placements), placements, scores } }
}

export function answerStatement(s: Session, id: string, value: Likert): Session {
  const history = s.answers[id] === undefined ? [...s.history, { kind: 'statement' as const, id }] : s.history
  return { ...s, answers: { ...s.answers, [id]: value }, history }
}

export function answerTiebreak(s: Session, placement: Placement, sin: SinId): Session {
  return { ...s, tiebreaks: { ...s.tiebreaks, [placement]: sin }, history: [...s.history, { kind: 'tiebreak', placement }] }
}

export function answerBirthOrder(s: Session, b: BirthOrder | null): Session {
  return { ...s, birthOrder: b, history: [...s.history, { kind: 'birthOrder' }] }
}

/** Step back one answer (the UI's back button). Re-answering may change ties, so tiebreaks after it are dropped too. */
export function undo(s: Session): Session {
  const last = s.history[s.history.length - 1]
  if (!last) return s
  const next: Session = { ...s, history: s.history.slice(0, -1), answers: { ...s.answers }, tiebreaks: { ...s.tiebreaks } }
  if (last.kind === 'statement') { delete next.answers[last.id]; next.tiebreaks = {}; next.birthOrder = undefined
    next.history = next.history.filter((h) => h.kind === 'statement') }
  else if (last.kind === 'tiebreak') delete next.tiebreaks[last.placement]
  else next.birthOrder = undefined
  return next
}

export function progress(s: Session): number {
  return Object.keys(s.answers).length / s.order.length
}
