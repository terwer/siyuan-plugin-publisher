/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 */
import type { PageHelpConfig } from "~/src/types/IPageHelpConfig"

export const csdnHelpConfig: PageHelpConfig = {
  pageId: "platform-config/custom_Csdn",
  helpUrl: "https://siyuan.wiki/s/20240330142711-bc3gjg0",
  summary: "通过 Cookie 授权发布到 CSDN。图片默认上传到 CSDN；默认使用 Markdown 发布。",
  fields: {
    home: { tip: "默认是 CSDN 博客首页 https://blog.csdn.net，通常保持默认。" },
    apiUrl: { tip: "默认是 CSDN 业务 API 地址 https://bizapi.csdn.net，通常保持默认。" },
    password: {
      tip:
        "Cookie 授权：点「1 去登录」登录 CSDN 创作中心，关闭登录窗口保存登录态后点「2 自动读取 Cookie」写入本账号；" +
        "也可展开「手动编辑」直接粘贴 Cookie。Cookie 过期后需要重新读取。",
    },
    previewUrl: {
      tip: "查看文章链接模板，默认 /[userid]/article/details/[postid]，与 CSDN 文章地址一致，通常保持默认。",
    },
    pageType: { tip: "正文提交格式，CSDN 默认使用 Markdown 发布，保持默认的 Markdown。" },
    picbedService: {
      tip:
        "图片发布方式：默认「当前平台」，图片随文章上传到 CSDN；也可选「不使用」按原图地址引用（需公网可访问）。" +
        "CSDN 网页版未提供 PicGo 选项。",
    },
  },
  faq: [
    { q: "Cookie 验证失败？", a: "确认浏览器已登录 CSDN 创作中心，并重新读取 Cookie。" },
    { q: "图片发布该选什么？", a: "默认「当前平台」即可，图片随文章上传到 CSDN，不需要额外配置 PicGo。" },
    { q: "文章分类或标签异常？", a: "CSDN 支持分类和标签，发布前确认当前账号创作中心可以正常读取相关数据。" },
  ],
  tour: [
    {
      target: "[data-syp-tour='cookie']",
      title: "Cookie 授权",
      content: "先登录 CSDN 创作中心，再读取 Cookie。切换账号或登录过期后需要重新读取。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='pageType']",
      title: "内容格式",
      content: "CSDN 默认按 Markdown 发布，通常保持默认即可。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='picbedService']",
      title: "图片发布",
      content: "CSDN 默认使用平台内置（Bundled）图片链路，保持默认即可。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='validate']",
      title: "验证并保存",
      content: "验证 Cookie 和平台连通性后保存配置，再进行发布。",
      placement: "top",
    },
  ],
}
