import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

export default defineConfig({
    plugins: [preact()],
    // USTAW bazę pod GirHub Pages (nazwa repo jako podkatalog)
    base: "/p2-poznan-couchsurfing-game/",
});
