import { NAMES } from '../content/names'
import type { Placements } from './code'

/** "The {Rising adjective} {Sun–Moon identity}", e.g. "The Velvet General". */
export function titleFor(p: Placements): string {
  return `The ${NAMES.risingAdjectives[p.rising]} ${NAMES.identities[`${p.sun}:${p.moon}`]}`
}
