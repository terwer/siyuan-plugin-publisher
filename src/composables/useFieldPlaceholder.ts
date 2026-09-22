/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

/**
 * 平台配置表单的占位符取值：平台配置页用「示例值」，其余场景保持原有文案。
 *
 * 背景：这些表单的占位符原本是**长说明**（如「存储目录例如：docs，部分平台可使用 [auto] 作为特殊占位符…」）。
 * 这类文案一旦用户开始输入就消失，等于把说明放在最留不住信息的位置；而同一字段的含义
 * 已经由行尾的 ⓘ（`fields.tip`）讲清楚了。于是平台配置页的占位符改为只给**示例值**
 * （如 `docs`、`/post/[postid].html`），说明交给 ⓘ，两者不再重复。
 *
 * 生效边界：仅当**有 pageId 注入**时改用示例值，而 pageId 只由
 * `PlatformConfigBridge` 提供；没有注入时原样返回调用方文案。
 *
 * @author terwer
 * @since 1.42.0
 */
import { inject } from "vue"
import { SYP_HELP_PAGE_ID_KEY } from "~/src/ui/components/bridge/common/help/helpPageIdKey.ts"
import { helpRegistry } from "~/src/helpConfigs/registry"

/**
 * 返回「取占位符」的函数。
 *
 * @returns 传入 `field`（该行绑定的配置属性名）与该字段的原文案，返回示例值或原文案
 */
const useFieldPlaceholder = () => {
  const injectedPageId = inject(SYP_HELP_PAGE_ID_KEY, undefined)

  return (field: string, fallback: string): string => {
    const pageId = injectedPageId?.value
    if (!pageId) {
      return fallback
    }
    return helpRegistry.getField(pageId, field)?.placeholder ?? fallback
  }
}

export { useFieldPlaceholder }