# Tasks: v2-platform-verification-v1-retirement

> 进度主表：**仅更新** [platform-checklist.md](./platform-checklist.md)

## 0. 治理（本提案）

- [x] 0.1 创建 OpenSpec 变更 `v2-platform-verification-v1-retirement`
- [x] 0.2 迁入 `platform-checklist.md` 为 SSOT
- [x] 0.3 删除 `.qoder/plans/全量平台测试Checklist_0578ad66.md`
- [x] 0.4 停用 `.planning/` 平行副本，改为指向本变更
- [x] 0.5 撰写 proposal / design / specs / tasks

## 1. T1 逐平台验证（35）

按 `platform-checklist.md` 顺序；每项失败则在本节下追加子任务或新开 `openspec new change fix-<platform>`。

- [x] 1.1 #1 语雀 API `common_Yuque`（需专业会员，已 ✅）
- [x] 1.2 #2–#5 Common 其余（Notion、Halo、Telegraph、Confluence）
- [x] 1.3 #6–#13 Github 八项
- [x] 1.4 #14–#20 Gitlab 七项
- [x] 1.5 #21–#24 Metaweblog 四项
  - [x] 1.5a #21 博客园 `metaweblog_Cnblogs` — T1 全链路 ✅（2026-05-21，用户手测）
  - [x] 1.5b #22–#24 Typecho、Jvue、Metaweblog 通用
- [x] 1.6 #25–#26 Wordpress 两项
  - [x] 1.6a #25 Wordpress `wordpress_Wordpress` — T1 全链路 ✅（2026-05-21，本地 WP，用户手测）
  - [x] 1.6b #26 Wordpress.com
- [x] 1.7a #27 语雀网页版 `custom_Yuqueweb`（V2C/Pub/Upd/Del/Img 已验通过）
- [x] 1.7b #28 Halo网页版
  - [x] 1.7b.1 修复 Halo 网页版 V2C 配置页初始化失败：预置 `authUrl=/login` 不能在未配置站点时直接 `new URL()`；保留 Cookie 授权入口，未填 `home/apiUrl` 时点击登录/读取只提示先填站点地址，填入后由 Web Cookie 共用解析生成真实登录 URL
  - [x] 1.7b.2 2026-08-14 修 transport 规则：loopback/私网目标有代理条件时走 `siyuan-forward-proxy`（内核 3.7.3 默认允许本机访问，SSRF 由 `SSRFSafeDialer` 兜底）；单测 64 绿、build:v2 通过
  - [x] 1.7b.3 2026-08-14 本地 Docker Halo 2.20（localhost:8090）devtools 全链路手验：**V2C（forwardProxy 200 + 账号运行中）/ Pub / Upd / Del / Img 五格全部 ✅**
  - [x] 1.7c #30 知乎 `custom_Zhihu` — V2 Bridge 全链路 ✅（2026-05-24，用户手测：V2C/Pub/Upd/Del/Img）
  - [x] 1.7d #31 CSDN `custom_Csdn` — V2 Bridge 全链路 ✅（2026-05-24，用户手测：V2C/Pub/Upd/Del/Img）
  - [x] 1.7e #32–#35 简书、掘金、微信公众号、哔哩哔哩 V2 Bridge 全链路
- [x] 1.8 #29 本地系统（Electron）— V2 全链路 ✅（2026-05-24，用户手测）

## 2. T2a / T2b / T3

- [x] 2.1 T2a #30–#35：已迁入 T1 V2 Bridge；V1 回退保留至 Gate D，不再要求 V2 Inv
- [x] 2.2 T2b #36–#38：Vis/Add（Github Docsify、Gitlab Docsify、小红书；均「无 V2 bridge / pre 注释」，不在 V1 退役门禁内）—— 2026-09-20 确认：三站 Vis/Add 均为 ❌（不可用/不暴露）。Docsify ×2 全仓无任何设置界面（V1/V2 都从未提供添加入口），小红书入口为注释状态；静态比对了 `SubPlatformType` 枚举 vs `pre.ts` 活跃注册，宿主实测 V2 选择器 35 项均不含三者
- [x] 2.3 T3 #39–#54：孤儿与 Fs 占位确认（验收目标为「确认不可用/不暴露」，不在 V1 退役门禁内）—— 2026-09-20 确认：api 孤儿 3（Liandi 不存在；Siyuan/Yuque 已转正式平台）+ web 孤儿 4（Flowus 已彻底移除；Wechat 已转正式平台；Weibo/Wuaipojie 不存在）+ Fs 枚举占位 9（枚举在、`pre.ts` 无注册，故不暴露）。判定基准：枚举 47 成员中未注册者仅 9 个 Fs 占位 + 哨兵 `NONE`

## 3. Gate C — 标记 V1 废弃

- [x] 3.1 Checklist Gate A 全部满足（T1 35/35，2026-09-19）；同表 Gate B 亦满足（T2a 为 0 平台）
- [x] 3.2 偏好 / README：默认 V2；`useV2UI` 默认改为 `true`，README 中英文去掉「先手动开启新版 UI」步骤并注明旧界面已退役
- [x] 3.3 保留回退入口：偏好开关保留但**不允许关闭**（关闭即引导到最后一个提供 V1 的发行版 `1.41.1` 下载页），并保留 `useV2UI=false` 在旧版本中的语义

## 4. Gate D — `2.3.0` 彻底移除 V1（**迁移先于删除**）

口径（2026-09-20 用户确认）：Gate C 与 Gate D 同落 **`2.3.0`**；V1 彻底退役，不回退、不给「无法关闭」提示。取消原「三版本缓冲」，代之以本节 4.2 的硬前置：**迁移面未在 V2 可用并通过宿主手验前，不得执行 4.3 删除面**。

- [x] 4.1 版本口径（2026-09-20 用户确认并更正）：**`2.0.0` = 彻底移除 V1 全部遗产**（仅保留桥接组件；顶栏旧菜单不保留、文档菜单保留；补「下载 1.41.1」提示）；**`2.3.0` = 移除该下载提示**。此前把「Gate C 生效版本」记为 `2.3.0` 系我方误读（`2.0.0` 尚未发版），记载已更正
- [x] 4.2 **迁移面**（缺失即功能退化，见 design.md 决策 6）
  - [x] 4.2.0 普查 V1 可达面：确认文档块菜单（`click-editortitleicon`）在 V2 下仍可达且**直调 V1 iframe**，是本次必须迁移的关键项
  - [x] 4.2.1 `V2Host` 增加 `docId` / `initialSection` / `autoPublishPlatformKey`，`V2InitialView` 与 `V2CurrentView` 对齐并新增 `ai_chat`
  - [x] 4.2.2 移植 `src/pages/AiChat.vue` → `src/components/v2/V2AiChat.vue`（聊天 / 上下文模式 / Prompt 管理，14 个单测）。**内置 4 条 Prompt 保持 V1 的可编辑状态**（V1 的 `isSys` 就是 false），未借机改成只读
  - [x] 4.2.3 移植 `src/pages/About.vue` → `src/components/v2/settings/V2About.vue`，并在设置导航新增「关于」分区
  - [x] 4.2.4 文档块菜单的「发布到..」与「AI聊天」改为开 V2 面板：`siyuan/v2/v2DocMenu.ts`（每平台一项 + `autoPublishPlatformKey` 保留「一次点击即发布」），锚点取 `.protyle-title__icon`
  - [x] 4.2.5 顶栏点击恒开 V2（`showLegacyMenu`/`addMenu` 已删）；宿主 `openSetting()` 直接开 V2 设置
  - [x] 4.2.6 独立 PicGo 插件入口随 `pluginInvoke` 一并删除（V2 已有无头 PicGo 设置）
  - [x] 4.2.7 宿主手验：文档块菜单两项可达且子菜单列出全部已启用平台；一键入口实测完成「本地系统」发布/更新；「AI聊天」带文档上下文打开；顶栏与宿主设置入口均落 V2；「关于」渲染版本/slogan/依赖
- [x] 4.3 **删除面**（4.2 手验通过后执行，提交 `176fb662`）
  - [x] 4.3.1 删 iframe 宿主与旧 invoke：`siyuan/iframeDialog.ts`、`siyuan/invoke/pluginInvoke.ts`、`siyuan/invoke/widgetInvoke.ts`、`siyuan/utils/menuUtils.ts`，及随之成为孤儿的 `siyuan/utils/htmlUtils.ts`、`siyuan/utils/utils.ts`、`siyuan/api/{kernel-api,base-kernel-api}.ts`
  - [x] 4.3.2 **V1 SPA 暂留**（浏览器扩展的弹窗 UI 仍是它；扩展迁移完成前不得删除，见 4.6）。**挂件必须保留**（用户明确要求）。本次只删插件侧入口，另删掉仅供 V1 `showTab` 使用的自定义 Tab 注册
  - [x] 4.3.3 删 `useV2UI` 开关与其关闭提示、`preferenceConfigManager` 归一化、`PreferenceSetting.vue` 开关、`helpConfigs` 字段说明与相关 i18n 词条；另修正两处指向已退役世界的文案（偏好页说明、平台配置兜底空态）
  - [x] 4.3.4 保留清单核对：`src/components/publish/**`（含 `V2SinglePublish`/`V2BatchPublish` 桥接的 V1 组件）、`src/components/common/ArticleManageList.vue`、`src/components/set/publish/singleplatform/**`、`siyuan/utils/widgetPageUtils.ts` 均未删
- [x] 4.4 回归：`build:v2` ✓、**V1 SPA 构建 `pnpm siyuanBuild` ✓**（保证挂件/扩展产物仍可构建）、单测 70 文件 / 378 用例 ✓、宿主全入口手验 ✓、插件侧 i18n 死键清理 ✓
- [x] 4.5 补「下载 `1.41.1`」提示（用户要求：这是 V1 移除后唯一需要补的东西）—— 落 `V2About.vue` 的设置分区「关于」，文案「旧版界面已在 2.0.0 中移除…如确需旧界面，可安装最后一个支持它的版本 1.41.1」+ 下载按钮，宿主实测渲染正常（提交 `0295bd2b`）。`V1_LAST_VERSION`/`V1_LAST_RELEASE_URL` 仅为该提示恢复，**「2.3.0 移除提示与这两个常量」**
- [ ] 4.6 **浏览器扩展迁移到 2.0**（用户明确要求；扩展当前弹窗 UI 即 V1 SPA，属 V1 遗产）
  - [ ] 4.6.1 盘清扩展实际用到的 SPA 面：`manifest.json`（`default_popup: index.html`）、`background.js`（`fetchChromeXmlrpc` / `fetchChromeJson` CORS 旁路）、以及扩展场景下与「思源宿主 DOM」无关的差异（无 kernel DOM、需自行配置思源地址与 token）
  - [ ] 4.6.2 决定扩展壳的形态（复用 `V2App` 还是抽出可独立挂载的 V2 外壳）并落地
  - [ ] 4.6.3 扩展产物构建与手验（Chrome + Firefox MV2）
  - [ ] 4.6.4 迁移完成后：删除 V1 SPA（`src/main.ts`、`src/bootstrap.ts`、`src/routes/**`、`src/pages/**`、`src/workers/QuickPublish.vue`、`src/utils/directives/iframeResize.ts`）与 `vite.v1.app.config.ts`，并复核挂件/nginx/vercel 链的替代入口
- [ ] 4.7 归档本变更；合并 delta 至 `openspec/specs/`


## 修复 backlog（按需追加）

_验收中发现的问题在此登记，完成后勾选并回写 checklist。_

- [x] **#21 博客园 V2C**：MetaWeblog XML-RPC — `indexOf` / `non-text response`；`zhi-blog-api@1.79.0` + `proxyXmlrpc` 专用层（见 `.planning/2026-05-21-cnblogs-xmlrpc-response-text/`）
- [x] **#32 简书 Img/默认图床**：`JianshuConfig` 默认图床已设为 `PicbedServiceTypeEnum.Bundled`（新增账号默认选中"当前平台 推荐"，spec 已覆盖）；`uploadFile` 增加 qiniu 错误详情；完整 help 配置已补齐（fields/faq/tour 4 步）。真实 PNG 带图发布验证通过；此前失败是测试图片 `icon.png` 实为 WebP 伪装 PNG
- [x] **#26 Wordpress.com 传输受限**：站点域按客户端特征拒绝 Node fetch；新增 `electron-session-fetch`（宿主网络栈）与用户自备跨域代理两条通路，保留 XML-RPC。见 `openspec/changes/archive/2026-09-19-add-wordpress-com-chromium-transport/`
- [x] **平台图床默认值缺失**：Typecho / Jvue / Wordpress / Wordpressdotcom / Metaweblog 通用 / Halo / Confluence 默认图床修正为平台图床，新增 `picbedDefaults.spec.ts` 双向覆盖
- [x] **GitLab 族 `[docpath]` 未解析**：图片曾落到字面量 `[docpath]/images/`；抽出 `resolvePlatformImagePath` 供 GitHub / GitLab 两族共用
