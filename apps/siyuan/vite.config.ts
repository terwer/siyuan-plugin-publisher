import { resolve } from "node:path"
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import minimist from "minimist"
import { viteStaticCopy } from "vite-plugin-static-copy"
// import externalize from "vite-plugin-externalize-dependencies";
import livereload from "rollup-plugin-livereload"
import fg from "fast-glob"

const args = minimist(process.argv.slice(2))
const isWatch = args.watch || args.w || false
// const distDir = "./dist";
const distDir = "../../dist/siyuan"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),

    // externalize({
    //   externals: [
    //     // "react", // Externalize "react", and all of its subexports (react/*), such as react/jsx-runtime
    //     "siyuan",
    //     // /^external-.*/, // Externalize all modules starting with "external-"
    //     // (moduleName) => moduleName.includes("external"), // Externalize all modules containing "external",
    //   ],
    // }) as any,

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
  ],

  base: "",

  // https://github.com/vitejs/vite/issues/1930
  // https://vitejs.dev/guide/env-and-mode.html#env-files
  // https://github.com/vitejs/vite/discussions/3058#discussioncomment-2115319
  // 在这里自定义变量
  define: {
    "process.env.NODE_ENV": isWatch ? "\"development\"" : "\"production\"",
    "process.env.DEV_MODE": `"${isWatch}"`,
    "process.env.SH_BUILD_TIME": new Date().getTime().toString(),
  },

  resolve: {
    external: ["siyuan"],
  },

  build: {
    // 输出路径
    outDir: distDir,
    emptyOutDir: false,

    // 构建后是否生成 source map 文件
    sourcemap: isWatch ? "inline" : false,

    // 设置为 false 可以禁用最小化混淆
    // 或是用来指定是应用哪种混淆器
    // boolean | 'terser' | 'esbuild'
    // 不压缩，用于调试
    minify: !isWatch,

    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, "src/index.ts"),
      // the proper extensions will be added
      fileName: "index",
      formats: ["cjs"],
    },

    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["siyuan"],
      plugins: [
        ...(isWatch
          ? [
              livereload(distDir),
              {
                //监听静态资源文件
                name: "watch-external",
                async buildStart() {
                  const files = await fg([
                    "src/i18n/*.json",
                    "./README*.md",
                    "./plugin.json",
                  ])
                  for (const file of files) {
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
              return "Home.styl"
            }
          }
          return "[name][extname]"
        },
        banner: "/* Siyuan blog*/",
        footer: "/* Copyright Terwer Inc. */",
      },
    },
  },
})
