import { useMemo } from 'preact/hooks'
import { encode } from 'uqr'

/** Build one SVG path for all dark modules (row runs merged into rects). */
export function qrPath(data: boolean[][]): string {
  let d = ''
  data.forEach((row, y) => {
    let x = 0
    while (x < row.length) {
      if (!row[x]) { x++; continue }
      const start = x
      while (x < row.length && row[x]) x++
      d += `M${start} ${y}h${x - start}v1h${start - x}z`
    }
  })
  return d
}

/**
 * Scannable QR as inline SVG: always dark modules on white with a 4-module quiet
 * zone, whatever the page theme, because that is what phone cameras read best.
 */
export function QrCode({ value, label, class: cls }: { value: string; label?: string; class?: string }) {
  const { size, d } = useMemo(() => {
    const qr = encode(value, { ecc: 'M', border: 4 })
    return { size: qr.size, d: qrPath(qr.data) }
  }, [value])
  return (
    <svg
      class={cls}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={label ?? `QR code for ${value}`}
      shape-rendering="crispEdges"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width={size} height={size} fill="#fff" />
      <path d={d} fill="#000" />
    </svg>
  )
}
