/** @jsxImportSource preact */
import { useState } from "preact/hooks";
import { confirmWithQuip } from "./ui/modal";
import { getUserLocation, inRadius, distanceMeters } from "./geo";

export function App() {
    const [stage, setStage] = useState<"menu" | "palmiarnia">("menu");
    const [lang, setLang] = useState("en");
    const [weather, setWeather] = useState("sunny");
    const [cold, setCold] = useState(false);

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
                <button onClick={() => setStage("palmiarnia")}>
                    Let's go!
                </button>
            </main>
        );
    }

    if (stage === "palmiarnia") {
        return <Palmiarnia onBack={() => setStage("menu")} />;
    }
}

function Palmiarnia({ onBack }: { onBack: () => void }) {
    const checkLocation = async () => {
        try {
            const user = await getUserLocation();
            const place = { lat: 52.4006, lon: 16.9012 };
            const close = inRadius(user, place, 100);
            alert(
                close
                    ? "✅ You’re within 100 m of the Palm House!"
                    : `❌ Too far (${Math.round(
                          distanceMeters(user, place)
                      )} m away)`
            );
        } catch (err) {
            alert("⚠️ Location error: " + err);
        }
    };

    return (
        <main class="place">
            <img src="https://picsum.photos/seed/palmiarnia/400/240" />
            <h3>Humidity slap, palms everywhere. Nice spot for photos.</h3>
            <button onClick={checkLocation}>Check location</button>
            <button onClick={onBack}>Back</button>
        </main>
    );
}
