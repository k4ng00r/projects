// CREATE palette with color picker
let colors = [];

// DOM elements
const colorNameInput = document.querySelector("#colorName");
const colorPicker = document.querySelector("#colorPicker");
const addColorBtn = document.querySelector("#addColor");
const colorList = document.querySelector("#colorList");
const form = document.querySelector("#paletteForm");
const previewSection = document.querySelector("#previewSection");
const previewColors = document.querySelector("#previewColors");

// Add color to currect palette
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

    const newPalette = {
        id: Date.now(),
        name,
        date: new Date().toISOString().split("T")[0],
        colors,
    };

    console.log('New palette created:', newPalette);

    // TODO: save to localStorage (in next step)
    alert('Palette created successfully (mock). Check console for details.');
    form.reset();
    colors = [];
    renderColors();
});
