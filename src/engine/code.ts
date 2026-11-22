import { SINS } from '../content/sins'
import { BIRTH_ORDERS, SIN_IDS, type BirthOrder, type SinId } from '../content/types'

export interface Placements {
  sun: SinId
  moon: SinId
  rising: SinId
}
export interface ResultCode extends Placements {
  birthOrder?: BirthOrder
}

const BO_LETTER: Record<BirthOrder, string> = { oldest: 'o', middle: 'm', youngest: 'y', only: 'x' }
const byLetter = Object.fromEntries(SIN_IDS.map((s) => [SINS[s].letter, s])) as Record<string, SinId>
const boByLetter = Object.fromEntries(BIRTH_ORDERS.map((b) => [BO_LETTER[b], b])) as Record<string, BirthOrder>

/** e.g. { sun: pride, moon: envy, rising: wrath, birthOrder: youngest } → "PEW-y" */
export function encodeResult(r: ResultCode): string {
  const core = SINS[r.sun].letter + SINS[r.moon].letter + SINS[r.rising].letter
  return r.birthOrder ? `${core}-${BO_LETTER[r.birthOrder]}` : core
}

export function decodeResult(code: string): ResultCode | null {
  const m = /^([A-Z])([A-Z])([A-Z])(?:-([a-z]))?$/.exec(code.trim())
  if (!m) return null
  const [sun, moon, rising] = [byLetter[m[1]], byLetter[m[2]], byLetter[m[3]]]
  if (!sun || !moon || !rising) return null
  if (m[4] && !boByLetter[m[4]]) return null
  return { sun, moon, rising, ...(m[4] ? { birthOrder: boByLetter[m[4]] } : {}) }
}
