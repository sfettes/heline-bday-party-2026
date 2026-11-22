import { compatibility, decodeResult, titleFor } from '../../engine'
import { NotFound } from './NotFound'

// SKELETON — Agent D replaces.
export function Compare({ a, b }: { a: string; b: string }) {
  const ra = decodeResult(a), rb = decodeResult(b)
  if (!ra || !rb) return <NotFound />
  const c = compatibility(ra, rb)
  return (
    <main>
      <h1>{titleFor(ra)} × {titleFor(rb)}</h1>
      <p>{c.percent}% — {c.band.label}</p>
      <p>{c.band.blurb}</p>
    </main>
  )
}
