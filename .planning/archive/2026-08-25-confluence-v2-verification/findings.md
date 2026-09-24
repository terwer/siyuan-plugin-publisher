# 发现：Confluence 插件对接关键事实

> 调研细节与敏感材料已归档到仓库 `tmp/`（不提交）。本文件只保留与插件对接相关的中性事实契约。

## 数据库
- 类型：外部 MySQL
- 库名：`confluence`，用户：`terwer`，方言：`MySQLDialect`
- 版本：MySQL 5.7.38
- JDBC：`jdbc:mysql://localhost/confluence`（连接细节见 `tmp/`）

## 平台与实例
- 发行版：Confluence 10.1.0（buildNumber 9403）
- baseUrl：`http://localhost:8090`
- 部署：标准发行版目录，手动解压

## 对插件 V2 验证的影响
- Confluence 适配器通过 REST API 对接，鉴权用个人访问令牌（PAT）。
- 验证所需配置字段：home / apiUrl / 鉴权令牌 / 空间（Space）/ 父页面 ID / 预览规则 / 图床服务。

## 结论
- Confluence 实例可用于插件 V2 全链路验证，六格 + 帮助引导全部闭环（见 checklist #5）。
