/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 */
import type { PageHelpConfig } from "~/src/types/IPageHelpConfig"

export const zhihuHelpConfig: PageHelpConfig = {
  pageId: "platform-config/custom_Zhihu",
  helpUrl: "https://siyuan.wiki/s/20240330142711-bc3gjg0",
  summary: "通过 Cookie 授权发布到知乎专栏。图片默认上传到知乎；已发布文章暂不支持更换所属专栏。",
  fields: {
    home: { tip: "默认是知乎专栏地址 https://zhuanlan.zhihu.com，通常不需要修改。" },
    apiUrl: { tip: "默认是知乎专栏 API 地址，除非平台接口变更，一般保持默认。" },
    username: {
      tip: "你的知乎用户名，即个人主页地址 zhihu.com/people/<用户名> 里的那一段。必须填对，否则读取不到专栏列表。",
    },
    password: {
      tip:
        "Cookie 授权：点「1 去登录」登录知乎，关闭登录窗口保存登录态后点「2 自动读取 Cookie」写入本账号；" +
        "也可展开「手动编辑」直接粘贴 Cookie。Cookie 过期后需要重新读取。",
    },
    previewUrl: { tip: "查看文章链接模板，默认 /p/[postid]，与知乎文章地址一致，通常保持默认。" },
    pageType: { tip: "正文提交格式，知乎网页版使用 HTML 发布，保持默认的 HTML。" },
    blogid: {
      tip: "要发布到的知乎专栏；验证通过后会读取该账号可发布的专栏列表。已发布文章暂不支持更换所属专栏。",
    },
    picbedService: {
      tip:
        "图片发布方式：默认「当前平台」，图片随文章上传到知乎；也可选「不使用」按原图地址引用（需公网可访问）。" +
        "知乎网页版未提供 PicGo 选项。",
    },
  },
  faq: [
    { q: "为什么不能修改所属专栏？", a: "知乎平台限制导致已发布文档暂不支持直接编辑专栏。需要移动时，取消/删除原文后重新选择专栏发布。" },
    { q: "读取不到专栏？", a: "先确认「用户名」填的是知乎用户名（个人主页地址里那一段），并已读取 Cookie，然后再点验证。" },
    { q: "Cookie 验证失败？", a: "确认浏览器已登录知乎、账号可访问专栏后台，并重新读取 Cookie。" },
    { q: "图片该选什么图床？", a: "默认「当前平台」即可，图片随文章上传到知乎。" },
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
      content: "知乎使用平台内置图片上传，保持 Bundled 配置即可。",
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
