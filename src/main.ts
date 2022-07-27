import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
// 国际化
import i18n from "./locales";

// Element-Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// Vue初始化
const app = createApp(App)

// 组件注册
// 国际化
app.use(i18n)
// Element-Plus
app.use(ElementPlus)

// 挂载Vue
app.mount('#app')