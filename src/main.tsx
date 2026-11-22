import { render } from 'preact'
import { App } from './app'
import './styles/global.css'
import './styles/ui.css'

render(<App />, document.getElementById('app')!)
