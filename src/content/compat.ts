import { todo } from './placeholder'
import { PLACEMENTS, SIN_IDS, type CompatContent, type CompatMatrix, type Placement, type SinId } from './types'

// PLACEHOLDER — Agent B replaces with matrices derived from the brainstorm's match tables.
const flat = (placement: Placement): CompatMatrix => ({
  placement,
  scores: Object.fromEntries(SIN_IDS.map((a) => [a, Object.fromEntries(SIN_IDS.map((b) => [b, 0.5]))])) as Record<SinId, Record<SinId, number>>,
  notes: {},
})

export const COMPAT: CompatContent = {
  weights: { sun: 0.3, moon: 0.5, rising: 0.2 },
  matrices: Object.fromEntries(PLACEMENTS.map((p) => [p, flat(p)])) as Record<Placement, CompatMatrix>,
  needs: Object.fromEntries(SIN_IDS.map((s) => [s, todo(`${s} needs`)])) as Record<SinId, string>,
  bands: [
    { min: 0, label: todo('low band'), blurb: todo('low blurb') },
    { min: 0.5, label: todo('mid band'), blurb: todo('mid blurb') },
    { min: 0.75, label: todo('high band'), blurb: todo('high blurb') },
  ],
}
