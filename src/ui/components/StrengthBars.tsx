import { SIN_IDS, SINS, type SinId } from '../../content'

/** 16p-style bar list of all seven sins for one placement, winner first. */
export function StrengthBars({ strength, winner, label }: { strength: Record<SinId, number>; winner: SinId; label: string }) {
  const rows = [...SIN_IDS].sort((a, b) => (a === winner ? -1 : b === winner ? 1 : strength[b] - strength[a]))
  return (
    <figure class="bars">
      <figcaption class="bars__cap">{label}</figcaption>
      <ul class="bars__list">
        {rows.map((s) => {
          const v = Math.max(0, Math.min(100, Math.round(strength[s] ?? 0)))
          return (
            <li key={s} class={`bars__row${s === winner ? ' is-winner' : ''}`} style={{ '--sin': SINS[s].accent }}>
              <span class="bars__name">
                <span class="bars__emoji" aria-hidden="true">{SINS[s].emoji}</span>
                {SINS[s].name}
              </span>
              <span class="bars__track" aria-hidden="true">
                <span class="bars__fill" style={{ width: `${v}%` }} />
              </span>
              <span class="bars__val">{v}<span class="bars__pct">%</span></span>
            </li>
          )
        })}
      </ul>
    </figure>
  )
}
