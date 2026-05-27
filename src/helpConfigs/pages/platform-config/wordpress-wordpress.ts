/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 */
import type { PageHelpConfig } from "~/src/types/IPageHelpConfig"

export const wordpressHelpConfig: PageHelpConfig = {
  pageId: "platform-config/wordpress_Wordpress",
  helpUrl: "https://siyuan.wiki/s/20230908183639-btcnnmj",
  summary: "发布到自建或托管的 WordPress 站点。支持 XML-RPC 和 REST API。",
  fields: {
    home: { tip: "WordPress 站点首页地址，如 https://yourblog.com" },
    apiUrl: { tip: "WordPress XML-RPC 端点，如 https://yourblog.com/xmlrpc.php" },
    username: { tip: "WordPress 管理员用户名" },
    password: {
      tip: "WordPress 应用程序密码（在用户 → 编辑 → 应用程序密码中生成）",
    },
  },
  faq: [
    { q: "XML-RPC 被禁用？", a: "检查 WordPress 是否开启了 XML-RPC，或安装插件启用。" },
    { q: "Application Password 在哪？", a: "WordPress 后台 → 用户 → 编辑 → 滚动到「应用程序密码」 → 生成。" },
  ],
}