import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ["vue", "pinia"],
  esbuildOptions(options) {
    options.alias = {
      "@": "./src",
    }
  },
})
