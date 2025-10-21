import { confirmWithQuip } from "./ui/modal";

type SurfData = {
    lang: string;
    weather: string;
    cold: boolean;
};

const app = document.querySelector<HTMLDivElement>("#app")!;

// funkcja do renderowania startowego ekranu wyborów
function renderStart() {
    app.innerHTML = `
    <style>
      body { margin:0; font-family: system-ui, sans-serif; background:#0e0f12; color:#eee }
      .wrap { display:flex; flex-direction:column; gap:16px; padding:24px; max-width:400px; margin:auto; text-align:center }
      select, button, label { padding:8px; font-size:16px; border-radius:8px; border:1px solid #444; background:#1a1c22; color:#eee; }
      button { cursor:pointer; }
    </style>
    <div class="wrap">
      <h2>🏙️ Poznań Couchsurfing RPG</h2>
      <label>
        Language:
        <select id="lang">
          <option value="en">English</option>
          <option value="de">Deutsch</option>
          <option value="fr">Français</option>
          <option value="it">Italiano</option>
          <option value="es">Español</option>
          <option value="el">Ελληνικά</option>
          <option value="cs">Čeština</option>
          <option value="sv">Svenska</option>
          <option value="ru">Русский</option>
          <option value="ar">العربية</option>
        </select>
      </label>

      <label>
        Weather:
        <select id="weather">
          <option value="sunny">☀️ sunny</option>
          <option value="cloudy">☁️ cloudy</option>
          <option value="rain">🌧️ rain</option>
          <option value="snow">❄️ snow</option>
        </select>
      </label>

      <label>
        Is it cold for you?
        <select id="cold">
          <option value="false">No</option>
          <option value="true">Yes</option>
        </select>
      </label>

      <button id="start">Let's go!</button>
    </div>`;

    document.querySelector("#start")?.addEventListener("click", startGame);
}

// kiedy klikniemy "Let's go!"
async function startGame() {
    const lang = (document.querySelector("#lang") as HTMLSelectElement).value;
    const weather = (document.querySelector("#weather") as HTMLSelectElement)
        .value;
    const cold =
        (document.querySelector("#cold") as HTMLSelectElement).value === "true";

    const surfData: SurfData = { lang, weather, cold };
    localStorage.setItem("surfer", JSON.stringify(surfData));

    const ok = await confirmWithQuip(
        "Ready? Poznań can be weird when it rains."
    );
    if (ok) renderGame();
}

async function renderGame() {
    const grid = document.createElement("div");
    grid.className = "grid";
    document.body.innerHTML = ""; // wyczyść ekran
    document.body.appendChild(grid);

    const nodes = await (await fetch("/content/nodes.json")).json();
    const places = await (await fetch("/content/places.json")).json();
    const i18n = await (await fetch("/i18n/en.json")).json();

    const palmiarnia = places.find((p: any) => p.id === "palmiarnia");

    grid.innerHTML = `
      <div class="card" data-to="palmiarnia_scene">
        <img src="${palmiarnia.thumbnail}" alt="">
        <h3>${i18n["go.palmiarnia"]}</h3>
      </div>`;

    grid.addEventListener("click", async (e) => {
        const card = (e.target as HTMLElement).closest(
            ".card"
        ) as HTMLElement | null;
        if (!card) return;
        const ok = await confirmWithQuip(
            "Warm jungle, seaty selfies, possible dehydration"
        );
        if (!ok) return;
        renderPalmiarnia(grid, palmiarnia, i18n);
    });
}

function renderPalmiarnia(grid: HTMLElement, palmiarnia: any, i18n: any) {
  grid.innerHTML = `
    <div class="card">
      <img src="${palmiarnia.thumbnail}" alt="">
      <h3>${i18n['node.palmiarnia.intro']}</h3>
    </div>`;
}

// odpal ekran startowy
renderStart();