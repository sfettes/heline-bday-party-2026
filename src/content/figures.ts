import { todo } from './placeholder'
import { PLACEMENTS, SIN_IDS, type FigureSet } from './types'

// PLACEHOLDER — Agent C replaces.
export const FIGURES: FigureSet[] = PLACEMENTS.flatMap((placement) =>
  SIN_IDS.map((sin) => ({
    placement, sin,
    figures: [1, 2, 3].map((n) => ({ name: todo(`figure ${n}`), source: todo('source'), kind: 'fictional' as const, why: todo('why') })),
  })),
)
