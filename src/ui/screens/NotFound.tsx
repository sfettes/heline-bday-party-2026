import { href } from '../../router'
import { MoonGlyph, Rule } from '../components/Glyphs'
import { TopBar } from '../components/TopBar'

export function NotFound() {
  return (
    <main class="notfound page-enter">
      <TopBar />
      <div class="notfound__body">
        <MoonGlyph size={56} class="notfound__glyph" />
        <p class="kicker">Error 404 · no such constellation</p>
        <h1 class="notfound__title">Lost in the dark</h1>
        <p class="notfound__text">This link doesn't map to any chart we know. It may have been mistyped, or the stars have simply moved on.</p>
        <Rule />
        <a class="btn btn--primary" href={href.intro()}>Back to the start</a>
      </div>
    </main>
  )
}
