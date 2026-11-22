/**
 * Content contracts. Every file in src/content/ is typed against these.
 * Content agents edit the data modules; they must NOT change this file
 * without coordinating, because the engine and UI depend on it.
 *
 * Run `npm test` to validate structure, and `npm run check:content` to also
 * fail on leftover placeholder text.
 */

export const SIN_IDS = ['pride', 'greed', 'lust', 'envy', 'wrath', 'gluttony', 'sloth'] as const
export type SinId = (typeof SIN_IDS)[number]

export const PLACEMENTS = ['sun', 'moon', 'rising'] as const
export type Placement = (typeof PLACEMENTS)[number]

/** Likert value: -3 = strongly disagree … 0 = neutral … +3 = strongly agree. */
export type Likert = -3 | -2 | -1 | 0 | 1 | 2 | 3

export const BIRTH_ORDERS = ['oldest', 'middle', 'youngest', 'only'] as const
export type BirthOrder = (typeof BIRTH_ORDERS)[number]

/** Key for a Sun–Moon pair, e.g. "pride:envy" (sun first). */
export type PairKey = `${SinId}:${SinId}`

export interface Sin {
  id: SinId
  name: string // "Pride"
  latin: string // "superbia"
  emoji: string // single canonical emoji, used everywhere
  /** One-letter code used in result codes/URLs. Unique. */
  letter: string
  virtue: string // balancing virtue, e.g. "Humility"
  /** Accent colour (hex) tuned for the night-sky dark background. */
  accent: string
}

export interface PlacementMeta {
  id: Placement
  name: string // "Sun"
  emoji: string
  /** Short framing used on results, e.g. "What you do". */
  tagline: string
  /** One-sentence explanation of what this placement measures. */
  description: string
}

/**
 * One Likert statement. 3 per (placement × sin) cell → 63 total.
 * Writing rules (see PLAN.md):
 *  - sun:    first-person behaviour ("I'm the one who…")
 *  - moon:   private wants/fears ("Secretly, I…")
 *  - rising: how others read you ("People assume I'm…", "Strangers…")
 *  - never name the sin; ~15% reverse-worded (reverse: true means
 *    AGREEING indicates LESS of the sin).
 */
export interface Statement {
  id: string // stable, e.g. "sun-pride-1"
  placement: Placement
  sin: SinId
  text: string
  reverse?: boolean
}

/** Forced-choice tiebreaker shown only when sins tie within a placement. */
export interface TiebreakerSet {
  placement: Placement
  prompt: string // e.g. "Okay, be honest — which is more you?"
  /** One option line per sin; only the tied sins are shown. */
  options: Record<SinId, string>
}

/** Result write-up for one sin in one placement (21 total). */
export interface PlacementWriteup {
  placement: Placement
  sin: SinId
  headline: string // punchy one-liner
  body: string // 2–4 sentences, second person
  light: string[] // 2–4 strengths
  shadow: string[] // 2–4 pitfalls
}

/** Growth tips for one sin in one placement (21 total). */
export interface GrowthTip {
  placement: Placement
  sin: SinId
  /** e.g. "Ask: 'Do I need to prove myself, or solve this?'" */
  question: string
  practices: string[] // 2–4
  powerMove: string
}

export interface NameParts {
  /** 49 unique Sun–Moon identity nouns, e.g. "General". No leading "The". */
  identities: Record<PairKey, string>
  /** 7 Rising adjectives, e.g. "Velvet". Title = `The ${adj} ${identity}`. */
  risingAdjectives: Record<SinId, string>
}

/** Symmetric 7×7 matrix of 0..1 affinity scores, plus optional flavour notes. */
export interface CompatMatrix {
  placement: Placement
  scores: Record<SinId, Record<SinId, number>>
  /** Optional one-liners keyed by sorted pair "a:b" (a <= b in SIN_IDS order). */
  notes: Partial<Record<PairKey, string>>
}

export interface CompatContent {
  /** Weights, must sum to 1. Default sun .3 / moon .5 / rising .2. */
  weights: Record<Placement, number>
  matrices: Record<Placement, CompatMatrix>
  /** What each sin needs from a partner/friend. */
  needs: Record<SinId, string>
  /** Score bands → label, ascending by `min`. */
  bands: { min: number; label: string; blurb: string }[]
}

export interface Figure {
  name: string
  source: string // show/film/book/place, or "real" context (e.g. "Mayor of Waterloo")
  kind: 'fictional' | 'real'
  why: string // one affectionate line
}

/** Pop-culture figures for one sin in one placement (21 sets). */
export interface FigureSet {
  placement: Placement
  sin: SinId
  figures: Figure[] // 3–4
}

export interface BirthOrderContent {
  question: string
  labels: Record<BirthOrder, string>
  /** Flavour line keyed by birth order then Sun sin (28 lines). */
  lines: Record<BirthOrder, Record<SinId, string>>
}

export interface PartyConfig {
  title: string // "Sinners"
  guestOfHonour: string // "Heline"
  intro: string
  outro: string
}
