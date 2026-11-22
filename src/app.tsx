import { useRoute, type Route } from './router'
import { Starfield } from './ui/components/Glyphs'
import { Intro } from './ui/screens/Intro'
import { Quiz } from './ui/screens/Quiz'
import { Result } from './ui/screens/Result'
import { Compare } from './ui/screens/Compare'
import { Wall } from './ui/screens/Wall'
import { Qr } from './ui/screens/Qr'
import { NotFound } from './ui/screens/NotFound'

function Screen({ route }: { route: Route }) {
  switch (route.name) {
    case 'intro': return <Intro />
    case 'quiz': return <Quiz />
    case 'result': return <Result key={route.code} code={route.code} />
    case 'compare': return <Compare a={route.a} b={route.b} />
    case 'wall': return <Wall party={route.party} />
    case 'qr': return <Qr />
    default: return <NotFound />
  }
}

export function App() {
  const route = useRoute()
  // The wall (TV) and printable QR page own their whole canvas; everything else sits on the night sky.
  const sky = route.name !== 'wall' && route.name !== 'qr'
  return (
    <>
      {sky && <Starfield />}
      <Screen route={route} />
    </>
  )
}
