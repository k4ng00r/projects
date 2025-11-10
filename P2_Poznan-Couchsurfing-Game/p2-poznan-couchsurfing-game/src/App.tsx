/** @jsxImportSource preact */
import { useState, useEffect } from "preact/hooks";
import { confirmWithQuip } from "./ui/modal";
import { Palmiarnia } from "./scenes/Palmiarnia";
import { t } from "./i18n";

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

    const hasSave = !!localStorage.getItem("save");

    // 4) handler startu gry — TERAZ używany przez przycisk
    const startGame = async () => {
        // tu już i tak mamy zapisane preferencje przez useEffect, ale nie zaszkodzi nadpisać
        localStorage.setItem("surfer", JSON.stringify({ lang, weather, cold }));
        const ok = await confirmWithQuip(
            t("quip.start", lang)
        );
        if (ok) setStage("palmiarnia"); // albo setStage("game"), jeśli tak nazwiesz scenę
    };

    if (stage === "menu") {
        return (
            <main class="menu">
                <h2>🏙️ {t("menu.title", lang)}</h2>
                {/* Language */}
                <label>
                    {t("menu.lang", lang)}
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
                            "pl",
                            "cs",
                            "sv",
                            "no",
                            "da",
                            "nl",
                            "el",
                            "he",
                            "uk",
                            "ru",
                            "ar",
                        ].map((l) => (
                            <option value={l}>{l}</option>
                        ))}
                    </select>
                </label>

                {/* Weather */}
                <label>
                    {t("menu.weather", lang)}:
                    <select
                        value={weather}
                        onChange={(e) =>
                            setWeather((e.target as HTMLSelectElement).value)
                        }
                    >
                        <option value="sunny">☀️ {t("weather.sunny", lang)}</option>
                        <option value="cloudy">☁️ {t("weather.cloudy", lang)}</option>
                        <option value="rain">🌧️ {t("weather.rain", lang)}</option>
                        <option value="snow">❄️ {t("weather.snow", lang)}</option>
                    </select>
                </label>

                <label>
                    {t("menu.cold", lang)}
                    <select
                        value={String(cold)}
                        onChange={(e) =>
                            setCold(e.currentTarget.value === "true")
                        }
                    >
                        <option value="false">{t("cold.no", lang)}</option>
                        <option value="true">{t("cold.yes", lang)}</option>
                    </select>
                </label>
                <button onClick={startGame}>
                    {hasSave ? t("menu.resume", lang) : t("menu.start", lang)}
                </button>
            </main>
        );
    }

    if (stage === "palmiarnia") {
        return <Palmiarnia onBack={() => setStage("menu")} />;
    }
}
