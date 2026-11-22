import { BIRTH_ORDER, CONTRADICTIONS, PLACEMENTS, PLACEMENT_META, SINS, WRITEUPS } from '../../content'
import { decodeResult, titleFor } from '../../engine'
import { href } from '../../router'
import { loadMyResult } from '../../storage'
import { NotFound } from './NotFound'

// SKELETON — Agent D replaces (adds growth, figures, compat, share card, strength bars).
export function Result({ code }: { code: string }) {
  const r = decodeResult(code)
  if (!r) return <NotFound />
  const mine = loadMyResult()
  return (
    <main>
      <h1>{titleFor(r)}</h1>
      <p>{PLACEMENTS.map((p) => `${SINS[r[p]].emoji} ${SINS[r[p]].name} ${PLACEMENT_META[p].emoji}`).join(' · ')}</p>
      {PLACEMENTS.map((p) => {
        const w = WRITEUPS.find((x) => x.placement === p && x.sin === r[p])!
        return (
          <section key={p}>
            <h2>{PLACEMENT_META[p].name}: {SINS[r[p]].name}</h2>
            <p>{w.headline}</p>
            <p>{w.body}</p>
          </section>
        )
      })}
      <p>{CONTRADICTIONS[`${r.sun}:${r.moon}`]}</p>
      {r.birthOrder && <p>{BIRTH_ORDER.lines[r.birthOrder][r.sun]}</p>}
      {mine && mine !== code && <a href={href.compare(mine, code)}>Compare with mine</a>}
    </main>
  )
}
