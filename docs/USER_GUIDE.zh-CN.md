# 用户指南

## 管理界面 (`/#/manage`)

Publisher 插件使用单页应用（SPA）作为界面。  
**管理界面** 的路由是 `/#/manage`。

- 在 SiYuan 中：无需手动输入该地址，插件面板会自动加载。
- 在开发模式下（`pnpm dev`）：可通过浏览器访问 `http://localhost:5173/#/manage`。

## 基本流程

1. 在 SiYuan 中安装插件。
2. 打开插件面板 → **管理**。
3. 配置发布平台：
    - Token（个人访问令牌）
    - Owner/Repo
    - Branch
    - 内容目录（如 `content/posts`）
    - 图片目录（如 `static/img`）
4. 保存设置。
5. 在 SiYuan 中选择笔记并点击 **发布**。

## 草稿

- Front Matter 中包含 `draft` 字段。
- 可以在 UI 中切换，也可在 YAML 中手动设置。

## 图片处理

可以选择以下方式：
- **直传到仓库**（文件存储在仓库的图片目录）。
- **PicGo 集成**（上传到外部对象存储或 CDN）。

## 提示

- 确认仓库路径（如 `content/posts`、`static/img`）已存在。
- Token 必须具有仓库写入权限。
- 如果发布失败，请参见 [TROUBLESHOOTING.zh-CN.md](TROUBLESHOOTING.zh-CN.md)。  
