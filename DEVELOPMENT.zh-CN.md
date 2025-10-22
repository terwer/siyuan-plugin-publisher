# 开发指南

本文件是贡献者的唯一参考。  
所有开发相关信息都应集中在这里。

---

## 环境要求

- **Node.js**（建议使用当前 LTS 版本）  
- **pnpm**（包管理器）  

请在开始开发前确保已安装以上依赖。

---

## 技术栈

- 语言：TypeScript  
- 构建工具：Vite + pnpm  
- 界面：单页应用（SPA），使用哈希路由，如 `/#/manage`  
- 运行环境：SiYuan 插件框架  

---

## 快速开始

在开发环境中运行以下命令：

    pnpm install        # 安装依赖
    pnpm dev            # 启动开发服务器
    # 打开 http://localhost:5173/#/manage
    pnpm build          # 构建生产版本

- 开发过程中可以在浏览器中直接打开管理界面，加快调试速度。  
- 构建完成后可在 SiYuan 中加载插件。  

---

## 项目结构

    src/
      platforms/    # 各个平台的实现（GitHub、GitLab、Gitea 等）
      core/         # 核心逻辑：笔记 → Markdown + Front Matter
      images/       # 图片上传适配器（直传 / PicGo）
      ui/           # SPA 界面与路由
    docs/           # 用户文档

---

## 路由说明

- `/#/manage` → 插件管理界面（配置平台、仓库、Token、图片上传方式）。  

---

## Provider 接口

所有 Provider 必须实现统一接口：

    interface PublishProvider {
      id: string;
      label: string;
      supportsImages: boolean;
      upsertText(opts): Promise<UpsertResult>;
      uploadImage?(opts): Promise<UploadResult>;
    }

- `upsertText`：创建或更新 Markdown 文件  
- `uploadImage`：可选，用于上传图片  

---

## 图片处理

- **直传模式**：图片以二进制写入仓库 `static/img/...`  
- **PicGo 模式**：使用 PicGo 上传到对象存储或 CDN  

---

## Front Matter

插件默认生成 YAML Front Matter：

    ---
    title: "文章标题"
    date: 2025-10-03T12:00:00-04:00
    slug: "post-title"
    draft: false
    tags: []
    categories: []
    ---

- 与 Hugo、Hexo 等主流静态站点生成器兼容。  

---

## 添加新 Provider

1. 创建 `src/platforms/<provider>.ts` 文件。  
2. 在注册表中登记该 Provider。  
3. 为配置界面增加对应表单字段。  
4. 在 `docs/CONFIGURATION.md` 中更新文档。  

---

## 测试

- 编写单元测试，验证 Markdown / Front Matter 转换逻辑。  
- 使用测试仓库验证 API 调用是否正常。  
- 使用以下命令运行检查：

      pnpm lint
      pnpm test

---

## 发布流程

1. 更新 `package.json` 中的版本号。  
2. 执行构建命令：

       pnpm build

3. 更新文档（README.md / README.zh-CN.md）。  
4. 提交并打标签发布。  

---

## 文档维护

- 所有开发文档集中在本文件。  
- 用户文档位于 `/docs` 目录。  
