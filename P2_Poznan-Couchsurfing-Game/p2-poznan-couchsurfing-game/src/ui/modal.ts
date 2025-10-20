export function confirmWithQuip(quip: string): Promise<boolean> {
    return new Promise((resolve) => {
        const el = document.createElement("div");
        el.className = "modal";
        el.innerHTML = `
      <div class="box">
        <h3>Are you sure?</h3>
        <p>${quip}</p>
        <button id="yes">Yes</button>
        <button id="no">No</button>
      </div>`;
        Object.assign(el.style, {
            position: "fixed",
            inset: "0",
            background: "rgba(0, 0, 0, .6)",
            display: "grid",
            placeItems: "center",
        });
        document.body.appendChild(el);
        (el.querySelector("#yes") as HTMLButtonElement).onclick = () => {
            el.remove();
            resolve(true);
        };
        (el.querySelector("#no") as HTMLButtonElement).onclick = () => {
            el.remove();
            resolve(false);
        };
    });
}
