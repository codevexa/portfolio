import { fileURLToPath } from "node:url"
import { defineConfig } from "vitest/config"

export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./", import.meta.url)) } },
  test: {
    include: ["tests/unit/**/*.test.ts", "tests/db/**/*.test.ts"],
    testTimeout: 120_000,
    hookTimeout: 120_000,
  },
})
