import { useEffect, useState } from 'preact/hooks'
import { BIRTH_ORDER, BIRTH_ORDERS, SINS, TIEBREAKERS, type Likert } from '../../content'
import { answerBirthOrder, answerStatement, answerTiebreak, currentStep, newSession, undo, type Session } from '../../engine'
import { href, navigate } from '../../router'
import { loadSession, saveMyResult, saveSession } from '../../storage'

const SCALE: Likert[] = [-3, -2, -1, 0, 1, 2, 3]

// SKELETON — Agent D replaces the presentation; keep the engine calls.
export function Quiz() {
  const [session, setSession] = useState<Session>(() => loadSession() ?? newSession())
  useEffect(() => saveSession(session), [session])
  const step = currentStep(session)

  useEffect(() => {
    if (step.kind === 'done') {
      saveMyResult(step.result.code)
      saveSession(null)
      navigate(href.result(step.result.code))
    }
  }, [step.kind])

  return (
    <main>
      {session.history.length > 0 && <button onClick={() => setSession(undo(session))}>Back</button>}
      {step.kind === 'statement' && (
        <section>
          <p>{step.index + 1} / {step.total}</p>
          <h2>{step.statement.text}</h2>
          <div role="radiogroup" aria-label="Disagree to agree">
            {SCALE.map((v) => (
              <button key={v} role="radio" aria-checked={false} aria-label={`${v}`} onClick={() => setSession(answerStatement(session, step.statement.id, v))}>
                {v}
              </button>
            ))}
          </div>
        </section>
      )}
      {step.kind === 'tiebreak' && (
        <section>
          <h2>{TIEBREAKERS.find((t) => t.placement === step.placement)!.prompt}</h2>
          {step.sins.map((s) => (
            <button key={s} onClick={() => setSession(answerTiebreak(session, step.placement, s))}>
              {TIEBREAKERS.find((t) => t.placement === step.placement)!.options[s]}
            </button>
          ))}
          <p hidden>{step.sins.map((s) => SINS[s].name).join(',')}</p>
        </section>
      )}
      {step.kind === 'birthOrder' && (
        <section>
          <h2>{BIRTH_ORDER.question}</h2>
          {BIRTH_ORDERS.map((b) => <button key={b} onClick={() => setSession(answerBirthOrder(session, b))}>{BIRTH_ORDER.labels[b]}</button>)}
          <button onClick={() => setSession(answerBirthOrder(session, null))}>Skip</button>
        </section>
      )}
    </main>
  )
}
