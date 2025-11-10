/** @jsxImportSource preact */
import { useEffect, useMemo, useState } from "preact/hooks";
import {
    distanceMeters,
    getUserLocation,
    inRadius,
    watchPosition,
} from "../geo";
import { t } from "../i18n";

const CHECKIN_RADIUS = 100;

type Localized = Record<string, string>;

type Place = {
    id: string;
    name: Localized | { en: string } | string;
    coords: { lat: number; lon: number };
    hours?: string;
    ticket?: string;
    thumbnail?: string;
    category?: "museum" | "cafe" | "pub" | "park" | string;
    indoor?: boolean;
    warm?: boolean;
};

export function PlaceScene({
    place,
    lang,
    onBack,
    onCheckIn,
}: {
    place: Place;
    lang: string;
    onBack: () => void;
    onCheckIn: (ok: boolean) => void;
}) {
    const [user, setUser] = useState<{ lat: number; lon: number } | null>(null);
    const [dist, setDist] = useState<number | null>(null);
    const [manual, setManual] = useState<{ lat: string; lon: string }>({
        lat: "",
        lon: "",
    });
    const [status, setStatus] = useState<string>("");
    const [pending, setPending] = useState(false);

    // Bezpieczna nazwa miejsca z lokalizacji
    const placeName = useMemo(() => {
        if (typeof place.name === "string") return place.name;
        const n = place.name as any;
        return n?.[lang] ?? n?.en ?? String(place.id);
    }, [place.name, lang, place.id]);

    // Live dystans przez watchPosition
    useEffect(() => {
        let stop: (() => void) | undefined;
        try {
            stop = watchPosition(
                (p) => {
                    setUser(p);
                    setDist(distanceMeters(p, place.coords));
                },
                (msg) => setStatus(`⚠️ ${msg}`),
                { throttleMs: 3000, enableHighAccuracy: true }
            );
        } catch (e) {
            // geolocation off albo brak HTTPS — nie wywalamy UI
        }
        return () => {
            stop && stop();
        };
    }, [place.id, place.coords.lat, place.coords.lon]);

    function getFastPosition(): Promise<{ lat: number; lon: number }> {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation)
                return reject("Geolocation not supported");

            let settled = false;
            const done = (fn: (v: any) => void) => (v: any) => {
                if (settled) return;
                settled = true;
                try {
                    clearTimeout(timer);
                } catch {}
                try {
                    navigator.geolocation.clearWatch(watchId);
                } catch {}
                fn(v);
            };

            const ok = done((pos: GeolocationPosition) =>
                resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude })
            );
            const fail = done((msg: any) => reject(msg));

            // 1) szybki cache (często zwraca w <1s)
            navigator.geolocation.getCurrentPosition(
                (pos) => ok(pos),
                (err) => {
                    if ((err as GeolocationPositionError).code === 1)
                        return fail("permission deniad");
                    // inne błędy ignorujemy, watch może jeszcze zadziałać
                },
                {
                    enableHighAccuracy: false,
                    maximumAge: 120_000,
                    timeout: 4_000,
                }
            );

            // 2) fallback: pierwszy strzał z watchPosition
            const watchId = navigator.geolocation.watchPosition(
                (pos) => ok(pos),
                (err) => {
                    if ((err as GeolocationPositionError).code === 1)
                        fail("permission denied");
                },
                { enableHighAccuracy: true, maximumAge: 0, timeout: 8_000 }
            );

            // 3) globalny limit
            const timer = setTimeout(() => fail("timeout expired"), 10_000);
        });
    }

    async function tryBrowserCheckin() {
        setPending(true);
        setStatus("⏳ Checking location…");
        try {
            const p = await getFastPosition();
            setUser(p);
            const d = distanceMeters(p, place.coords);
            setDist(d);
            const ok = inRadius(p, place.coords, CHECKIN_RADIUS);
            setStatus(
                ok
                    ? `✅ Checked in at ~${Math.round(d)} m`
                    : `❌ Too far: ~${Math.round(d)} m`
            );
            onCheckIn(ok);
        } catch (e: any) {
            setStatus(`⚠️ ${String(e)}`);
            onCheckIn(false);
        } finally {
            setPending(false);
        }
    }

    function tryManualCheckin(e: Event) {
        e.preventDefault();
        const p = { lat: Number(manual.lat), lon: Number(manual.lon) };
        if (Number.isNaN(p.lat) || Number.isNaN(p.lon)) {
            setStatus("⚠️ Invalid coordinates");
            onCheckIn(false);
            return;
        }
        setUser(p);
        const d = distanceMeters(p, place.coords);
        setDist(d);
        const ok = inRadius(p, place.coords, CHECKIN_RADIUS);
        setStatus(
            ok
                ? `✅ Checked in (manual) at ~${Math.round(d)} m`
                : `❌ Too far: ~${Math.round(d)} m`
        );
        onCheckIn(ok);
    }

    return (
        <main
            class="place"
            style="max-width:720px;margin:0 auto;padding:12px;display:grid;gap:12px"
        >
            {place.thumbnail && (
                <img
                    src={place.thumbnail}
                    alt={placeName}
                    style="width:100%;height:auto;border-radius:12px;object-fit:cover"
                />
            )}

            <header>
                <h2 style="margin:0 0 4px 0">{placeName}</h2>
                <p style="margin:0;color:#888">
                    {t(`node.${place.id}.intro`, lang)}
                </p>
            </header>

            <section>
                <p>{t(`place.${place.id}.desc`, lang)}</p>
                <p>
                    <strong>{t("place.hours", lang)}:</strong>{" "}
                    {place.hours ?? "-"}
                </p>
                <p>
                    <strong>{t("place.ticket", lang)}:</strong>{" "}
                    {place.ticket ?? "-"}
                </p>
            </section>

            <section aria-live="polite">
                <p style="margin:0 0 6px 0">
                    Distance {dist != null ? `${Math.round(dist)} m` : "-"}
                </p>
                <div style="display:flex;gap:8px;flex-wrap:wrap">
                    <button disabled={pending} onClick={tryBrowserCheckin}>
                        🔎 Check location
                    </button>
                    <form
                        onSubmit={tryManualCheckin}
                        style="display:flexl;gap:6px;align-items:center;flex-wrap:wrap"
                    >
                        <input
                            aria-label="Latitude"
                            placeholder="lat"
                            inputMode="decimal"
                            value={manual.lat}
                            onInput={(e) =>
                                setManual((v) => ({
                                    ...v,
                                    lat: (e.target as HTMLInputElement).value,
                                }))
                            }
                            style="width:120px"
                        />
                        <input
                            aria-label="Longitude"
                            placeholder="lon"
                            inputMode="decimal"
                            value={manual.lon}
                            onInput={(e) =>
                                setManual((v) => ({
                                    ...v,
                                    lon: (e.target as HTMLInputElement).value,
                                }))
                            }
                            style="width:120px"
                        />
                        <button type="submit">✍️ Manual coords</button>
                    </form>
                </div>
                {status && <p style="margin:6px 0 0 0">{status}</p>}
            </section>

            <nav style="margin-top:8px">
                <button onClick={onBack}>← Back</button>
            </nav>
        </main>
    );
}
