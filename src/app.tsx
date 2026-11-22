import { useRoute } from './router'
import { Intro } from './ui/screens/Intro'
import { Quiz } from './ui/screens/Quiz'
import { Result } from './ui/screens/Result'
import { Compare } from './ui/screens/Compare'
import { Wall } from './ui/screens/Wall'
import { Qr } from './ui/screens/Qr'
import { NotFound } from './ui/screens/NotFound'

export function App() {
  const route = useRoute()
  switch (route.name) {
    case 'intro': return <Intro />
    case 'quiz': return <Quiz />
    case 'result': return <Result code={route.code} />
    case 'compare': return <Compare a={route.a} b={route.b} />
    case 'wall': return <Wall party={route.party} />
    case 'qr': return <Qr />
    default: return <NotFound />
  }
}
