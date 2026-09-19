/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 */
import type { PageHelpConfig } from "~/src/types/IPageHelpConfig"

export const wordpressHelpConfig: PageHelpConfig = {
  pageId: "platform-config/wordpress_Wordpress",
  helpUrl: "https://siyuan.wiki/s/20230908183639-btcnnmj",
  summary: "发布到自建或托管的 WordPress 站点。当前配置重点是站点地址、账号和图片发布方式。",
  fields: {
    home: { tip: "WordPress 站点首页地址，如 https://yourblog.com", placeholder: "https://yourblog.com" },
    apiUrl: { tip: "WordPress XML-RPC 端点，通常会从首页自动推导为 https://yourblog.com/xmlrpc.php", placeholder: "https://yourblog.com/xmlrpc.php" },
    username: { tip: "WordPress 管理员用户名", placeholder: "your-wordpress-name" },
    password: {
      tip: "WordPress 账号密码；建议改用「应用程序密码」（后台 → 用户 → 编辑 → 应用程序密码 中生成），避免直接使用登录口令",
      placeholder: "your-application-password",
    },
    previewUrl: { tip: "查看文章链接模板，默认 /?p=[postid]，与 WordPress 默认固定链接一致，通常保持默认。", placeholder: "/?p=[postid]" },
    pageType: {
      tip: "正文提交格式：默认 HTML（插件先把笔记转成 HTML 再提交）；选 Markdown 则直接提交 Markdown 原文。",
    },
    picbedService: {
      tip:
        "图片发布方式：「当前平台 推荐」经 XML-RPC 上传到 WordPress 媒体库；「PicGo 强烈推荐」改用你配置的 PicGo 图床；" +
        "「不使用」跳过图片处理，按原图地址引用（需图片本身公网可访问）。",
    },
  },
  faq: [
    { q: "XML-RPC 被禁用？", a: "检查 WordPress 是否开启了 XML-RPC，或确认安全插件没有拦截 /xmlrpc.php。" },
    { q: "Application Password 在哪？", a: "WordPress 后台 → 用户 → 编辑 → 滚动到「应用程序密码」 → 生成。" },
    {
      q: "图片上传失败？",
      a: "「图床服务」选「当前平台」时图片经 XML-RPC 上传到 WordPress 媒体库，请确认站点媒体库权限与网络连通；也可先在设置里配置好 PicGo，再改选「PicGo 强烈推荐」。",
    },
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
      title: "账号密码",
      content: "填写 WordPress 账号密码；建议改用后台生成的应用程序密码，避免直接使用登录口令。",
      placement: "bottom",
    },
    {
      target: "[data-syp-tour='previewUrl']",
      title: "预览规则",
      content: "查看文章链接模板，默认 /?p=[postid]，只有站点固定链接结构特殊时才需要修改。",
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