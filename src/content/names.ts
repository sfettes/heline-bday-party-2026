import { todo } from './placeholder'
import { SIN_IDS, type NameParts, type PairKey, type SinId } from './types'

// PLACEHOLDER — Agent B replaces. Identities must be 49 unique nouns.
export const NAMES: NameParts = {
  identities: Object.fromEntries(
    SIN_IDS.flatMap((s) => SIN_IDS.map((m) => [`${s}:${m}`, todo(`${s}-${m}`)])),
  ) as Record<PairKey, string>,
  risingAdjectives: Object.fromEntries(SIN_IDS.map((s) => [s, todo(s)])) as Record<SinId, string>,
}

/** Central contradiction line per Sun:Moon pair (49). */
export const CONTRADICTIONS: Record<PairKey, string> = Object.fromEntries(
  SIN_IDS.flatMap((s) => SIN_IDS.map((m) => [`${s}:${m}`, todo(`contradiction ${s}-${m}`)])),
) as Record<PairKey, string>
