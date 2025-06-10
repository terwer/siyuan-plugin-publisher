import { ref, watch } from "vue"

const CONFIG_KEY = "publisher-config"

export interface GlobalConfig {
  name: string
  theme: "light" | "dark"
  language: "zh_CN" | "en_US"
  autoSave: boolean
  defaultPlatform: string
  publishOptions: {
    defaultStatus: "draft" | "published" | "scheduled"
    defaultCategories: string
    defaultTags: string
  }
}

const defaultConfig: GlobalConfig = {
  name: "",
  theme: "light",
  language: "zh_CN",
  autoSave: true,
  defaultPlatform: "",
  publishOptions: {
    defaultStatus: "draft",
    defaultCategories: "",
    defaultTags: "",
  },
}

export function useConfig() {
  // 从 localStorage 获取配置，如果没有则使用默认配置
  const config = ref<GlobalConfig>(() => {
    const savedConfig = localStorage.getItem(CONFIG_KEY)
    return savedConfig ? JSON.parse(savedConfig) : defaultConfig
  })

  // 监听配置变化
  watch(
    config,
    (newConfig) => {
      // 保存到 localStorage
      localStorage.setItem(CONFIG_KEY, JSON.stringify(newConfig))
    },
    { deep: true },
  )

  // 重置配置
  const resetConfig = () => {
    config.value = { ...defaultConfig }
  }

  // 导出配置
  const exportConfig = () => {
    const configStr = JSON.stringify(config.value, null, 2)
    const blob = new Blob([configStr], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "publisher-config.json"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // 导入配置
  const importConfig = (configStr: string) => {
    try {
      const newConfig = JSON.parse(configStr)
      config.value = { ...defaultConfig, ...newConfig }
      return { success: true }
    } catch (error) {
      return { success: false, error: "无效的配置文件" }
    }
  }

  return {
    config,
    resetConfig,
    exportConfig,
    importConfig,
  }
} 