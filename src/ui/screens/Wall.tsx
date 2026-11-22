import { useEffect, useMemo, useRef, useState } from 'preact/hooks'
import { PARTY, PLACEMENTS, PLACEMENT_META, SINS, SIN_IDS, type Placement, type SinId } from '../../content'
import { titleFor, type Placements } from '../../engine'
import { href } from '../../router'
import { subscribeResults, type Feed } from '../../wall/client'
import { QrCode } from '../../wall/QrCode'
import { computeStats, type Guest, type Pair, type WallStats } from '../../wall/stats'
import { normalizeParty, quizUrl } from '../../wall/validate'
import '../../wall/wall.css'

const FRESH_MS = 9000

export function Wall({ party }: { party: string }) {
  const p = normalizeParty(party)
  const [feed, setFeed] = useState<Feed>({ status: 'connecting', guests: [] })
  const [fresh, setFresh] = useState<ReadonlySet<string>>(new Set())
  const seen = useRef<Set<string> | null>(null)

  useEffect(() => {
    const prev = document.title
    document.title = `${PARTY.title} · party wall`
    return () => { document.title = prev }
  }, [])

  useEffect(() => {
    seen.current = null
    setFresh(new Set())
    const timers: ReturnType<typeof setTimeout>[] = []
    const stop = subscribeResults(p ?? party, (f) => {
      setFeed(f)
      // Guests present at first live load appear quietly; later arrivals get the entrance.
      if (seen.current === null) {
        if (f.status === 'live') seen.current = new Set(f.guests.map((g) => g.id))
        return
      }
      const arrivals = f.guests.filter((g) => !seen.current!.has(g.id)).map((g) => g.id)
      if (!arrivals.length) return
      arrivals.forEach((id) => seen.current!.add(id))
      setFresh((s) => new Set([...s, ...arrivals]))
      timers.push(setTimeout(() => setFresh((s) => new Set([...s].filter((id) => !arrivals.includes(id)))), FRESH_MS))
    })
    return () => { stop(); timers.forEach(clearTimeout) }
  }, [p, party])

  const stats = useMemo(() => computeStats(feed.guests), [feed.guests])
  const url = useMemo(() => quizUrl(), [])

  if (!p) {
    return (
      <main class="wall wall--message">
        <h1>That party doesn’t exist</h1>
        <p>Party ids use lowercase letters, numbers and dashes. Try <a href={href.wall()}>the main wall</a>.</p>
      </main>
    )
  }

  const newestFirst = [...feed.guests].reverse()
  const n = feed.guests.length
  const density = n <= 12 ? 'l' : n <= 30 ? 'm' : 's'

  return (
    <main class="wall">
      <header class="wall-head">
        <div class="wall-brand">
          <p class="wall-kicker">{PARTY.guestOfHonour}’s birthday <span aria-hidden="true">✦</span> Sun · Moon · Rising</p>
          <h1 class="wall-title">{PARTY.title}</h1>
          <StatusLine feed={feed} />
        </div>
        <div class="wall-count" aria-live="polite">
          <span class="wall-count-num">{n}</span>
          <span class="wall-count-label">{n === 1 ? 'sinner' : 'sinners'} so far</span>
        </div>
        <figure class="wall-qr">
          <QrCode value={url} class="wall-qr-code" label="QR code: scan to take the quiz" />
          <figcaption>Scan to find<br />your sins</figcaption>
        </figure>
      </header>

      <section class="wall-guests" data-density={density} aria-label="Guests">
        {n === 0 ? (
          <div class="wall-empty">
            <p class="wall-empty-star" aria-hidden="true">✦</p>
            <p class="wall-empty-text">Waiting for the first sinner…</p>
            <p class="wall-empty-sub">Scan the code, take the quiz, add yourself to the wall.</p>
          </div>
        ) : (
          <ol class="wall-grid">
            {newestFirst.map((g) => <GuestCard key={g.id} guest={g} fresh={fresh.has(g.id)} />)}
          </ol>
        )}
      </section>

      <aside class="wall-stats" aria-label="Party stats">
        <h2 class="wall-stats-title">The room’s chart</h2>
        {PLACEMENTS.map((pl) => <Distribution key={pl} placement={pl} stats={stats} />)}
        <Highlights stats={stats} />
      </aside>
    </main>
  )
}

function StatusLine({ feed }: { feed: Feed }) {
  const text: Record<Feed['status'], string> = {
    connecting: 'Connecting…',
    live: 'Live',
    offline: 'Reconnecting…',
    error: feed.message ?? 'Connection problem',
    'invalid-party': feed.message ?? 'Invalid party',
  }
  return <p class="wall-status" data-status={feed.status} role="status">{text[feed.status]}</p>
}

function SinChips({ p }: { p: Placements }) {
  return (
    <span class="wall-chips">
      {PLACEMENTS.map((pl) => {
        const sin = SINS[p[pl]]
        return (
          <span key={pl} class="wall-chip" style={{ '--sin': sin.accent }} title={`${PLACEMENT_META[pl].name}: ${sin.name}`}>
            <span aria-hidden="true">{sin.emoji}</span>
            <span class="wall-sr">{PLACEMENT_META[pl].name} {sin.name}</span>
          </span>
        )
      })}
    </span>
  )
}

function GuestCard({ guest, fresh }: { guest: Guest; fresh: boolean }) {
  return (
    <li class={fresh ? 'wall-card is-fresh' : 'wall-card'} style={{ '--sin': SINS[guest.p.sun].accent }}>
      <div class="wall-card-top">
        <span class="wall-card-name">{guest.name}</span>
        <SinChips p={guest.p} />
      </div>
      <span class="wall-card-title">{titleFor(guest.p)}</span>
    </li>
  )
}

function sinList(ids: SinId[]): string {
  return ids.map((s) => `${SINS[s].emoji} ${SINS[s].name}`).join(' & ')
}

function Distribution({ placement, stats }: { placement: Placement; stats: WallStats }) {
  const counts = stats.counts[placement]
  const max = Math.max(1, ...SIN_IDS.map((s) => counts[s]))
  const meta = PLACEMENT_META[placement]
  const dom = stats.dominant[placement]
  return (
    <section class="wall-dist">
      <h3 class="wall-dist-head">
        <span class="wall-dist-name"><span aria-hidden="true">{meta.emoji}</span> {meta.name}</span>
        <span class="wall-dist-dom">
          {dom.length === 0 ? meta.tagline.toLowerCase()
            : dom.length > 3 ? <>a {dom.length}-way tie</>
            : <>mostly <strong>{sinList(dom)}</strong></>}
        </span>
      </h3>
      <ol class="wall-bars">
        {SIN_IDS.map((s) => (
          <li key={s} class="wall-bar" style={{ '--sin': SINS[s].accent, '--h': counts[s] / max }} title={`${SINS[s].name}: ${counts[s]}`}>
            <span class="wall-bar-n">{counts[s] || ''}</span>
            <span class="wall-bar-col" />
            <span class="wall-bar-emoji" aria-hidden="true">{SINS[s].emoji}</span>
            <span class="wall-sr">{SINS[s].name}: {counts[s]}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}

function PairLine({ pair }: { pair: Pair }) {
  return (
    <span class="wall-hl-value">
      {pair.a.name} <span class="wall-amp">&amp;</span> {pair.b.name}
      <span class="wall-hl-pct">{Math.round(pair.score * 100)}%</span>
    </span>
  )
}

function Highlights({ stats }: { stats: WallStats }) {
  if (stats.total < 2) {
    return <p class="wall-hl-wait">{stats.total ? 'One more guest unlocks the pairings.' : 'Stats fill in as guests arrive.'}</p>
  }
  const { rarest, pairs } = stats
  return (
    <dl class="wall-hl">
      {rarest && (
        <div class="wall-hl-item">
          <dt>Rarest combo</dt>
          <dd>
            <span class="wall-hl-value">{rarest.name} <SinChips p={rarest.p} /></span>
            <span class="wall-hl-sub">{titleFor(rarest.p)}</span>
          </dd>
        </div>
      )}
      {pairs && (
        <div class="wall-hl-item">
          <dt>Most compatible</dt>
          <dd><PairLine pair={pairs.best} /></dd>
        </div>
      )}
      {pairs?.chaos && (
        <div class="wall-hl-item">
          <dt>Chaos pair</dt>
          <dd><PairLine pair={pairs.chaos} /></dd>
        </div>
      )}
    </dl>
  )
}
