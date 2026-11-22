import { describe, expect, it } from 'vitest'
import * as C from './index'
import { TODO } from './placeholder'
import { BIRTH_ORDERS, PLACEMENTS, SIN_IDS, type PairKey } from './types'

const cells = PLACEMENTS.flatMap((p) => SIN_IDS.map((s) => [p, s] as const))
const pairs = SIN_IDS.flatMap((a) => SIN_IDS.map((b) => `${a}:${b}` as PairKey))

describe('content structure', () => {
  it('sins have unique letters and emoji', () => {
    const sins = Object.values(C.SINS)
    expect(new Set(sins.map((s) => s.letter)).size).toBe(7)
    expect(new Set(sins.map((s) => s.emoji)).size).toBe(7)
  })

  it('has exactly 3 statements per placement × sin, unique ids and texts', () => {
    expect(C.STATEMENTS).toHaveLength(63)
    for (const [p, s] of cells) expect(C.STATEMENTS.filter((x) => x.placement === p && x.sin === s), `${p}/${s}`).toHaveLength(3)
    expect(new Set(C.STATEMENTS.map((x) => x.id)).size).toBe(63)
    expect(new Set(C.STATEMENTS.map((x) => x.text.trim().toLowerCase())).size).toBe(63)
  })

  it('statements never name a sin outright', () => {
    for (const st of C.STATEMENTS) {
      for (const sin of Object.values(C.SINS)) {
        expect(new RegExp(`\\b${sin.name}\\b`, 'i').test(st.text), `${st.id} names ${sin.name}`).toBe(false)
      }
    }
  })

  it('has a reverse-worded share of roughly 10–25% once written', () => {
    if (C.STATEMENTS.every((s) => s.text.startsWith(TODO))) return
    const r = C.STATEMENTS.filter((s) => s.reverse).length / C.STATEMENTS.length
    expect(r).toBeGreaterThanOrEqual(0.1)
    expect(r).toBeLessThanOrEqual(0.25)
  })

  it('has one tiebreaker set per placement covering every sin', () => {
    for (const p of PLACEMENTS) {
      const t = C.TIEBREAKERS.filter((x) => x.placement === p)
      expect(t).toHaveLength(1)
      for (const s of SIN_IDS) expect(t[0].options[s]?.length).toBeGreaterThan(0)
    }
  })

  it('has write-ups, growth tips and figure sets for all 21 cells', () => {
    for (const [p, s] of cells) {
      expect(C.WRITEUPS.filter((x) => x.placement === p && x.sin === s)).toHaveLength(1)
      expect(C.GROWTH.filter((x) => x.placement === p && x.sin === s)).toHaveLength(1)
      const f = C.FIGURES.filter((x) => x.placement === p && x.sin === s)
      expect(f).toHaveLength(1)
      expect(f[0].figures.length).toBeGreaterThanOrEqual(3)
      expect(f[0].figures.length).toBeLessThanOrEqual(4)
    }
  })

  it('has 49 unique identities, 7 unique rising adjectives, 49 contradictions', () => {
    const ids = pairs.map((k) => C.NAMES.identities[k])
    expect(ids.every(Boolean)).toBe(true)
    expect(new Set(ids.map((x) => x.toLowerCase())).size).toBe(49)
    const adj = SIN_IDS.map((s) => C.NAMES.risingAdjectives[s])
    expect(new Set(adj.map((x) => x.toLowerCase())).size).toBe(7)
    for (const k of pairs) expect(C.CONTRADICTIONS[k]?.length, k).toBeGreaterThan(0)
    for (const x of ids) expect(/^the\s/i.test(x), `identity "${x}" must omit "The"`).toBe(false)
  })

  it('compat matrices are symmetric, in [0,1], and weights sum to 1', () => {
    const w = C.COMPAT.weights
    expect(w.sun + w.moon + w.rising).toBeCloseTo(1)
    for (const p of PLACEMENTS) {
      const m = C.COMPAT.matrices[p].scores
      for (const a of SIN_IDS)
        for (const b of SIN_IDS) {
          expect(m[a][b]).toBeGreaterThanOrEqual(0)
          expect(m[a][b]).toBeLessThanOrEqual(1)
          expect(m[a][b], `${p} ${a}/${b}`).toBe(m[b][a])
        }
    }
    const mins = C.COMPAT.bands.map((b) => b.min)
    expect(mins[0]).toBe(0)
    expect([...mins].sort((a, b) => a - b)).toEqual(mins)
  })

  it('has birth-order lines for every order × sun sin', () => {
    for (const b of BIRTH_ORDERS) for (const s of SIN_IDS) expect(C.BIRTH_ORDER.lines[b][s]?.length).toBeGreaterThan(0)
  })
})

describe.skipIf(!process.env.STRICT_CONTENT)('content completeness (STRICT_CONTENT)', () => {
  it('contains no TODO placeholders', () => {
    const leftovers: string[] = []
    const walk = (v: unknown, path: string) => {
      if (typeof v === 'string') { if (v.includes(TODO)) leftovers.push(path) }
      else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${path}[${i}]`))
      else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) walk(x, `${path}.${k}`)
    }
    walk(C, 'content')
    expect(leftovers.slice(0, 20), `${leftovers.length} placeholders left`).toEqual([])
  })
})
