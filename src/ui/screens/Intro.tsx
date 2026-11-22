import { PARTY } from '../../content'
import { href } from '../../router'
import { loadMyResult, loadSession } from '../../storage'

// SKELETON — Agent D replaces with the designed version.
export function Intro() {
  const inProgress = loadSession()
  const mine = loadMyResult()
  return (
    <main>
      <h1>{PARTY.title}</h1>
      <p>{PARTY.intro}</p>
      <a href={href.quiz()}>{inProgress ? 'Continue' : 'Begin'}</a>
      {mine && <p><a href={href.result(mine)}>See my result</a></p>}
    </main>
  )
}
