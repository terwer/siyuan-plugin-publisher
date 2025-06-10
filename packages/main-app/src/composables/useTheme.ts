import { ref, watch } from "vue"

const THEME_KEY = "tg-theme-mode"
const DEFAULT_THEME = "light"

export function useTheme() {
  // 从 localStorage 获取主题，如果没有则使用默认主题
  const theme = ref(localStorage.getItem(THEME_KEY) || DEFAULT_THEME)

  // 监听主题变化
  watch(
    theme,
    (newTheme) => {
      // 更新 HTML 的 data-theme-mode 属性
      document.documentElement.setAttribute("data-theme-mode", newTheme)
      // 保存到 localStorage
      localStorage.setItem(THEME_KEY, newTheme)
    },
    { immediate: true },
  )

  // 切换主题
  const toggleTheme = () => {
    theme.value = theme.value === "light" ? "dark" : "light"
  }

  // 设置主题
  const setTheme = (newTheme: "light" | "dark") => {
    theme.value = newTheme
  }

  return {
    theme,
    toggleTheme,
    setTheme,
  }
}
