import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

/*
  Unit tests for the pure data helpers only — the size and range labels every product
  image and spec row is drawn from, and the catalog repository. Components are verified
  by build + screenshot, not here.
*/
export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    include: ["src/**/*.test.ts"],
    environment: "node",
  },
});
