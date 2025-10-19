// przykładowe dane (normalnie potem wczytamy z localStorage)
const palettes = [
    {
        id: "p1",
        name: "Australian Coast",
        date: "2025-10-18",
        colors: ["#00665E", "#D84B20", "#F2E6C9", "#274C77"],
    },
    {
        id: "p2",
        name: "Outback Sunset",
        date: "2025-10-19",
        colors: ["#A0522D", "#FF7F32", "#2A9DF4", "#5A7359"],
    },
    {
        id: "p3",
        name: "Eucalypt Dreams",
        date: "2025-10-20",
        colors: ["#1B4332", "#40916C", "#74C69D", "#B7E4C7"],
    },
];

// renderowanie kart palet
const renderPalettes = (list) => {
    const container = document.querySelector("#paletteList");
    container.innerHTML = ""; // wyczyść

    list.forEach((palette) => {
        const col = document.createElement("div");
        col.className = "col-12 col-md-6 col-lg-4";

        // budujemy html jednej karty
        const colorsHTML = palette.colors
            .map(
                (c) =>
                    `<div class="flex-fill" style="background:${c};height:40px;" title="${c}"></div>`
            )
            .join("");

        col.innerHTML = `
      <div class="card bg-secondary text-light border-0 shadow-sm">
        <div class="d-flex">${colorsHTML}</div>
        <div class="card-body">
          <h5 class="card-title">${palette.name}</h5>
          <p class="card-text text-muted small mb-2">${palette.date}</p>
          <a href="palette.html?id=${palette.id}" class="btn btn-outline-light btn-sm">Open</a>
        </div>
      </div>
    `;

        container.appendChild(col);
    });
};

// inicjalizacja
document.addEventListener("DOMContentLoaded", () => {
    renderPalettes(palettes);
});
