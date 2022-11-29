import {defineConfig, loadEnv} from 'vite'
import path, {dirname, resolve} from 'path'
import {fileURLToPath} from 'url'
import vue from '@vitejs/plugin-vue'
import vitePluginRequireTransform from 'vite-plugin-require-transform';
import {NodeGlobalsPolyfillPlugin} from '@esbuild-plugins/node-globals-polyfill'
import {NodeModulesPolyfillPlugin} from '@esbuild-plugins/node-modules-polyfill'
import rollupNodePolyFill from 'rollup-plugin-node-polyfills'
import vueI18n from '@intlify/vite-plugin-vue-i18n'
import mpa from 'vite-plugin-mpa'
import Components from 'unplugin-vue-components/vite';
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers';

// https://vitejs.dev/config/
export default defineConfig(({command, mode, ssrBuild}) => {
    const env = loadEnv(mode, process.cwd())
    const processEnvValues = {
        'process.env': Object.entries(env).reduce(
            (prev, [key, val]) => {
                return {
                    ...prev,
                    [key]: val,
                }
            },
            {},
        )
    }

    const isProd = process.env.NODE_ENV == "production"
    console.log("isProd=>", isProd)

    const isTest = process.env.TEST == "true"
    console.log("isTest=>", isTest)

    const isSiyuanBuild = process.env.BUILD_TYPE == "siyuan"
    console.log("isSiyuanBuild=>", isSiyuanBuild)

    const logInfoEnabled = env.VITE_LOG_INFO_ENABLED;
    console.log("logInfoEnabled=>", logInfoEnabled)

    return {
        plugins: [
            vue(),
            // https://github.com/WarrenJones/vite-plugin-require-transform/issues/10
            // @ts-ignore
            vitePluginRequireTransform.default({
                fileRegex: /.ts$|.vue$/
            }),
            vueI18n({
                // if you want to use Vue I18n Legacy API, you need to set `compositionOnly: false`
                // compositionOnly: false,
                // you need to set i18n resource including paths !
                include: resolve(dirname(fileURLToPath(import.meta.url)), 'src/locales/index.ts'),
            }),
            // @ts-ignore
            isTest ? '' : mpa.default(),
            Components({
                resolvers: [
                    ElementPlusResolver({
                        importStyle: 'sass',
                    }),
                ],
            }),
        ],
        // 项目根目录
        // root: process.cwd(),
        root: './',
        // 项目部署的基础路径
        base: isSiyuanBuild ? '/widgets/sy-post-publisher/' : "",
        // 静态资源服务文件夹
        publicDir: 'public',
        // https://github.com/vitejs/vite/issues/1930
        // https://vitejs.dev/guide/env-and-mode.html#env-files
        // 在这里自定义变量
        define: Object.assign(processEnvValues, {}),
        resolve: {
            alias: {
                "~": path.resolve(path.dirname(fileURLToPath(import.meta.url)), "src"),
                // 'vue-i18n': 'vue-i18n/dist/vue-i18n.runtime.esm-bundler.js',
                // 'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
                'node-fetch': 'cross-fetch',
                // This Rollup aliases are extracted from @esbuild-plugins/node-modules-polyfill,
                // see https://github.com/remorses/esbuild-plugins/blob/master/node-modules-polyfill/src/polyfills.ts
                // process and buffer are excluded because already managed
                // by node-globals-polyfill
                util: 'rollup-plugin-node-polyfills/polyfills/util',
                sys: 'util',
                events: 'rollup-plugin-node-polyfills/polyfills/events',
                stream: 'rollup-plugin-node-polyfills/polyfills/stream',
                path: 'rollup-plugin-node-polyfills/polyfills/path',
                querystring: 'rollup-plugin-node-polyfills/polyfills/qs',
                punycode: 'rollup-plugin-node-polyfills/polyfills/punycode',
                url: 'rollup-plugin-node-polyfills/polyfills/url',
                string_decoder: 'rollup-plugin-node-polyfills/polyfills/string-decoder',
                http: 'rollup-plugin-node-polyfills/polyfills/http',
                https: 'rollup-plugin-node-polyfills/polyfills/http',
                os: 'rollup-plugin-node-polyfills/polyfills/os',
                assert: 'rollup-plugin-node-polyfills/polyfills/assert',
                constants: 'rollup-plugin-node-polyfills/polyfills/constants',
                _stream_duplex: 'rollup-plugin-node-polyfills/polyfills/readable-stream/duplex',
                _stream_passthrough: 'rollup-plugin-node-polyfills/polyfills/readable-stream/passthrough',
                _stream_readable: 'rollup-plugin-node-polyfills/polyfills/readable-stream/readable',
                _stream_writable: 'rollup-plugin-node-polyfills/polyfills/readable-stream/writable',
                _stream_transform: 'rollup-plugin-node-polyfills/polyfills/readable-stream/transform',
                timers: 'rollup-plugin-node-polyfills/polyfills/timers',
                console: 'rollup-plugin-node-polyfills/polyfills/console',
                vm: 'rollup-plugin-node-polyfills/polyfills/vm',
                zlib: 'rollup-plugin-node-polyfills/polyfills/zlib',
                tty: 'rollup-plugin-node-polyfills/polyfills/tty',
                domain: 'rollup-plugin-node-polyfills/polyfills/domain',
                buffer: 'rollup-plugin-node-polyfills/polyfills/buffer-es6', // add buffer
                process: 'rollup-plugin-node-polyfills/polyfills/process-es6', // add process
            },
        },
        optimizeDeps: {
            esbuildOptions: {
                // Node.js global to browser globalThis
                define: {
                    global: 'globalThis'
                },
                // Enable esbuild polyfill plugins
                plugins: [
                    NodeGlobalsPolyfillPlugin({
                        process: true,
                        buffer: true
                    }),
                    NodeModulesPolyfillPlugin()
                ]
            }
        },
        build: {
            // 浏览器兼容性 ‘esnext’ | 'modules'
            target: 'modules',
            //输出路径
            outDir: './dist',
            // 生成静态资源的存放路径
            assetsDir: './assets',
            // 小于此阈值的导入或引用资源将内联为 base64 编码， 以避免额外的http请求， 设置为 0, 可以完全禁用此项，
            assetsInlineLimit: 4096,
            // 启动 / 禁用 CSS 代码拆分
            cssCodeSplit: true,
            // 构建后是否生成 source map 文件
            sourcemap: false,

            // 设置为 false 可以禁用最小化混淆
            // 或是用来指定是应用哪种混淆器
            // boolean | 'terser' | 'esbuild'
            // minify: 'terser',
            // 不压缩，用于调试
            minify: true,

            // @rollup/plugin-commonjs 插件的选项
            commonjsOptions: {
                // include: [/node_modules/, /public/],
                // extensions: ['.js', '.cjs'],
            },

            // 当设置为 true, 构建后将会生成 manifest.json 文件
            manifest: isProd,

            // 传递给 Terser 的更多 minify 选项
            // terserOptions: {},

            // 设置为false 来禁用将构建好的文件写入磁盘
            write: true,

            // 默认情况下 若 outDir 在 root 目录下， 则 Vite 会在构建时清空该目录。
            emptyOutDir: true,

            // chunk 大小警告的限制
            chunkSizeWarningLimit: 500,

            rollupOptions: {
                input: {
                    siyuanIndex: path.resolve(__dirname, 'index.html'),
                    index: path.resolve(__dirname, 'pages/blog/index.html'),
                    detail: path.resolve(__dirname, 'pages/detail/index.html'),
                    publish: path.resolve(__dirname, 'pages/publish/index.html'),
                },
                output: {
                    chunkFileNames: 'static/js/[name]-[hash].js',
                    entryFileNames: 'static/js/[name]-[hash].js',
                    assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
                },
                plugins: [
                    // Enable rollup polyfills plugin
                    // used during production bundling
                    rollupNodePolyFill()
                ]
            },
        },
        test: {
            globals: true,
            // environment: 'node',
            environment: 'happy-dom',
            setupFiles: ['./test/setup.ts'],
            deps: {
                inline: ['element-plus'],
            },
        },
    }
})