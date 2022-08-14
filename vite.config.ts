import {defineConfig} from 'vite'
import {loadEnv} from "vite";
import vue from '@vitejs/plugin-vue'
import vitePluginRequireTransform from 'vite-plugin-require-transform';

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
            // https://github.com/WarrenJones/vite-plugin-require-transform/issues/10
            // @ts-ignore
            vitePluginRequireTransform.default({
                fileRegex: /.ts$|.vue$/
            }),
        ],
        base: './',
        // https://github.com/vitejs/vite/issues/1930
        // https://vitejs.dev/guide/env-and-mode.html#env-files
        // 在这里自定义变量
        define: Object.assign(processEnvValues, {}),
        resolve: {
            alias: {
                'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
                'node-fetch': 'isomorphic-fetch',
            },
        },
    }
})