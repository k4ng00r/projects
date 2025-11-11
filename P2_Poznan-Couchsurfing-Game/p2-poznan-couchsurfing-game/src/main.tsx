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

// DEV helper: wystaw PlaceScene + prosty montaż do podglądu
if (import.meta.env.DEV) {
    Promise.all([import("preact"), import("./scenes/PlaceScene.tsx")])
        .then(([preact, { PlaceScene }]) => {
            // 1) stary, prosty global — dla wpisywania w konsoli: window.PlaceScene
            (window as any).PlaceScene = PlaceScene;

            // 2) wygodny helper do montażu
            (window as any).dev = {
                PlaceScene,
                mountPlaceScene(opts: any) {
                    const mount =
                        document.getElementById("dev-mount") ||
                        (() => {
                            const d = document.createElement("div");
                            d.id = "dev-mount";
                            document.body.appendChild(d);
                            return d;
                        })();
                    preact.render(preact.h(PlaceScene, opts), mount);
                },
            };

            console.info(
                "[dev] PlaceScene ready → window.PlaceScene & window.dev.mountPlaceScene()"
            );
        })
        .catch((e) => console.warn("[dev] PlaceScene helper failed", e));
}

// DEV helpers: expose content & optional PlaceScene for console fiddling
if (import.meta.env.DEV) {
    (async () => {
        try {
            const [{ default: places }, { default: nodes }] = await Promise.all(
                [
                    import("../content/places.json"),
                    import("../content/nodes.json"),
                ]
            );
            (window as any).content = { places, nodes };
            console.info("[dev] window.content ready:", {
                places: Array.isArray(places)
                    ? places.length
                    : Object.keys(places || {}).length,
                nodes: Array.isArray(nodes)
                    ? nodes.length
                    : Object.keys(nodes || {}).length,
            });
        } catch (e) {
            console.warn("[dev] content import failed", e);
        }

        // optional: expose PlaceScene if present
        try {
            const mod = await import("./scenes/PlaceScene.tsx");
            (window as any).PlaceScene = mod.PlaceScene;
            console.info("[dev] window.PlaceScene ready");
        } catch {
            // PlaceScene może jeszcze nie istnieć i to jest ok
        }
    })();
}

// --- DEV: expose JSON content & quick PlaceScene mount for console ---
if (import.meta.env.DEV) {
    (async () => {
        // 1) Loader z możliwością reloadu po zmianach plików
        async function loadContent() {
            try {
                const [{ default: places }, { default: nodes }] =
                    await Promise.all([
                        import("../content/places.json"),
                        import("../content/nodes.json"),
                    ]);
                (window as any).content = {
                    places,
                    nodes,
                    reload: loadContent,
                };
                console.info("[dev] window.content ready:", {
                    places: Array.isArray(places) ? places.length : "(object)",
                    nodes: Array.isArray(nodes) ? nodes.length : "(object)",
                });
                return { places, nodes };
            } catch (e) {
                console.warn("[dev] content import failed", e);
                return { places: null, nodes: null };
            }
        }

        // 2) Opcjonalny helper do szybkiego podglądu PlaceScene
        try {
            const preact = await import("preact");
            const mod = await import("./scenes/PlaceScene.tsx");
            const PlaceScene = (mod as any).PlaceScene;

            (window as any).dev = {
                ...(window as any).dev,
                loadContent,
                PlaceScene,
                mountPlaceScene(opts: any) {
                    const mount =
                        document.getElementById("dev-mount") ||
                        (() => {
                            const d = document.createElement("div");
                            d.id = "dev-mount";
                            document.body.appendChild(d);
                            return d;
                        })();
                    preact.render(preact.h(PlaceScene, opts), mount);
                },
            };

            console.info(
                "[dev] helpers → window.content & window.dev.mountPlaceScene(opts)"
            );
        } catch {
            // PlaceScene może jeszcze nie istnieć i to jest OK
            (window as any).dev = { ...(window as any).dev, loadContent };
            console.info(
                "[dev] helpers → window.content (PlaceScene not found yet)"
            );
        }

        // Pierwsze załadowanie danych
        await loadContent();
    })();
}

render(<App />, document.querySelector("#app")!);
