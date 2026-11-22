/** Tiny hex colour helpers (no color-mix dependency, so they also work on canvas). */
function parse(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

export function mix(a: string, b: string, t: number): string {
  const [r1, g1, b1] = parse(a), [r2, g2, b2] = parse(b)
  const f = (x: number, y: number) => Math.round(x + (y - x) * t).toString(16).padStart(2, '0')
  return `#${f(r1, r2)}${f(g1, g2)}${f(b1, b2)}`
}

export function alpha(hex: string, a: number): string {
  const [r, g, b] = parse(hex)
  return `rgba(${r}, ${g}, ${b}, ${a})`
}
