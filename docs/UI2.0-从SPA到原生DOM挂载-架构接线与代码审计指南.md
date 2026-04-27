# UI2.0 从 SPA 到原生 DOM 挂载：架构接线与代码审计指南

> 基于仓库 `siyuan-plugin-publisher` 在 **2026-04-27** 的当前代码状态整理。
> 这份文档只描述**已经在代码里落地的真实链路**，不额外发明新方案。

## 0. 先给结论

当前 UI2.0 **不是**“已经完全从 SPA 迁完”，而是一个**分层迁移态**：

- **入口层**：已经有一部分从 `iframe + SPA` 切到 **思源原生 Menu + 真实 DOM 挂载**
- **视图层**：V2 有自己的统一工作壳 `V2App + UnifiedWorkspaceShell`
- **业务层**：V2 **没有重写核心发布业务**，而是继续复用老的 `usePublish / usePublishConfig / useSiyuanApi`
- **设置表单层**：平台配置页大部分仍然是 **V2 壳 + 旧表单组件桥接**
- **剩余功能**：常规发布、批量分发、AI、文章管理、测试页、关于页等仍然主要走 **旧 SPA/iframe**

如果你现在要**快速把架构代码接起来做审计**，最短阅读主线就是：

```text
siyuan/index.ts
  -> siyuan/topbar.ts / siyuan/invoke/widgetInvoke.ts
  -> siyuan/v2/v2Host.ts
  -> src/v2/createV2App.ts
  -> src/components/v2/V2App.vue
  -> src/composables/v2/useV2QuickPublish.ts / useV2Settings.ts
  -> src/composables/usePublish.ts / usePublishConfig.ts / useSiyuanApi.ts
```

### 0.1 直接跳读索引（建议按这个顺序点开）

> 为了方便你“顺手去读”，这里统一给出**可点击文件引用**。  
> 行号仍然保留在正文里，下面这个索引优先解决“先点开哪个文件”。

1. 插件宿主入口
   - [`../siyuan/index.ts`](../siyuan/index.ts)
2. 顶栏主入口与 V2/旧 UI 分流
   - [`../siyuan/topbar.ts`](../siyuan/topbar.ts)
3. 插件/挂件侧入口分流
   - [`../siyuan/invoke/widgetInvoke.ts`](../siyuan/invoke/widgetInvoke.ts)
4. V2 原生 DOM 宿主
   - [`../siyuan/v2/v2Host.ts`](../siyuan/v2/v2Host.ts)
5. V2 Vue 工厂
   - [`../src/v2/createV2App.ts`](../src/v2/createV2App.ts)
6. V2 根组件
   - [`../src/components/v2/V2App.vue`](../src/components/v2/V2App.vue)
7. V2 工作壳
   - [`../src/components/v2/layout/UnifiedWorkspaceShell.vue`](../src/components/v2/layout/UnifiedWorkspaceShell.vue)
8. V2 快速发布状态
   - [`../src/composables/v2/useV2QuickPublish.ts`](../src/composables/v2/useV2QuickPublish.ts)
9. V2 设置状态
   - [`../src/composables/v2/useV2Settings.ts`](../src/composables/v2/useV2Settings.ts)
10. 共享发布业务
    - [`../src/composables/usePublish.ts`](../src/composables/usePublish.ts)
11. 共享平台配置解析
    - [`../src/composables/usePublishConfig.ts`](../src/composables/usePublishConfig.ts)
12. 共享思源 API 封装
    - [`../src/composables/useSiyuanApi.ts`](../src/composables/useSiyuanApi.ts)
13. 共享发布配置存储
    - [`../src/stores/usePublishSettingStore.ts`](../src/stores/usePublishSettingStore.ts)
14. V2 平台配置桥接
    - [`../src/components/v2/settings/V2PlatformConfigBridge.vue`](../src/components/v2/settings/V2PlatformConfigBridge.vue)
15. 桥接注册表
    - [`../src/components/v2/settings/bridge/bridgeRegistry.ts`](../src/components/v2/settings/bridge/bridgeRegistry.ts)
16. 旧 iframe 承载
    - [`../siyuan/iframeDialog.ts`](../siyuan/iframeDialog.ts)
17. 旧 SPA 启动入口
    - [`../src/main.ts`](../src/main.ts)
    - [`../src/bootstrap.ts`](../src/bootstrap.ts)
    - [`../src/routes/routeConfig.ts`](../src/routes/routeConfig.ts)
18. 旧 quick publish worker
    - [`../src/workers/QuickPublish.vue`](../src/workers/QuickPublish.vue)

### 0.2 引用约定

- 文中形如 `siyuan/index.ts:81-99` 的写法，表示**本次整理时的代码快照行号**
- 真正顺手阅读时，优先直接点上面的相对路径链接，再按正文给的行号定位
- 如果后续代码改动导致行号漂移，以**函数名 / 结构名 / 调用链**为准，不以旧行号为准

---

## 1. 你说的 “DOM Ready” 在这个仓库里到底指什么

这个仓库里**没有显式的 `DOMContentLoaded` / `dom ready` 架构层**。
当前真正存在的是两段 readiness：

### 1.1 宿主 ready（思源插件 ready）

由插件生命周期触发：

- `PublisherPlugin.onload()`：初始化顶栏、Tab、全局 `window.syp.alert`
- `PublisherPlugin.onLayoutReady()`：加载配置并绑定文档标题菜单事件

对应文件：

- `siyuan/index.ts:81-99`
- `siyuan/index.ts:134-188`

### 1.2 V2 挂载 ready（mount ready）

由入口显式调用 `V2Host.show()` 触发：

- 创建思源原生 `Menu`
- 创建真实 DOM `mountPoint`
- `app.mount(mountPoint)`
- `V2App.onMounted()` 后再初始化页面状态

对应文件：

- `siyuan/v2/v2Host.ts:26-70`
- `src/components/v2/V2App.vue:268-271`

**所以这里更准确的词不是 “DOM Ready 架构”，而是：**

> **思源宿主 ready -> V2Host 真实 DOM 挂载 -> V2App mounted -> 业务初始化**

---

## 2. 当前真实架构图

```text
┌──────────────────────────────────────────────────────────────┐
│                     思源插件运行时 siyuan/                   │
├──────────────────────────────────────────────────────────────┤
│ PublisherPlugin.onload / onLayoutReady                      │
│   ├─ Topbar.initTopbar()                                    │
│   ├─ WidgetInvoke / PluginInvoke                            │
│   └─ click-editortitleicon 文档菜单事件                     │
└──────────────────────────────────────────────────────────────┘
                     │
          ┌──────────┴──────────┐
          │                     │
          ▼                     ▼
┌──────────────────────┐  ┌──────────────────────────────────┐
│ 旧入口：iframe SPA    │  │ 新入口：V2Host 原生 DOM 挂载      │
│ showIframeDialog()   │  │ Menu + mountPoint + app.mount() │
└─────────┬────────────┘  └──────────────┬───────────────────┘
          │                               │
          ▼                               ▼
┌──────────────────────┐      ┌──────────────────────────────┐
│ src/main.ts          │      │ src/v2/createV2App.ts        │
│ bootstrap.ts         │      │ V2App.vue                    │
│ vue-router           │      │ UnifiedWorkspaceShell        │
│ routeConfig.ts       │      │ useV2QuickPublish            │
└─────────┬────────────┘      │ useV2Settings                │
          │                   └──────────────┬───────────────┘
          │                                  │
          └──────────────┬───────────────────┘
                         ▼
        ┌────────────────────────────────────────────┐
        │ 共享业务层（V1 / V2 共用）                 │
        │ usePublish / usePublishConfig /            │
        │ useSiyuanApi / usePublishSettingStore      │
        └────────────────────────────────────────────┘
```

**关键判断：**

当前真正迁走的主要是**承载方式**，不是**核心业务实现**。

---

## 3. 两套承载体系分别在哪里

## 3.1 旧体系：iframe + SPA

### 承载入口

- `siyuan/iframeDialog.ts:39-63`
- `siyuan/invoke/widgetInvoke.ts:140-181`

### SPA 启动链

- `src/main.ts:15-20`
- `src/bootstrap.ts:25-49`
- `src/routes/routeConfig.ts:42-150`

### 典型旧路径

- 快速发布 worker：`/workers/quickPublish/:key/:id`
- 常规发布：`/publish/singlePublish`
- 批量分发：`/publish/batchPublish`
- AI：`/ai/chat`
- 发布设置：`/setting/publish`
- 偏好设置：`/setting/general`
- 关于：`/about`

---

## 3.2 新体系：思源 Menu + 原生 DOM 挂载

### 宿主层

- `siyuan/v2/v2Host.ts:15-140`

职责：

- 建立思源原生 `Menu`
- 创建 `mountPoint`
- 决定 desktop 锚点弹出 / mobile 全屏
- 创建并销毁 V2 Vue App
- 注入宿主 i18n fallback

### Vue 工厂层

- `src/v2/createV2App.ts:17-40`

职责：

- 创建 `V2App`
- 装载 `Pinia`
- 装载 `vue-i18n`
- 注入 `V2_I18N_FALLBACK_KEY`

### 统一工作壳

- `src/components/v2/V2App.vue:1-329`
- `src/components/v2/layout/UnifiedWorkspaceShell.vue:1-49`

职责：

- header / close / settings back
- 快速发布态与设置态切换
- 设置态左侧导航
- 各子视图条件渲染

---

## 4. 实际启动时序

## 4.1 插件生命周期

### 阶段 A：插件载入

`PublisherPlugin.onload()` 做 3 件事：

1. `Topbar.initTopbar()`
2. `initCustomTab()`
3. `mountFn()` 注入 `window.syp.alert`

见：`siyuan/index.ts:81-127`

### 阶段 B：布局就绪

`PublisherPlugin.onLayoutReady()` -> `onEvent()`：

- 预加载发布配置 `ConfigManager.loadConfig()`
- 预加载偏好配置 `PreferenceConfigManager.loadConfig()`
- 绑定 `click-editortitleicon`

见：`siyuan/index.ts:90-142`

---

## 4.2 顶栏打开 V2 快速发布

入口链路：

```text
Topbar.addEventListener(click)
  -> PreferenceConfigManager.loadConfig()
  -> if useV2UI
       -> V2Host.show({ anchorElement, initialView: 'quick_publish' })
       -> createV2VueApp()
       -> V2App.onMounted()
       -> quickPublish.init() + settings.loadAccountItems()
```

关键代码：

- `siyuan/topbar.ts:64-79`
- `siyuan/topbar.ts:85-90`
- `siyuan/v2/v2Host.ts:26-65`
- `src/components/v2/V2App.vue:268-271`

---

## 4.3 从插件设置入口打开 V2 设置壳

入口链路：

```text
WidgetInvoke.showPublisherPublishSettingDialog()
  -> PreferenceConfigManager.loadConfig()
  -> if useV2UI
       -> V2Host.show({ initialView: 'settings' })
```

关键代码：

- `siyuan/invoke/widgetInvoke.ts:109-120`
- `siyuan/v2/v2Host.ts:90-106`

注意：

- 这里没有 `anchorElement`
- 所以 desktop 也会走 `fullscreen("all")`

---

## 4.4 V2 内部初始化

`V2App.onMounted()` 现在只做两件事：

- `quickPublish.init()`
- `settings.loadAccountItems()`

见：`src/components/v2/V2App.vue:268-271`

### 快速发布初始化干什么

`useV2QuickPublish.init()`：

1. 通过 DOM 取当前文档 ID：`WidgetPageUtils.getPageId()`
2. 读取统一发布配置：`usePublishSettingStore.getSetting()`
3. 从 `DYNAMIC_CONFIG_KEY` 解析启用平台
4. 从当前文档的 post meta 判断已发布状态
5. 通过 `kernelApi.getBlockByID()` 取当前文档标题

见：

- `src/composables/v2/useV2QuickPublish.ts:101-142`
- `siyuan/utils/widgetPageUtils.ts:29-37`

### 设置初始化干什么

`useV2Settings.loadAccountItems()`：

1. 读取统一发布配置
2. 解析 `DYNAMIC_CONFIG_KEY`
3. 过滤 `PlatformType.System`
4. 组装账号状态 UI 数据

见：

- `src/composables/v2/useV2Settings.ts:94-138`

---

## 4.5 一条最关键的单链路审计图

如果你现在只想抓**当前 V2 主路径**，最值得先审这一条：

```text
顶栏点击
  -> Topbar 判断 useV2UI
  -> V2Host.show()
  -> createV2VueApp()
  -> V2App.onMounted()
  -> useV2QuickPublish.init()
  -> 用户点击某个平台卡片
  -> useV2QuickPublish.publishToPlatform()
  -> usePublishConfig.getPublishCfg()
  -> useSiyuanApi.blogApi.getPost()
  -> usePublish.doSinglePublish()
  -> Adaptors.getAdaptor() / api.preEditPost() / api.newPost() or editPost()
  -> updateSetting() / setSingleBlockAttr() / getPostPreviewUrl()
```

### 4.5.1 顺手点开的文件顺序

1. 顶栏入口  
   - [`../siyuan/topbar.ts`](../siyuan/topbar.ts)
2. V2 宿主  
   - [`../siyuan/v2/v2Host.ts`](../siyuan/v2/v2Host.ts)
3. V2 Vue 工厂  
   - [`../src/v2/createV2App.ts`](../src/v2/createV2App.ts)
4. V2 根组件  
   - [`../src/components/v2/V2App.vue`](../src/components/v2/V2App.vue)
5. V2 快速发布状态  
   - [`../src/composables/v2/useV2QuickPublish.ts`](../src/composables/v2/useV2QuickPublish.ts)
6. 共享发布配置解析  
   - [`../src/composables/usePublishConfig.ts`](../src/composables/usePublishConfig.ts)
7. 共享思源 API  
   - [`../src/composables/useSiyuanApi.ts`](../src/composables/useSiyuanApi.ts)
8. 共享发布核心  
   - [`../src/composables/usePublish.ts`](../src/composables/usePublish.ts)
9. adaptor 总入口  
   - [`../src/adaptors/index.ts`](../src/adaptors/index.ts)

### 4.5.2 按调用顺序展开

#### A. 顶栏点击到 V2 Host

- `Topbar.initTopbar()` 注册顶栏 click
- click 时先读 `PreferenceConfigManager.loadConfig()`
- 如果 `useV2UI` 为真，则走 `showV2QuickPublishPanel()`
- 最终进入 `V2Host.show({ anchorElement, initialView: "quick_publish" })`

主看：

- `../siyuan/topbar.ts`
- `siyuan/topbar.ts:55-90`

这里先审两个问题：

1. `useV2UI` 开关是否是唯一分流点
2. V2 初始化异常时是否一定回退到 legacy menu

#### B. V2 Host 到 Vue App

- `V2Host.show()` 先 `close()`
- 创建思源 `Menu`
- 创建 `mountPoint`
- 调用 `createV2VueApp()`
- `app.mount(mountPoint)`

主看：

- `../siyuan/v2/v2Host.ts`
- `../src/v2/createV2App.ts`
- `siyuan/v2/v2Host.ts:26-70`

这里先审三个问题：

1. 是否真的完全脱离 iframe
2. mount/unmount 是否成对
3. 宿主 i18n fallback 是否只注入一处

#### C. V2App mounted 到快速发布初始化

- `V2App.onMounted()` 同时执行
  - `quickPublish.init()`
  - `settings.loadAccountItems()`
- 快速发布主路径主要先看 `quickPublish.init()`

主看：

- `../src/components/v2/V2App.vue`
- `../src/composables/v2/useV2QuickPublish.ts`
- `src/components/v2/V2App.vue:268-271`
- `src/composables/v2/useV2QuickPublish.ts:101-142`

这里先审两个问题：

1. 当前文档上下文从哪里来
2. 平台列表和已发布状态从哪里来

#### D. `useV2QuickPublish.init()` 读了哪些东西

它会依次做：

1. `WidgetPageUtils.getPageId()` 从 DOM 推断当前文档
2. `usePublishSettingStore.getSetting()` 读取统一发布配置
3. 解析 `DYNAMIC_CONFIG_KEY`
4. 用 `getDynPostidKey()` 判断当前文档在各平台是否已发布
5. `kernelApi.getBlockByID()` 取文档标题

主看：

- `../siyuan/utils/widgetPageUtils.ts`
- `../src/stores/usePublishSettingStore.ts`
- `../src/platforms/dynamicConfig.ts`
- `../src/composables/useSiyuanApi.ts`

这里先审四个问题：

1. `pageId` 是否会在多编辑器场景取错
2. `getSetting()` 是否存在缓存陈旧
3. 发布态是不是完全依赖 post meta
4. 标题修正是否受偏好配置影响

#### E. 用户点击平台卡片后的真实发布链

点击平台卡片后：

- `V2App.publishToPlatform(item)`
- `useV2QuickPublish.publishToPlatform(item)`
- `getPublishCfg(item.platformKey)`
- `blogApi.getPost(state.pageId)`
- `initPublishMethods.assignInitAttrs(...)`
- `doSinglePublish(...)`

主看：

- `src/components/v2/V2App.vue:299-301`
- `src/composables/v2/useV2QuickPublish.ts:147-200`

这里先审两个问题：

1. V2 和旧 quick publish 在发布前预处理是否一致
2. publish state 的状态机是否覆盖全部失败路径

#### F. `doSinglePublish()` 才是核心业务落点

`usePublish.doSinglePublish()` 里做的才是真正的发布动作：

1. 判断是否系统平台
2. 读取旧 postid / 判断 add 还是 edit
3. `getPublishApi()` -> `Adaptors.getAdaptor()`
4. `api.preEditPost()`
5. `api.newPost()` 或 `api.editPost()`
6. `updateSetting(setting)` 写回发布信息
7. `kernelApi.setSingleBlockAttr()` 写回 YAML
8. `getPostPreviewUrl()` 计算预览地址

主看：

- `../src/composables/usePublish.ts`
- `../src/composables/usePublishConfig.ts`
- `src/composables/usePublish.ts:59-209`

这里先审四个问题：

1. postid / slug 写回是否和旧链路完全一致
2. add/edit 分支是否会因为旧数据缺损而漂移
3. adaptor 的 `preEditPost()` 是否会隐式改写关键字段
4. 失败时是否会留下半写入状态

### 4.5.3 这条链上最关键的“断点位”

如果你边看边打断点，优先下在这几个位置：

1. `siyuan/topbar.ts`  
   - 顶栏 click 回调进入处
2. `siyuan/v2/v2Host.ts`  
   - `show()` 里 `app.mount(mountPoint)` 前后
3. `src/components/v2/V2App.vue`  
   - `onMounted()`  
   - `publishToPlatform()`
4. `src/composables/v2/useV2QuickPublish.ts`  
   - `init()`  
   - `publishToPlatform()`
5. `src/composables/usePublish.ts`  
   - `doSinglePublish()`
6. `src/composables/usePublishConfig.ts`  
   - `getPublishCfg()`  
   - `getPublishApi()`

### 4.5.4 这一条链和旧 quick publish 的核心差异

当前最需要记住的一处差异是：

- **旧 quick publish worker**
  - [`../src/workers/QuickPublish.vue`](../src/workers/QuickPublish.vue)
  - 会先发布 `pre.systemCfg`，再发目标平台
- **V2 quick publish**
  - [`../src/composables/v2/useV2QuickPublish.ts`](../src/composables/v2/useV2QuickPublish.ts)
  - 当前直接发目标平台

所以如果你要审“V2 是否功能等价”，这一条就是第一优先级。

---

## 5. 现在已经迁到哪一步了

## 5.1 已经是 V2 原生 DOM 的部分

| 能力 | 当前状态 | 代码锚点 |
|---|---|---|
| 顶栏主入口快速发布 | 已切到 V2 原生 DOM | `siyuan/topbar.ts:67-90` |
| 发布设置壳入口 | 已切到 V2 原生 DOM | `siyuan/invoke/widgetInvoke.ts:109-120` |
| V2 统一工作壳 | 已存在 | `src/components/v2/V2App.vue` |
| 账号列表 | 原生 V2 | `src/components/v2/settings/V2AccountList.vue` |
| 账号选择 | 原生 V2 | `src/components/v2/settings/V2PlatformSelect.vue` |
| 图床设置 | 原生 V2 | `src/components/v2/settings/V2PicBedSettings.vue` |
| 偏好设置 | 原生 V2 | `src/components/v2/settings/V2PreferenceSettings.vue` |
| 快速发布卡片视图 | 原生 V2 | `src/components/v2/publish/V2PlatformCard.vue` |

## 5.2 仍然是 V2 壳 + 旧表单桥接

| 能力 | 当前状态 | 代码锚点 |
|---|---|---|
| 平台配置表单 | V2 外壳承载，内部复用旧表单组件 | `src/components/v2/settings/V2PlatformConfigBridge.vue` |
| 桥接注册表 | 26 个直接映射 + 1 个 Electron-only 特例 | `src/components/v2/settings/bridge/bridgeRegistry.ts:31-79` |

这里的真实含义是：

- **承载方式已经从 iframe 迁走了**
- **表单实现本体还没有完全 V2 原生化**

## 5.3 仍然留在旧 SPA / iframe 的部分

| 能力 | 当前状态 | 代码锚点 |
|---|---|---|
| 文档菜单快速发布 | 旧菜单 + 旧 quick publish worker | `siyuan/index.ts:173-186` |
| 常规发布 | 旧 SPA | `src/routes/routeConfig.ts:48-49` |
| 批量分发 | 旧 SPA | `src/routes/routeConfig.ts:53-55` |
| AI 聊天 | 旧 SPA / Tab | `siyuan/invoke/widgetInvoke.ts:71-85` |
| 文章管理/仪表盘 | 旧 SPA / Tab | `src/routes/routeConfig.ts:50-52` |
| 关于页 | 旧 SPA | `src/routes/routeConfig.ts:145-149` |
| 测试页 | 旧 SPA | `src/routes/routeConfig.ts:63-107` |
| 通用设置旧页 | 旧 SPA | `src/routes/routeConfig.ts:136-143` |

---

## 6. 业务层到底有没有重写

没有。

当前 V2 和旧 SPA 的核心业务层仍然是**共用的**。

### 共享发布业务

- `src/composables/usePublish.ts`
- `src/composables/usePublishConfig.ts`
- `src/composables/useSiyuanApi.ts`

### 共享配置存储

- 发布配置：`src/stores/usePublishSettingStore.ts`
- 偏好配置文件：`/data/storage/syp/publish-preference-cfg.json`
  - 插件运行时读法：`siyuan/store/preferenceConfigManager.ts:69-100`
  - Vue/V2 响应式读法：`src/stores/usePreferenceSettingStore.ts:21-89`
  - Electron 本地文件适配：`src/stores/common/jsonStorage.ts:29-50`

### 这意味着什么

这其实是当前迁移能快速接线的根本原因：

> **V2 主要替换的是“壳”和“入口”，不是业务 API。**

所以你审计时要把边界分成两层：

- **承载层**：旧 iframe SPA vs 新 DOM Host
- **业务层**：共享 composable/store

---

## 7. 当前最短接线路线

如果你要沿着现有路线继续接代码，最短路径不是去改 `src/pages/*`，而是：

### 7.1 新入口接法

优先从这里接：

- `siyuan/topbar.ts`
- `siyuan/invoke/widgetInvoke.ts`

原则：

- **新 V2 能力优先走 `V2Host.show()`**
- 不再优先新增 `showPage("/xxx")`

### 7.2 新视图接法

优先从这里接：

- `src/components/v2/V2App.vue`
- `src/components/v2/layout/UnifiedWorkspaceShell.vue`

原则：

- 快速发布态：直接挂在 `V2App.vue` 主区
- 设置态：通过 `section/accountView` 进入

### 7.3 新状态接法

优先从这里接：

- `src/composables/v2/useV2QuickPublish.ts`
- `src/composables/v2/useV2Settings.ts`

原则：

- V2 自己只维护 **局部 UI 状态**
- 持久化和业务动作继续复用共享层

### 7.4 新文案接法

优先从这里接：

- `siyuan/i18n/zh_CN.json`
- `siyuan/i18n/en_US.json`
- `src/composables/v2/useV2I18n.ts`

原则：

- **V2 文案只认宿主 i18n 真相源**
- 不要再给 V2 新增 `src/locales/*` 里的独立 key

### 7.5 新平台配置页接法

当前有两种接法：

1. **继续桥接旧表单**：在 `bridgeRegistry.ts` 注册
2. **做原生 V2 表单**：替换 `V2PlatformConfigBridge` 的桥接分支

---

## 8. 审计时必须先盯住的几个边界

## 8.1 入口边界：哪些入口已经迁了，哪些没迁

这是当前最重要的审计问题。

因为现在仓库是**入口分裂态**：

- 顶栏主入口：可走 V2
- 插件设置入口：可走 V2
- 文档标题菜单：仍是旧 quick publish worker
- 其他功能入口：大量仍走旧 SPA

**结论：** 现在还不能把“UI2.0 已全面替代 SPA”当成事实。

---

## 8.2 视图边界：V2 是否真的脱离 iframe

高频主路径上，答案是：**是，已脱离 iframe**。

证据：

- `V2Host.show()` 直接创建 `Menu` 和 `mountPoint`，没有 `iframe`
- `createV2VueApp()` 直接 `createApp(V2App)`
- `V2App` 子视图通过 `v-if / v-else-if` 渲染

见：

- `siyuan/v2/v2Host.ts:29-65`
- `src/v2/createV2App.ts:17-40`
- `src/components/v2/V2App.vue:49-137`

但平台配置页还不是“完全原生化”，因为它复用了旧 SFC 表单。

---

## 8.3 数据边界：V2 有没有新建一套存储

没有。

当前发布配置仍然统一落在：

- `/data/storage/syp/sy-p-plus-cfg.json`

见：

- `siyuan/store/config.ts:33-45`
- `src/stores/usePublishSettingStore.ts:21-59`

偏好配置仍然统一落在：

- `/data/storage/syp/publish-preference-cfg.json`

见：

- `siyuan/store/preferenceConfigManager.ts:69-100`
- `src/stores/common/jsonStorage.ts:38-50`

这说明当前迁移的优点是：

- 回退成本低
- 数据格式没有分叉

但副作用是：

- V1/V2 改同一份数据，必须重点审计状态刷新一致性

---

## 9. 现在最值得审计的高风险点

以下几点都能直接从当前代码确认：

### 9.1 事件解绑有 bug

绑定：

- `this.eventBus.on("click-editortitleicon", this.blockMenuEventListener)`

解绑：

- `this.eventBus.off("click-editortitleicon", () => {})`

这不是同一个函数引用，理论上**解绑无效**。

见：

- `siyuan/index.ts:138-142`

### 9.2 文档菜单配置是“加载一次后缓存”

`PublisherPlugin.onEvent()` 只在 `onLayoutReady()` 时读取一次：

- `this.publishSetting`
- `this.prefSetting`

之后 `blockMenuEventListener` 一直复用缓存。

见：

- `siyuan/index.ts:134-138`
- `siyuan/index.ts:168-178`

这意味着：

- 你在 V2 设置里改了某些偏好/平台开关
- 顶栏主入口可能能马上读到新值
- **文档标题菜单不一定马上同步**

### 9.3 新旧快速发布行为并不完全等价

旧 quick publish worker 会先循环发布所有 `pre.systemCfg`，再发目标平台：

- `src/workers/QuickPublish.vue:80-89`

而 V2 quick publish 直接只发当前平台：

- `src/composables/v2/useV2QuickPublish.ts:167-178`

这意味着这里存在一个很值得审计的功能差异：

> **V2 快速发布可能没有覆盖旧 quick publish 的 system pre-publish 行为。**

### 9.4 当前文档识别是 DOM 启发式，不是宿主显式上下文

V2 当前文档 ID 来自：

- `document.querySelector("div.protyle:not(.fn__none)")`
- 再查 `div.protyle-title[data-node-id]`

见：

- `siyuan/utils/widgetPageUtils.ts:30-36`

这不是思源直接传入的 active document context，而是 DOM 推断。

在这些场景要重点审：

- 分屏
- 多编辑器
- 特殊 tab 切换
- 可见/隐藏 protyle 切换

### 9.5 平台配置“迁移完成”只是壳层完成，不是表单层完成

`V2PlatformConfigBridge` 仍然从 `bridgeRegistry.ts` 取旧组件：

- `src/components/v2/settings/V2PlatformConfigBridge.vue:68-72`
- `src/components/v2/settings/bridge/bridgeRegistry.ts:31-79`

所以审计时要把它看成：

- **承载迁移完成**
- **实现迁移未完成**

### 9.6 构建链仍然是双轨

当前仓库同时有：

- SPA 构建：`vite.config.ts`
- V2/插件运行时构建：`vite.v2.config.ts`

而且 `vite.v2.config.ts` 直接以 `siyuan/index.ts` 为 `lib.entry`：

- `vite.v2.config.ts:94-98`

这说明代码组织已经明显向插件 runtime 收敛，但仓库还不是单一构建入口。

---

## 10. 建议的代码审计顺序

如果你要最快恢复整体心智，我建议按这个顺序读：

### 第一轮：先建立入口与壳

1. [`../siyuan/index.ts`](../siyuan/index.ts)
2. [`../siyuan/topbar.ts`](../siyuan/topbar.ts)
3. [`../siyuan/invoke/widgetInvoke.ts`](../siyuan/invoke/widgetInvoke.ts)
4. [`../siyuan/v2/v2Host.ts`](../siyuan/v2/v2Host.ts)
5. [`../src/v2/createV2App.ts`](../src/v2/createV2App.ts)
6. [`../src/components/v2/V2App.vue`](../src/components/v2/V2App.vue)

### 第二轮：再看 V2 状态和共享业务

7. [`../src/composables/v2/useV2QuickPublish.ts`](../src/composables/v2/useV2QuickPublish.ts)
8. [`../src/composables/v2/useV2Settings.ts`](../src/composables/v2/useV2Settings.ts)
9. [`../src/composables/usePublish.ts`](../src/composables/usePublish.ts)
10. [`../src/composables/usePublishConfig.ts`](../src/composables/usePublishConfig.ts)
11. [`../src/composables/useSiyuanApi.ts`](../src/composables/useSiyuanApi.ts)
12. [`../src/stores/usePublishSettingStore.ts`](../src/stores/usePublishSettingStore.ts)

### 第三轮：最后看旧系统残留

13. [`../siyuan/iframeDialog.ts`](../siyuan/iframeDialog.ts)
14. [`../src/main.ts`](../src/main.ts)
15. [`../src/bootstrap.ts`](../src/bootstrap.ts)
16. [`../src/routes/routeConfig.ts`](../src/routes/routeConfig.ts)
17. [`../src/workers/QuickPublish.vue`](../src/workers/QuickPublish.vue)
18. [`../src/components/v2/settings/bridge/bridgeRegistry.ts`](../src/components/v2/settings/bridge/bridgeRegistry.ts)

---

## 11. 一句话判断当前迁移成熟度

如果只用一句话描述当前代码状态，我建议你这样记：

> **UI2.0 现在已经把“高频入口 + 工作壳”迁到了原生 DOM，但“业务内核 + 大量旧功能 + 平台表单实现”仍然处于共用/桥接/兼容期。**

也就是说，当前最重要的审计工作不是“V2 有没有页面”，而是：

1. **入口是否彻底收敛**
2. **V1/V2 是否行为等价**
3. **桥接层是否只是换壳，没有真正消债**
4. **共享配置与状态刷新是否一致**

---

## 12. OpenSpec 当前状态（供你判断迁移阶段）

仓库当前存在进行中的变更：

- `refactor-ui-v2-foundation`
- 任务进度：**38 / 57**
- 状态：**in-progress**

这和代码现状是匹配的：

- 主路径已经能跑
- 但还远没到“可以删掉旧 SPA”的阶段
