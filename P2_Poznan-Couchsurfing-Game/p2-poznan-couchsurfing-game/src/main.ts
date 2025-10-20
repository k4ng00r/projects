import { confirmWithQuip } from "./ui/modal";

const app = document.querySelector<HTMLDivElement>("#app")!;
app.innerHTML = `
  <style>
    body { margin:0; font-family: system-ui, sans-serif; background:#0e0f12; color:#eee }
    .grid { display:grid; gap:12px; padding:16px; grid-template-columns:repeat(2,1fr) }
    .card { background:#1a1c22; border:1px solid #2a2d36; border-radius:12px; overflow:hidden; cursor:pointer }
    .card img { width:100%; height:120px; object-fit:cover }
    .card h3 { margin:8px 12px 12px }
  </style>
  <div class="grid" id="grid"></div>
`;

const grid = document.getElementById('grid');
if (!grid) {
  throw new Error("Element #grid nie został znaleziony w DOM.");
}

const nodes = await (await fetch("/content/nodes.json")).json();
const places = await (await fetch("/content/places.json")).json();
const i18n = await (await fetch("/i18n/en.json")).json();

const start = nodes.find((n: any) => n.id === "start");
const palmiarnia = places.find((p: any) => p.id === "palmiarnia");

grid.innerHTML = `
  <div class="card" data-to="palmiarnia_scene">
    <img src="${palmiarnia.thumbnail}" alt="">
    <h3>${i18n["go.palmiarnia"]}</h3>
  </div>
`;

grid.addEventListener('click', async (e) => {
  const card = (e.target as HTMLElement).closest('.card') as HTMLElement | null;
  if (!card) return;
  const ok = await confirmWithQuip("Warm jungle, sweaty selfies, possible dehydration.");
  if (!ok) return;
  renderPalmiarnia();
});

function renderPalmiarnia() {
  const node = nodes.find((n: any) => n.id === 'palmiarnia_scene');
  const grid = document.getElementById('grid');
  if (!grid) return; // TypeScript szczęśliwy
  grid.innerHTML = `
    <div class="card">
      <img src="${palmiarnia.thumbnail}" alt="">
      <h3>${i18n['node.palmiarnia.intro']}</h3>
    </div>
  `;
}