import { useRef, useState } from 'preact/hooks'
import type { Likert as LikertValue } from '../../content'
import { mix } from '../lib/color'

export const SCALE: LikertValue[] = [-3, -2, -1, 0, 1, 2, 3]

const LABELS: Record<LikertValue, string> = {
  [-3]: 'Strongly disagree',
  [-2]: 'Disagree',
  [-1]: 'Slightly disagree',
  0: 'Neutral',
  1: 'Slightly agree',
  2: 'Agree',
  3: 'Strongly agree',
}

/** Circle diameters (px at the base scale): biggest at the ends, smallest in the middle. */
const SIZE: Record<number, number> = { 3: 44, 2: 36, 1: 29, 0: 22 }

const DISAGREE = '#9fb0d8'
const AGREE = '#e8c468'
const NEUTRAL = '#6e6a7c'

export function likertColour(v: LikertValue): string {
  if (v === 0) return NEUTRAL
  return mix(NEUTRAL, v < 0 ? DISAGREE : AGREE, Math.abs(v) / 3)
}

interface Props {
  labelledBy: string
  /** The value currently picked (shown filled). */
  value: LikertValue | null
  /** A previous answer to hint at after going back (shown as a ring). */
  previous?: LikertValue | null
  disabled?: boolean
  onPick: (v: LikertValue) => void
}

/**
 * 16personalities-style 7-point scale. A radiogroup with a roving tab stop:
 * arrows move focus, Enter/Space (or a tap) selects. Number keys 1–7 are handled
 * by the quiz screen so they work without focusing the group first.
 */
export function Likert({ labelledBy, value, previous, disabled, onPick }: Props) {
  const [focusIdx, setFocusIdx] = useState(() => SCALE.indexOf(value ?? previous ?? 0))
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  const move = (to: number) => {
    const i = Math.max(0, Math.min(SCALE.length - 1, to))
    setFocusIdx(i)
    refs.current[i]?.focus()
  }

  const onKeyDown = (e: KeyboardEvent, i: number) => {
    switch (e.key) {
      case 'ArrowRight': case 'ArrowDown': e.preventDefault(); move(i + 1); break
      case 'ArrowLeft': case 'ArrowUp': e.preventDefault(); move(i - 1); break
      case 'Home': e.preventDefault(); move(0); break
      case 'End': e.preventDefault(); move(SCALE.length - 1); break
    }
  }

  return (
    <div class="likert">
      <div class="likert__row" role="radiogroup" aria-labelledby={labelledBy}>
        {SCALE.map((v, i) => {
          const checked = value === v
          return (
            <button
              key={v}
              ref={(el) => { refs.current[i] = el }}
              type="button"
              role="radio"
              aria-checked={checked}
              aria-label={`${LABELS[v]} (${i + 1})`}
              tabIndex={i === focusIdx ? 0 : -1}
              class={`likert__opt${checked ? ' is-checked' : ''}${previous === v && !checked ? ' is-previous' : ''}`}
              style={{ '--c': likertColour(v), '--d': SIZE[Math.abs(v)] }}
              aria-disabled={disabled || undefined}
              onClick={() => { if (!disabled) { setFocusIdx(i); onPick(v) } }}
              onKeyDown={(e) => onKeyDown(e, i)}
            >
              <span class="likert__dot" />
            </button>
          )
        })}
      </div>
      <div class="likert__ends" aria-hidden="true">
        <span style={{ color: DISAGREE }}>Disagree</span>
        <span style={{ color: AGREE }}>Agree</span>
      </div>
    </div>
  )
}
