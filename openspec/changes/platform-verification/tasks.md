# Tasks: platform-verification

> 进度主表：**仅更新** [platform-checklist.md](./platform-checklist.md)

## 0. 治理（本提案）

- [x] 0.1 创建 OpenSpec 变更 `platform-verification`
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
- [x] 1.7a #27 语雀网页版 `custom_Yuqueweb`（Cfg/Pub/Upd/Del/Img 已验通过）
- [x] 1.7b #28 Halo网页版
  - [x] 1.7b.1 修复 Halo 网页版 Cfg 配置页初始化失败：预置 `authUrl=/login` 不能在未配置站点时直接 `new URL()`；保留 Cookie 授权入口，未填 `home/apiUrl` 时点击登录/读取只提示先填站点地址，填入后由 Web Cookie 共用解析生成真实登录 URL
  - [x] 1.7b.2 2026-08-14 修 transport 规则：loopback/私网目标有代理条件时走 `siyuan-forward-proxy`（内核 3.7.3 默认允许本机访问，SSRF 由 `SSRFSafeDialer` 兜底）；单测 64 绿、build:v2 通过
  - [x] 1.7b.3 2026-08-14 本地 Docker Halo 2.20（localhost:8090）devtools 全链路手验：**Cfg（forwardProxy 200 + 账号运行中）/ Pub / Upd / Del / Img 五格全部 ✅**
  - [x] 1.7c #30 知乎 `custom_Zhihu` — 界面桥接全链路 ✅（2026-05-24，用户手测：Cfg/Pub/Upd/Del/Img）
  - [x] 1.7d #31 CSDN `custom_Csdn` — 界面桥接全链路 ✅（2026-05-24，用户手测：Cfg/Pub/Upd/Del/Img）
  - [x] 1.7e #32–#35 简书、掘金、微信公众号、哔哩哔哩界面桥接全链路
- [x] 1.8 #29 本地系统（Electron）— 全链路 ✅（2026-05-24，用户手测）

## 2. T2a / T2b / T3

- [x] 2.1 T2a #30–#35：已迁入 T1 界面桥接；旧界面回退保留至 Gate D，不再要求 Inv
- [x] 2.2 T2b #36–#38：Vis/Add（Github Docsify、Gitlab Docsify、小红书；均「未桥接入界面 / pre 注释」，不在旧界面退役门禁内）—— 2026-09-20 确认：三站 Vis/Add 均为 ❌（不可用/不暴露）。Docsify ×2 全仓无任何设置界面（旧界面与现行界面都从未提供添加入口），小红书入口为注释状态；静态比对了 `SubPlatformType` 枚举 vs `pre.ts` 活跃注册，宿主实测界面选择器 35 项均不含三者
- [x] 2.3 T3 #39–#54：孤儿与 Fs 占位确认（验收目标为「确认不可用/不暴露」，不在旧界面退役门禁内）—— 2026-09-20 确认：api 孤儿 3（Liandi 不存在；Siyuan/Yuque 已转正式平台）+ web 孤儿 4（Flowus 已彻底移除；Wechat 已转正式平台；Weibo/Wuaipojie 不存在）+ Fs 枚举占位 9（枚举在、`pre.ts` 无注册，故不暴露）。判定基准：枚举 47 成员中未注册者仅 9 个 Fs 占位 + 哨兵 `NONE`

## 3. Gate C — 标记旧界面废弃

- [x] 3.1 Checklist Gate A 全部满足（T1 35/35，2026-09-19）；同表 Gate B 亦满足（T2a 为 0 平台）
- [x] 3.2 偏好 / README：默认新界面；「旧界面开关」默认改为 `true`，README 中英文去掉「先手动开启新版 UI」步骤并注明旧界面已退役
- [x] 3.3 保留回退入口：偏好开关保留但**不允许关闭**（关闭即引导到最后一个提供旧界面的发行版 `1.41.1` 下载页），并保留旧界面开关关闭时在旧版本中的语义

## 4. Gate D — `2.3.0` 彻底移除旧界面（**迁移先于删除**）

口径（2026-09-20 用户确认）：Gate C 与 Gate D 同落 **`2.3.0`**；旧界面彻底退役，不回退、不给「无法关闭」提示。取消原「三版本缓冲」，代之以本节 4.2 的硬前置：**迁移面未在当前界面可用并通过宿主手验前，不得执行 4.3 删除面**。

- [x] 4.1 版本口径（2026-09-20 用户确认并更正）：**`2.0.0` = 彻底移除旧界面全部遗产**（仅保留桥接组件；顶栏旧菜单不保留、文档菜单保留；补「下载 1.41.1」提示）；**`2.3.0` = 移除该下载提示**。此前把「Gate C 生效版本」记为 `2.3.0` 系我方误读（`2.0.0` 尚未发版），记载已更正
- [x] 4.2 **迁移面**（缺失即功能退化，见 design.md 决策 6）
  - [x] 4.2.0 普查旧界面可达面：确认文档块菜单（`click-editortitleicon`）在当前界面下仍可达且**直调旧界面 iframe**，是本次必须迁移的关键项
  - [x] 4.2.1 `PluginHost` 增加 `docId` / `initialSection` / `autoPublishPlatformKey`，`V2InitialView` 与 `CfgurrentView` 对齐并新增 `ai_chat`
  - [x] 4.2.2 移植 AI 聊天视图 → `src/ui/components/AiChat.vue`（聊天 / 上下文模式 / Prompt 管理，14 个单测）。**内置 4 条 Prompt 保持旧界面的可编辑状态**（旧界面的 `isSys` 就是 false），未借机改成只读
  - [x] 4.2.3 移植关于视图 → `src/ui/components/settings/About.vue`，并在设置导航新增「关于」分区
  - [x] 4.2.4 文档块菜单的「发布到..」与「AI聊天」改为开界面面板：`siyuan/host/docMenu.ts`（每平台一项 + `autoPublishPlatformKey` 保留「一次点击即发布」），锚点取 `.protyle-title__icon`
  - [x] 4.2.5 顶栏点击恒开界面（`showLegacyMenu`/`addMenu` 已删）；宿主 `openSetting()` 直接开界面设置
  - [x] 4.2.6 独立 PicGo 插件入口随 `pluginInvoke` 一并删除（当前界面已有无头 PicGo 设置）
  - [x] 4.2.7 宿主手验：文档块菜单两项可达且子菜单列出全部已启用平台；一键入口实测完成「本地系统」发布/更新；「AI聊天」带文档上下文打开；顶栏与宿主设置入口均落界面；「关于」渲染版本/slogan/依赖
- [x] 4.3 **删除面**（4.2 手验通过后执行，提交 `176fb662`）
  - [x] 4.3.1 删 iframe 宿主与旧 invoke：`siyuan/iframeDialog.ts`、`siyuan/invoke/pluginInvoke.ts`、`siyuan/invoke/widgetInvoke.ts`、`siyuan/utils/menuUtils.ts`，及随之成为孤儿的 `siyuan/utils/htmlUtils.ts`、`siyuan/utils/utils.ts`、`siyuan/api/{kernel-api,base-kernel-api}.ts`
  - [x] 4.3.2 **旧界面 SPA 暂留**（浏览器扩展的弹窗 UI 仍是它；扩展迁移完成前不得删除，见 4.6）。**挂件必须保留**（用户明确要求）。本次只删插件侧入口，另删掉仅供旧界面 `showTab` 使用的自定义 Tab 注册
  - [x] 4.3.3 删 「旧界面开关」与其关闭提示、`preferenceConfigManager` 归一化、`PreferenceSetting.vue` 开关、`helpConfigs` 字段说明与相关 i18n 词条；另修正两处指向已退役世界的文案（偏好页说明、平台配置兜底空态）
  - [x] 4.3.4 保留清单核对：`src/ui/components/publish/**`（含 `SinglePublish`/`BatchPublish` 桥接的复用组件）、`src/ui/components/bridge/common/ArticleManageList.vue`、`src/ui/components/set/publish/singleplatform/**`、`siyuan/utils/widgetPageUtils.ts` 均未删
- [x] 4.4 回归：`build:v2` ✓、**旧界面 SPA 构建 `pnpm siyuanBuild` ✓**（保证挂件/扩展产物仍可构建）、单测 70 文件 / 378 用例 ✓、宿主全入口手验 ✓、插件侧 i18n 死键清理 ✓
- [x] 4.5 补「下载 `1.41.1`」提示（用户要求：这是旧界面移除后唯一需要补的东西）—— 落 `V2About.vue` 的设置分区「关于」，文案「旧版界面已在 2.0.0 中移除…如确需旧界面，可安装最后一个支持它的版本 1.41.1」+ 下载按钮，宿主实测渲染正常（提交 `0295bd2b`）。`V1_LAST_VERSION`/`V1_LAST_RELEASE_URL` 仅为该提示恢复，**「2.3.0 移除提示与这两个常量」**
- [x] 4.6 **浏览器扩展迁移到 2.0**（用户明确要求；扩展原弹窗 UI 即旧界面 SPA，属旧界面遗产）—— 已完成，提交 `a8d69580`（通用壳）+ 后续构建链与删除提交
  - [x] 4.6.1 只读普查完成（结论如下，均有 `路径:行号` 证据）
    - **`App` 不绑定宿主**：不可复用的只有 `siyuan/host/pluginHost.ts`（`import { Menu } from "siyuan"`）；`siyuan/host/createApp.ts` 与 `App.vue` 都不 import `siyuan`。宿主依赖只有 4 类且全部已是可注入参数：`props.docId`、`props.onClose`、`initialView`/`initialSection`、i18n（`createApp({ messages, fallbackResolve })`）→ **扩展只需一层薄壳**。
    - **`background.js` 的两条消息通道零调用方**（最后调用方 `ChromeUtil.ts` 于 2022-12-03 `ee7a98af` 删除）→ 没有「必须保留的 CORS 旁路」；且 MV3 下 `host_permissions: ["*://*/*"]` 已使扩展页直接 fetch 不受页面同源限制。
    - **`vite.v1.app.config.ts` 有 5 个消费者**（此前记为 4）：扩展 / 挂件 / nginx / vercel **+ 插件发行包自己**（`scripts/build.py:38` = `pluginBuild && siyuanBuild`）。
    - **现状即负债**：`pnpm build` 把整套 SPA 打进发行包 —— `dist/` 实测 **74 文件 / 33.66 MB**（含 `index.html`、`chunks/chunk.vendor_chatgpt.js` 5.39 MB），插件运行期完全用不到；对照 `dist/` 34 文件 / 18.40 MB。
    - **旧界面 SPA 路由实为 27 条**（此前记为 22）：16 条产品路由在当前界面有对应、11 条为开发测试用、**1 条缺口 = `/setting/siyuan`**（扩展在无宿主时**必须**手填 kernel 地址与 token，否则连自己的账号都读不到）。
    - **扩展只有一个真实功能缺口**：当前界面无自有暗色模式（宿主暗色由 `v2Host.ts` 同步），弹窗会恒亮色。
  - [x] 4.6.2 方案选型：**先做方案 A 的最小真机 POC**（扩展独立壳：新入口 html + 独立 vite config + 调 `createApp` 的壳 main + 连接配置视图），**纯新增文件、零改动现界面核心、不动挂件与 CI**；以真机结论再决定是否需要方案 B（抽出 `HostCapabilities` 解耦，可顺带覆盖挂件）。方案 C（保留 SPA 路由只换内部 UI）不采用：不收敛任何目标。
  - [x] 4.6.3 真机验证完成（真实 Chrome 152 + `Extensions.loadUnpacked`，以 `chrome-extension://` 身份装载）：① 渲染成功、**CSP 违规 0 条**；② 连接配置写入 `127.0.0.1:9999` 后**刷新仍在**（顺带修掉 `useSiyuanSettingStore` 无条件回写 `apiUrl` 的缺陷，见提交 `1d90f10b`），填入真实 token 后 `POST /api/notebook/lsNotebooks` 返回 **200 / 3 个笔记本**、账号列表读出 **48 个账号**；③ 无宿主文档时初始视图为「文章管理」，产品语义成立。**未验**：`chrome.*` 登录窗口/cookie 链路、单 chunk 12 MB 的弹窗加载成本
  - [x] 4.6.4 通用壳落地：`src/webapp/**` + `vite.webapp.config.ts`（`BUILD_TYPE` → `extension/<type>` / `widget` / `nginx` / `vercel`），`hostAdapter` 判定宿主（扩展/挂件/网页版）决定文档来源与是否显示连接面板；**挂件与 nginx/vercel 一并迁到通用壳**（挂件无需连接面板，文档 id 走 `getWidgetId()`）
  - [x] 4.6.5 旧界面 SPA 已删除：入口与壳（`index.html`、`main.ts`、`bootstrap.ts`、`App.vue`）、路由 27 条、`pages/**`、`layouts/**`、`workers/**`、`components/test/**`、`styles`、`locales/index.ts`、`iframeResize`、`vite.v1*.config.ts`，以及仅 SPA 可达的 `DrawerBoxBridge`/设置页/平台表单/`CookieSetting`/`FlowusSetting` 等；`usePublishConfig.spec.ts` 改为直接准备 pinia+i18n，不再挂载 `App.vue`
  - [x] 4.6.6 Firefox/MV2 分支已修好（`manifest-v2-for-firefox.json` 的 popup 指向通用壳产物 `index.html`，删掉全文注释的死背景脚本）；chrome/edge/firefox 三产物均可构建并打包
  - [x] 4.6.7 发行包已瘦身：`pnpm build` 不再夹带 SPA，`build/siyuan-plugin-publisher-*.zip` 由 **74 项 / 33.66 MB** 降到 **42 项 / 17.90 MB**，无 `index.html` / `chunks/` / `entry.*.js`
  - [x] 4.6.8 构建链转正：插件 lib 唯一出口 `vite.config.ts` → **`dist/`**（与 `makeLink` 默认值一致，`dist` 退役）；`DEV_MODE` 正式构建置 false（原先恒 true）；脚本的 `--outDir` 必须传绝对路径（Vite 会把相对路径按 config 的 `root` 解析，曾误落到 `src/webapp/`）；修掉 `vercelBuild` 调用不存在的 `python3`
- [ ] 4.7 归档本变更；合并 delta 至 `openspec/specs/`


## 修复 backlog（按需追加）

_验收中发现的问题在此登记，完成后勾选并回写 checklist。_

- [x] **#21 博客园配置验证**：MetaWeblog XML-RPC — `indexOf` / `non-text response`；`zhi-blog-api@1.79.0` + `proxyXmlrpc` 专用层（见 `.planning/2026-05-21-cnblogs-xmlrpc-response-text/`）
- [x] **#32 简书 Img/默认图床**：`JianshuConfig` 默认图床已设为 `PicbedServiceTypeEnum.Bundled`（新增账号默认选中"当前平台推荐"，spec 已覆盖）；`uploadFile` 增加 qiniu 错误详情；完整 help 配置已补齐（fields/faq/tour 4 步）。真实 PNG 带图发布验证通过；此前失败是测试图片 `icon.png` 实为 WebP 伪装 PNG
- [x] **#26 Wordpress.com 传输受限**：站点域按客户端特征拒绝 Node fetch；新增 `electron-session-fetch`（宿主网络栈）与用户自备跨域代理两条通路，保留 XML-RPC。见 `openspec/changes/archive/2026-09-19-add-wordpress-com-chromium-transport/`
- [x] **平台图床默认值缺失**：Typecho / Jvue / Wordpress / Wordpressdotcom / Metaweblog 通用 / Halo / Confluence 默认图床修正为平台图床，新增 `picbedDefaults.spec.ts` 双向覆盖
- [x] **GitLab 族 `[docpath]` 未解析**：图片曾落到字面量 `[docpath]/images/`；抽出 `resolvePlatformImagePath` 供 GitHub / GitLab 两族共用
