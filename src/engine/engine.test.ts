import { describe, expect, it } from 'vitest'
import { STATEMENTS } from '../content/statements'
import { PLACEMENTS, SIN_IDS, type Likert, type SinId, type Statement } from '../content/types'
import { mulberry32 } from './rng'
import { decodeResult, encodeResult } from './code'
import { compatibility } from './compat'
import { resolvePlacement, scorePlacement } from './scoring'
import { answerBirthOrder, answerStatement, answerTiebreak, buildOrder, currentStep, newSession, undo, type Session } from './session'

const clamp = (x: number) => Math.max(-3, Math.min(3, Math.round(x))) as Likert

/** Run a whole session with an answer function; returns the final result. */
function run(answer: (st: Statement) => Likert, pickTie = (sins: SinId[]) => sins[0], seed = 1) {
  let s: Session = newSession(seed)
  let ties = 0
  for (let guard = 0; guard < 200; guard++) {
    const step = currentStep(s)
    if (step.kind === 'statement') s = answerStatement(s, step.statement.id, answer(step.statement))
    else if (step.kind === 'tiebreak') { ties++; s = answerTiebreak(s, step.placement, pickTie(step.sins)) }
    else if (step.kind === 'birthOrder') s = answerBirthOrder(s, 'youngest')
    else return { result: step.result, ties }
  }
  throw new Error('session did not finish')
}

describe('result codes', () => {
  it('round-trips every combination with and without birth order', () => {
    for (const sun of SIN_IDS) for (const moon of SIN_IDS) for (const rising of SIN_IDS) {
      expect(decodeResult(encodeResult({ sun, moon, rising }))).toEqual({ sun, moon, rising })
      expect(decodeResult(encodeResult({ sun, moon, rising, birthOrder: 'only' }))).toEqual({ sun, moon, rising, birthOrder: 'only' })
    }
  })
  it('rejects junk', () => {
    for (const bad of ['', 'PE', 'PEZ', 'pew', 'PEW-q', 'PEWW', '<script>']) expect(decodeResult(bad)).toBeNull()
  })
})

describe('scoring', () => {
  it('flips reverse-keyed items', () => {
    const sts: Statement[] = [
      { id: 'a', placement: 'sun', sin: 'pride', text: 'a' },
      { id: 'b', placement: 'sun', sin: 'greed', text: 'b', reverse: true },
    ]
    const sc = scorePlacement('sun', sts, { a: 1, b: -3 })
    expect(sc.raw.greed).toBe(3)
    expect(sc.top).toEqual(['greed'])
  })

  it('centres strength on the person, so agree-to-everything is flat at 50', () => {
    const answers = Object.fromEntries(STATEMENTS.map((s) => [s.id, 3 as Likert]))
    const sc = scorePlacement('moon', STATEMENTS.map((s) => ({ ...s, reverse: false })), answers)
    for (const s of SIN_IDS) expect(sc.strength[s]).toBe(50)
    expect(sc.top).toHaveLength(7)
  })

  it('resolves ties: tiebreak pick, then peak answer, then canonical order', () => {
    const sts: Statement[] = [
      { id: 'p1', placement: 'sun', sin: 'pride', text: '' }, { id: 'p2', placement: 'sun', sin: 'pride', text: '' },
      { id: 'w1', placement: 'sun', sin: 'wrath', text: '' }, { id: 'w2', placement: 'sun', sin: 'wrath', text: '' },
    ]
    const answers = { p1: 2, p2: 2, w1: 3, w2: 1 } as const
    const sc = scorePlacement('sun', sts, answers)
    expect(sc.top).toEqual(['pride', 'wrath'])
    expect(resolvePlacement(sc, sts, answers, 'pride')).toBe('pride')
    expect(resolvePlacement(sc, sts, answers)).toBe('wrath') // peak +3
    expect(resolvePlacement(sc, sts, answers, 'sloth')).toBe('wrath') // invalid pick ignored
  })
})

describe('session', () => {
  it('orders all 63 statements with no sin twice in a row, deterministically per seed', () => {
    const order = buildOrder(STATEMENTS, 42)
    expect(new Set(order).size).toBe(63)
    const sinOf = new Map(STATEMENTS.map((s) => [s.id, s.sin]))
    for (let i = 1; i < order.length; i++) expect(sinOf.get(order[i])).not.toBe(sinOf.get(order[i - 1]))
    expect(buildOrder(STATEMENTS, 42)).toEqual(order)
  })

  it('a pure-sin persona gets that sin in every placement', () => {
    for (const sin of SIN_IDS) {
      const { result } = run((st) => ((st.sin === sin) !== !!st.reverse ? 3 : -3))
      expect(result.placements).toMatchObject({ sun: sin, moon: sin, rising: sin, birthOrder: 'youngest' })
    }
  })

  it('asks tiebreakers only for tied placements, and uses the pick', () => {
    const { result, ties } = run(() => 0, (sins) => sins[sins.length - 1])
    expect(ties).toBe(3)
    for (const p of PLACEMENTS) expect(result.placements[p]).toBe('sloth')
  })

  it('undo removes the last answer and invalidates later tiebreaks', () => {
    let s = newSession(3)
    for (const id of s.order) s = answerStatement(s, id, 0)
    s = answerTiebreak(s, 'sun', 'envy')
    s = undo(s)
    expect(s.tiebreaks.sun).toBeUndefined()
    s = undo(s)
    expect(Object.keys(s.answers)).toHaveLength(62)
    expect(currentStep(s).kind).toBe('statement')
  })

  it('every sin is reachable and none dominates under noisy simulated respondents', () => {
    const rand = mulberry32(7)
    const gauss = () => Math.sqrt(-2 * Math.log(rand() + 1e-12)) * Math.cos(2 * Math.PI * rand())
    const counts = Object.fromEntries(PLACEMENTS.map((p) => [p, Object.fromEntries(SIN_IDS.map((s) => [s, 0]))]))
    let tieSessions = 0
    const N = 1500
    for (let i = 0; i < N; i++) {
      const latent = Object.fromEntries(PLACEMENTS.flatMap((p) => SIN_IDS.map((s) => [`${p}:${s}`, gauss()])))
      const bias = gauss() * 0.5 // acquiescence
      const { result, ties } = run((st) => {
        const v = latent[`${st.placement}:${st.sin}`] + gauss()
        return clamp((st.reverse ? -v : v) + bias)
      }, (sins) => sins[Math.floor(rand() * sins.length)], i)
      if (ties) tieSessions++
      for (const p of PLACEMENTS) (counts[p] as Record<string, number>)[result.placements[p]]++
    }
    for (const p of PLACEMENTS) for (const s of SIN_IDS) {
      const share = (counts[p] as Record<string, number>)[s] / N
      expect(share, `${p}/${s}`).toBeGreaterThan(0.08)
      expect(share, `${p}/${s}`).toBeLessThan(0.22)
    }
    expect(tieSessions / N).toBeLessThan(0.7)
  })
})

describe('compatibility', () => {
  it('weights placements and picks a band', () => {
    const r = compatibility({ sun: 'pride', moon: 'envy', rising: 'wrath' }, { sun: 'lust', moon: 'sloth', rising: 'greed' })
    expect(r.score).toBeGreaterThanOrEqual(0)
    expect(r.score).toBeLessThanOrEqual(1)
    expect(r.percent).toBe(Math.round(r.score * 100))
    expect(r.band).toBeDefined()
  })
})
