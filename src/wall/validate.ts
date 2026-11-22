import { decodeResult, encodeResult, type ResultCode } from '../engine/code'

/** Party id used when none is given (`#/wall` → `#/wall/main`). */
export const DEFAULT_PARTY = 'main'
/** Mirrors firestore.rules. */
export const PARTY_RE = /^[a-z0-9-]{1,32}$/
export const CODE_RE = /^[PGLEWUS]{3}(-[omyx])?$/
export const NAME_MAX = 24

/** Normalise a party id; null when it can't satisfy the rules. Empty → DEFAULT_PARTY. */
export function normalizeParty(raw: string | null | undefined): string | null {
  const p = (raw ?? '').trim().toLowerCase()
  if (!p) return DEFAULT_PARTY
  return PARTY_RE.test(p) ? p : null
}

/**
 * Trim, collapse whitespace, drop control characters and clamp to NAME_MAX.
 * The clamp never splits a surrogate pair and keeps the UTF-16 length within the
 * limit too, so it holds whether the rules count code points or code units.
 */
export function cleanName(raw: string | null | undefined): string | null {
  // eslint-disable-next-line no-control-regex
  const s = (raw ?? '').replace(/[\u0000-\u001f\u007f-\u009f]/g, '').replace(/\s+/g, ' ').trim()
  let out = ''
  for (const ch of s) {
    if (out.length + ch.length > NAME_MAX) break
    out += ch
  }
  out = out.trim()
  return out ? out : null
}

/** Canonical result code (whitespace trimmed, must decode) or null. */
export function cleanCode(raw: string | null | undefined): string | null {
  const r = decodeResult(raw ?? '')
  if (!r) return null
  const code = encodeResult(r)
  return CODE_RE.test(code) ? code : null
}

/** Decoded placements for a valid wire code, else null. */
export function parseCode(raw: unknown): ResultCode | null {
  if (typeof raw !== 'string' || !CODE_RE.test(raw)) return null
  return decodeResult(raw)
}

/** The quiz entry URL for QR codes: current origin + path, hash route '#/'. */
export function quizUrl(loc: { origin: string; pathname: string } = window.location): string {
  return `${loc.origin}${loc.pathname}#/`
}
