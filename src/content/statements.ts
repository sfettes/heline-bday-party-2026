import { todo } from './placeholder'
import { PLACEMENTS, SIN_IDS, type Statement } from './types'

// PLACEHOLDER — Agent A replaces this whole file with 63 hand-written statements.
export const STATEMENTS: Statement[] = PLACEMENTS.flatMap((placement) =>
  SIN_IDS.flatMap((sin) =>
    [1, 2, 3].map((n) => ({ id: `${placement}-${sin}-${n}`, placement, sin, text: todo(`${placement} cell ${SIN_IDS.indexOf(sin)} #${n}`) })),
  ),
)
