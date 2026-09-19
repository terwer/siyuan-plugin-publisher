/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 */
import type { PageHelpConfig } from "~/src/types/IPageHelpConfig"

export const aiChatHelpConfig: PageHelpConfig = {
  pageId: "ai-chat",
  helpUrl: "https://siyuan.wiki/s/20240330142711-bc3gjg0",
  summary: "基于当前文档上下文与 AI 对话，支持自动生成标题、摘要、标签。",
  fields: {
    model: { tip: "选择 AI 模型。不同模型的能力和速度不同。" },
    apiKey: { tip: "填写你的 AI API Key，不会上传到服务器" },
  },
  faq: [
    { q: "AI 功能需要什么？", a: "需要配置有效的 API Key 和模型。支持 OpenAI 兼容接口。" },
  ],
}