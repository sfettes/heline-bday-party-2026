import { todo } from './placeholder'
import { PLACEMENTS, SIN_IDS, type GrowthTip } from './types'

// PLACEHOLDER — Agent B replaces.
export const GROWTH: GrowthTip[] = PLACEMENTS.flatMap((placement) =>
  SIN_IDS.map((sin) => ({
    placement, sin,
    question: todo(`${placement} ${sin} question`),
    practices: [todo('practice'), todo('practice')],
    powerMove: todo('power move'),
  })),
)
