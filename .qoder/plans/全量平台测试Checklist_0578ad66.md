# 全量平台注册矩阵与测试 Checklist

> 数据来源：src/adaptors/ 目录扫描 + SubPlatformType 枚举 + bridgeRegistry.ts + pre.ts + index.ts
> 最后更新：2026-05-06

## 统计口径说明

本表穷举了代码库中所有与"平台"相关的条目，共计 54 项。SubPlatformType 枚举（不含 NONE）共 47 项，差值 7 项来源：6 个有目录但无 SubPlatformType 的孤儿 Config + 1 个 Custom_Flowus（历史残留：枚举值已注释、运行时不可达，仅目录和 Setting 文件残留于代码库）。小红书枚举值和 index.ts 注册均活跃，System_Siyuan 在枚举中，均不属差值来源。

## 列语义说明

| 列名 | 值 | 含义 |
|------|-----|------|
| adaptor | 类名 | 有完整 ApiAdaptor/WebAdaptor 实现，可在 index.ts 中通过 SubPlatformType 路由获取 |
| Setting | 组件名 / **无** | 有对应的 V1 Setting.vue 配置组件。**无** = 缺少配置界面，V1/V2 均无法通过 UI 配置该平台 |
| V2 Bridge | Yes / **无** | 已注册到 bridgeRegistry.ts，V2 设置态可桥接渲染该平台的配置组件。**无** = V2 中不可见，只能走 V1 |
| pre.ts | Yes / 动态 / **无** / **注释** | Yes=在 pre.ts 预设列表中，用户可直接添加；动态=需用户手动创建平台实例后才会出现；**无**=未注册到预设列表；**注释**=代码中已注释掉，不参与运行时 |

## 测试策略分层

本表并非所有条目都按同一标准测试。按实现完整度分为四层：

| 层级 | 适用条目 | 测试范围 | 测试动作 |
|------|---------|---------|---------|
| **T1 完整链路** | 人工可完成完整链路测试的条目（27项）：有 adaptor + Setting + V2 Bridge，可从 UI 添加并执行发布/更新/删除/图片/V2配置 | 发布、更新、删除、图片上传、V2配置 | 全量5动作 |
| **T2a V1可配置** | 有 adaptor + V1 Setting + 无 V2 Bridge（7项）：Custom Web Cookie 活跃平台 | 发布/更新 + V1配置验证 + V2不可见确认 | 4动作(发布+更新+V1配置+Inv) |
| **T2b 仅adaptor可达** | 有 adaptor 但无 Setting/无 V2 Bridge（3项）：Docsifyx2 + 小红书 | UI可见性与可添加性确认（不可见/不可添加即为预期通过） | 2动作(Vis+Add) |
| **T3 存在性确认** | 孤儿Config(6) + 枚举占位(9) + 注释项(1)（16项） | 确认不可用/未注册状态，不做功能测试 | 仅确认"该条目不存在可执行功能" |

### 人工测试与代码审计边界

本文档仅记录**人工测试动作**——即测试员通过 UI 操作可直接观察和验证的步骤（可见性、可添加性、可配置性、发布链路完整性）。

以下内容**不属于**人工测试范畴，不计入本 Checklist 的测试步骤：
- index.ts 中 platformKey → adaptor 的路由可达性
- bridgeRegistry.ts 中 V2 Bridge 的注册完整性
- SubPlatformType 枚举值的定义与存在性
- 代码级的 import / export 关系

若需验证上述内容，应另列为**代码审计结果**，不与人工测试动作混排。

### T0 内置最小验证动作定义

| 动作 | 说明 | 验证标准 |
|------|------|---------|
| Pub | 内置发布到思源自身 | 发布成功，思源笔记端文档内容正确 |

示例记录：`#54 思源笔记 Pub:P`

### T1 测试动作定义与记录粒度

每个 T1 平台的测试结果按以下 5 个动作分别记录，格式：`P/F/−`（Pass/Fail/未测）

| 动作 | 说明 | 验证标准 |
|------|------|---------|
| Pub | 新文档发布到目标平台 | 返回文章URL，平台端可见 |
| Upd | 修改已发布文档并重新发布 | 内容更新正确，URL不变 |
| Del | 删除已发布文档 | 平台端文章已删除 |
| Img | 发布含图片的文档 | 图片正确同步到平台图床/PicGo |
| V2C | 在V2设置态完成平台添加与参数配置 | Bridge组件正常渲染，配置可保存 |

示例记录：`#1 语雀 Pub:P Upd:P Del:P Img:P V2C:P`

### T2a 测试动作定义

| 动作 | 说明 | 验证标准 |
|------|------|---------|
| Pub | 新文档发布到目标平台 | 返回文章URL，平台端可见 |
| Upd | 修改已发布文档并重新发布 | 内容更新正确 |
| V1C | 在V1设置界面完成配置 | 配置可保存，Cookie登录态有效 |
| Inv | 确认V2设置态中不出现该平台 | V2平台选择列表中无该平台选项 |

示例记录：`#32 知乎 Pub:P Upd:P V1C:P Inv:P`

### T2b 测试动作定义

| 动作 | 说明 | 验证标准 |
|------|------|---------|
| Vis | 确认该平台在 V1/V2 UI 中的可见与可到达状态 | V1 发布设置界面中查看该平台配置入口是否存在且可到达；V2 设置态平台选择列表中查看该平台是否出现。T2b 预期：均不可见、不可到达配置页 |
| Add | 确认该平台是否可通过 UI 入口添加 | 查看 V1 预置列表或 V2"添加平台"菜单中是否出现该平台选项。T2b 预期：不可添加 |

示例记录：`#14 Docsify Vis:P Add:P`

### 人工测试前置条件

#### 账号与凭证准备

| 平台类型 | 必须有真实账号 | 允许暂缓 | 说明 |
|---------|-------------|---------|------|
| Common（语雀/Notion/Halo/Telegraph/Confluence） | 是 | — | API Token 方式授权，需在对应平台获取 |
| Github 系列 | 是 | — | GitHub Personal Access Token |
| Gitlab 系列 | 是 | — | Gitlab Personal Access Token（可使用 gitlab.com 免费版） |
| Metaweblog（博客园/Typecho/Jvue/通用） | 是 | Jvue | API Key 方式授权 |
| Wordpress 系列 | 是 | — | 自托管需安装站点；Wordpress.com 需注册 |
| Custom Web（知乎/CSDN/微信/简书/掘金/Halo网页版/B站） | 是 | 微信公众号 | Cookie 方式授权，需在浏览器中登录后提取 |
| Fs_LocalSystem | — | — | 无需账号，仅需本地目录 |
| System_Siyuan | — | — | 内置平台，思源环境自带 |

#### 测试文档

- **基础测试文档**：使用一篇包含标题、正文、代码块、图片的思源笔记文档
- **图片测试文档**：使用一篇包含 2+ 张本地图片的文档，验证图片上传链路
- **删除隔离**：每个平台创建专用测试文章（标题含 `[TEST]` 前缀），删除操作仅删除测试文章，避免误删真实内容

#### 特殊构造方法

| 场景 | 构造方法 |
|------|---------|
| Metaweblog_Metaweblog（pre.ts=动态） | 在 V2"添加平台"中选择 Metaweblog 类型，手动填写 API 地址和凭证 |
| 小红书（pre.ts 注释、无 Setting） | V1/V2 中不可见（无配置入口、无添加入口）；不做配置、不做发布功能验证 |
| Web Cookie 类平台 | 在思源内置浏览器中访问平台登录页，完成登录后 Cookie 自动提取；或手动填写 Cookie |
| Fs_LocalSystem | 在思源 Electron 环境下，准备一个本地目录作为发布目标（如 `/tmp/syp-test`） |

### 特殊平台测试备注

| 平台 | 层级 | 备注 |
|------|------|------|
| Docsify / Gitlabdocsify | T2b | adaptor 和 index.ts 已注册，但无 Setting 组件、无 V2 Bridge。T2b 只做 UI 可见性与可添加性确认（Vis+Add），不做配置后的功能验证 |
| 小红书 | T2b | SubPlatformType 和 index.ts 已注册但当前刻意不对用户开放（pre.ts 注释、无 Setting 组件）。仅做 Vis+Add 人工可观察验证，不做配置、不做发布功能验证。Vis:P 与 Add:P 即为预期通过，表示"该平台 UI 不可见且不可添加"是设计意图而非待补缺口 |
| Flowus | T3 | 历史残留：枚举值、pre.ts、index.ts 均已注释，目录和 Setting 文件仍保留在代码库中。运行时完全不活跃。T3 测试：确认 UI 中无该平台入口、不可添加、不可配置、无法走到发布流程 |
| Fs 9个枚举占位 | T3 | 仅 SubPlatformType 枚举中定义，无目录、无 adaptor、无注册。T3 测试：确认 UI 中无入口、不可添加、不可配置、无法走到发布流程 |
| System_Siyuan | T0 内置最小验证 | 系统内置平台，非用户可添加。测试目的仅验证：内置发布到思源自身可用，不做"添加/删除平台"操作 |

### Metaweblog 命名说明

OthermetaSetting 是 Metaweblog_Metaweblog（通用 Metaweblog）的 Setting 组件名。"Othermeta"意为"其他/通用 Metaweblog 实例"，与 Cnblogs/Typecho/Jvue 等具体子类型并列，非命名错误或漏项。

### 人工测试执行顺序

#### 阶段一：存在性确认（T0 + T3）

优先完成 T0 和 T3，确认所有"不可用/不可见"条目符合预期。这些不需要外部账号，可快速批量完成。

1. T0: #54 思源笔记 — 确认内置发布可用
2. T3: #23-25 api孤儿 + #39 Flowus + #41-43 web孤儿 + #45-53 Fs枚举占位 — 逐一确认 UI 中不可见、不可操作

#### 阶段二：T1 完整链路（按依赖复杂度递增）

每个 T1 平台必须**先完成配置（V2C），再做发布（Pub）→ 更新（Upd）→ 图片（Img）→ 删除（Del）**。

顺序建议（依赖复杂度递增）：

1. #44 本地系统（Fs_LocalSystem）— 无需外部账号，最易启动
2. #1-5 Common 系列 — API Token 授权，配置简单
3. #6-13 Github 系列 — GitHub PAT 授权
4. #15-21 Gitlab 系列 — Gitlab PAT 授权（可与 Github 并行）
5. #26-29 Metaweblog 系列 — API Key 授权
6. #30-31 Wordpress 系列 — 自托管/托管站点

#### 阶段三：T2 半活跃 / Cookie 类平台

1. T2b: #14 Docsify + #22 Gitlabdocsify + #40 小红书 — UI 可见性与可添加性确认（不可见/不可添加即为预期通过）
2. T2a: #32-38 Custom Web 活跃平台 — Cookie 授权，需登录态，依赖浏览器环境

#### 结果记录规范

- 动作通过记 `P`，失败记 `F`，未测记 `−`
- 如果某平台前置条件未满足（如无账号、无站点），标记为 `Blocked` 而非 `F`，例如：`#30 Wordpress Pub:Blocked Upd:− Del:− Img:− V2C:Blocked`
- `Blocked` 不影响其他平台测试，后续补齐条件后可单独重测

---

## 一、Common 通用（5）— T1 完整链路

| # | 目录 | SubPlatformType | platformName | adaptor | Setting | V2 Bridge | pre.ts | T1测试 |
|---|------|----------------|-------------|---------|---------|-----------|--------|------|
| 1 | api/yuque | Common_Yuque | 语雀 | YuqueApiAdaptor | YuqueSetting | Yes | Yes | [ ] |
| 2 | api/notion | Common_Notion | Notion | NotionApiAdaptor | NotionSetting | Yes | Yes | [ ] |
| 3 | api/halo | Common_Halo | Halo29 | HaloApiAdaptor | HaloSetting | Yes | Yes | [ ] |
| 4 | api/telegraph | Common_Telegraph | Telegraph | TelegraphApiAdaptor | TelegraphSetting | Yes | Yes | [ ] |
| 5 | api/confluence | Common_Confluence | Confluence | ConfluenceApiAdaptor | ConfluenceSetting | Yes | Yes | [ ] |

## 二、Github（8 + 1无Setting）— T1x8 + T2bx1

| # | 目录 | SubPlatformType | platformName | adaptor | Setting | V2 Bridge | pre.ts | 测试层级 |
|---|------|----------------|-------------|---------|---------|-----------|--------|------|
| 6 | api/hexo | Github_Hexo | Hexo | HexoApiAdaptor | HexoSetting | Yes | Yes | T1[ ] |
| 7 | api/hugo | Github_Hugo | Hugo | HugoApiAdaptor | HugoSetting | Yes | Yes | T1[ ] |
| 8 | api/jekyll | Github_Jekyll | Jekyll | JekyllApiAdaptor | JekyllSetting | Yes | Yes | T1[ ] |
| 9 | api/quartz | Github_Quartz | Quartz | QuartzApiAdaptor | QuartzSetting | Yes | Yes | T1[ ] |
| 10 | api/vuepress | Github_Vuepress | Vuepress | VuepressApiAdaptor | VuepressSetting | Yes | Yes | T1[ ] |
| 11 | api/vuepress2 | Github_Vuepress2 | Vuepress2 | Vuepress2ApiAdaptor | Vuepress2Setting | Yes | Yes | T1[ ] |
| 12 | api/vitepress | Github_Vitepress | Vitepress | VitepressApiAdaptor | VitepressSetting | Yes | Yes | T1[ ] |
| 13 | api/astro | Github_Astro | Astro | AstroApiAdaptor | AstroSetting | Yes | Yes | T1[ ] |
| 14 | api/docsify | Github_Docsify | Docsify | DocsifyApiAdaptor | **无** | **无** | Yes | T2b[ ] |

## 三、Gitlab（7 + 1无Setting）— T1x7 + T2bx1

| # | 目录 | SubPlatformType | platformName | adaptor | Setting | V2 Bridge | pre.ts | 测试层级 |
|---|------|----------------|-------------|---------|---------|-----------|--------|------|
| 15 | api/gitlab-hexo | Gitlab_Hexo | Gitlabhexo | GitlabhexoApiAdaptor | GitlabhexoSetting | Yes | Yes | T1[ ] |
| 16 | api/gitlab-hugo | Gitlab_Hugo | Gitlabhugo | GitlabhugoApiAdaptor | GitlabhugoSetting | Yes | Yes | T1[ ] |
| 17 | api/gitlab-jekyll | Gitlab_Jekyll | Gitlabjekyll | GitlabjekyllApiAdaptor | GitlabjekyllSetting | Yes | Yes | T1[ ] |
| 18 | api/gitlab-vuepress | Gitlab_Vuepress | Gitlabvuepress | GitlabvuepressApiAdaptor | GitlabvuepressSetting | Yes | Yes | T1[ ] |
| 19 | api/gitlab-vuepress2 | Gitlab_Vuepress2 | Gitlabvuepress2 | Gitlabvuepress2ApiAdaptor | Gitlabvuepress2Setting | Yes | Yes | T1[ ] |
| 20 | api/gitlab-vitepress | Gitlab_Vitepress | Gitlabvitepress | GitlabvitepressApiAdaptor | GitlabvitepressSetting | Yes | Yes | T1[ ] |
| 21 | api/gitlab-astro | Gitlab_Astro | Gitlabastro | GitlabastroApiAdaptor | GitlabastroSetting | Yes | Yes | T1[ ] |
| 22 | api/gitlab-docsify | Gitlab_Docsify | Gitlabdocsify | GitlabdocsifyApiAdaptor | **无** | **无** | Yes | T2b[ ] | |

## 四、api/ 孤儿目录（3）— T3 存在性确认

| # | 目录 | SubPlatformType | platformName | 仅有 | index.ts注册 | 测试层级 |
|---|------|----------------|-------------|------|-------------|------|
| 23 | api/antora | **无** | Antora | antoraConfig.ts | **无** | T3[ ] |
| 24 | api/gitlab-antora | **无** | Gitlabantora | gitlabantoraConfig.ts | **无** | T3[ ] |
| 25 | api/yinxiang | **无** | 印象笔记 | yinxiangConfig.ts | **无** | T3[ ] |

## 五、Metaweblog（4）— T1 完整链路

| # | 目录 | SubPlatformType | platformName | adaptor | Setting | V2 Bridge | pre.ts | T1测试 |
|---|------|----------------|-------------|---------|---------|-----------|--------|------|
| 26 | api/metaweblog | Metaweblog_Metaweblog | Metaweblog | MetaweblogApiAdaptor | OthermetaSetting | Yes | 动态 | [ ] |
| 27 | api/cnblogs | Metaweblog_Cnblogs | 博客园 | CnblogsApiAdaptor | CnblogsSetting | Yes | Yes | [ ] |
| 28 | api/typecho | Metaweblog_Typecho | Typecho | TypechoApiAdaptor | TypechoSetting | Yes | Yes | [ ] |
| 29 | api/jvue | Metaweblog_Jvue | Jvue | JvueApiAdaptor | JvueSetting | Yes | Yes | [ ] |

## 六、Wordpress（2）— T1 完整链路

| # | 目录 | SubPlatformType | platformName | adaptor | Setting | V2 Bridge | pre.ts | T1测试 |
|---|------|----------------|-------------|---------|---------|-----------|--------|------|
| 30 | api/wordpress | Wordpress_Wordpress | Wordpress | WordpressApiAdaptor | WordpressSetting | Yes | Yes | [ ] |
| 31 | api/wordpress-dot-com | Wordpress_Wordpressdotcom | Wordpress.com | WordpressdotcomApiAdaptor | WordpressdotcomSetting | Yes | Yes | [ ] |

## 七、Custom Web Cookie 类（7 活跃 + 1 注释 + 1 半活跃）— T2ax7 + T2bx1 + T3x1

| # | 目录 | SubPlatformType | platformName | adaptor | Setting | V2 Bridge | pre.ts | 测试层级 |
|---|------|----------------|-------------|---------|---------|-----------|--------|------|
| 32 | web/zhihu | Custom_Zhihu | 知乎 | ZhihuWebAdaptor | ZhihuSetting | **无** | Yes | T2a[ ] |
| 33 | web/csdn | Custom_CSDN | CSDN | CsdnWebAdaptor | CsdnSetting | **无** | Yes | T2a[ ] |
| 34 | web/wechat | Custom_Wechat | 微信公众号 | WechatWebAdaptor | WechatSetting | **无** | Yes | T2a[ ] |
| 35 | web/jianshu | Custom_Jianshu | 简书 | JianshuWebAdaptor | JianshuSetting | **无** | Yes | T2a[ ] |
| 36 | web/juejin | Custom_Juejin | 掘金 | JuejinWebAdaptor | JuejinSetting | **无** | Yes | T2a[ ] |
| 37 | web/haloweb | Custom_Haloweb | Halo网页版 | HalowebWebAdaptor | HalowebSetting | **无** | Yes | T2a[ ] |
| 38 | web/bilibili | Custom_Bilibili | 哔哩哔哩 | BilibiliWebAdaptor | BilibiliSetting | **无** | Yes | T2a[ ] |
| 39 | web/flowus | ~~Custom_Flowus~~ | Flowus息流 | FlowusWebAdaptor | FlowusSetting | **无** | **注释** | T3[ ] |
| 40 | web/xiaohongshu | Custom_Xiaohongshu | 小红书 | XiaohongshuWebAdaptor | **无** | **无** | **注释** | T2b[ ] |

## 八、web/ 孤儿目录（3）— T3 存在性确认

| # | 目录 | SubPlatformType | platformName | 仅有 | index.ts注册 | 测试层级 |
|---|------|----------------|-------------|------|-------------|------|
| 41 | web/douban | **无** | 豆瓣 | doubanConfig.ts | **无** | T3[ ] |
| 42 | web/mdnice | **无** | 墨滴 | mdniceConfig.ts | **无** | T3[ ] |
| 43 | web/wuaipojie | **无** | 吾爱破解 | wuaipojieConfig.ts | **无** | T3[ ] |

## 九、Fs 文件系统（1 T1实现 + 9 T3枚举占位）— fs/

| # | 目录 | SubPlatformType | platformName | adaptor | Setting | V2 Bridge | pre.ts | 测试层级 |
|---|------|----------------|-------------|---------|---------|-----------|--------|------|
| 44 | fs/LocalSystem | Fs_LocalSystem | 本地系统 | LocalSystemApiAdaptor | LocalSystemSetting | Yes | Yes | T1[ ] |
| 45 | — | Fs_Ftp | FTP | **无** | **无** | **无** | **无** | T3[ ] |
| 46 | — | Fs_Sftp | SFTP | **无** | **无** | **无** | **无** | T3[ ] |
| 47 | — | Fs_BaiduNetDisk | 百度网盘 | **无** | **无** | **无** | **无** | T3[ ] |
| 48 | — | Fs_AliyunDrive | 阿里云盘 | **无** | **无** | **无** | **无** | T3[ ] |
| 49 | — | Fs_Weiyun | 微云 | **无** | **无** | **无** | **无** | T3[ ] |
| 50 | — | Fs_Doubao | 豆包 | **无** | **无** | **无** | **无** | T3[ ] |
| 51 | — | Fs_OneDrive | OneDrive | **无** | **无** | **无** | **无** | T3[ ] |
| 52 | — | Fs_GoogleDrive | Google Drive | **无** | **无** | **无** | **无** | T3[ ] |
| 53 | — | Fs_Quark | 夸克网盘 | **无** | **无** | **无** | **无** | T3[ ] |

## 十、System（1）— T0 内置最小验证

| # | 目录 | SubPlatformType | platformName | adaptor | Setting | V2 Bridge | pre.ts | 测试层级 |
|---|------|----------------|-------------|---------|---------|-----------|--------|------|
| 54 | — | System_Siyuan | 思源笔记 | SiyuanApi | — | 不适用 | Yes | T0[ ] |

---

## 汇总

| 分类 | 总数 | T0内置 | T1完整链路 | T2a V1可配置 | T2b仅adaptor | T3存在性 |
|------|------|--------|-----------|-------------|-------------|---------|
| Common | 5 | 0 | 5 | 0 | 0 | 0 |
| Github | 9 | 0 | 8 | 0 | 1(Docsify) | 0 |
| Gitlab | 8 | 0 | 7 | 0 | 1(Docsify) | 0 |
| api孤儿 | 3 | 0 | 0 | 0 | 0 | 3(仅Config) |
| Metaweblog | 4 | 0 | 4 | 0 | 0 | 0 |
| Wordpress | 2 | 0 | 2 | 0 | 0 | 0 |
| Custom Web | 9 | 0 | 0 | 7(活跃) | 1(小红书) | 1(Flowus) |
| web孤儿 | 3 | 0 | 0 | 0 | 0 | 3(仅Config) |
| Fs | 10 | 0 | 1(LocalSystem) | 0 | 0 | 9(仅枚举) |
| System | 1 | 1(Siyuan) | 0 | 0 | 0 | 0 |
| **合计** | **54** | **1** | **27** | **7** | **3** | **16** |