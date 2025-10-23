/** @jsxImportSource preact */
import { getUserLocation, inRadius, distanceMeters } from '../geo';

export function Palmiarnia({ onBack }: { onBack: () => void }) {
  const checkLocation = async () => {
    try {
      const user = await getUserLocation();
      const place = { lat: 52.4006, lon: 16.9012 };
      const close = inRadius(user, place, 100);
      alert(
        close
          ? '✅ You’re within 100 m of the Palm House!'
          : `❌ Too far (${Math.round(distanceMeters(user, place))} m away)`
      );
    } catch (err) {
      alert('⚠️ Location error: ' + err);
    }
  };

  return (
    <main class="place">
      <img src="https://picsum.photos/seed/palmiarnia/400/240" alt="Palm House" />
      <h3>Humidity slap, palms everywhere. Nice spot for photos.</h3>
      <button onClick={checkLocation}>Check location</button>
      <button onClick={onBack}>Back</button>
    </main>
  );
}