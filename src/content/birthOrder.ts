import { todo } from './placeholder'
import { BIRTH_ORDERS, SIN_IDS, type BirthOrder, type BirthOrderContent, type SinId } from './types'

// PLACEHOLDER — Agent B replaces.
export const BIRTH_ORDER: BirthOrderContent = {
  question: 'One last thing — where do you fall in your family?',
  labels: { oldest: 'Oldest', middle: 'Middle', youngest: 'Youngest', only: 'Only child' },
  lines: Object.fromEntries(
    BIRTH_ORDERS.map((b) => [b, Object.fromEntries(SIN_IDS.map((s) => [s, todo(`${b} ${s}`)]))]),
  ) as Record<BirthOrder, Record<SinId, string>>,
}
