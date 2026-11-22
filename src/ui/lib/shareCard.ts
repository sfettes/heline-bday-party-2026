import { PARTY, PLACEMENTS, PLACEMENT_META, SINS } from '../../content'
import type { Placements } from '../../engine'
import { mulberry32 } from '../../engine/rng'
import { SPARKLE_PATH } from '../components/Glyphs'
import { alpha } from './color'

/**
 * 1080×1920 story-format share card, drawn with plain canvas APIs.
 * Layout: party masthead → title → the three placements → small URL.
 */
export const CARD_W = 1080
export const CARD_H = 1920

const INK = '#0a0c16'
const TEXT = '#f2e9da'
const MUTED = '#a39dad'
const GOLD = '#e8c468'
const DISPLAY = "'Cormorant Garamond', 'Cormorant', Georgia, serif"
const BODY = "'Instrument Sans', system-ui, -apple-system, 'Segoe UI', sans-serif"

const GLYPH_PATHS: Record<string, string> = {
  sun: [
    'M17.2 12a5.2 5.2 0 1 1-10.4 0a5.2 5.2 0 1 1 10.4 0Z',
    ...Array.from({ length: 8 }, (_, i) => {
      const a = (i * Math.PI) / 4, r1 = i % 2 ? 7.6 : 7.4, r2 = i % 2 ? 9.4 : 11
      return `M${12 + r1 * Math.cos(a)} ${12 + r1 * Math.sin(a)}L${12 + r2 * Math.cos(a)} ${12 + r2 * Math.sin(a)}`
    }),
  ].join(''),
  moon: 'M15.2 3.6A8.6 8.6 0 1 0 20.4 16.3A7 7 0 0 1 15.2 3.6Z',
  rising: 'M2.5 18.5h19M6.5 18.5a5.5 5.5 0 0 1 11 0M12 11V2.8M9.2 5.6 12 2.8l2.8 2.8',
}

export interface CardInput {
  code: string
  placements: Placements
  title: string
  url: string // printed small at the bottom
}

async function fontsReady() {
  if (!('fonts' in document)) return
  const loads = [
    `italic 600 120px ${DISPLAY}`,
    `500 120px ${DISPLAY}`,
    `500 30px ${BODY}`,
  ].map((f) => document.fonts.load(f).catch(() => []))
  await Promise.race([Promise.all(loads), new Promise((r) => setTimeout(r, 2500))])
}

function seedFrom(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619)
  return h >>> 0
}

function spaced(ctx: CanvasRenderingContext2D, px: number) {
  // letterSpacing is widely but not universally supported; it's purely cosmetic.
  if ('letterSpacing' in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${px}px`
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const words = text.split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let line = ''
  for (const w of words) {
    const test = line ? `${line} ${w}` : w
    if (ctx.measureText(test).width <= maxW || !line) line = test
    else { lines.push(line); line = w }
  }
  if (line) lines.push(line)
  return lines
}

function sparkle(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, color: string) {
  ctx.save()
  ctx.translate(cx - size / 2, cy - size / 2)
  ctx.scale(size / 24, size / 24)
  ctx.fillStyle = color
  ctx.fill(new Path2D(SPARKLE_PATH))
  ctx.restore()
}

function glyph(ctx: CanvasRenderingContext2D, kind: string, x: number, y: number, size: number, color: string) {
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(size / 24, size / 24)
  ctx.strokeStyle = color
  ctx.lineWidth = 1.2
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.stroke(new Path2D(GLYPH_PATHS[kind]))
  if (kind === 'sun') { ctx.fillStyle = color; ctx.beginPath(); ctx.arc(12, 12, 1, 0, Math.PI * 2); ctx.fill() }
  ctx.restore()
}

export async function drawShareCard({ code, placements, title, url }: CardInput): Promise<HTMLCanvasElement> {
  await fontsReady()
  const c = document.createElement('canvas')
  c.width = CARD_W
  c.height = CARD_H
  const ctx = c.getContext('2d')!
  const W = CARD_W, H = CARD_H, cx = W / 2

  // Ground + a faint warm glow behind the title.
  ctx.fillStyle = INK
  ctx.fillRect(0, 0, W, H)
  const glow = ctx.createRadialGradient(cx, 760, 40, cx, 760, 760)
  glow.addColorStop(0, alpha(GOLD, 0.07))
  glow.addColorStop(1, alpha(GOLD, 0))
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, W, H)

  // Stars, seeded by the code so each card is a little different.
  const rand = mulberry32(seedFrom(code))
  for (let i = 0; i < 170; i++) {
    const big = rand() > 0.9
    ctx.fillStyle = alpha(TEXT, 0.15 + rand() * 0.5)
    ctx.beginPath()
    ctx.arc(rand() * W, rand() * H, big ? 1.8 + rand() * 1.2 : 0.7 + rand() * 1.1, 0, Math.PI * 2)
    ctx.fill()
  }
  // Orbit arcs.
  ctx.strokeStyle = alpha(TEXT, 0.1)
  ctx.lineWidth = 1.2
  ctx.beginPath(); ctx.arc(W + 40, -60, 460, 0, Math.PI * 2); ctx.stroke()
  ctx.setLineDash([3, 12])
  ctx.beginPath(); ctx.arc(W + 40, -60, 600, 0, Math.PI * 2); ctx.stroke()
  ctx.setLineDash([])
  ctx.beginPath(); ctx.arc(-80, H + 40, 520, 0, Math.PI * 2); ctx.stroke()

  // Double hairline frame with star corners.
  ctx.strokeStyle = alpha(GOLD, 0.6)
  ctx.lineWidth = 2
  ctx.strokeRect(48, 48, W - 96, H - 96)
  ctx.strokeStyle = alpha(GOLD, 0.25)
  ctx.lineWidth = 1
  ctx.strokeRect(64, 64, W - 128, H - 128)
  for (const [x, y] of [[48, 48], [W - 48, 48], [48, H - 48], [W - 48, H - 48]]) {
    ctx.fillStyle = INK
    ctx.fillRect(x - 16, y - 16, 32, 32)
    sparkle(ctx, x, y, 28, GOLD)
  }

  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'

  // Masthead.
  ctx.fillStyle = MUTED
  ctx.font = `500 28px ${BODY}`
  spaced(ctx, 7)
  ctx.fillText(`${PARTY.guestOfHonour}'s birthday`.toUpperCase(), cx, 190)
  spaced(ctx, 0)
  ctx.fillStyle = GOLD
  ctx.font = `italic 600 150px ${DISPLAY}`
  ctx.fillText(PARTY.title, cx, 330)

  // Rule.
  ctx.strokeStyle = alpha(GOLD, 0.5)
  ctx.lineWidth = 1.5
  ctx.beginPath(); ctx.moveTo(250, 412); ctx.lineTo(cx - 34, 412); ctx.moveTo(cx + 34, 412); ctx.lineTo(W - 250, 412); ctx.stroke()
  sparkle(ctx, cx, 412, 26, GOLD)

  // Title, shrunk until it fits in three lines.
  ctx.fillStyle = MUTED
  ctx.font = `500 28px ${BODY}`
  spaced(ctx, 7)
  ctx.fillText('THE STARS SAY I AM', cx, 540)
  spaced(ctx, 0)
  let size = 128
  let lines: string[] = []
  for (; size >= 72; size -= 8) {
    ctx.font = `italic 600 ${size}px ${DISPLAY}`
    lines = wrap(ctx, title, 880)
    if (lines.length <= 3 && lines.every((l) => ctx.measureText(l).width <= 900)) break
  }
  lines = lines.slice(0, 4)
  ctx.fillStyle = TEXT
  const lh = size * 1.04
  const titleTop = 600
  const blockH = lh * lines.length
  const titleY = titleTop + Math.max(0, (420 - blockH) / 2) + size * 0.82
  lines.forEach((l, i) => ctx.fillText(l, cx, titleY + i * lh))

  // Placements.
  const rowsTop = 1090
  const rowH = 180
  const left = 190
  PLACEMENTS.forEach((p, i) => {
    const sin = SINS[placements[p]]
    const y = rowsTop + i * rowH
    if (i > 0) {
      ctx.strokeStyle = alpha(TEXT, 0.12)
      ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(left, y); ctx.lineTo(W - left, y); ctx.stroke()
    }
    glyph(ctx, p, left, y + 50, 76, sin.accent)
    ctx.textAlign = 'left'
    ctx.fillStyle = MUTED
    ctx.font = `500 26px ${BODY}`
    spaced(ctx, 6)
    ctx.fillText(`${PLACEMENT_META[p].name} · ${PLACEMENT_META[p].tagline}`.toUpperCase(), left + 116, y + 66)
    spaced(ctx, 0)
    ctx.fillStyle = sin.accent
    ctx.font = `600 92px ${DISPLAY}`
    ctx.fillText(sin.name, left + 116, y + 150)
    const nameW = ctx.measureText(sin.name).width
    ctx.font = `60px ${BODY}`
    ctx.fillText(sin.emoji, left + 116 + nameW + 24, y + 144)
    ctx.textAlign = 'center'
  })

  // Footer.
  ctx.fillStyle = MUTED
  ctx.font = `500 26px ${BODY}`
  spaced(ctx, 6)
  ctx.fillText('FIND YOUR SINS', cx, 1730)
  spaced(ctx, 1)
  ctx.fillStyle = GOLD
  ctx.font = `500 30px ${BODY}`
  ctx.fillText(url, cx, 1782)
  spaced(ctx, 0)

  return c
}

export function canvasToBlob(c: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) => {
    try { c.toBlob((b) => resolve(b), 'image/png') } catch { resolve(null) }
  })
}

export type ShareOutcome = 'shared' | 'downloaded' | 'cancelled' | 'failed'

/**
 * Share a ready-made PNG via the Web Share API (files) when the device supports it,
 * otherwise download it. Call this straight from a click handler with a pre-rendered
 * blob so iOS still counts it as a user gesture.
 */
export async function shareOrDownload(blob: Blob, filename: string, text: string): Promise<ShareOutcome> {
  const file = new File([blob], filename, { type: 'image/png' })
  try {
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], title: PARTY.title, text })
      return 'shared'
    }
  } catch (e) {
    if ((e as Error)?.name === 'AbortError') return 'cancelled'
    // Fall through to download (e.g. NotAllowedError when the gesture expired).
  }
  try {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    setTimeout(() => URL.revokeObjectURL(url), 4000)
    return 'downloaded'
  } catch { return 'failed' }
}
