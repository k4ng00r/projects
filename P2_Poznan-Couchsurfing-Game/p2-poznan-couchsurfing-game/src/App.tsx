/** @jsxImportSource preact */
import { useState, useEffect } from "preact/hooks";
import { confirmWithQuip } from "./ui/modal";
import { Palmiarnia } from "./scenes/Palmiarnia";

export function App() {
    // wczytaj zapisane preferencje (bez krzyczenia przy złamanym JSON)
    const saved = (() => {
        try {
            return JSON.parse(localStorage.getItem("surfer") || "null") as {
                lang: string;
                weather: string;
                cold: boolean;
            } | null;
        } catch {
            return null;
        }
    })();

    // 1) stan aplikacji
    const [stage, setStage] = useState<"menu" | "palmiarnia">("menu");

    // 2) stan Surfera z fallbackiem do zapisanych ustawień
    const [lang, setLang] = useState(saved?.lang ?? "en");
    const [weather, setWeather] = useState(saved?.weather ?? "sunny");
    const [cold, setCold] = useState<boolean>(saved?.cold ?? false);

    // 3) trzymamy wybory w localStorage na bieżąco (wygodne przy odświeżeniu strony)
    useEffect(() => {
        localStorage.setItem("surfer", JSON.stringify({ lang, weather, cold }));
    }, [lang, weather, cold]);

    // 4) handler startu gry — TERAZ używany przez przycisk
    const startGame = async () => {
        // tu już i tak mamy zapisane preferencje przez useEffect, ale nie zaszkodzi nadpisać
        localStorage.setItem("surfer", JSON.stringify({ lang, weather, cold }));
        const ok = await confirmWithQuip(
            "Ready? Poznań can be weird when it rains."
        );
        if (ok) setStage("palmiarnia"); // albo setStage("game"), jeśli tak nazwiesz scenę
    };

    if (stage === "menu") {
        return (
            <main class="menu">
                <h2>🏙️ Poznań Couchsurfing RPG</h2>
                {/* Language */}
                <label>
                    Language:
                    <select
                        value={lang}
                        onChange={(e) =>
                            setLang((e.target as HTMLSelectElement).value)
                        }
                    >
                        {[
                            "en",
                            "de",
                            "fr",
                            "it",
                            "es",
                            "el",
                            "cs",
                            "sv",
                            "ru",
                            "ar",
                        ].map((l) => (
                            <option value={l}>{l}</option>
                        ))}
                    </select>
                </label>

                {/* Weather */}
                <label>
                    Weather:
                    <select
                        value={weather}
                        onChange={(e) =>
                            setWeather((e.target as HTMLSelectElement).value)
                        }
                    >
                        <option value="sunny">☀️ sunny</option>
                        <option value="cloudy">☁️ cloudy</option>
                        <option value="rain">🌧️ rain</option>
                        <option value="snow">❄️ snow</option>
                    </select>
                </label>

                <label>
                    Is it cold for you?
                    <select
                        value={String(cold)}
                        onChange={(e) =>
                            setCold(e.currentTarget.value === "true")
                        }
                    >
                        <option value="false">No</option>
                        <option value="true">Yes</option>
                    </select>
                </label>
                <button onClick={startGame}>
                    Let's go!
                </button>
            </main>
        );
    }

    if (stage === "palmiarnia") {
        return <Palmiarnia onBack={() => setStage("menu")} />;
    }
}
