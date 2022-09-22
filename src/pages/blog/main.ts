import {createApp} from 'vue'
import App from './App.vue'
import './style.css'
// 国际化
import i18n from "../../locales";

// Element-Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import './styles/dark/css-vars.css'

// hljs
import "../../lib/vue-hljs/vue-hljs.js"
// @ts-ignore
import vueHljs from "../../lib/vue-hljs/lib/vue-hljs/main.js";

// Vue初始化
const app = createApp(App)

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