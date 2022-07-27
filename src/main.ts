import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import i18n from "./locales";

// Vue初始化
const app = createApp(App)

// 国际化
app.use(i18n)

// 挂载Vue
app.mount('#app')