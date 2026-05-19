# 进度记录：语雀网页版退出设计

## 2026-05-19
- 读取 planning-with-files-zh 技能说明。
- 检查 `.planning/.active_plan`，确认无活跃计划。
- 搜索 `logoutUrl`、`accounts/logout`、`yuque`，初步定位当前抽象与语雀相关目录。
- 创建本次规划目录 `.planning/2026-05-19-yuque-logout-design/`。
- 阅读 `src/platforms/dynamicConfig.ts`、`src/components/set/publish/platform/PublishPlatformSettingList.vue`、`src/utils/widgetUtils.ts`、`src/adaptors/web/yuqueweb/YuquewebConfig.ts`、`src/platforms/pre.ts`、`src/composables/useWebCookieAuthorization.ts`、`src/components/v2/settings/V2WebCookieAuthPanel.vue`。
- 确认 `logoutUrl` 的实际消费方式是打开 URL，不是执行可配置 HTTP 动作。
- 阅读 `src/adaptors/web/yuqueweb/YuquewebWebAdaptor.ts` 和 `src/adaptors/web/base/baseWebApi.ts`，确认语雀退出可复用现有 `yuquewebFetch`/`webFetch` 请求层。
- 完成方案判断：保留 `logoutUrl` 作为向后兼容 URL fallback，同时为语雀这类平台引入适配器级退出动作。
- 用户确认：统一清理本地授权状态；V1/V2 同步修复；语雀网页版移除已不支持的 `logoutUrl` 字段并改用适配器级退出动作。
- 开始创建 OpenSpec 变更提案，拟定 change name：`fix-yuqueweb-logout-action`。
- 已创建 OpenSpec change：`openspec/changes/fix-yuqueweb-logout-action/`。
- 已生成 `proposal.md`、`design.md`、`specs/web-cookie-logout/spec.md`、`specs/v2-web-cookie-authorization/spec.md`、`tasks.md`。
- `openspec status --change fix-yuqueweb-logout-action` 显示 4/4 artifacts complete，已可进入 apply/implementation。
- 记录新决策：`logoutWebAuth` 必须进入 `zhi-blog-api` 公共 Web API/SPI 契约。
- 检查 zhi 仓库结构、`IWebApi`、`WebApi`、`WebAdaptor`、既有 `add-validate-publish-spi` 提案，确认新提案应落在 `libs/zhi-blog-api`。

- 当前插件实现阶段已被上游 zhi-blog-api 的 `add-web-auth-logout-spi` 提案阻塞，需等待其发布新 npm 版本并升级依赖后再继续。

- 已在 zhi 仓库创建 `add-web-auth-logout-spi` 提案，并回写本仓库依赖说明；本仓库实现仍需等待上游发布新 npm 包后继续。
