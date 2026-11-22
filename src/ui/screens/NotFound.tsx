import { href } from '../../router'

export function NotFound() {
  return <main><h1>Lost in the dark</h1><p><a href={href.intro()}>Back to the start</a></p></main>
}
