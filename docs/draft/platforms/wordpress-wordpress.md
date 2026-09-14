# WordPress 配置指南（草稿）

> TODO：待替换真实帮助文档链接。

通过 **XML-RPC** 发布到自建/托管 WordPress。

## 一、准备

1. 一个 WordPress 站点（含管理员账号）。
2. 一个 **应用程序密码**（Application Password，推荐；也可用账号密码）。

## 二、获取应用程序密码

WordPress 后台 → 用户 → 编辑 → 滚动到「应用程序密码」→ 生成。地址：`https://你的站点/wp-admin/profile.php`

## 三、配置

| 字段 | 填什么 |
|------|--------|
| 平台首页 | 站点首页，如 `https://yourblog.com` |
| API 地址 | 通常自动推导为 `https://yourblog.com/xmlrpc.php` |
| 用户名 | WordPress 管理员用户名 |
| 密码 | 账号密码；建议用后台生成的**应用程序密码** |
| 预览规则 | 默认 `/?p=[postid]`，与默认固定链接一致，一般不改 |
| 发布格式 | 默认 **HTML**（插件先把笔记转成 HTML 再提交）；选 Markdown 则提交 Markdown 原文 |
| 图床服务 | 默认「当前平台」：经 XML-RPC 上传到 WordPress 媒体库；也可改选「PicGo 强烈推荐」用你配置的 PicGo；「不使用」跳过图片处理、按原图地址引用（需公网可访问） |

## 四、验证与发布

1. 点「验证」→ 通过后保存。
2. 快速发布 → 选 WordPress → 发布。

## 常见问题

- **XML-RPC 被禁用**：检查 WordPress 是否开启 XML-RPC，安全插件是否拦截 `/xmlrpc.php`。
- **应用程序密码在哪**：后台 → 用户 → 编辑 → 应用程序密码 → 生成。
- **图片上传失败**：确认「图床服务」选的是「当前平台」（经 XML-RPC 上传到 WordPress 媒体库）、站点媒体库权限和网络连通；也可改用「PicGo 强烈推荐」。
