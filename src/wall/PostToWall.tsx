import { useState } from 'preact/hooks'
import { loadName, saveName } from '../storage'
import { newDocId, postResult, preloadWall } from './client'
import { loadPostRecord, savePostRecord } from './postRecord'
import { DEFAULT_PARTY, NAME_MAX, cleanCode, cleanName, normalizeParty } from './validate'
import './postToWall.css'

type State =
  | { kind: 'idle' }
  | { kind: 'posting' }
  | { kind: 'done'; name: string }
  | { kind: 'error'; message: string }

/**
 * "Add me to the party wall" box for the result page. Self-contained: prefills the
 * name, posts once per party and result code on this device, and remembers it.
 */
export function PostToWall({ code, party = DEFAULT_PARTY, class: cls }: { code: string; party?: string; class?: string }) {
  const p = normalizeParty(party) ?? DEFAULT_PARTY
  const c = cleanCode(code)
  const [name, setName] = useState(loadName)
  const [state, setState] = useState<State>(() => {
    const rec = loadPostRecord(p)
    return rec?.done && rec.code === c ? { kind: 'done', name: rec.name } : { kind: 'idle' }
  })

  if (!c) return null

  async function submit(e: Event) {
    e.preventDefault()
    if (state.kind === 'posting' || state.kind === 'done') return
    const n = cleanName(name)
    if (!n) { setState({ kind: 'error', message: 'Add your name first.' }); return }
    const prev = loadPostRecord(p)
    if (prev?.done && prev.code === c) { setState({ kind: 'done', name: prev.name }); return }
    // Reuse the id of an unfinished attempt for the same result, so retries can't duplicate.
    const id = prev && !prev.done && prev.code === c ? prev.id : newDocId()
    savePostRecord(p, { id, code: c!, name: n, done: false })
    saveName(n)
    setState({ kind: 'posting' })
    const res = await postResult(p, n, c!, { id })
    if (res.ok) {
      savePostRecord(p, { id, code: c!, name: res.name, done: true })
      setState({ kind: 'done', name: res.name })
    } else {
      setState({ kind: 'error', message: res.message })
    }
  }

  const busy = state.kind === 'posting'
  return (
    <section class={['ptw', cls].filter(Boolean).join(' ')} aria-live="polite">
      {state.kind === 'done' ? (
        <p class="ptw-done">
          <span aria-hidden="true">✦</span> You’re on the party wall, <strong>{state.name}</strong>. Look up at the screen.
        </p>
      ) : (
        <form class="ptw-form" onSubmit={submit}>
          <label class="ptw-label" for="ptw-name">Add me to the party wall</label>
          <div class="ptw-row">
            <input
              id="ptw-name"
              class="ptw-input"
              type="text"
              autoComplete="given-name"
              enterKeyHint="send"
              placeholder="Your first name"
              maxLength={NAME_MAX}
              value={name}
              disabled={busy}
              onFocus={preloadWall}
              onInput={(e) => setName((e.target as HTMLInputElement).value)}
            />
            <button class="ptw-button" type="submit" disabled={busy}>
              {busy ? 'Posting…' : state.kind === 'error' ? 'Try again' : 'Post'}
            </button>
          </div>
          {state.kind === 'error' && <p class="ptw-error" role="alert">{state.message}</p>}
          {state.kind !== 'error' && <p class="ptw-hint">Just your name and your three sins. Nothing else.</p>}
        </form>
      )}
    </section>
  )
}
