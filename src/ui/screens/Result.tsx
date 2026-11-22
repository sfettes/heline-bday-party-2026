import { useEffect, useRef, useState } from 'preact/hooks'
import { BIRTH_ORDER, CONTRADICTIONS, FIGURES, GROWTH, PARTY, PLACEMENTS, PLACEMENT_META, SINS, WRITEUPS, type Placement, type SinId } from '../../content'
import { decodeResult, titleFor, type ResultCode } from '../../engine'
import { href } from '../../router'
import { loadMyResult } from '../../storage'
import { FrameCorners, PlacementGlyph, Rule, Sparkle } from '../components/Glyphs'
import { StrengthBars } from '../components/StrengthBars'
import { TopBar } from '../components/TopBar'
import { absoluteUrl, copyText, prettyUrl } from '../lib/links'
import { loadMyScores, type Strengths } from '../lib/myScores'
import { canvasToBlob, drawShareCard, shareOrDownload } from '../lib/shareCard'
import { NotFound } from './NotFound'
import { PostToWall } from '../../wall/PostToWall'

const NUMERALS: Record<Placement, string> = { sun: 'I', moon: 'II', rising: 'III' }

export function Result({ code }: { code: string }) {
  const r = decodeResult(code)
  if (!r) return <NotFound />
  return <ResultView code={code} r={r} />
}

function ResultView({ code, r }: { code: string; r: ResultCode }) {
  const mine = loadMyResult()
  const isMine = mine === code
  const strengths = isMine ? loadMyScores(code) : null
  const title = titleFor(r)
  const contradiction = CONTRADICTIONS[`${r.sun}:${r.moon}`]

  return (
    <main class="result page-enter">
      <TopBar>
        {!isMine && !mine && <a class="topbar__link" href={href.quiz()}>Take the quiz</a>}
        {isMine && <span class="topbar__note">Your reading</span>}
      </TopBar>

      {/* Hero: the title as a framed tarot-style card. */}
      <header class="hero frame">
        <FrameCorners />
        <p class="kicker hero__kicker">{isMine ? 'The stars have spoken. You are' : 'Their reading'}</p>
        <h1 class="hero__title">{title}</h1>
        <Rule />
        <ul class="triplet" aria-label="Placements">
          {PLACEMENTS.map((p) => {
            const sin = SINS[r[p]]
            return (
              <li key={p} class="triplet__item" style={{ '--sin': sin.accent }}>
                <PlacementGlyph placement={p} size={28} class="triplet__glyph" />
                <span class="triplet__label">{PLACEMENT_META[p].name}</span>
                <span class="triplet__sin">
                  <span aria-hidden="true">{sin.emoji}</span> {sin.name}
                </span>
              </li>
            )
          })}
        </ul>
      </header>

      <Actions code={code} r={r} title={title} mine={mine} isMine={isMine} />

      {contradiction && (
        <section class="contradiction" aria-labelledby="contra-h">
          <p class="kicker" id="contra-h">The central contradiction</p>
          <p class="contradiction__pair">
            <span style={{ color: SINS[r.sun].accent }}>{SINS[r.sun].name} Sun</span>
            <span class="contradiction__vs">against</span>
            <span style={{ color: SINS[r.moon].accent }}>{SINS[r.moon].name} Moon</span>
          </p>
          <blockquote class="contradiction__quote">{contradiction}</blockquote>
        </section>
      )}

      {PLACEMENTS.map((p) => (
        <PlacementSection key={p} placement={p} sin={r[p]} strengths={strengths} />
      ))}

      {r.birthOrder && (
        <section class="birth">
          <Rule />
          <p class="kicker">{BIRTH_ORDER.labels[r.birthOrder]} · with a {SINS[r.sun].name} Sun</p>
          <p class="birth__line">{BIRTH_ORDER.lines[r.birthOrder][r.sun]}</p>
        </section>
      )}

      <footer class="outro">
        <Rule />
        <p class="outro__text">{PARTY.outro}</p>
        <div class="outro__links">
          {isMine ? <a href={href.quiz()}>Take it again</a> : <a href={href.quiz()}>{mine ? 'Retake the quiz' : 'Find your own sins'}</a>}
          <span aria-hidden="true">·</span>
          <a href={href.intro()}>Home</a>
        </div>
        <p class="outro__code">Result code <code>{code}</code></p>
      </footer>
    </main>
  )
}

function PlacementSection({ placement, sin, strengths }: { placement: Placement; sin: SinId; strengths: Strengths | null }) {
  const meta = PLACEMENT_META[placement]
  const s = SINS[sin]
  const w = WRITEUPS.find((x) => x.placement === placement && x.sin === sin)
  const figs = FIGURES.find((x) => x.placement === placement && x.sin === sin)?.figures ?? []
  const g = GROWTH.find((x) => x.placement === placement && x.sin === sin)
  const id = `pl-${placement}`

  return (
    <section class="placement" aria-labelledby={id} style={{ '--sin': s.accent }}>
      <header class="placement__head">
        <span class="placement__num" aria-hidden="true">{NUMERALS[placement]}</span>
        <PlacementGlyph placement={placement} size={34} class="placement__glyph" />
        <div>
          <p class="kicker">{meta.tagline}</p>
          <h2 id={id} class="placement__title">
            {meta.name} in <em>{s.name}</em>
          </h2>
        </div>
      </header>
      <p class="placement__desc">{meta.description}</p>

      {w && (
        <>
          <p class="placement__headline">{w.headline}</p>
          <p class="placement__body">{w.body}</p>
          <div class="ls">
            <div class="ls__col">
              <h3 class="ls__h"><Sparkle size={10} /> In the light</h3>
              <ul class="ls__list">{w.light.map((x, i) => <li key={i}>{x}</li>)}</ul>
            </div>
            <div class="ls__col ls__col--shadow">
              <h3 class="ls__h"><MoonDot /> In the shadow</h3>
              <ul class="ls__list">{w.shadow.map((x, i) => <li key={i}>{x}</li>)}</ul>
            </div>
          </div>
        </>
      )}

      {strengths && <StrengthBars strength={strengths[placement]} winner={sin} label={`Your ${meta.name} across all seven`} />}

      {figs.length > 0 && (
        <div class="figures">
          <h3 class="subhead">In good company</h3>
          <ul class="figures__list">
            {figs.map((f, i) => (
              <li key={i} class="figure">
                <p class="figure__name">{f.name} <span class="figure__src">{f.source}</span></p>
                <p class="figure__why">{f.why}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {g && (
        <div class="growth">
          <h3 class="subhead">Toward {s.virtue.toLowerCase()}</h3>
          <p class="growth__q">{g.question}</p>
          <ul class="growth__list">{g.practices.map((x, i) => <li key={i}>{x}</li>)}</ul>
          <p class="growth__power"><span class="growth__tag">Power move</span> {g.powerMove}</p>
        </div>
      )}
    </section>
  )
}

function MoonDot() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M15.2 3.6A8.6 8.6 0 1 0 20.4 16.3A7 7 0 0 1 15.2 3.6Z" />
    </svg>
  )
}

/** Share card + compatibility actions. The card is pre-rendered so tapping Share stays a direct user gesture. */
function Actions({ code, r, title, mine, isMine }: { code: string; r: ResultCode; title: string; mine: string | null; isMine: boolean }) {
  const [blob, setBlob] = useState<Blob | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [status, setStatus] = useState('')
  const statusTimer = useRef<number | undefined>(undefined)

  const flash = (msg: string) => {
    setStatus(msg)
    window.clearTimeout(statusTimer.current)
    statusTimer.current = window.setTimeout(() => setStatus(''), 3200)
  }

  useEffect(() => {
    let alive = true
    let url: string | null = null
    drawShareCard({ code, placements: r, title, url: prettyUrl(absoluteUrl('')) })
      .then(canvasToBlob)
      .then((b) => {
        if (!alive || !b) return
        setBlob(b)
        url = URL.createObjectURL(b)
        setPreview(url)
      })
      .catch(() => {})
    return () => { alive = false; if (url) URL.revokeObjectURL(url); window.clearTimeout(statusTimer.current) }
  }, [code])

  const share = async () => {
    let b = blob
    if (!b) {
      flash('Drawing your card…')
      b = await drawShareCard({ code, placements: r, title, url: prettyUrl(absoluteUrl('')) }).then(canvasToBlob)
    }
    if (!b) return flash('Sorry, your browser could not draw the card.')
    const out = await shareOrDownload(b, `sinners-${code}.png`, `${title}. ${absoluteUrl(href.result(code))}`)
    if (out === 'downloaded') flash('Card saved to your downloads.')
    else if (out === 'failed') flash('Sorry, sharing failed. Try a screenshot instead.')
  }

  const copyLink = async () => {
    const ok = await copyText(absoluteUrl(href.result(code)))
    flash(ok ? 'Link copied. Send it to a friend; when they open it, they can compare.' : 'Copy failed. The link is in your address bar.')
  }

  return (
    <section class="actions" aria-label="Share and compare">
      {preview && (
        <figure class="cardpreview">
          <img src={preview} alt={`Share card: ${title}`} width={540} height={960} />
        </figure>
      )}
      <div class="actions__btns">
        {!isMine && mine && (
          <a class="btn btn--primary" href={href.compare(mine, code)}>Compare with mine</a>
        )}
        <button type="button" class={`btn${!isMine && mine ? '' : ' btn--primary'}`} onClick={share}>
          Share the card
        </button>
        {isMine && (
          <button type="button" class="btn" onClick={copyLink}>Compare with a friend</button>
        )}
        {!isMine && !mine && <a class="btn" href={href.quiz()}>Take the quiz</a>}
      </div>
      <p class="actions__status" role="status" aria-live="polite">{status}</p>
      {isMine && <PostToWall code={code} />}
    </section>
  )
}
