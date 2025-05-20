# WordPress 发布插件

这是思源笔记发布插件的 WordPress 平台插件，支持将思源笔记内容发布到 WordPress 站点。

## 功能特性

- 支持 WordPress REST API 发布
- 支持分类和标签
- 支持自定义字段
- 支持媒体上传
- 支持草稿模式
- 支持定时发布
- 支持自定义模板
- 支持自定义域名
- 支持自定义 CSS 和 JS

## 配置说明

### 必需配置

1. WordPress REST API Endpoint
   - 格式：`https://your-site.com/wp-json/wp/v2`
   - 说明：您的 WordPress 站点的 REST API 端点

2. WordPress 用户名
   - 说明：用于 API 认证的 WordPress 用户名

3. WordPress 应用密码
   - 说明：WordPress 应用密码（不是普通登录密码）
   - 获取方法：
     1. 登录 WordPress 后台
     2. 进入"用户" -> "个人资料"
     3. 滚动到底部，在"应用程序密码"部分创建新的应用密码

## 使用方法

1. 在思源笔记中安装并启用发布插件
2. 在插件设置中添加 WordPress 平台
3. 填写上述配置信息
4. 选择要发布的文档
5. 点击发布按钮
6. 选择 WordPress 平台
7. 配置发布选项（分类、标签等）
8. 确认发布

## 开发说明

### 项目结构

```
wordpress/
├── src/
│   ├── index.ts        # 插件入口文件
│   └── types.ts        # 类型定义
├── package.json        # 项目配置
└── README.md          # 说明文档
```

### 构建

```bash
# 在项目根目录下执行
pnpm build
```

### 开发

```bash
# 在项目根目录下执行
pnpm dev
```

## 注意事项

1. 确保 WordPress 站点已启用 REST API
2. 建议使用 HTTPS 协议
3. 应用密码请妥善保管，不要泄露
4. 如遇到发布失败，请检查：
   - API 端点是否正确
   - 用户名和密码是否正确
   - WordPress 站点是否可访问
   - REST API 是否被禁用

## 许可证

MIT License 