import { todo } from './placeholder'
import { PLACEMENTS, SIN_IDS, type SinId, type TiebreakerSet } from './types'

// PLACEHOLDER — Agent A replaces.
export const TIEBREAKERS: TiebreakerSet[] = PLACEMENTS.map((placement) => ({
  placement,
  prompt: todo(`${placement} tiebreak prompt`),
  options: Object.fromEntries(SIN_IDS.map((s) => [s, todo(`${placement} ${s} option`)])) as Record<SinId, string>,
}))
