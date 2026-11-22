import type { ComponentChildren } from 'preact'
import { PARTY } from '../../content'
import { href } from '../../router'
import { Sparkle } from './Glyphs'

/** Slim masthead used on the reading pages (result, compare, not-found). */
export function TopBar({ children }: { children?: ComponentChildren }) {
  return (
    <header class="topbar">
      <a class="wordmark wordmark--small" href={href.intro()}>
        <Sparkle size={9} /> {PARTY.title}
      </a>
      {children && <div class="topbar__end">{children}</div>}
    </header>
  )
}
