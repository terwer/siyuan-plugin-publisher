/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 */
import type { PageHelpConfig } from "~/src/types/IPageHelpConfig"

export const quickPublishHelpConfig: PageHelpConfig = {
  pageId: "quick-publish",
  helpUrl: "https://siyuan.wiki/s/20240330142711-bc3gjg0",
  summary: "选择目标平台，填写文章信息，一键发布到已配置的账号。",
  fields: {
    targetPlatform: { tip: "选择已配置好的目标平台" },
    title: { tip: "文章标题，留空则使用思源文档标题" },
    tags: { tip: "逗号分隔多个标签，部分平台不支持标签" },
  },
  faq: [
    { q: "发布失败怎么办？", a: "查看错误详情，检查平台配置是否验证通过、网络是否连通。" },
    { q: "图片显示不出来？", a: "检查图床配置，确认 PicGo 或平台图床设置正确。" },
  ],
}