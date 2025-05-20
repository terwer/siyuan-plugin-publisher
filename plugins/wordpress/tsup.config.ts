import { defineConfig } from "tsup"
import { copyFileSync } from "fs"
import { resolve } from "path"

const isDev = process.env.NODE_ENV === "development"
const outDir = isDev 
  ? "../../dist/siyuan/plugins/wordpress"
  : "../../apps/siyuan/public/plugins/wordpress"

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["iife"],
  dts: true,
  splitting: false,
  sourcemap: false,
  clean: true,
  minify: true,
  globalName: "pt",
  outDir: outDir,
  outExtension() {
    return {
      js: ".js",
    }
  },
  noExternal: ["*"],
  treeshake: true,
  bundle: true,
  platform: "browser",
  target: "es5",
  injectStyle: false,
  esbuildOptions(options) {
    options.define = {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || "production")
    }
  },
  onSuccess: (options) => {
    // 复制 package.json 到 dist 目录
    const sourcePath = resolve(__dirname, "package.json")
    const targetPath = resolve(outDir, "package.json")
    copyFileSync(sourcePath, targetPath)
  }
}) 