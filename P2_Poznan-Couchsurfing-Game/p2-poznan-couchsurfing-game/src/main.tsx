/** @jsxImportSource preact */
import { render } from "preact";
import { App } from "./App";
import "./style.css";

// DEV helper: wystaw geo do window, żeby testować w konsoli
if (import.meta.env.DEV) {
    import("./geo")
        .then((mod) => {
            (window as any).geo = mod;
            console.info("[dev] window.geo ready:", Object.keys(mod));
        })
        .catch((e) => console.warn("[dev] geo import failed", e));
}

// DEV helper: wystaw i18n do window, żeby testować w konsoli
if (import.meta.env.DEV) {
    import("./i18n")
        .then((mod) => {
            (window as any).i18n = mod;
            console.info("[dev] window.i18n ready:", Object.keys(mod));
        })
        .catch((e) => console.warn("[dev] i18n import failed", e));
}

// DEV helper: wystaw engine do window, żeby testować w konsoli
if (import.meta.env.DEV) {
    import("./engine")
        .then((mod) => {
            (window as any).engine = mod;
            console.info("[dev] window.engine ready:", Object.keys(mod));
        })
        .catch((e) => console.warn("[dev] engine import failed", e));
}

render(<App />, document.querySelector("#app")!);
