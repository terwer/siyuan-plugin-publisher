import { defineConfig, normalizePath } from "vite"
import vue from "@vitejs/plugin-vue"
import path, { dirname, resolve } from "path"
import vueI18n from "@intlify/vite-plugin-vue-i18n"
import { createMpaPlugin } from "vite-plugin-virtual-mpa"
import Components from "unplugin-vue-components/vite"
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"
import { fileURLToPath } from "url"
import requireTransform from "vite-plugin-require-transform"

const isTest = process.env.TEST === "true"
console.log("isTest=>", isTest)

// https://vitejs.dev/config/
export default defineConfig(({ command, mode, ssrBuild }) => {
  return {
    plugins: [
      vue(),
      // https://github.com/emosheeep/vite-plugin-virtual-mpa
      createMpaPlugin({
        pages: [
          {
            name: "index",
            /**
             * filename is optional, default is `${name}.html`, which is the relative path of `build.outDir`.
             * output into index.html at build time.
             */
            filename: "index.html",
            entry: "/pages/index/main.ts",
            data: {
              title: "首页",
            },
          },
          {
            name: "blog",
            filename: "blog/index.html",
            entry: "/pages/blog/main.ts",
            data: {
              title: "文章列表查看",
            },
          },
          {
            name: "detail",
            filename: "detail/index.html",
            entry: "/pages/detail/main.ts",
            data: {
              title: "文章详情预览",
            },
          },
          {
            name: "publish",
            filename: "publish/index.html",
            entry: "/pages/publish/main.ts",
            data: {
              title: "多平台文章发布",
            },
          },
        ],
        /**
         * 通过该选项 rewrites 来配置 history fallback rewrite rules
         * 如果你像上面这样配置页面的话，那下面的这份配置将会自动生成。
         * 否则你需要自己编写重定向规则，自定义规则将覆盖默认规则。
         */
        rewrites: [
          {
            from: new RegExp(normalizePath(`/(blog|publish)`)),
            to: (ctx) => normalizePath(`/${ctx.match[1]}/index.html`),
          },
        ],
      }),
      vueI18n({
        // if you want to use Vue I18n Legacy API, you need to set `compositionOnly: false`
        // compositionOnly: false,
        // you need to set i18n resource including paths !
        include: resolve(
          dirname(fileURLToPath(import.meta.url)),
          "locales/index.ts"
        ),
      }),
      Components({
        resolvers: [
          ElementPlusResolver({
            importStyle: "sass",
          }),
        ],
      }),
      // https://github.com/WarrenJones/vite-plugin-require-transform/issues/10
      requireTransform(),
    ],
    resolve: {
      alias: {
        "~": path.resolve(__dirname, "./"),
      },
    },
    build: {
      rollupOptions: {
        output: {
          chunkFileNames: "static/js/[name]-[hash].js",
          entryFileNames: "static/js/[name]-[hash].js",
          assetFileNames: "static/[ext]/[name]-[hash].[ext]",
        },
        plugins: [],
      },
    },
    test: {
      globals: true,
      // environment: 'node',
      environment: "happy-dom",
      setupFiles: ["./test/setup.ts"],
      deps: {
        inline: ["element-plus"],
      },
    },
  }
})
