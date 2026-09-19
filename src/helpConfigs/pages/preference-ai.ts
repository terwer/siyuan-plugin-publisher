/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 */
import type { PageHelpConfig } from "~/src/types/IPageHelpConfig"

export const preferenceAiHelpConfig: PageHelpConfig = {
  pageId: "preference-ai",
  helpUrl: "https://siyuan.wiki/s/20240330142711-bc3gjg0",
  summary: "配置 AI 服务，用于自动生成标题、摘要、标签和分类。支持 OpenAI 兼容接口。",
  fields: {
    apiKey: { tip: "AI 服务 API Key，仅保存在本地，不会上传" },
    model: { tip: "选择 AI 模型，推荐使用价格较低的模型如 gpt-4o-mini" },
    baseUrl: { tip: "API Base URL，使用第三方中转时填写，默认留空即可" },
  },
  faq: [
    { q: "支持哪些 AI 模型？", a: "所有兼容 OpenAI API 格式的模型均可使用。" },
    { q: "费用如何？", a: "每次生成消耗少量 token，推荐使用 gpt-4o-mini 等经济模型。" },
  ],
}