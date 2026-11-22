import { COMPAT, PLACEMENTS, PLACEMENT_META, SIN_IDS, SINS, type PairKey, type SinId } from '../../content'
import { compatibility, decodeResult, titleFor, type ResultCode } from '../../engine'
import { href } from '../../router'
import { loadMyResult } from '../../storage'
import { FrameCorners, PlacementGlyph, Rule, Sparkle } from '../components/Glyphs'
import { TopBar } from '../components/TopBar'
import { NotFound } from './NotFound'

/** Notes are keyed by the pair sorted in SIN_IDS order. */
function noteKey(a: SinId, b: SinId): PairKey {
  return (SIN_IDS.indexOf(a) <= SIN_IDS.indexOf(b) ? `${a}:${b}` : `${b}:${a}`) as PairKey
}

export function Compare({ a, b }: { a: string; b: string }) {
  const ra = decodeResult(a), rb = decodeResult(b)
  if (!ra || !rb) return <NotFound />
  const c = compatibility(ra, rb)
  const mine = loadMyResult()
  const [nameA, nameB] = mine === a ? ['You', 'Them'] : mine === b ? ['Them', 'You'] : ['First', 'Second']

  return (
    <main class="compare page-enter">
      <TopBar />

      <header class="pair">
        <Person label={nameA} code={a} r={ra} />
        <div class="pair__x" aria-hidden="true"><span /><Sparkle size={14} /><span /></div>
        <Person label={nameB} code={b} r={rb} />
      </header>

      <section class="score frame" aria-labelledby="score-h">
        <FrameCorners />
        <p class="kicker" id="score-h">Compatibility</p>
        <p class="score__pct">{c.percent}<span>%</span></p>
        <p class="score__band">{c.band.label}</p>
        <p class="score__blurb">{c.band.blurb}</p>
      </section>

      <section class="breakdown" aria-labelledby="bd-h">
        <h2 id="bd-h" class="section-title">Placement by placement</h2>
        <ol class="breakdown__list">
          {PLACEMENTS.map((p) => {
            const sa = SINS[ra[p]], sb = SINS[rb[p]]
            const part = Math.round(c.parts[p] * 100)
            const note = COMPAT.matrices[p].notes[noteKey(ra[p], rb[p])]
            return (
              <li key={p} class="bd">
                <div class="bd__head">
                  <PlacementGlyph placement={p} size={22} class="bd__glyph" />
                  <span class="bd__name">{PLACEMENT_META[p].name}</span>
                  <span class="bd__weight">counts {Math.round(COMPAT.weights[p] * 100)}%</span>
                  <span class="bd__pct">{part}%</span>
                </div>
                <p class="bd__pair">
                  <span style={{ color: sa.accent }}><span aria-hidden="true">{sa.emoji}</span> {sa.name}</span>
                  <span class="bd__amp">&amp;</span>
                  <span style={{ color: sb.accent }}><span aria-hidden="true">{sb.emoji}</span> {sb.name}</span>
                </p>
                <span class="meter" aria-hidden="true">
                  <span class="meter__fill" style={{ width: `${part}%`, background: `linear-gradient(90deg, ${sa.accent}, ${sb.accent})` }} />
                </span>
                {note && <p class="bd__note">{note}</p>}
              </li>
            )
          })}
        </ol>
      </section>

      <section class="needs" aria-labelledby="needs-h">
        <h2 id="needs-h" class="section-title">What you each need</h2>
        <p class="needs__intro">Read from your Moons, the part you don't say out loud.</p>
        <div class="needs__grid">
          {([[nameA, ra], [nameB, rb]] as const).map(([label, r]) => {
            const s = SINS[r.moon]
            return (
              <div key={label} class="need" style={{ '--sin': s.accent }}>
                <p class="kicker">{label} · {s.name} Moon</p>
                <p class="need__text">{COMPAT.needs[r.moon]}</p>
              </div>
            )
          })}
        </div>
      </section>

      <footer class="outro">
        <Rule />
        <div class="outro__links">
          <a href={href.result(a)}>{nameA === 'You' ? 'Your' : `${nameA}'s`} reading</a>
          <span aria-hidden="true">·</span>
          <a href={href.result(b)}>{nameB === 'You' ? 'Your' : `${nameB}'s`} reading</a>
          {!mine && (<><span aria-hidden="true">·</span><a href={href.quiz()}>Take the quiz</a></>)}
        </div>
      </footer>
    </main>
  )
}

function Person({ label, code, r }: { label: string; code: string; r: ResultCode }) {
  return (
    <a class="person" href={href.result(code)}>
      <span class="kicker">{label}</span>
      <span class="person__title">{titleFor(r)}</span>
      <span class="person__sins">
        {PLACEMENTS.map((p) => (
          <span key={p} style={{ color: SINS[r[p]].accent }} title={`${PLACEMENT_META[p].name}: ${SINS[r[p]].name}`}>
            <PlacementGlyph placement={p} size={14} /> {SINS[r[p]].name}
          </span>
        ))}
      </span>
    </a>
  )
}
