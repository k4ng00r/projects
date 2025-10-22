import { getUserLocation, inRadius, distanceMeters } from "../geo";

export async function renderPalmiarnia(
    app: HTMLElement,
    palmiarnia: any,
    i18n: any
) {
    app.innerHTML = `
    <div class="card" style="padding:16px;">
      <img src="${palmiarnia.thumbnail}" alt="">
      <h3>${i18n["node.palmiarnia.intro"]}</h3>
      <button id="checkLoc">Check location</button>
      <p id="result" style="margin-top:12px;color:#aaa;font-size:14px;"></p>

      <details style="margin-top:10px;">
        <summary>📍 How to paste coordinates manually</summary>
        <p style="font-size:13px;color:#888;">
          Android: long-press on Maps → copy coordinates.<br>
          iPhone: drop pin → swipe up → copy numbers.<br>
        </p>
        <input id="manualCoords" placeholder="52.4006,16.9012" style="width:90%;padding:6px;border-radius:6px;">
        <button id="manualCheck">Check manually</button>
      </details>
    </div>    
  `;

  document.querySelector('#checkLoc')!.addEventListener('click', async () => {
    const result = document.getElementById('result')!;
    result.textContent = 'Checking your GPS...';
    try {
      const user = await getUserLocation();
      const close = inRadius(user, palmiarnia.coords, 100);
      if (close) {
        result.textContent = '✅ You’re within 100 m of the Palm House! Challenge complete.';
      } else {
        const d = Math.round(distanceMeters(user, palmiarnia.coords));
        result.textContent = `❌ Too far (${d} m away). Get closer, traveller.`;
      }
    } catch (err) {
      result.textContent = '⚠️ Location error: ' + err;
    }
  });

  document.querySelector('#manualCheck')!.addEventListener('click', () => {
    const result = document.querySelector('#result')!;
    const coords = (document.querySelector('#manualCoords') as HTMLInputElement).value
      .split(',') 
      .map((x) => parseFloat(x.trim()));
    if (coords.length === 2) {
      const user = { lat: coords[0], lon: coords[1] };
      const close = inRadius(user, palmiarnia.coords, 100);
      if (close) result.textContent = '✅ Manual check: within 100 m!';
      else result.textContent = '❌ Still too far. Try again.';
    }
  }); 
}
