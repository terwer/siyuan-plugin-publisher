/// <reference types="vitest" />

import { resolve } from "path"
import { defineConfig } from "vite"
import minimist from "minimist"
import { viteStaticCopy } from "vite-plugin-static-copy"
import livereload from "rollup-plugin-livereload"

const args = minimist(process.argv.slice(2))
const isWatch = args.watch || args.w
const devDistDir = "/Users/terwer/Documents/mydocs/SiYuanWorkspace/public/data/plugins/publish-tool"
const distDir = isWatch ? devDistDir : "./dist"

console.log("isWatch=>", isWatch)
console.log("distDir=>", distDir)

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: "../../README*.md",
          dest: "./",
        },
      ],
    }),
  ],

  // 项目根目录
  // root: "./",

  // 项目部署的基础路径
  // base: "",

  // 静态资源服务文件夹
  // publicDir: "public",

  build: {
    // 浏览器兼容性 ‘esnext’ | 'modules'
    // https://vitejs.dev/config/build-options.html#build-target
    // target: "modules",

    // 输出路径
    outDir: distDir,

    // 生成静态资源的存放路径
    // assetsDir: "./assets",
    // 小于此阈值的导入或引用资源将内联为 base64 编码， 以避免额外的http请求， 设置为 0, 可以完全禁用此项，
    assetsInlineLimit: 4096,
    // 启动 / 禁用 CSS 代码拆分
    cssCodeSplit: true,
    // 构建后是否生成 source map 文件
    sourcemap: false,

    // 设置为 false 可以禁用最小化混淆
    // 或是用来指定是应用哪种混淆器
    // boolean | 'terser' | 'esbuild'
    // 不压缩，用于调试
    minify: isWatch ? false : "terser",
    terserOptions: {
      compress: {
        // 生产环境时移除console
        drop_console: true,
        drop_debugger: true,
      },
    },

    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, "src/index.ts"),
      // the proper extensions will be added
      fileName: "index",
      formats: ["cjs"],
    },

    rollupOptions: {
      plugins: [...(isWatch ? [livereload(devDistDir)] : [])] as Plugin[],

      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["siyuan"],

      output: {
        chunkFileNames: "static/js/[name]-[hash].js",
        // entryFileNames: "static/js/[name]-[hash].js",
        entryFileNames: "[name].js",
        assetFileNames: "static/[ext]/[name]-[hash].[ext]",
        manualChunks(id) {
          if (id.includes("node_modules")) {
            let arr = id.toString().split("node_modules/")[1].split("/")
            // pnpm单独处理
            if (id.includes(".pnpm")) {
              arr = id.toString().split(".pnpm/")[1].split("/")
            }
            const dep = arr[0].split("@")[0].replace(/\./g, "-")
            // console.log("id=>", id)
            // console.log("dep=>", dep)
            if (dep !== "") {
              return "vendor_" + dep
            }
            return "vendor"
          }
        },
      },
    },
  },

  test: {
    globals: true,
    // environment: "node",
    environment: "jsdom",
    // setupFiles: ["./setup.ts"],
    deps: {
      // inline: [],
    },
    include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
  },
})
