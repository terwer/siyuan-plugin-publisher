import { defineConfig, type ConfigEnv, type UserConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import { resolve } from "path"
import minimist from "minimist"
import { viteStaticCopy } from "vite-plugin-static-copy"
import livereload from "rollup-plugin-livereload"
import fg from "fast-glob"
// import { nodePolyfills } from "vite-plugin-node-polyfills"

const args = minimist(process.argv.slice(2))
const isWatch = args.watch || args.w || false

export default defineConfig((env: ConfigEnv): UserConfig => {
  return {
    plugins: [
      vue(),
      viteStaticCopy({
        targets: [
          {
            src: "./README*.md",
            dest: "./",
          },
          {
            src: "./LICENSE",
            dest: "./",
          },
          {
            src: "./icon.png",
            dest: "./",
          },
          {
            src: "./preview.png",
            dest: "./",
          },
          {
            src: "./plugin.json",
            dest: "./",
          },
          {
            src: "./src/i18n/**",
            dest: "./i18n/",
          },
        ],
      }),
      // nodePolyfills({
      //   exclude: [],
      //   globals: {
      //     Buffer: true,
      //     global: true,
      //     process: true,
      //   },
      //   protocolImports: true,
      // }),
    ],
    define: {
      "process.env.NODE_ENV": isWatch ? '"development"' : '"production"',
      "process.env.DEV_MODE": `"${isWatch}"`,
      "process.env.SH_BUILD_TIME": new Date().getTime().toString(),
    },
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
        "@components": resolve(__dirname, "./src/components"),
        "@composables": resolve(__dirname, "./src/composables"),
        "@pages": resolve(__dirname, "./src/pages"),
        "@assets": resolve(__dirname, "./src/assets"),
        "@stores": resolve(__dirname, "./src/stores"),
        "@enums": resolve(__dirname, "./src/enums"),
        "@constants": resolve(__dirname, "./src/constants"),
        "@utils": resolve(__dirname, "./src/utils"),
      },
    },
    base: "",
    build: {
      outDir: "../../dist/siyuan",
      emptyOutDir: false,
      sourcemap: isWatch ? "inline" : false,
      minify: !isWatch,
      lib: {
        entry: resolve(__dirname, "src/index.ts"),
        fileName: "index",
        formats: ["cjs"],
      },
      rollupOptions: {
        external: ["siyuan"],
        plugins: [
          ...(isWatch
            ? [
                livereload("../../dist/siyuan"),
                {
                  name: "watch-external",
                  async buildStart() {
                    const files = await fg(["src/i18n/*.json", "./README*.md", "./plugin.json"])
                    for (const file of files) {
                      // @ts-ignore
                      this.addWatchFile(file)
                    }
                  },
                },
              ]
            : []),
        ],
        output: {
          entryFileNames: "[name].js",
          assetFileNames: (assetInfo) => {
            for (const name of assetInfo.names) {
              if (name === "style.css") {
                return "index.styl"
              }
            }
            return "[name][extname]"
          },
          banner: "/* Siyuan Publisher */",
          footer: "/* Copyright Terwer Inc. */",
        },
      },
    },
  }
})
