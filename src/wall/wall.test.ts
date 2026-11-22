import { describe, expect, it } from 'vitest'
import { encode } from 'uqr'
import type { Placements } from '../engine'
import { qrPath } from './QrCode'
import { computeStats, countPlacements, dedupeGuests, dominantSins, extremePairs, rarestGuest, toGuest, type Guest } from './stats'
import { DEFAULT_PARTY, cleanCode, cleanName, normalizeParty, parseCode, quizUrl } from './validate'

let n = 0
function guest(name: string, code: string): Guest {
  const g = toGuest(`id${n++}`, { name, code })
  if (!g) throw new Error(`bad fixture ${name} ${code}`)
  return g
}

describe('validate', () => {
  it('normalises party ids against the rules', () => {
    expect(normalizeParty('')).toBe(DEFAULT_PARTY)
    expect(normalizeParty(undefined)).toBe('main')
    expect(normalizeParty(' Main ')).toBe('main')
    expect(normalizeParty('test-smoke')).toBe('test-smoke')
    expect(normalizeParty('a'.repeat(32))).toBe('a'.repeat(32))
    expect(normalizeParty('a'.repeat(33))).toBeNull()
    expect(normalizeParty('no spaces')).toBeNull()
    expect(normalizeParty('under_score')).toBeNull()
    expect(normalizeParty('../x')).toBeNull()
  })

  it('cleans and clamps names', () => {
    expect(cleanName('  Heline  ')).toBe('Heline')
    expect(cleanName('Mary   Jane\n')).toBe('Mary Jane')
    expect(cleanName('   ')).toBeNull()
    expect(cleanName(null)).toBeNull()
    expect(cleanName('a\u0000b')).toBe('ab')
    expect(cleanName('x'.repeat(40))).toBe('x'.repeat(24))
    // trailing space after the clamp is trimmed
    expect(cleanName('a'.repeat(23) + ' bcd')).toBe('a'.repeat(23))
  })

  it('never splits an emoji when clamping and stays within 24 UTF-16 units', () => {
    const out = cleanName('😴'.repeat(20))!
    expect(out).toBe('😴'.repeat(12))
    expect(out.length).toBeLessThanOrEqual(24)
    expect(cleanName('a' + '👑'.repeat(12))).toBe('a' + '👑'.repeat(11))
  })

  it('accepts only decodable result codes', () => {
    expect(cleanCode('PEW-y')).toBe('PEW-y')
    expect(cleanCode(' PGS ')).toBe('PGS')
    expect(cleanCode('pew-y')).toBeNull()
    expect(cleanCode('PEZ')).toBeNull()
    expect(cleanCode('PEW-q')).toBeNull()
    expect(cleanCode('PEWS')).toBeNull()
    expect(cleanCode('')).toBeNull()
    expect(parseCode(' PEW')).toBeNull() // wire codes must already be canonical
    expect(parseCode(42)).toBeNull()
    expect(parseCode('UUS-x')).toEqual({ sun: 'gluttony', moon: 'gluttony', rising: 'sloth', birthOrder: 'only' })
  })

  it('builds the quiz URL from origin + path with a #/ hash', () => {
    expect(quizUrl({ origin: 'https://sfettes.github.io', pathname: '/heline-bday-party-2026/' }))
      .toBe('https://sfettes.github.io/heline-bday-party-2026/#/')
  })
})

describe('toGuest / dedupe', () => {
  it('drops malformed docs', () => {
    expect(toGuest('a', undefined)).toBeNull()
    expect(toGuest('a', { name: '', code: 'PEW' })).toBeNull()
    expect(toGuest('a', { name: 'Zoe', code: 'XYZ' })).toBeNull()
    expect(toGuest('a', { name: 7, code: 'PEW' })).toBeNull()
    expect(toGuest('a', { name: 'Zoe', code: 'PEW-o' }, 5)).toMatchObject({ id: 'a', name: 'Zoe', at: 5, p: { sun: 'pride', moon: 'envy', rising: 'wrath' } })
  })

  it('collapses the same name + code posted twice, keeping the first', () => {
    const a = guest('Zoe', 'PEW'), b = guest('zoe', 'PEW'), c = guest('Zoe', 'PES')
    expect(dedupeGuests([a, b, c]).map((g) => g.id)).toEqual([a.id, c.id])
  })
})

describe('stats', () => {
  const room = [guest('A', 'PEW'), guest('B', 'PGW'), guest('C', 'WGW'), guest('D', 'SLU')]

  it('counts each placement', () => {
    const c = countPlacements(room)
    expect(c.sun).toMatchObject({ pride: 2, wrath: 1, sloth: 1, greed: 0 })
    expect(c.moon).toMatchObject({ greed: 2, envy: 1, lust: 1 })
    expect(c.rising).toMatchObject({ wrath: 3, gluttony: 1 })
    for (const p of ['sun', 'moon', 'rising'] as const) {
      expect(Object.values(c[p]).reduce((a, b) => a + b, 0)).toBe(room.length)
    }
  })

  it('finds dominant sins, keeping ties and nothing when empty', () => {
    const d = dominantSins(countPlacements(room))
    expect(d.sun).toEqual(['pride'])
    expect(d.rising).toEqual(['wrath'])
    expect(dominantSins(countPlacements([guest('A', 'PEW'), guest('B', 'GEW')])).sun).toEqual(['pride', 'greed'])
    expect(dominantSins(countPlacements([])).moon).toEqual([])
  })

  it('picks the rarest combo', () => {
    expect(rarestGuest(room)?.name).toBe('D')
    expect(rarestGuest([room[0]])).toBeNull()
    // all unique → earliest arrival wins the tie
    expect(rarestGuest([guest('X', 'PPP'), guest('Y', 'GGG')])?.name).toBe('X')
  })

  it('computeStats bundles everything', () => {
    const s = computeStats(room, () => 0.5)
    expect(s.total).toBe(4)
    expect(s.rarest?.name).toBe('D')
    expect(s.pairs?.best.score).toBe(0.5)
    expect(s.pairs?.chaos).toBeNull()
    expect(computeStats([]).pairs).toBeNull()
  })
})

describe('extremePairs', () => {
  // Score = number of matching placements / 3, so the outcome is easy to reason about.
  const same = (a: Placements, b: Placements) => (['sun', 'moon', 'rising'] as const).filter((p) => a[p] === b[p]).length / 3

  it('finds the best and worst pair over all pairs', () => {
    const g = [guest('A', 'PEW'), guest('B', 'SLU'), guest('C', 'PEG'), guest('D', 'GGG')]
    const r = extremePairs(g, same)!
    expect([r.best.a.name, r.best.b.name]).toEqual(['A', 'C'])
    expect(r.best.score).toBeCloseTo(2 / 3)
    expect([r.chaos!.a.name, r.chaos!.b.name]).toEqual(['A', 'B'])
    expect(r.chaos!.score).toBe(0)
  })

  it('needs two guests and hides chaos when every pair ties', () => {
    expect(extremePairs([], same)).toBeNull()
    expect(extremePairs([guest('A', 'PEW')], same)).toBeNull()
    const r = extremePairs([guest('A', 'PEW'), guest('B', 'PEW')], same)!
    expect(r.best.score).toBe(1)
    expect(r.chaos).toBeNull()
  })

  it('handles a 60-guest party with the real compatibility()', () => {
    const letters = 'PGLEWUS'
    const g = Array.from({ length: 60 }, (_, i) => guest(`G${i}`, letters[i % 7] + letters[(i * 3) % 7] + letters[(i * 5 + 1) % 7]))
    const s = computeStats(g)
    expect(s.pairs).not.toBeNull()
    expect(s.pairs!.best.score).toBeGreaterThanOrEqual(s.pairs!.chaos?.score ?? 0)
    expect(s.pairs!.best.a.id).not.toBe(s.pairs!.best.b.id)
  })
})

describe('qrPath', () => {
  it('covers exactly the dark modules', () => {
    const qr = encode('https://example.com/#/', { border: 4 })
    const d = qrPath(qr.data)
    const area = [...d.matchAll(/h(\d+)/g)].reduce((a, m) => a + Number(m[1]), 0)
    const dark = qr.data.flat().filter(Boolean).length
    expect(area).toBe(dark)
    expect(qr.data[0].every((x) => !x)).toBe(true) // quiet zone
  })
})
