import { useState } from 'preact/hooks'
import { PARTY, PLACEMENTS, PLACEMENT_META, SIN_IDS, SINS, STATEMENTS } from '../../content'
import { decodeResult, titleFor } from '../../engine'
import { href, navigate } from '../../router'
import { loadMyResult, loadSession, saveSession } from '../../storage'
import { GlyphTriad, PlacementGlyph, Rule } from '../components/Glyphs'

export function Intro() {
  const [session, setSession] = useState(loadSession)
  const mine = loadMyResult()
  const mineR = mine ? decodeResult(mine) : null
  const answered = session ? Object.keys(session.answers).length : 0
  const inProgress = session !== null && answered > 0

  const startOver = () => {
    saveSession(null)
    setSession(null)
    navigate(href.quiz())
  }

  return (
    <main class="intro page-enter">
      <header class="masthead">
        <GlyphTriad size={22} />
        <p class="kicker masthead__kicker">{PARTY.guestOfHonour}'s birthday · a reading in three parts</p>
        <h1 class="masthead__title">{PARTY.title}</h1>
        <ul class="masthead__sins" aria-label="The seven sins">
          {SIN_IDS.map((s) => (
            <li key={s} style={{ color: SINS[s].accent }}>{SINS[s].latin}</li>
          ))}
        </ul>
      </header>

      <p class="intro__lede">{PARTY.intro}</p>

      <div class="intro__cta">
        <a class="btn btn--primary btn--wide" href={href.quiz()}>
          {inProgress ? `Continue · ${answered} of ${STATEMENTS.length}` : 'Begin'}
        </a>
        {inProgress && (
          <button type="button" class="textbtn" onClick={startOver}>Start over</button>
        )}
        <p class="intro__meta">{STATEMENTS.length} statements · about 10 minutes · no wrong answers</p>
      </div>

      {mine && mineR && (
        <a class="saved" href={href.result(mine)}>
          <span class="kicker">Your last reading</span>
          <span class="saved__title">{titleFor(mineR)}</span>
          <span class="saved__go" aria-hidden="true">→</span>
        </a>
      )}

      <Rule />

      <section class="howto" aria-labelledby="howto-h">
        <h2 id="howto-h" class="section-title">How to read your chart</h2>
        <ol class="howto__list">
          {PLACEMENTS.map((p) => (
            <li key={p} class="howto__item">
              <PlacementGlyph placement={p} size={30} class="howto__glyph" />
              <div>
                <p class="howto__name">{PLACEMENT_META[p].name} <span>· {PLACEMENT_META[p].tagline}</span></p>
                <p class="howto__desc">{PLACEMENT_META[p].description}</p>
              </div>
            </li>
          ))}
        </ol>
        <p class="howto__note">Answer on instinct. Rate each statement from disagree to agree; the bigger the circle, the stronger you feel.</p>
      </section>
    </main>
  )
}
