import {defineConfig} from 'vite'
import {loadEnv} from "vite";
import vue from '@vitejs/plugin-vue'
import vitePluginRequireTransform from 'vite-plugin-require-transform';
import rollupNodePolyFill from 'rollup-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
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

    return {
        plugins: [
            vue(),
            // @ts-ignore
            vitePluginRequireTransform.default(),
        ],
        base: './',
        // resolve: {
        //     alias: [
        //         // https://github.com/intlify/vue-i18n-next/issues/789
        //         // 修复国际化警告
        //         {
        //             find: 'vue-i18n',
        //             replacement: 'vue-i18n/dist/vue-i18n.cjs.js',
        //         }
        //     ]
        // },
        resolve: {
            alias: {
                'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
                'node-fetch': 'isomorphic-fetch',
                events: 'rollup-plugin-node-polyfills/polyfills/events',
            },
        },
        // https://github.com/vitejs/vite/issues/1930
        // https://vitejs.dev/guide/env-and-mode.html#env-files
        define: processEnvValues,
        // https://blog.csdn.net/weixin_44147791/article/details/125065039
        build: {
            rollupOptions: {
                plugins: [
                    // Enable rollup polyfills plugin used during production bundling
                    rollupNodePolyFill()
                ]
            }
        }
    }
})