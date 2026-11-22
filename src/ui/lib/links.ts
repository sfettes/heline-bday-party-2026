/** Absolute URL for an in-app hash route, e.g. "#/r/PEW-y". */
export function absoluteUrl(hash: string): string {
  const { origin, pathname } = window.location
  return `${origin}${pathname}${hash}`
}

/** Copy text; resolves true on success. Falls back to a hidden textarea for older browsers. */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch { /* fall through */ }
  try {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.setAttribute('readonly', '')
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    ta.remove()
    return ok
  } catch { return false }
}

/** Short display form of a URL for print (drops protocol, hash and trailing slash). */
export function prettyUrl(url: string): string {
  return url.replace(/^https?:\/\//, '').replace(/#.*$/, '').replace(/\/$/, '')
}
