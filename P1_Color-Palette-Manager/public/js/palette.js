// CREATE + UPDATE palettes in localStorage
const STORAGE_KEY = "palettes";

const loadPalettes = () =>
    JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
const savePalettes = (data) =>
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

let colors = [];
let editingPaletteId;

// DOM
const colorNameInput = document.querySelector("#colorName");
const colorPicker = document.querySelector("#colorPicker");
const addColorBtn = document.querySelector("#addColor");
const colorList = document.querySelector("#colorList");
const form = document.querySelector("#paletteForm");
const previewSection = document.querySelector("#previewSection");
const previewColors = document.querySelector("#previewColors");
const paletteNameInput = document.querySelector("#paletteName");

// --- INIT: sprawdź, czy to edycja (parametr ?id=)
document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (id) loadPaletteForEdit(id);
});

const loadPaletteForEdit = (id) => {
    const palettes = loadPalettes();
    const palette = palettes.find((p) => p.id == id);
    if (!palette) return;

    editingPaletteId = id;
    paletteNameInput.value = palette.name;
    colors = palette.colors;
    renderColors();
};

// --- dodawanie koloru
addColorBtn.addEventListener("click", () => {
    const name = colorNameInput.value.trim() || "Unnamed";
    const hex = colorPicker.value;
    const color = { id: Date.now(), name, hex };
    colors.push(color);
    renderColors();
    colorNameInput.value = "";
});

// Render current colors list
const renderColors = () => {
    colorList.innerHTML = "";
    previewColors.innerHTML = "";

    if (colors.length > 0) previewSection.classList.remove("d-none");
    else previewSection.classList.add("d-none");

    colors.forEach((c, index) => {
        const item = document.createElement("div");
        item.className =
            "d-flex align-items-center justify-content-between border p-2 mb-2 rounded bg-secondary";

        item.innerHTML = `
      <div class="d-flex align-items-center">
        <div style="width:24px;height:24px;background:${c.hex};border-radius:4px;margin-right:8px;"></div>
        <span>${c.name}</span>
      </div>
      <small class="text-muted">${c.hex}</small>
      <button class="btn btn-sm btn-outline-danger ms-2" data-index="${index}">x</button>
    `;
        colorList.appendChild(item);

        // preview stripe
        const stripe = document.createElement("div");
        stripe.style.background = c.hex;
        stripe.className = "flex-fill";
        stripe.style.height = "50px";
        previewColors.appendChild(stripe);
    });

    // delete buttons
    colorList.querySelectorAll("button").forEach((btn) =>
        btn.addEventListener("click", (e) => {
            const idx = e.target.dataset.index;
            colors.splice(idx, 1);
            renderColors();
        })
    );
};

// Save pallete
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.querySelector("#paletteName").value.trim();

    if (!name || colors.length === 0) {
        alert("Please provide a palette name and at least one color.");
        return;
    }

    const palettes = loadPalettes();

    if (editingPaletteId) {
        // UPDATE
        const index = palettes.findIndex((p) => p.id == editingPaletteId);
        if (index !== -1) {
            palettes[index] = {
                ...palettes[index],
                name,
                colors,
                date: new Date().toISOString().split("T")[0],
            };
        }
        alert("Palette updated!");
    } else {
        // CREATE
        const newPalette = {
            id: Date.now(),
            name,
            date: new Date().toISOString().split("T")[0],
            colors,
        };
        palettes.push(newPalette);
        alert("Palette saved!");
    }

    savePalettes(palettes);
    window.location.href = "index.html";
});
