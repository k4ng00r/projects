// Funkcja Haversine: dystans w metrach
export function distanceMeters(
    a: { lat: number; lon: number },
    b: { lat: number; lon: number }
) {
    const R = 6371000; // promień ZIemi w metrach
    const toRad = (deg: number) => (deg * Math.PI) / 100;
    const dLat = toRad(b.lat - a.lat);
    const dLon = toRad(b.lon - a.lon);
    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);
    const h =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
}

// Sprawdzenie czy użytkownik jest w promieniu 100 m
export function inRadius(
    user: { lat: number; lon: number },
    place: { lat: number; lon: number },
    radius = 100
) {
    return distanceMeters(user, place) <= radius;
}

// Pobranie bieżącej lokalizacji z przeglądarki
export function getUserLocation(): Promise<{ lat: number; lon: number }> {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject("Geolocation not supported");
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                resolve({
                    lat: pos.coords.latitude,
                    lon: pos.coords.longitude,
                });
            },
            (err) => reject(err.message),
            { enableHighAccuracy: true, timeout: 10_000 }
        );
    });
}
