import {App, Component} from "@vue/runtime-core";
import {createApp} from "vue";

// pinia
import {createPinia} from "pinia";

// 国际化
import i18n from "../locales";

// Element-Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import '../assets/style.css'
import '../assets/style.dark.css'

// hljs
import ".//vue-hljs/vue-hljs.js"
// @ts-ignore
import vueHljs from ".//vue-hljs/lib/vue-hljs/main.js";

/**
 * 统一的Vue实例创建入口
 * @param rootComponent
 */
const createPage = (rootComponent: Component): App => {
    // Vue初始化
    const app = createApp(rootComponent);

    // pinia
    const pinia = createPinia()
    app.use(pinia) //再挂载pinia

    // 组件注册
    // 国际化
    app.use(i18n)
    // Element-Plus
    app.use(ElementPlus)
    // vueHljs
    app.use(vueHljs)

    // Register a global custom directive called `v-focus`
    app.directive('focus', {
        // When the bound element is mounted into the DOM...
        mounted(el) {
            // Focus the element
            el.focus()
        }
    })

    // 挂载Vue
    app.mount('#app')

    return app;
}

const pageUtil = {
    createPage
}

export default pageUtil