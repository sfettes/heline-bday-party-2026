import { useEffect, useRef, useState } from 'preact/hooks'
import type { RefObject } from 'preact'
import { BIRTH_ORDER, BIRTH_ORDERS, PLACEMENT_META, STATEMENTS, TIEBREAKERS, type BirthOrder, type Likert as LikertValue, type SinId } from '../../content'
import { answerBirthOrder, answerStatement, answerTiebreak, currentStep, newSession, undo, type QuizResult, type Session, type Step } from '../../engine'
import { href, navigate } from '../../router'
import { loadName, loadSession, saveMyResult, saveName, saveSession } from '../../storage'
import { PlacementGlyph, Sparkle } from '../components/Glyphs'
import { Likert, SCALE } from '../components/Likert'
import { saveMyScores } from '../lib/myScores'

const ROMAN = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii']
const NAME_MAX = 24

function reducedMotion(): boolean {
  try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches } catch { return false }
}

/** A saved session is only usable if it was built from the current statement set. */
function restore(): Session {
  const s = loadSession()
  const ids = new Set(STATEMENTS.map((x) => x.id))
  if (s && s.order.length === ids.size && s.order.every((id) => ids.has(id))) return s
  return newSession()
}

function stepKey(step: Step): string {
  switch (step.kind) {
    case 'statement': return `s:${step.statement.id}`
    case 'tiebreak': return `t:${step.placement}`
    default: return step.kind
  }
}

export function Quiz() {
  const [session, setSession] = useState<Session>(restore)
  const [picked, setPicked] = useState<string | null>(null) // "stepKey|value" while the advance animation plays
  const [previous, setPrevious] = useState<{ id: string; v: LikertValue } | null>(null)
  const timer = useRef<number | undefined>(undefined)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const firstRender = useRef(true)

  useEffect(() => saveSession(session), [session])
  useEffect(() => () => window.clearTimeout(timer.current), [])

  const step = currentStep(session)
  const key = stepKey(step)

  // Move focus to the new prompt so screen readers announce it (skip on first paint).
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return }
    headingRef.current?.focus({ preventScroll: true })
  }, [key])

  /** Show the pick briefly, then commit it (auto-advance). */
  const commit = (token: string, apply: (s: Session) => Session) => {
    if (picked) return
    setPicked(token)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      setPicked(null)
      setPrevious(null)
      setSession((s) => apply(s))
    }, reducedMotion() ? 80 : 240)
  }

  const back = () => {
    window.clearTimeout(timer.current)
    setPicked(null)
    const last = session.history[session.history.length - 1]
    if (last?.kind === 'statement') {
      const v = session.answers[last.id]
      setPrevious(v === undefined ? null : { id: last.id, v })
    } else setPrevious(null)
    setSession(undo(session))
  }

  const finish = (result: QuizResult, name: string) => {
    saveName(name)
    saveMyResult(result.code)
    saveMyScores(result.code, result.scores)
    saveSession(null)
    navigate(href.result(result.code))
  }

  // Number keys answer whatever is on screen.
  const keyHandler = useRef<(e: KeyboardEvent) => void>(() => {})
  keyHandler.current = (e: KeyboardEvent) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return
    const t = e.target as HTMLElement | null
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return
    const n = Number(e.key)
    if (!Number.isInteger(n) || n < 1) return
    if (step.kind === 'statement' && n <= 7) {
      e.preventDefault()
      const v = SCALE[n - 1]
      commit(`${key}|${v}`, (s) => answerStatement(s, step.statement.id, v))
    } else if (step.kind === 'tiebreak' && n <= step.sins.length) {
      e.preventDefault()
      const sin = step.sins[n - 1]
      commit(`${key}|${sin}`, (s) => answerTiebreak(s, step.placement, sin))
    } else if (step.kind === 'birthOrder' && n <= BIRTH_ORDERS.length) {
      e.preventDefault()
      const b = BIRTH_ORDERS[n - 1]
      commit(`${key}|${b}`, (s) => answerBirthOrder(s, b))
    }
  }
  useEffect(() => {
    const on = (e: KeyboardEvent) => keyHandler.current(e)
    window.addEventListener('keydown', on)
    return () => window.removeEventListener('keydown', on)
  }, [])

  const total = session.order.length
  const answered = Object.keys(session.answers).length
  const isPick = (v: string) => picked === `${key}|${v}`
  const busy = picked !== null

  let counter: string
  if (step.kind === 'statement') counter = `${step.index + 1} / ${step.total}`
  else if (step.kind === 'tiebreak') counter = 'Tiebreak'
  else if (step.kind === 'birthOrder') counter = 'Bonus'
  else counter = 'Last step'

  return (
    <main class="quiz">
      <header class="quiz__bar">
        <button type="button" class="iconbtn" onClick={back} disabled={session.history.length === 0} aria-label="Back to the previous question">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
          <span>Back</span>
        </button>
        <a class="wordmark wordmark--small" href={href.intro()} aria-label="Sinners home">
          <Sparkle size={9} /> Sinners
        </a>
        <span class="quiz__count" aria-live="polite">{counter}</span>
      </header>
      <div class="progress" role="progressbar" aria-label="Quiz progress" aria-valuemin={0} aria-valuemax={total} aria-valuenow={answered}>
        <span class="progress__fill" style={{ transform: `scaleX(${step.kind === 'statement' ? answered / total : 1})` }} />
      </div>

      <section key={key} class={`quiz__step${busy ? ' is-leaving' : ''}`}>
        {step.kind === 'statement' && (
          <>
            <p class="kicker quiz__kicker">How true is this of you?</p>
            <h1 id="q-prompt" ref={headingRef} tabIndex={-1} class="quiz__statement">{step.statement.text}</h1>
            <Likert
              key={step.statement.id}
              labelledBy="q-prompt"
              value={picked?.startsWith(`${key}|`) ? (Number(picked.split('|')[1]) as LikertValue) : null}
              previous={previous?.id === step.statement.id ? previous.v : null}
              disabled={busy}
              onPick={(v) => commit(`${key}|${v}`, (s) => answerStatement(s, step.statement.id, v))}
            />
            <p class="quiz__hint">Use keys 1–7, or tap a circle.</p>
          </>
        )}

        {step.kind === 'tiebreak' && (
          <TiebreakStep
            placement={step.placement}
            sins={step.sins}
            headingRef={headingRef}
            isPick={isPick}
            onPick={(sin) => commit(`${key}|${sin}`, (s) => answerTiebreak(s, step.placement, sin))}
          />
        )}

        {step.kind === 'birthOrder' && (
          <>
            <p class="kicker quiz__kicker"><Sparkle size={9} /> Bonus round</p>
            <h1 id="q-prompt" ref={headingRef} tabIndex={-1} class="quiz__statement quiz__statement--sm">{BIRTH_ORDER.question}</h1>
            <div class="choices choices--grid" role="radiogroup" aria-labelledby="q-prompt">
              {BIRTH_ORDERS.map((b: BirthOrder, i) => (
                <button key={b} type="button" role="radio" aria-checked={isPick(b)} class={`choice${isPick(b) ? ' is-checked' : ''}`}
                  onClick={() => commit(`${key}|${b}`, (s) => answerBirthOrder(s, b))}>
                  <span class="choice__mark">{ROMAN[i]}</span>
                  <span class="choice__text">{BIRTH_ORDER.labels[b]}</span>
                </button>
              ))}
            </div>
            <button type="button" class="textbtn quiz__skip" onClick={() => commit(`${key}|skip`, (s) => answerBirthOrder(s, null))}>
              Skip this one
            </button>
          </>
        )}

        {step.kind === 'done' && <NameStep headingRef={headingRef} onDone={(name) => finish(step.result, name)} />}
      </section>
    </main>
  )
}

function TiebreakStep({ placement, sins, headingRef, isPick, onPick }: {
  placement: keyof typeof PLACEMENT_META
  sins: SinId[]
  headingRef: RefObject<HTMLHeadingElement | null>
  isPick: (v: string) => boolean
  onPick: (sin: SinId) => void
}) {
  const set = TIEBREAKERS.find((t) => t.placement === placement)
  const meta = PLACEMENT_META[placement]
  return (
    <>
      <p class="kicker quiz__kicker">
        <PlacementGlyph placement={placement} size={16} /> Your {meta.name} is split
      </p>
      <h1 id="q-prompt" ref={headingRef} tabIndex={-1} class="quiz__statement quiz__statement--sm">
        {set?.prompt ?? 'Which sounds more like you?'}
      </h1>
      <p class="quiz__sub">Pick the one that fits best. No wrong answers, only revealing ones.</p>
      {/* Sin names are deliberately never shown here. */}
      <div class="choices" role="radiogroup" aria-labelledby="q-prompt">
        {sins.map((sin, i) => (
          <button key={sin} type="button" role="radio" aria-checked={isPick(sin)} class={`choice${isPick(sin) ? ' is-checked' : ''}`} onClick={() => onPick(sin)}>
            <span class="choice__mark">{ROMAN[i]}</span>
            <span class="choice__text">{set?.options[sin] ?? '…'}</span>
          </button>
        ))}
      </div>
    </>
  )
}

function NameStep({ headingRef, onDone }: { headingRef: RefObject<HTMLHeadingElement | null>; onDone: (name: string) => void }) {
  const [name, setName] = useState(loadName)
  const clean = name.replace(/\s+/g, ' ').trim().slice(0, NAME_MAX)
  return (
    <form class="namestep" onSubmit={(e) => { e.preventDefault(); onDone(clean) }}>
      <p class="kicker quiz__kicker"><Sparkle size={9} /> The stars have decided</p>
      <h1 id="q-prompt" ref={headingRef} tabIndex={-1} class="quiz__statement quiz__statement--sm">Before the reveal, sign the guest book.</h1>
      <label class="field">
        <span class="field__label">First name or nickname</span>
        <input
          class="field__input"
          type="text"
          name="name"
          autoComplete="given-name"
          autoCapitalize="words"
          enterKeyHint="go"
          maxLength={NAME_MAX}
          value={name}
          onInput={(e) => setName((e.target as HTMLInputElement).value)}
          placeholder="e.g. Heline"
        />
        <span class="field__help">It's how you'll appear on the party wall. Nothing else is shared.</span>
      </label>
      <div class="namestep__actions">
        <button type="submit" class="btn btn--primary">Reveal my sins</button>
        <button type="button" class="textbtn" onClick={() => onDone("")}>Stay anonymous</button>
      </div>
    </form>
  )
}
