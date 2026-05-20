## Why

语雀开放 API 当前在配置阶段即可能返回 `429 Too Many Requests`，已经不足以支撑稳定的 V2 回归验证；同时 V2 需要一个真实、可复用、最小闭环的“网页授权平台样板”，用于沉淀 Cookie 授权、网页内部接口、平台配置桥接、发布动作和用户化错误处理的标准做法。

本变更新增“语雀网页版”平台，与现有“语雀 API”平台并存。它不是绕过 API 限流的补丁，而是 V2 网页授权适配的第一个完整样板。

## What Changes

- 新增 `custom_Yuqueweb`（语雀网页版）平台，归入网页授权平台，不替换现有 `common_Yuque`。
- 新增语雀网页版适配器四件套：配置类、占位符、Hook、WebAdaptor。
- 新增语雀网页版设置入口，并接入 V1 平台设置桥接与 V2 平台配置桥接。
- 复用现有 `CommonWebConfig`、`CommonBlogSetting`、`BaseWebApi.webFetch/webFormFetch` 和发布主链路，不新增一套平台设置/发布框架。
- 通过 Cookie 授权访问语雀 Web 内部接口，支持登录态校验、知识库列表、文档新建、文档更新、文档删除、预览 URL。
- 首期内容格式以网页接口实测支持的 `format: "markdown"` 为主路径，避免为了 Lake 编辑器私有 ASL 结构引入不可维护转换层。
- 将图片上传纳入同一阶段证据闭环：必须通过真实语雀网页上传接口验证后实现 `newMediaObject`，不得私写与发布链路不一致的 Markdown 图片解析逻辑。
- 新增语雀网页版 postid 元信息格式，保存文档 id、slug、bookId、bookSlug、login、format 等更新/删除/预览所需字段。
- 新增用户化错误信息：登录失效、知识库为空、429/限流、权限不足、文档不存在、图片上传失败等必须给用户可执行说明，不暴露内部调试指令。
- 新增全链路人工测试清单，覆盖配置、授权、知识库、新建、更新、删除、图片、预览、V2 快速发布、V2 配置桥接、回归兼容。
- 不修改现有 `common_Yuque` API 平台的配置格式和行为；用户可继续保留或使用旧 API 平台。

## Capabilities

### New Capabilities

- `yuque-web-publishing`: 定义语雀网页版平台的 Cookie 授权、知识库发现、文章发布/更新/删除、预览、图片上传、错误处理和 V2 桥接能力。

### Modified Capabilities

- 无。现有 OpenSpec 中没有语雀发布或网页授权通用能力规格；本次新增独立能力，不修改已有 `astro-yaml`、`github-astro`、`gitlab-astro` 规格。

## Impact

- 适配器层：新增 `src/adaptors/web/yuqueweb/*`，复用 `BaseWebApi`。
- 平台注册：影响 `src/platforms/PreConstants.ts`、`src/platforms/pre.ts`、`src/platforms/dynamicConfig.ts`、`src/adaptors/index.ts`。
- 设置 UI：新增 `src/components/set/publish/singleplatform/web/YuquewebSetting.vue`，更新 `SingleSettingIndex.vue` 和 `src/components/v2/settings/bridge/bridgeRegistry.ts`。
- 国际化：补齐 `src/locales/zh_CN.ts`、`src/locales/en_US.ts`、`siyuan/i18n/zh_CN.json`、`siyuan/i18n/en_US.json` 中的用户可读文案。
- 测试与文档：新增 OpenSpec 任务、人工测试清单和必要的接口证据记录。
- 外部依赖：不新增运行时依赖；不引入新的构建链。
- 兼容性：不改变 `zhi-blog-api` 接口契约，不改变现有 API 授权语雀平台，不改变通用发布主链路。
