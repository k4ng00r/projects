// Klucz, pod którym trzymamy dane w locaStorage
const STORAGE_KEY = "palettes";

// Odczytaj palety z localStorage
const loadPalettes = () =>
    JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

// Zapisz palety do localStorage
const savePalettes = (data) =>
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

// Usuń paletę po id
const deletePalette = (id) => {
    const palettes = loadPalettes().filter((p) => p.id != id);
    savePalettes(palettes);
    renderPalettes(loadPalettes());
};

// Renderowanie kart
const renderPalettes = (list) => {
    const container = document.querySelector("#paletteList");
    container.innerHTML = "";

    if (list.length === 0) {
        container.innerHTML = `<p class="text-muted">No palettes yet. <a href="palette.html">Create one →</a></p>`;
        return;
    }

    list.forEach((palette) => {
        const col = document.createElement("div");
        col.className = "col-12 col-md-6 col-lg-4";

        const colorsHTML = palette.colors
            .map(
                (c) =>
                    `<div class="flex-fill" style="background:${c.hex};height:40px; title="${c.hex}"></div>`
            )
            .join("");

        col.innerHTML = `
      <div class="card bg-secondary text-light border-0 shadow-sm">
        <div class="d-flex">${colorsHTML}</div>
        <div class="card-body">
          <h5 class="card-title">${palette.name}</h5>
          <p class="card-text text-muted small mb-2">${palette.date}</p>
          <div class="d-flex gap-2">
            <a href="palette.html?id=${palette.id}" class="btn btn-outline-light btn-sm flex-grow-1">Edit</a>
            <button class="btn btn-outline-danger btn-sm flex-grow-1" data-id="${palette.id}">Delete</button>
          </div>
        </div>
      </div>
    `;

        container.appendChild(col);
    });

    // Obsługa przycisków "Delete"
    document.querySelectorAll("button[data-id]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const id = e.target.dataset.id;
            if (confirm("Delete this palette?")) deletePalette(id);
        });
    });
};

// Inicjalizacja
document.addEventListener("DOMContentLoaded", () => {
    const palettes = loadPalettes();
    renderPalettes(palettes);
});
