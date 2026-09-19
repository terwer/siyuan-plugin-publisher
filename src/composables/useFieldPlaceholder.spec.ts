/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/> and Contributors
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { describe, expect, it } from "vitest"
import { computed, defineComponent, h, provide } from "vue"
import { mount } from "@vue/test-utils"
import { useFieldPlaceholder } from "~/src/composables/useFieldPlaceholder.ts"
import { SYP_HELP_PAGE_ID_KEY } from "~/src/components/common/help/helpPageIdKey.ts"
import "~/src/helpConfigs/pages/index"

/**
 * 在给定 pageId（或不注入）下求值一次占位符。
 *
 * 注意：`inject()` 只沿**父级**链解析，组件 provide 给自己是取不到的；
 * 因此这里用「父组件 provide + 子组件 inject」还原 V2 的真实结构
 * （`V2PlatformConfigBridge` 提供，表单子组件消费）。
 */
const resolvePlaceholder = (field: string, fallback: string, pageId?: string): string => {
  let result = ""
  const child = defineComponent({
    setup() {
      const ph = useFieldPlaceholder()
      result = ph(field, fallback)
      return () => h("div")
    },
  })
  const parent = defineComponent({
    setup() {
      if (pageId) {
        provide(SYP_HELP_PAGE_ID_KEY, computed(() => pageId))
      }
      return () => h(child)
    },
  })
  mount(parent)
  return result
}

describe("useFieldPlaceholder", () => {
  it("V1（无 pageId 注入）：原样返回调用方文案，界面零变化", () => {
    const original = "存储目录例如：docs，部分平台可使用 [auto] 作为特殊占位符"
    expect(resolvePlaceholder("defaultPath", original)).toBe(original)
  })

  it("V2（有 pageId 注入）：返回该字段的示例值", () => {
    const original = "存储目录例如：docs，部分平台可使用 [auto] 作为特殊占位符"
    expect(resolvePlaceholder("defaultPath", original, "platform-config/github_Hexo")).toBe("source/_posts")
  })

  it("V2 但该字段没有登记示例值时，回退到调用方文案", () => {
    const original = "某个还没有示例值的字段说明"
    // pageType 是单选行，不承载占位符，因此没有示例值
    expect(resolvePlaceholder("pageType", original, "platform-config/github_Hexo")).toBe(original)
  })

  it("V2 但该字段未登记说明时，同样回退而不是给出空串", () => {
    const original = "兜底文案"
    expect(resolvePlaceholder("notARealField", original, "platform-config/github_Hexo")).toBe(original)
  })
})