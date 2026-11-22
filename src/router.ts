import { useEffect, useState } from 'preact/hooks'

/** Hash routes (GitHub Pages friendly). */
export type Route =
  | { name: 'intro' }
  | { name: 'quiz' }
  | { name: 'result'; code: string }
  | { name: 'compare'; a: string; b: string }
  | { name: 'wall'; party: string }
  | { name: 'qr' }
  | { name: 'notFound' }

export function parseHash(hash: string): Route {
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent)
  switch (parts[0]) {
    case undefined: return { name: 'intro' }
    case 'q': return { name: 'quiz' }
    case 'r': return parts[1] ? { name: 'result', code: parts[1] } : { name: 'notFound' }
    case 'c': return parts[1] && parts[2] ? { name: 'compare', a: parts[1], b: parts[2] } : { name: 'notFound' }
    case 'wall': return { name: 'wall', party: parts[1] ?? 'main' }
    case 'qr': return { name: 'qr' }
    default: return { name: 'notFound' }
  }
}

export const href = {
  intro: () => '#/',
  quiz: () => '#/q',
  result: (code: string) => `#/r/${encodeURIComponent(code)}`,
  compare: (a: string, b: string) => `#/c/${encodeURIComponent(a)}/${encodeURIComponent(b)}`,
  wall: (party = 'main') => `#/wall/${encodeURIComponent(party)}`,
  qr: () => '#/qr',
}

export function navigate(to: string) {
  window.location.hash = to
}

export function useRoute(): Route {
  const [route, setRoute] = useState(() => parseHash(window.location.hash))
  useEffect(() => {
    const on = () => { setRoute(parseHash(window.location.hash)); window.scrollTo(0, 0) }
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return route
}
