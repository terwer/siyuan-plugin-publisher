import type { PlatformType, Plugin, PluginManifest, PluginType } from "@siyuan-publisher/common"

/**
 * 验证插件清单
 * @param manifest 插件清单
 * @returns 是否有效
 */
export function validateManifest(manifest: any): manifest is PluginManifest {
  if (typeof manifest !== "object" || manifest === null) {
    return false
  }

  const requiredFields = ["id", "name", "version", "description", "author", "main", "type"]
  const hasRequiredFields = requiredFields.every(
    (field) => typeof manifest[field] === "string" && manifest[field].length > 0,
  )

  if (!hasRequiredFields) {
    return false
  }

  // 验证类型字段
  if (!["adapter", "plugin"].includes(manifest.type)) {
    return false
  }

  // 验证版本号格式
  if (!/^\d+\.\d+\.\d+$/.test(manifest.version)) {
    return false
  }

  return true
}

/**
 * 类型守卫：检查是否为平台类型
 */
function isPlatformType(type: PluginType): type is PlatformType {
  return type !== "plugin"
}

/**
 * 验证插件类型
 * @param plugin 插件实例
 * @param type 插件类型
 * @returns 是否匹配
 */
export function validatePluginType(plugin: Plugin, type: PluginType): boolean {
  if (!plugin || typeof plugin !== "object") {
    return false
  }

  if (isPlatformType(type)) {
    return typeof (plugin as any).getPlatformAdapter === "function"
  }
  if (type === "plugin") {
    return typeof (plugin as any).processPost === "function"
  }
  return false
}

/**
 * 检查插件依赖
 * @param plugin 插件实例
 * @param loadedPlugins 已加载的插件列表
 * @returns 是否满足依赖
 */
export function checkDependencies(plugin: Plugin, loadedPlugins: Map<string, Plugin>): boolean {
  const manifest = (plugin as any).manifest as PluginManifest
  if (!manifest?.dependencies) {
    return true
  }

  // 检查所有依赖是否已加载
  const allDependenciesLoaded = Object.keys(manifest.dependencies).every((depId) => loadedPlugins.has(depId))

  if (!allDependenciesLoaded) {
    return false
  }

  // 检查依赖版本兼容性
  return Object.entries(manifest.dependencies).every(([depId, requiredVersion]) => {
    const depPlugin = loadedPlugins.get(depId)
    if (!depPlugin) {
      return false
    }

    const depVersion = depPlugin.version
    return isVersionCompatible(depVersion, requiredVersion)
  })
}

/**
 * 获取插件状态
 * @param plugin 插件实例
 * @returns 插件状态
 */
export function getPluginStatus(plugin: Plugin): "loading" | "loaded" | "error" | "unloaded" {
  if (!plugin) {
    return "unloaded"
  }

  try {
    const config = plugin.getConfig()
    return config.enabled ? "loaded" : "unloaded"
  } catch {
    return "error"
  }
}

/**
 * 检查版本兼容性
 * @param currentVersion 当前版本
 * @param requiredVersion 所需版本
 * @returns 是否兼容
 */
function isVersionCompatible(currentVersion: string, requiredVersion: string): boolean {
  const [currentMajor, currentMinor, currentPatch] = currentVersion.split(".").map(Number)
  const [requiredMajor, requiredMinor, requiredPatch] = requiredVersion.split(".").map(Number)

  if (currentMajor !== requiredMajor) {
    return false
  }

  if (currentMinor < requiredMinor) {
    return false
  }

  if (currentMinor === requiredMinor && currentPatch < requiredPatch) {
    return false
  }

  return true
}
