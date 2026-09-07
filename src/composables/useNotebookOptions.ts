/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { ref } from "vue"
import { useSiyuanApi } from "~/src/composables/useSiyuanApi.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { StrUtil } from "zhi-common"

/**
 * 可选择的笔记本项
 *
 * @public
 */
export interface NotebookOption {
  id: string
  name: string
  icon?: string
}

/**
 * 系统内置/用户指南笔记本名称（多种语言/形态），用于从发布源可选项里排除。
 * 这些是思源维护的、不可作为发布源的笔记本。
 *
 * @internal
 */
const SYSTEM_GUIDE_NAMES = [
  "用户指南",
  "用户指南教程",
  "user guide",
  "user_guide",
  "siyuan user guide",
  "使用指南",
]

/**
 * 判断笔记本是否为系统内置/用户指南，应被排除在发布源之外。
 *
 * @param name - 笔记本名称
 * @returns true 表示应排除
 * @public
 */
export const isSystemOrUserGuideNotebook = (name: string): boolean => {
  const n = (name || "").trim().toLowerCase()
  if (!n) {
    return false
  }
  return SYSTEM_GUIDE_NAMES.some((v) => n === v.toLowerCase())
}

/**
 * 笔记本是否应被排除：关闭（closed）或系统/用户指南。
 *
 * @param notebook - 内核 lsNotebooks 返回的笔记本对象
 * @returns true 表示应排除
 * @public
 */
export const shouldExcludeNotebook = (notebook: any): boolean => {
  if (!notebook) {
    return true
  }
  if (notebook.closed === true) {
    return true
  }
  return isSystemOrUserGuideNotebook(notebook.name)
}

/**
 * 加载可发布的笔记本选项（<br/>发布源可选集合）。
 *
 * 数据来源：`kernelApi.lsNotebooks()`；排除关闭的与系统/用户指南笔记本。
 * 供 V1/V2 共用（文章管理页过滤、偏好设置的多选）。
 *
 * @returns 响应式的选项列表、加载状态与加载方法
 * @public
 */
export const useNotebookOptions = () => {
  const logger = createAppLogger("use-notebook-options")
  const { kernelApi } = useSiyuanApi()
  const options = ref<NotebookOption[]>([])
  const isLoading = ref(false)

  const load = async () => {
    isLoading.value = true
    try {
      // lsNotebooks 在声明与运行时形态存在差异，这里用 any 兼容（notebooks 或 data.notebooks）
      const res: any = await kernelApi.lsNotebooks()
      const rawNotebooks = Array.isArray(res?.notebooks)
        ? res.notebooks
        : Array.isArray(res?.data?.notebooks)
          ? res.data.notebooks
          : []

      options.value = (rawNotebooks || [])
        .filter((nb: any) => !shouldExcludeNotebook(nb))
        .map((nb: any) => ({
          id: String(nb.id ?? ""),
          name: String(nb.name ?? ""),
          icon: nb.icon,
        }))
        .filter((item: NotebookOption) => item.id && !StrUtil.isEmptyString(item.name))
        .sort((a: NotebookOption, b: NotebookOption) => a.name.localeCompare(b.name))
    } catch (e) {
      logger.error("load notebooks failed=>", e)
      options.value = []
    } finally {
      isLoading.value = false
    }
  }

  return {
    options,
    isLoading,
    load,
  }
}
