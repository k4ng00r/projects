/** @jsxImportSource preact */
import { render } from "preact";
import { App } from './App';
import './style.css';

// DEV helper: wystaw geo do window, żeby testować w konsoli
if (import.meta.env.DEV) {
  import('./geo').then((mod) => {
    (window as any).geo = mod;
    console.info('[dev] window.geo ready:', Object.keys(mod));
  }).catch((e) => console.warn('[dev] geo import failed', e));
}

render(<App />, document.querySelector('#app')!);