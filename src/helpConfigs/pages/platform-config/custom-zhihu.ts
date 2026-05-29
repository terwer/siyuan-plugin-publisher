/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 */
import type { PageHelpConfig } from "~/src/types/IPageHelpConfig"

export const zhihuHelpConfig: PageHelpConfig = {
  pageId: "platform-config/custom_Zhihu",
  helpUrl: "https://siyuan.wiki/s/20240330142711-bc3gjg0",
  summary: "通过 Cookie 授权发布到知乎专栏。V2 已验证配置、发布、更新、删除和平台内置图片链路；知乎专栏归属当前不可编辑。",
  fields: {
    home: { tip: "默认是知乎专栏地址 https://zhuanlan.zhihu.com，通常不需要修改。" },
    apiUrl: { tip: "默认是知乎专栏 API 地址，除非平台接口变更，一般保持默认。" },
    cookie: { tip: "先在浏览器登录知乎，再自动读取或手动粘贴 Cookie。Cookie 过期后需要重新读取。" },
    knowledgeSpace: { tip: "知乎专栏。由于平台限制，已发布文档暂不支持编辑所属专栏。" },
    pageType: { tip: "知乎 V2 使用 HTML 发布。" },
    picbedService: { tip: "知乎已验证平台内置图片链路；配置默认使用 Bundled，PicGo 不适用。" },
  },
  faq: [
    { q: "为什么不能修改所属专栏？", a: "知乎平台限制导致已发布文档暂不支持直接编辑专栏。需要移动时，取消/删除原文后重新选择专栏发布。" },
    { q: "Cookie 验证失败？", a: "确认浏览器已登录知乎、账号可访问专栏后台，并重新读取 Cookie。" },
    { q: "图片该选什么图床？", a: "本次 V2 验证覆盖了知乎平台内置图片链路，默认 Bundled 即可。" },
  ],
  tour: [
    {
      target: "[data-syp-tour='cookie']",
      title: "Cookie 授权",
      content: "先登录知乎，再读取 Cookie。知乎 Cookie 过期或切换账号后需要重新验证。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='knowledgeSpace']",
      title: "专栏选择",
      content: "选择发布目标专栏。知乎平台限制下，已发布文档暂不支持编辑所属专栏。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='picbedService']",
      title: "图片发布",
      content: "知乎 V2 已验证平台内置图片上传，保持 Bundled 配置即可。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='validate']",
      title: "验证并保存",
      content: "验证 Cookie 和专栏读取成功后再保存配置。",
      placement: "top",
    },
  ],
}
