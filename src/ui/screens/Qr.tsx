import { useEffect, useMemo } from 'preact/hooks'
import { PARTY } from '../../content'
import { QrCode } from '../../wall/QrCode'
import { quizUrl } from '../../wall/validate'
import '../../wall/qr.css'

/** Printable "scan to play" page (#/qr). */
export function Qr() {
  const url = useMemo(() => quizUrl(), [])
  useEffect(() => {
    const prev = document.title
    document.title = `${PARTY.title} · scan to play`
    return () => { document.title = prev }
  }, [])
  const shown = url.replace(/^https?:\/\//, '').replace(/#\/$/, '')
  return (
    <main class="qrp">
      <p class="qrp-kicker">{PARTY.guestOfHonour}’s birthday</p>
      <h1 class="qrp-title">{PARTY.title}</h1>
      <QrCode value={url} class="qrp-code" label="QR code: scan to take the quiz" />
      <p class="qrp-copy">Scan to find your Sun, Moon and Rising sins.</p>
      <p class="qrp-url">{shown}</p>
      <button class="qrp-print" type="button" onClick={() => window.print()}>Print this page</button>
    </main>
  )
}
