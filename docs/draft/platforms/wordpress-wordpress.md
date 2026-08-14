# WordPress 配置指南（草稿）

> TODO：待替换真实帮助文档链接。

通过 **XML-RPC** 发布到自建/托管 WordPress。V2 已验证完整链路。

## 一、准备

1. 一个 WordPress 站点（含管理员账号）。
2. 一个 **应用程序密码**（Application Password）。

## 二、获取应用程序密码

WordPress 后台 → 用户 → 编辑 → 滚动到「应用程序密码」→ 生成。地址：`https://你的站点/wp-admin/profile.php`

## 三、配置

| 字段 | 填什么 |
|------|--------|
| 平台首页 | 站点首页，如 `https://yourblog.com` |
| API 地址 | 通常自动推导为 `https://yourblog.com/xmlrpc.php` |
| 用户名 | WordPress 管理员用户名 |
| 密码 | 上面生成的**应用程序密码**（不是后台登录密码） |
| 预览地址 | 默认 `/?p=[postid]`，一般不改 |
| 图床 | 本地 WP 已验 plugin-node-fetch 图片链路，内置/外部图床均可 |

## 四、验证与发布

1. 点「验证」→ 通过后保存。
2. 快速发布 → 选 WordPress → 发布。

## 常见问题

- **XML-RPC 被禁用**：检查 WordPress 是否开启 XML-RPC，安全插件是否拦截 `/xmlrpc.php`。
- **应用程序密码在哪**：后台 → 用户 → 编辑 → 应用程序密码 → 生成。
- **图片上传失败**：确认媒体库权限和网络连通。
