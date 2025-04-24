import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "node:path";

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue()],

    resolve: {
        alias: {
            // '~/': path.resolve(__dirname, './'),
            '@': path.resolve(__dirname, './src'),
            "@components": path.resolve(__dirname, './src/components'),
            "@assets": path.resolve(__dirname, './src/assets'),
            "@constants": path.resolve(__dirname, './src/constants'),
            "@utils": path.resolve(__dirname, './src/utils'),
        }
    }
})
