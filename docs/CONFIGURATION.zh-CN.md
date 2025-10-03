# 配置说明

## 通用字段

- **Owner/Repo**：目标仓库  
- **Branch**：目标分支  
- **Content dir**：Markdown 文件保存路径  
- **Images dir**：图片保存路径  
- **Token**：拥有写入权限的个人访问令牌（PAT）  

## Front Matter

- 默认包含：`title`, `date`, `slug`, `draft`, `tags`, `categories`  
- 日期格式：ISO8601，插件会保存时区信息  

## 图片上传

- **直传模式**：图片直接写入仓库（适合小型站点）  
- **PicGo 模式**：图片通过 PicGo 上传到对象存储或 CDN  

## 安全提示

- 建议使用仓库级别的 Token  
- 可以考虑使用独立的机器人账号  
- 定期更换 Token  
