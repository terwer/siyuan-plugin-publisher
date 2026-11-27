/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { mount } from "@vue/test-utils"
import { nextTick } from "vue"
import { describe, expect, it, vi } from "vitest"
import { Post, YamlStrategy } from "zhi-blog-api"

const effectiveYaml = "---\ntitle: 新标题\nsticky: true\n---"
const yamlAdaptor = {
  convertToYaml: vi.fn(() => ({
    yamlObj: { title: "新标题", sticky: true },
    formatter: effectiveYaml,
    mdContent: "正文",
    mdFullContent: effectiveYaml + "\n正文",
    htmlContent: "<p>正文</p>",
  })),
  convertToAttr: vi.fn((post: Post) => post),
}

vi.mock("~/src/ui/composables/useAppI18n.ts", () => ({ useAppI18n: () => ({ t: (key: string) => key }) }))
vi.mock("~/src/composables/useSiyuanApi.ts", () => ({ useSiyuanApi: () => ({ kernelApi: {} }) }))
vi.mock("~/src/stores/usePreferenceSettingStore.ts", () => ({
  usePreferenceSettingStore: () => ({ getReadOnlyPublishPreferenceSetting: () => ({ value: {} }) }),
}))
vi.mock("~/src/adaptors/index.ts", () => ({ default: { getYamlAdaptor: vi.fn(async () => yamlAdaptor) } }))

import SourceMode from "~/src/ui/components/bridge/publish/form/SourceMode.vue"

const mountSourceMode = (props: Record<string, any>) =>
  mount(SourceMode, {
    props,
    global: {
      stubs: {
        "el-skeleton": true,
        "el-form-item": true,
        "el-alert": true,
        "el-button": true,
        "el-input": true,
      },
    },
  })

const buildPost = () => {
  const post = new Post()
  post.title = "旧标题"
  post.markdown = "正文"
  post.yaml = "---\ntitle: 旧标题\n---"
  post.yamlType = YamlStrategy.Yaml_custom_hand
  return post
}

const flushInit = async () => {
  await nextTick()
  await new Promise((resolve) => setTimeout(resolve, 20))
}

describe("SourceMode", () => {
  it("初始化时把含 YAML 预设的有效内容同步回表单模型（issue #1667）", async () => {
    const wrapper = mountSourceMode({
      modelValue: buildPost(),
      pageId: "",
      apiType: "github_Hexo",
      cfg: { dynYamlCfg: '{"sticky":true}' },
    })
    await flushInit()

    const emitted = wrapper.emitted("emitSyncPost") as Array<[Post]> | undefined
    expect(emitted).toHaveLength(1)
    expect(emitted![0][0].yaml).toBe(effectiveYaml)
    wrapper.unmount()
  })

  it("批量分发（没有单平台上下文）不回写 YAML", async () => {
    const post = buildPost()
    // 批量分发没有平台 YAML 适配器，初始化走通用分支
    post.yamlType = YamlStrategy.YAML_default
    const wrapper = mountSourceMode({ modelValue: post, pageId: "", apiType: "", cfg: {} })
    await flushInit()

    expect(wrapper.emitted("emitSyncPost")).toBeUndefined()
    wrapper.unmount()
  })
})
