/** @jsxImportSource preact */
import { useEffect, useMemo, useState } from "preact/hooks";
import { PlaceScene } from "./PlaceScene";

type Place = {
    id: string;
    name: Record<string, string> | { en: string } | string;
    coords: { lat: number; lon: number };
    hours?: string;
    ticket?: string;
    thumbnail?: string;
    category?: string;
    indoor?: boolean;
    warm?: boolean;
};

function getLang(): string {
    try {
        const save = JSON.parse(localStorage.getItem("save") || "null");
        if (save?.lang) return save.lang;
        const prefs = JSON.parse(localStorage.getItem("surfer") || "null");
        if (prefs?.lang) return prefs.lang;
    } catch {}
    return "en";
}

export function Palmiarnia({ onBack }: { onBack: () => void }) {
    const [place, setPlace] = useState<Place | null>(null);
    const lang = useMemo(getLang, []);

    useEffect(() => {
        (async () => {
            let data: any = null;
            try {
                data = (await import("../../content/places.json")).default;
            } catch {}
            if (!data) return;

            // Obsłuż zarówno tablicę miejsc jak i potencjalny obiekt z kluczem .places
            const list: Place[] = Array.isArray(data)
                ? data
                : Array.isArray(data?.places)
                ? data.places
                : [];
            const p = list.find((x) => x.id === "palmiarnia") || null;
            setPlace(p);
        })();
    }, []);

    function handleCheckIn(ok: boolean) {
        console.log("[palmiarnia] onCheckIn", ok);
        if (!ok || !place) return;
        try {
            const raw = localStorage.getItem("save");
            const save = raw ? JSON.parse(raw) : {};
            if (!Array.isArray(save.visited)) save.visited = [];
            if (!save.visited.includes(place.id)) save.visited.push(place.id);

            localStorage.setItem("save", JSON.stringify(save));

            // round-trip: sprawdź, czy faktycznie siedzi w storage
            const after = JSON.parse(localStorage.getItem("save") || "null");
            console.log("[palmiarnia] saved roundtrip", after);
        } catch (e) {
            console.error("[palmiarnia] save error", e);
        }
    }

    if (!place) {
        return (
            <main style="padding:12px;max-width:720px;margin:0 auto">
                <h2>Palmiarnia</h2>
                <p>Loading place data…</p>
                <button onClick={onBack}>← Back</button>
            </main>
        );
    }

    return (
        <PlaceScene
            place={place}
            lang={lang}
            onBack={onBack}
            onCheckIn={handleCheckIn}
        />
    );
}
