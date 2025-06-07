import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import './custom.css'

export default {
    ...DefaultTheme,
    enhanceApp({ app }) {
        // 在这里可以注册全局组件
    }
} 