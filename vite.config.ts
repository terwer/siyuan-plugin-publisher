import { defineConfig, loadEnv } from "vite"
import vue from "@vitejs/plugin-vue"
import livereload from "rollup-plugin-livereload"
import minimist from "minimist"
import fg from "fast-glob"
import { createHtmlPlugin } from "vite-plugin-html"
import path from "path"
import AutoImport from "unplugin-auto-import/vite"
import Components from "unplugin-vue-components/vite"
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"
import { nodePolyfills } from "vite-plugin-node-polyfills"
import Icons from "unplugin-icons/vite"

// methods start
const getAppBase = (isSiyuanBuild: boolean, isWidgetBuild: boolean, isNginxBuild): string => {
  if (isSiyuanBuild) {
    return "/plugins/siyuan-plugin-publisher/"
  } else if (isWidgetBuild) {
    return "/widgets/sy-post-publisher/"
  } else if (isNginxBuild) {
    return "/"
  } else {
    return "/"
  }
}

const getDefineEnv = (isDevMode: boolean, debugMode: boolean) => {
  const mode = process.env.NODE_ENV
  const isTest = mode === "test"
  console.log("isServe=>", isServe)
  console.log("mode=>", mode)

  const defaultEnv = {
    DEV_MODE: `${isDevMode || isTest}`,
    DEBUG_MODE: `${debugMode || isTest}`,
    APP_BASE: `${appBase}`,
    NODE_ENV: "development",
    VITE_DEFAULT_TYPE: `siyuan`,
  }
  const env = loadEnv(mode, process.cwd())
  const processEnvValues = {
    "process.env": Object.entries(env).reduce((prev, [key, val]) => {
      return {
        ...prev,
        [key]: val,
      }
    }, defaultEnv),
  }
  const defineEnv = {
    ...processEnvValues,
    ...{},
  }
  console.log("defineEnv=>", defineEnv)

  return defineEnv
}
// methods end

// config
const args = minimist(process.argv.slice(2))
// 开启之后可以同eruda接管日志
const debugMode = process.env.DEBUG_MODE === "true"
const isServe = process.env.IS_SERVE
const isWatch = args.watch || args.w || false
const isDev = isServe || isWatch || debugMode
const outDir = args.o || args.outDir

const buildType = process.env.BUILD_TYPE
const isSiyuanBuild = process.env.BUILD_TYPE === "siyuan"
const isWidgetBuild = process.env.BUILD_TYPE === "widget"
const isNginxBuild = process.env.BUILD_TYPE === "nginx"
const distDir = outDir || (isWidgetBuild ? "widget" : "./dist")
const appBase = getAppBase(isSiyuanBuild, isWidgetBuild, isNginxBuild)

console.log("isWatch=>", isWatch)
console.log("debugMode=>", debugMode)
console.log("isDev=>", isDev)
console.log("distDir=>", distDir)
console.log("buildType=>", buildType)

// https://github.com/vuejs/vue-cli/issues/1198
// https://vitejs.dev/config/
// https://github.com/intlify/vue-i18n-next/issues/543
export default defineConfig({
  plugins: [
    vue(),

    Icons({
      autoInstall: true,
    }),

    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),

    createHtmlPlugin({
      minify: !isDev,
      inject: {
        // 在 body 标签底部插入指定的 JavaScript 文件
        tags:
          isDev && debugMode
            ? [
                {
                  tag: "script",
                  attrs: {
                    src: "./libs/eruda/eruda.js",
                  },
                  injectTo: "head-prepend",
                },
                {
                  tag: "script",
                  attrs: {
                    async: true,
                    src: "./libs/lute/lute-1.7.5-20230410.min.js",
                  },
                  injectTo: "head",
                },
                {
                  tag: "script",
                  attrs: {
                    async: true,
                    src: "./libs/alioss/aliyun-oss-sdk-6.16.0.min.js",
                  },
                  injectTo: "head",
                },
              ]
            : [
                {
                  tag: "script",
                  attrs: {
                    async: true,
                    src: "./libs/lute/lute-1.7.5-20230410.min.js",
                  },
                  injectTo: "head",
                },
                {
                  tag: "script",
                  attrs: {
                    async: true,
                    src: "./libs/alioss/aliyun-oss-sdk-6.16.0.min.js",
                  },
                  injectTo: "head",
                },
              ],
        data: {
          title: "eruda",
          injectScript: isDev && debugMode ? `<script>eruda.init();</script>` : "",
        },
      },
    }),

    // {
    //   name: "add-query-param",
    //   transformIndexHtml(html) {
    //     const timestamp = Date.now()
    //     html = html.replace(/(<script.+src=")([^"]+\.js)"/g, `$1$2?v=${timestamp}"`)
    //     html = html.replace(/(<link[^>]+href=")([^"]+(\.css|\.js))"/g, (match, p1, p2) => `${p1}${p2}?v=${timestamp}"`)
    //     // html = html.replace(/(<link rel=")modulepreload(" crossorigin href=")([^"]+\.js)"/g, `$1preload$2$3?v=${timestamp}"`);
    //     html = html.replace(/(<link rel=")modulepreload(" crossorigin href=")([^"]+\.js)"/g, `$1preload$2$3?v=${timestamp}" as="script"`);
    //     html = html.replace(/(<link[^>]+href=")([^"]+(\.css))"/g, (match, p1, p2) => `${p1}${p2}?v=${timestamp}"`)
    //     html = html.replace(/(<link[^>]+href=")([^"]+\.svg)"/g, `$1$2?v=${timestamp}"`)
    //     html = html.replace(/(<img[^>]+src=")([^"]+\.(jpe?g|gif|webp|bmp|png))"/g, `$1$2?v=${timestamp}"`)
    //     return html
    //   },
    // },

    // 在浏览器中polyfill node
    // https://github.com/davidmyersdev/vite-plugin-node-polyfills/blob/main/test/src/main.ts
    nodePolyfills({
      exclude: [],
      globals: {
        // can also be 'build', 'dev', or false
        Buffer: true,
        global: true,
        process: true,
      },
      protocolImports: true,
    }),
  ],

  base: "",

  // https://github.com/vitejs/vite/issues/1930
  // https://vitejs.dev/guide/env-and-mode.html#env-files
  // https://github.com/vitejs/vite/discussions/3058#discussioncomment-2115319
  // 在这里自定义变量
  define: getDefineEnv(isDev, debugMode),

  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./"),
    },
  },

  build: {
    // 输出路径
    outDir: distDir,
    emptyOutDir: false,

    // 构建后是否生成 source map 文件
    sourcemap: false,

    // 设置为 false 可以禁用最小化混淆
    // 或是用来指定是应用哪种混淆器
    // boolean | 'terser' | 'esbuild'
    // 不压缩，用于调试
    minify: !isDev,

    rollupOptions: {
      plugins: [
        ...(isWatch
          ? [
              livereload(distDir),
              {
                //监听静态资源文件
                name: "watch-external",
                async buildStart() {
                  const files = await fg(["src/assets/*", "./README*.md", "./widget.json"])
                  for (const file of files) {
                    this.addWatchFile(file)
                  }
                },
              },
            ]
          : []),
      ],

      // make sure to externalize deps that shouldn't be bundled into your library
      external: [],

      // output: {
      //   // add a query parameter to all JS and CSS file URLs
      //   chunkFileNames: "chunks/chunk.[name].js",
      //   entryFileNames: "entry.[name].js",
      //   assetFileNames: "assets/[name].[ext]",
      //   // manualChunks(id) {
      //   //   if (id.includes("node_modules")) {
      //   //     let arr = id.toString().split("node_modules/")[1].split("/")
      //   //     // pnpm单独处理
      //   //     if (id.includes(".pnpm")) {
      //   //       arr = id.toString().split(".pnpm/")[1].split("/")
      //   //     }
      //   //     const dep = arr[0].split("@")[0].replace(/\./g, "-")
      //   //     // console.log("id=>", id)
      //   //     // console.log("dep=>", dep)
      //   //     if (dep !== "") {
      //   //       return "vendor_" + dep
      //   //     }
      //   //     return "vendor"
      //   //   }
      //   // },
      // },
    },
  },

  test: {
    globals: true,
    environment: "jsdom",
    // environment: "node",
    // environment: "happy-dom",
    setupFiles: ["./src/setup.ts"],
    include: [
      "src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
      "cross/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
    ],
    server: {
      deps: {
        inline: ["element-plus"],
      },
    },
  },
} as any)
