import { defineStore } from "pinia"
import { SypConfig } from "~/syp.config.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { useCommonStorageAsync } from "~/src/stores/common/useCommonStorageAsync.ts"
import { computed, ref } from "vue"

/**
 * 设置配置存储
 * https://pinia.vuejs.org/ssr/nuxt.html
 * 从0.9.0+ 开始，配置文件变更为 /data/storage/syp/sy-p-plus-cfg.json ，旧数据会自动迁移
 */
export const usePublishSettingStore = defineStore("setting", () => {
  const logger = createAppLogger("use-setting-store")
  const storageKey = "/data/storage/syp/sy-p-plus-cfg.json"
  const initialValue = SypConfig
  const { commonStore } = useCommonStorageAsync<typeof SypConfig>(storageKey, initialValue)
  const settingRef = ref<typeof SypConfig | null>(null)

  const getSettingRef = computed(async () => {
    const setting = await commonStore.get()
    logger.debug("get data from setting=>", setting)
    settingRef.value = setting
    return setting
  })

  /**
   * 获取配置
   */
  const getSetting = async (): Promise<typeof SypConfig> => {
    if (settingRef.value === null) {
      logger.info("Setting not initialized. Initializing now...")
      // 如果设置还没有被初始化，则调用 getSettingRef 函数
      const setting = getSettingRef.value
      logger.info(`Loaded setting from remote api`)
      return setting ?? {}
    }
    logger.info(`Loaded setting from cache.`)
    return settingRef.value ?? {}
  }

  /**
   * 修改配置
   *
   * @param setting - 需要修改的配置
   */
  const updateSetting = async (setting: Partial<typeof SypConfig>) => {
    logger.debug("update setting=>", setting)
    await commonStore.set(setting)
    settingRef.value = { ...settingRef.value, ...setting }
  }

  const checkKeyExists = (targetKey: string): boolean => {
    const obj = settingRef.value
    if (!obj) {
      return false
    }

    // 遍历所有属性名，检查是否存在目标属性
    for (const key in obj) {
      if (key === targetKey) {
        return true
      }
    }

    // 如果以上情况都不符合，则说明不存在目标属性
    return false
  }

  const deleteKey = (targetKey: string): void => {
    const obj = settingRef.value
    if (!obj) {
      return
    }

    // 遍历所有属性名，检查是否存在目标属性
    for (const key in obj) {
      if (key === targetKey) {
        delete obj[key]
        return
      }
    }
  }

  return { getSetting, updateSetting, checkKeyExists, deleteKey }
})
