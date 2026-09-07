# CSDN 配置指南（草稿）

> TODO：待替换真实帮助文档链接。

通过 **Cookie 授权**发布到 CSDN。图片使用 CSDN 平台内置图床，默认 Bundled 即可。

## 一、准备

1. 在浏览器登录 CSDN 创作中心。
2. 无需 API Token。

## 二、配置

| 字段 | 填什么 |
|------|--------|
| 平台首页 | 默认 `https://blog.csdn.net`，一般不改 |
| API 地址 | 默认 `https://bizapi.csdn.net`，一般不改 |
| Cookie | 登录 CSDN 后自动读取，或手动粘贴 |
| 内容格式 | 默认 Markdown |
| 图床 | 默认 Bundled（平台内置图片链路） |

## 三、验证与发布

1. 点「去登录」→ 登录 CSDN → 关闭窗口 → 「自动读取 Cookie」→ 验证。
2. 快速发布 → 选 CSDN → 发布。

## 常见问题

- **Cookie 验证失败**：确认浏览器已登录 CSDN 创作中心，重新读取 Cookie。
- **图片图床**：默认 Bundled 即可，无需额外配置 PicGo。
- **分类/标签异常**：确认创作中心能正常读取相关数据。
