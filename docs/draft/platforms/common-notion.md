# Notion API 配置指南（草稿）

> TODO：待替换真实帮助文档链接。

通过 **Notion API Token** 发布到 Notion 页面。V2 已验证完整链路（配置、发布、更新、删除、带图发布、查看链接）。

## 一、准备

1. 一个 Notion 账号。
2. 一个 **Notion 集成（Integration）** 生成的 API Token。

## 二、获取 Token

Notion 集成地址：<https://www.notion.so/my-integrations>

1. 新建集成，生成 Token。
2. 为该集成勾选权限：**Read content**、**Update content**、**Insert content**。
3. 将集成授权给具体的根页面（父页面），发布才能写入该页面下。

## 三、配置

| 字段 | 填什么 |
|------|--------|
| 平台首页 | 通常固定 `https://www.notion.so/`，保持默认 |
| API 地址 | 通常固定 `https://api.notion.com/v1`，保持默认 |
| Token | 上面的 Notion 集成 Token |
| 预览规则 | 固定 `/[postid]`，不可修改；查看链接 `https://www.notion.so/<postid>` |
| 根页面 | 验证通过后从下拉选择目标根页面 |
| 图床 | Notion 无内置上传，选「PicGo」：图片先上传外部图床，再以外部 image 块嵌入 |

## 四、验证与发布

1. 点「验证」→ 拉取根页面列表 → 选根页面 → 保存。
2. 快速发布 → 选 Notion → 发布。

## 常见问题

- **提示 Token 无效 / 验证失败**：确认集成已勾选读、更新、插入三项权限，并已授权给目标根页面。
- **根页面列表为空**：确认 Token 正确，且集成已授权给相应根页面，先点验证。
- **不能修改已发布页面的根页面**：Notion 平台限制，先删除该文档再选新根页面重新发布。
- **查看链接打开提示登录**：Notion 页面默认私有，需 Notion 账号访问权限，发布成功且链接正确即为正常现象。
