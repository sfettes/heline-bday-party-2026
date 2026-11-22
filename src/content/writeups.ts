import { todo } from './placeholder'
import { PLACEMENTS, SIN_IDS, type PlacementWriteup } from './types'

// PLACEHOLDER — Agent B replaces.
export const WRITEUPS: PlacementWriteup[] = PLACEMENTS.flatMap((placement) =>
  SIN_IDS.map((sin) => ({
    placement, sin,
    headline: todo(`${placement} ${sin} headline`),
    body: todo(`${placement} ${sin} body`),
    light: [todo('strength'), todo('strength')],
    shadow: [todo('pitfall'), todo('pitfall')],
  })),
)
