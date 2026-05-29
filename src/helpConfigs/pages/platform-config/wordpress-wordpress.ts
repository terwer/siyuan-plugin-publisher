/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 */
import type { PageHelpConfig } from "~/src/types/IPageHelpConfig"

export const wordpressHelpConfig: PageHelpConfig = {
  pageId: "platform-config/wordpress_Wordpress",
  helpUrl: "https://siyuan.wiki/s/20230908183639-btcnnmj",
  summary: "发布到自建或托管的 WordPress 站点。V2 已验证配置、发布、更新、删除和图片链路；当前配置重点是站点地址、账号和应用程序密码。",
  fields: {
    home: { tip: "WordPress 站点首页地址，如 https://yourblog.com" },
    apiUrl: { tip: "WordPress XML-RPC 端点，通常会从首页自动推导为 https://yourblog.com/xmlrpc.php" },
    username: { tip: "WordPress 管理员用户名" },
    password: {
      tip: "WordPress 应用程序密码（在用户 → 编辑 → 应用程序密码中生成）",
    },
    previewUrl: { tip: "默认使用 /?p=[postid] 预览格式。只有站点永久链接规则特殊时才需要调整。" },
    pageType: { tip: "WordPress V2 验证使用 HTML 内容发布，通常保持默认即可。" },
    picbedService: { tip: "本地 WordPress V2 图片链路已通过 plugin-node-fetch 验证。可按站点能力选择内置或外部图床。" },
  },
  faq: [
    { q: "XML-RPC 被禁用？", a: "检查 WordPress 是否开启了 XML-RPC，或确认安全插件没有拦截 /xmlrpc.php。" },
    { q: "Application Password 在哪？", a: "WordPress 后台 → 用户 → 编辑 → 滚动到「应用程序密码」 → 生成。" },
    { q: "图片上传失败？", a: "先确认站点媒体库权限和网络连通性。本次 V2 验证已覆盖本地 WordPress 图片发布链路。" },
  ],
  tour: [
    {
      target: "[data-syp-tour='home']",
      title: "站点首页",
      content: "填写 WordPress 站点首页，插件会据此推导常见 XML-RPC 地址和发布链接。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='apiUrl']",
      title: "XML-RPC 地址",
      content: "确认 XML-RPC 端点可访问。默认通常是站点根路径下的 /xmlrpc.php。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='username']",
      title: "登录用户名",
      content: "填写拥有发布权限的 WordPress 用户名。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='password']",
      title: "应用程序密码",
      content: "这里建议填写 WordPress 应用程序密码，不要直接使用后台登录密码。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='previewUrl']",
      title: "预览地址",
      content: "默认预览格式适合多数 WordPress 站点。只有固定链接结构特殊时再修改。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='validate']",
      title: "验证配置",
      content: "保存前先验证账号、XML-RPC 和站点连通性，验证通过后再进行发布测试。",
      placement: "top",
    },
  ],
}