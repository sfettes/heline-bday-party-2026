import type { Placement } from '../../content'
import { mulberry32 } from '../../engine/rng'

/** Fine-line celestial ornaments. All inline SVG, stroked in currentColor. */

type GlyphProps = { size?: number; class?: string; title?: string }

function svgA11y(title?: string) {
  return title ? { role: 'img' as const, 'aria-label': title } : { 'aria-hidden': true as const }
}

export const SPARKLE_PATH =
  'M12 1.5C12.5 8.4 15.6 11.5 22.5 12C15.6 12.5 12.5 15.6 12 22.5C11.5 15.6 8.4 12.5 1.5 12C8.4 11.5 11.5 8.4 12 1.5Z'

export function Sparkle({ size = 12, class: cls, title }: GlyphProps) {
  return (
    <svg class={cls} width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...svgA11y(title)}>
      <path d={SPARKLE_PATH} />
    </svg>
  )
}

export function SunGlyph({ size = 24, class: cls, title }: GlyphProps) {
  return (
    <svg class={cls} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.15" stroke-linecap="round" {...svgA11y(title)}>
      <circle cx="12" cy="12" r="5.2" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i * Math.PI) / 4
        const r1 = i % 2 ? 7.6 : 7.4, r2 = i % 2 ? 9.4 : 11
        return <line key={i} x1={12 + r1 * Math.cos(a)} y1={12 + r1 * Math.sin(a)} x2={12 + r2 * Math.cos(a)} y2={12 + r2 * Math.sin(a)} />
      })}
    </svg>
  )
}

export function MoonGlyph({ size = 24, class: cls, title }: GlyphProps) {
  return (
    <svg class={cls} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.15" stroke-linejoin="round" {...svgA11y(title)}>
      <path d="M15.2 3.6A8.6 8.6 0 1 0 20.4 16.3A7 7 0 0 1 15.2 3.6Z" />
      <path d="M19.5 5.2l.35 1 1 .35-1 .35-.35 1-.35-1-1-.35 1-.35z" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function RisingGlyph({ size = 24, class: cls, title }: GlyphProps) {
  return (
    <svg class={cls} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.15" stroke-linecap="round" stroke-linejoin="round" {...svgA11y(title)}>
      <path d="M2.5 18.5h19" />
      <path d="M6.5 18.5a5.5 5.5 0 0 1 11 0" />
      <path d="M12 11V2.8M9.2 5.6 12 2.8l2.8 2.8" />
      <path d="M5 21.2h14" opacity=".45" />
    </svg>
  )
}

export function PlacementGlyph({ placement, ...rest }: GlyphProps & { placement: Placement }) {
  if (placement === 'sun') return <SunGlyph {...rest} />
  if (placement === 'moon') return <MoonGlyph {...rest} />
  return <RisingGlyph {...rest} />
}

/** Thin horizontal rule with a centred star; the house divider. */
export function Rule({ class: cls }: { class?: string }) {
  return (
    <div class={`rule ${cls ?? ''}`} aria-hidden="true">
      <span class="rule__line" />
      <Sparkle size={10} />
      <span class="rule__line" />
    </div>
  )
}

/** The three placement glyphs in a row, used as a masthead ornament. */
export function GlyphTriad({ size = 22 }: { size?: number }) {
  return (
    <div class="triad" aria-hidden="true">
      <SunGlyph size={size} />
      <span class="triad__dot" />
      <MoonGlyph size={size} />
      <span class="triad__dot" />
      <RisingGlyph size={size} />
    </div>
  )
}

/** Fixed background: a seeded field of pinprick stars and two faint orbit arcs. */
const STARS = (() => {
  const rand = mulberry32(1218)
  return Array.from({ length: 110 }, (_, i) => ({
    x: rand() * 1000,
    y: rand() * 1600,
    r: rand() < 0.88 ? 0.5 + rand() * 0.9 : 1.4 + rand() * 0.6,
    o: 0.18 + rand() * 0.5,
    twinkle: i % 9 === 0,
    delay: (rand() * 6).toFixed(2),
  }))
})()

export function Starfield() {
  return (
    <div class="starfield" aria-hidden="true">
      <svg viewBox="0 0 1000 1600" preserveAspectRatio="xMidYMin slice" width="100%" height="100%">
        <g fill="none" stroke="currentColor" stroke-width="0.6" opacity="0.16">
          <circle cx="980" cy="-40" r="300" />
          <circle cx="980" cy="-40" r="420" stroke-dasharray="2 7" />
          <circle cx="-60" cy="1500" r="360" />
        </g>
        <g fill="currentColor">
          {STARS.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={s.r} opacity={s.o} class={s.twinkle ? 'twinkle' : undefined} style={s.twinkle ? { animationDelay: `${s.delay}s` } : undefined} />
          ))}
        </g>
        <g fill="currentColor" opacity="0.55">
          <path d={SPARKLE_PATH} transform="translate(842 212) scale(0.7)" />
          <path d={SPARKLE_PATH} transform="translate(96 690) scale(0.5)" />
          <path d={SPARKLE_PATH} transform="translate(760 1210) scale(0.6)" />
        </g>
      </svg>
    </div>
  )
}

/** Four tiny stars pinned to the corners of a framed panel. */
export function FrameCorners() {
  return (
    <>
      {(['tl', 'tr', 'bl', 'br'] as const).map((c) => (
        <span key={c} class={`frame__corner frame__corner--${c}`} aria-hidden="true">
          <Sparkle size={9} />
        </span>
      ))}
    </>
  )
}
