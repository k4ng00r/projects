import { confirmWithQuip } from "./ui/modal";
import { Engine } from "./engine";
import type { Params } from "./engine";
import { renderPalmiarnia } from './scenes/palmiarnia';

const app = document.querySelector<HTMLDivElement>("#app")!;

type SurfData = {
    lang: string;
    weather: string;
    cold: boolean;
};

// EKRAN STARTOWY
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

// START GRY
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
    if (ok) renderGame(surfData);
}

// GŁÓWNA GRA
async function renderGame(surfData: SurfData) {
    const nodes = await (await fetch("/content/nodes.json")).json();
    const i18n = await (await fetch(`/i18n/${surfData.lang}.json`)).json();
    const places = await (await fetch("/content/places.json")).json();

    // inicjalne parametry
    const params: Params = {
        charisma: 0,
        openess: 0,
        adventure: 0,
        comfort: 0,
        budget: 100,
        cold: surfData.cold,
    };
    const engine = new Engine(nodes, params);

    renderNode("start");

    async function renderNode(id: string) {
      const node = engine.getNode(id);
      app.innerHTML = '<div class="grid" id="grid"></div>';
      const grid = document.querySelector('#grid');
      if (!grid) return;
      grid.className = 'grid';
      grid?.setAttribute(
        'style',
        'display:grid;gap:12px;padding:16px;grid-template-columns:repeat(2,1fr);background:#0e0f12;color:#eee;'
      );

      if (node.textKey) {
        const text = i18n[node.textKey] || node.textKey;
        grid?.insertAdjacentHTML('beforebegin', `<h3 style="padding: 16px;">${text}</h3>`);
      }

      for (const choice of node.choices || []) {
        const label = i18n[choice.labelKey] || choice.labelKey;
        grid?.insertAdjacentHTML(
          'beforeend',
          `<div class="card" data-to="${choice.to}" style="background:#1a1c22;border:1px solid #2a2d36;border-radius:12px;overflow:hidden;cursor:pointer;padding:12px;">
            <h3>${label}</h3>
          </div>`
        );
      }

      grid?.querySelectorAll('.card').forEach((card) => {
        card.addEventListener('click', async () => {
          const to = (card as HTMLElement).dataset.to!;
          const ok = await confirmWithQuip('Are you sure?');
          if (!ok) return;
          const choice = node.choices?.find((c) => c.to === to);
          if (choice) engine.apply(choice);
          const paramsNow = engine.getParams();
          console.log('🧠 Player stats:', paramsNow);
          if (to === 'palmiarnia_scene') {
            const palmiarnia = places.find((p: any) => p.id === 'palmiarnia');
            await renderPalmiarnia(app, palmiarnia, i18n);
            return;
          }
          renderNode(to);
        });
      });
    }
}

renderStart();