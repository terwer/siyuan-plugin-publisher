# Composition API设计模式

<cite>
**本文档引用的文件**
- [usePublish.ts](file://src/composables/usePublish.ts)
- [usePublishConfig.ts](file://src/composables/usePublishConfig.ts)
- [useSiyuanApi.ts](file://src/composables/useSiyuanApi.ts)
- [useLoadingTimer.ts](file://src/composables/useLoadingTimer.ts)
- [usePlatformDefine.ts](file://src/composables/usePlatformDefine.ts)
- [useVueI18n.ts](file://src/composables/useVueI18n.ts)
- [useVueRouter.ts](file://src/composables/useVueRouter.ts)
- [useProxy.ts](file://src/composables/useProxy.ts)
- [useSiyuanDevice.ts](file://src/composables/useSiyuanDevice.ts)
- [useChatGPT.ts](file://src/composables/useChatGPT.ts)
- [useV2QuickPublish.ts](file://src/composables/v2/useV2QuickPublish.ts)
- [SinglePublish.vue](file://src/pages/SinglePublish.vue)
- [SinglePublishDoPublish.vue](file://src/components/publish/SinglePublishDoPublish.vue)
- [PublishSetting.vue](file://src/components/set/PublishSetting.vue)
- [usePublishSettingStore.ts](file://src/stores/usePublishSettingStore.ts)
- [usePlatformMetadataStore.ts](file://src/stores/usePlatformMetadataStore.ts)
- [dynamicConfig.ts](file://src/platforms/dynamicConfig.ts)
- [usePreferenceSettingStore.ts](file://src/stores/usePreferenceSettingStore.ts)
- [V2App.vue](file://src/components/v2/V2App.vue)
- [V2PlatformCard.vue](file://src/components/v2/publish/V2PlatformCard.vue)
- [publishPreferenceCfg.ts](file://src/models/publishPreferenceCfg.ts)
- [constants.ts](file://src/utils/constants.ts)
</cite>

## 更新摘要
**变更内容**
- 新增useV2QuickPublish组合式函数的详细分析，涵盖V2快速发布功能的授权状态管理和动态授权状态计算
- 更新平台项目接口定义，包含更完善的V2QuickPublishPlatformItem结构
- 增强动态配置系统的授权状态管理机制
- 完善偏好设置存储与动态配置的集成模式

## 目录
1. [引言](#引言)
2. [项目结构](#项目结构)
3. [核心组件](#核心组件)
4. [架构总览](#架构总览)
5. [详细组件分析](#详细组件分析)
6. [依赖关系分析](#依赖关系分析)
7. [性能考量](#性能考量)
8. [故障排查指南](#故障排查指南)
9. [结论](#结论)
10. [附录](#附录)

## 引言
本文件面向思源笔记发布器插件的Vue 3 Composition API设计模式，系统性阐述在该复杂多平台发布场景下的可复用逻辑抽取、响应式数据管理、生命周期钩子处理、组件间状态共享与集成策略，并总结开发规范与性能优化建议。重点覆盖以下composables的设计理念与最佳实践：usePublish、usePublishConfig、useSiyuanApi、useLoadingTimer、usePlatformDefine、useVueI18n、useVueRouter、useProxy、useSiyuanDevice、useChatGPT、**useV2QuickPublish**。

**更新** 新增V2快速发布组合式函数的增强功能，包括授权状态管理、动态授权状态计算以及更完善的平台项目接口定义。

## 项目结构
项目采用"功能域+分层"的组织方式：
- composables：封装跨组件复用的业务逻辑与外部依赖接入（API、设备、代理、国际化等）
- adaptors：平台适配器层，屏蔽不同发布平台的差异
- stores：Pinia状态管理，负责持久化与全局状态
- components：页面与表单组件，使用setup语法与组合式API
- pages：路由页面，承载入口与导航
- utils：工具模块与日志、常量等基础设施

```mermaid
graph TB
subgraph "页面层"
SP["SinglePublish.vue"]
DSP["SinglePublishDoPublish.vue"]
PS["PublishSetting.vue"]
V2A["V2App.vue"]
V2PC["V2PlatformCard.vue"]
end
subgraph "组合式API层"
UP["usePublish.ts"]
UPC["usePublishConfig.ts"]
USA["useSiyuanApi.ts"]
ULT["useLoadingTimer.ts"]
UPLD["usePlatformDefine.ts"]
UVI["useVueI18n.ts"]
UVR["useVueRouter.ts"]
UPX["useProxy.ts"]
USD["useSiyuanDevice.ts"]
UC["useChatGPT.ts"]
UV2QP["useV2QuickPublish.ts"]
end
subgraph "状态管理层"
UPS["usePublishSettingStore.ts"]
UPM["usePlatformMetadataStore.ts"]
UPREF["usePreferenceSettingStore.ts"]
end
subgraph "平台适配层"
AD["adaptors/*"]
DC["dynamicConfig.ts"]
end
SP --> DSP
DSP --> UP
DSP --> UPC
DSP --> USA
DSP --> ULT
DSP --> UC
PS --> UVI
V2A --> UV2QP
V2A --> V2PC
UP --> UPC
UP --> USA
UP --> UPS
UP --> UPM
UPC --> UPS
UPC --> AD
USA --> USD
UPX --> USA
UV2QP --> UPS
UV2QP --> USA
UV2QP --> UPREF
UV2QP --> DC
```

**图表来源**
- [V2App.vue:112-131](file://src/components/v2/V2App.vue#L112-L131)
- [useV2QuickPublish.ts:19-80](file://src/composables/v2/useV2QuickPublish.ts#L19-L80)
- [dynamicConfig.ts:13-113](file://src/platforms/dynamicConfig.ts#L13-L113)
- [usePreferenceSettingStore.ts:21-86](file://src/stores/usePreferenceSettingStore.ts#L21-L86)

**章节来源**
- [V2App.vue:112-131](file://src/components/v2/V2App.vue#L112-L131)
- [useV2QuickPublish.ts:19-80](file://src/composables/v2/useV2QuickPublish.ts#L19-L80)
- [dynamicConfig.ts:13-113](file://src/platforms/dynamicConfig.ts#L13-L113)
- [usePreferenceSettingStore.ts:21-86](file://src/stores/usePreferenceSettingStore.ts#L21-L86)

## 核心组件
本节聚焦关键composables及其职责边界与协作方式。

- usePublish：统一发布流程编排，负责文章预处理、新增/更新、删除、预览链接生成、平台元数据同步等；内部聚合usePublishConfig、useSiyuanApi、useVueI18n、usePlatformMetadataStore等依赖。
- usePublishConfig：平台配置与API实例工厂，负责动态解析平台配置、生成适配器与API实例。
- useSiyuanApi：封装思源内核与博客API，统一设备环境判断与代理策略选择。
- useLoadingTimer：轻量计时器，基于onBeforeMount与watch实现加载耗时统计。
- usePlatformDefine：平台类型与预设平台集合管理，提供平台枚举与查询能力。
- useVueI18n：CSP友好型多语言封装，避免动态eval。
- useVueRouter：路由实例创建，集中管理路由配置。
- useProxy：代理请求与XML-RPC封装，支持Siyan代理与中间件代理双通道。
- useSiyuanDevice：设备检测，区分主窗体、挂件、浏览器、扩展等运行环境。
- useChatGPT：实验性AI能力封装，按偏好设置动态创建官方或反代实例。
- **useV2QuickPublish**：**新增** V2快速发布组合式函数，负责动态授权状态计算、平台项目接口定义与文档上下文处理。

**章节来源**
- [useV2QuickPublish.ts:10-17](file://src/composables/v2/useV2QuickPublish.ts#L10-L17)
- [useV2QuickPublish.ts:19-80](file://src/composables/v2/useV2QuickPublish.ts#L19-L80)

## 架构总览
下图展示从页面到composables再到适配器与状态管理的整体调用链路。

```mermaid
sequenceDiagram
participant Page as "V2App.vue"
participant V2QP as "useV2QuickPublish"
participant PSS as "usePublishSettingStore"
participant USA as "useSiyuanApi"
participant Pref as "usePreferenceSettingStore"
participant DC as "dynamicConfig"
Page->>V2QP : 调用 init()
V2QP->>PSS : getSetting()
V2QP->>USA : 获取 kernelApi
V2QP->>Pref : getReadOnlyPublishPreferenceSetting()
V2QP->>DC : 解析 DynamicConfig
DC-->>V2QP : 返回平台配置与授权状态
V2QP-->>Page : 返回平台项目列表与状态
```

**图表来源**
- [V2App.vue:129-131](file://src/components/v2/V2App.vue#L129-L131)
- [useV2QuickPublish.ts:34-71](file://src/composables/v2/useV2QuickPublish.ts#L34-L71)
- [usePublishSettingStore.ts:38-48](file://src/stores/usePublishSettingStore.ts#L38-L48)
- [useSiyuanApi.ts:68-74](file://src/composables/useSiyuanApi.ts#L68-L74)
- [dynamicConfig.ts:13-113](file://src/platforms/dynamicConfig.ts#L13-L113)

## 详细组件分析

### usePublish：统一发布流程编排
- 设计原则
  - 将"平台无关"的发布流程抽象为可复用逻辑，通过适配器解耦具体平台差异。
  - 使用reactive聚合UI状态，确保组件渲染与流程控制的一致性。
  - 通过store读写发布配置，保证跨组件状态一致性与持久化。
- 关键流程
  - 初始化：根据方法类型决定从思源或平台拉取文章，合并内容后进入预处理阶段。
  - 预处理：调用适配器的preEditPost，统一处理标题、别名、摘要、标签、分类等。
  - 新增/更新：根据postid存在与否选择newPost或editPost；必要时更新slug与目录变更后的postid。
  - 同步属性与元数据：写入思源块属性与平台元数据缓存。
  - 预览链接：根据平台返回的postid与基础URL拼接预览地址。
- 生命周期与副作用
  - 在doSinglePublish中集中处理错误与消息提示，避免分散在组件中。
  - 通过computed与store的异步读取，确保配置与元数据的实时性。
- 性能与健壮性
  - 使用深拷贝避免对原始Post对象的意外修改。
  - 对平台返回的postid变化进行检测与配置回写，防止脏数据。

```mermaid
flowchart TD
Start(["开始发布"]) --> CheckSys["检测是否内置平台"]
CheckSys --> |是| UseDocId["使用思源ID作为postid"]
CheckSys --> |否| LoadCfg["读取配置与postMeta"]
LoadCfg --> HasPostId{"是否存在postid"}
HasPostId --> |否| NewPost["调用newPost新增"]
HasPostId --> |是| EditPost["调用editPost更新"]
NewPost --> SaveMeta["写入配置与属性"]
EditPost --> UpdateSlug["必要时更新slug"]
UpdateSlug --> CheckDir["检测目录变更"]
CheckDir --> |变更| Rebind["更新配置中的postid"]
CheckDir --> |未变更| SaveMeta
SaveMeta --> SyncMeta["更新平台元数据"]
SyncMeta --> Preview["生成预览URL"]
Preview --> End(["结束"])
```

**章节来源**
- [usePublish.ts:44-557](file://src/composables/usePublish.ts#L44-L557)

### useV2QuickPublish：V2快速发布组合式函数
**新增** 本节详细介绍V2快速发布组合式函数的增强功能。

- 设计原则
  - 将V2快速发布的核心逻辑抽象为独立的组合式函数，支持动态授权状态计算与平台项目接口定义。
  - 通过响应式状态管理文档上下文、平台项目列表与授权状态，提供完整的V2发布体验。
  - 集成动态配置系统，支持多种平台类型的统一管理与状态计算。
- 关键功能
  - **授权状态管理**：基于DynamicConfig的isAuth字段计算平台授权状态，支持API授权与网站授权两种模式。
  - **动态授权状态计算**：根据平台配置与文档元数据动态计算isPublished状态，提供准确的发布状态反馈。
  - **平台项目接口定义**：通过V2QuickPublishPlatformItem接口定义统一的平台项目结构，包含平台信息、授权状态、发布状态等。
  - **文档上下文处理**：自动检测当前文档ID，获取文档标题并应用偏好设置进行标题处理。
- 生命周期与副作用
  - 在init方法中集中处理异步初始化，包括配置读取、文档信息获取与平台项目构建。
  - 通过computed属性hasPlatforms提供平台可用性判断，简化组件逻辑。
- 性能与健壮性
  - 使用reactive管理复杂状态对象，避免不必要的响应式转换开销。
  - 通过只读偏好设置引用避免重复的配置读取操作。

```mermaid
flowchart TD
Init(["init() 调用"]) --> SetLoading["设置isLoading=true"]
SetLoading --> GetPageId["获取页面ID"]
GetPageId --> CheckDoc{"是否有文档"}
CheckDoc --> |有| LoadSetting["加载发布设置"]
CheckDoc --> |无| SkipSetting["跳过设置加载"]
LoadSetting --> ParseDynCfg["解析动态配置"]
ParseDynCfg --> FilterEnabled["筛选启用的平台"]
FilterEnabled --> BuildItems["构建平台项目列表"]
BuildItems --> GetDocInfo["获取文档信息"]
GetDocInfo --> ProcessTitle["处理文档标题"]
ProcessTitle --> SetReady["设置isLoading=false"]
SkipSetting --> GetDocInfo
GetDocInfo --> SetReady
SetReady --> End(["初始化完成"])
```

**图表来源**
- [useV2QuickPublish.ts:34-71](file://src/composables/v2/useV2QuickPublish.ts#L34-L71)
- [useV2QuickPublish.ts:47-60](file://src/composables/v2/useV2QuickPublish.ts#L47-L60)

**章节来源**
- [useV2QuickPublish.ts:10-17](file://src/composables/v2/useV2QuickPublish.ts#L10-L17)
- [useV2QuickPublish.ts:19-80](file://src/composables/v2/useV2QuickPublish.ts#L19-L80)

### usePublishConfig：平台配置与API工厂
- 设计原则
  - 将"配置解析"与"API实例化"分离，便于测试与替换。
  - 通过Adaptors动态获取平台配置与适配器，支持多种发布协议与前端站点。
- 关键点
  - getPublishCfg：从store读取动态配置，解析平台配置与动态配置数组。
  - getPublishApi：根据key与可选cfg创建适配器与API实例，供上层调用。
- 与状态管理的协作
  - 依赖usePublishSettingStore读取/写入配置，确保配置变更即时生效。

```mermaid
classDiagram
class usePublishConfig {
+getPublishCfg(key) IPublishCfg
+getPublishApi(key, cfg) BlogAdaptor|WebAdaptor
}
class usePublishSettingStore {
+getSetting() SypConfig
+updateSetting(setting) void
}
class Adaptors {
+getCfg(key, storedCfg) BlogConfig
+getAdaptor(key, cfg) BlogAdaptor|WebAdaptor
}
usePublishConfig --> usePublishSettingStore : "读取配置"
usePublishConfig --> Adaptors : "获取配置与适配器"
```

**图表来源**
- [usePublishConfig.ts:26-95](file://src/composables/usePublishConfig.ts#L26-L95)
- [usePublishSettingStore.ts:21-94](file://src/stores/usePublishSettingStore.ts#L21-L94)

**章节来源**
- [usePublishConfig.ts:26-95](file://src/composables/usePublishConfig.ts#L26-L95)
- [usePublishSettingStore.ts:21-94](file://src/stores/usePublishSettingStore.ts#L21-L94)

### useSiyuanApi：思源API封装与代理策略
- 设计原则
  - 将API配置、设备检测、代理策略统一抽象，减少调用方心智负担。
  - 支持在不同运行环境下选择直连或代理转发，提升兼容性。
- 关键点
  - 从store与环境变量读取配置，构造SiYuanConfig。
  - isStorageViaSiyuanApi与isUseSiyuanProxy决定代理路径。
  - 暴露kernelApi与blogApi供上层调用。

```mermaid
sequenceDiagram
participant Caller as "调用方"
participant Usa as "useSiyuanApi"
participant Dev as "useSiyuanDevice"
participant Pref as "偏好设置Store"
Caller->>Usa : 调用获取API与配置
Usa->>Pref : 读取只读偏好设置
Usa->>Dev : 检测运行环境
Dev-->>Usa : 返回设备类型
Usa-->>Caller : 返回 blogApi/kernelApi/siyuanConfig/isUseSiyuanProxy
```

**图表来源**
- [useSiyuanApi.ts:20-75](file://src/composables/useSiyuanApi.ts#L20-L75)
- [useSiyuanDevice.ts:16-82](file://src/composables/useSiyuanDevice.ts#L16-L82)
- [useSiyuanApi.ts:30-39](file://src/composables/useSiyuanApi.ts#L30-L39)

**章节来源**
- [useSiyuanApi.ts:20-75](file://src/composables/useSiyuanApi.ts#L20-L75)
- [useSiyuanDevice.ts:16-82](file://src/composables/useSiyuanDevice.ts#L16-L82)

### useLoadingTimer：轻量计时器
- 设计原则
  - 通过onBeforeMount与watch实现"开始/停止"自动化切换，避免重复逻辑。
  - 仅暴露loadingTime，降低对外部状态的耦合。
- 使用场景
  - 页面首次加载与关键操作前后的时间统计，辅助性能监控与用户体验反馈。

**章节来源**
- [useLoadingTimer.ts:20-55](file://src/composables/useLoadingTimer.ts#L20-L55)

### usePlatformDefine：平台类型与预设平台管理
- 设计原则
  - 将平台类型与预设平台集合集中管理，提供查询与过滤能力。
  - 通过i18n注入，实现平台名称与类型的本地化展示。
- 关键点
  - 提供getPlatformType、getPrePlatformList、getPrePlatform、getAllPrePlatformList等查询接口。

**章节来源**
- [usePlatformDefine.ts:18-82](file://src/composables/usePlatformDefine.ts#L18-L82)

### useVueI18n：CSP友好型多语言
- 设计原则
  - 避免动态eval，通过messages与locale直接映射，满足CSP严格要求。
- 使用场景
  - 组件与composables中统一使用t(key)进行文本翻译。

**章节来源**
- [useVueI18n.ts:16-25](file://src/composables/useVueI18n.ts#L16-L25)

### useVueRouter：路由实例创建
- 设计原则
  - 将路由配置集中管理，便于统一维护与扩展。
- 使用场景
  - 页面组件中通过useRoute/useRouter获取路由上下文。

**章节来源**
- [useVueRouter.ts:13-18](file://src/composables/useVueRouter.ts#L13-L18)

### useProxy：代理请求与XML-RPC
- 设计原则
  - 统一封装代理fetch与XML-RPC调用，支持Siyan代理与中间件代理双通道。
  - 对不安全header进行过滤与透传，保障安全性与兼容性。
- 关键点
  - proxyFetch：根据isUseSiyuanProxy选择代理路径，支持多种编码与响应格式。
  - proxyXmlrpc：序列化XML-RPC请求并反序列化响应。
  - corsFetch：通过CORS代理发送表单数据，处理返回头透传。

```mermaid
flowchart TD
A["proxyFetch 调用"] --> B{"是否使用Siyuan代理"}
B --> |是| C["siyuanProxyFetch"]
B --> |否| D["commonFetchClient.fetchCall"]
C --> E["forwardProxy 调用"]
D --> F["返回响应"]
E --> G["解析响应/错误处理"]
G --> H["返回JSON/文本/XML"]
```

**图表来源**
- [useProxy.ts:53-99](file://src/composables/useProxy.ts#L53-L99)
- [useProxy.ts:203-315](file://src/composables/useProxy.ts#L203-L315)

**章节来源**
- [useProxy.ts:27-318](file://src/composables/useProxy.ts#L27-L318)

### useSiyuanDevice：设备检测
- 设计原则
  - 将设备类型判断抽象为一组布尔函数，便于在不同运行环境中做差异化处理。
- 关键点
  - isInSiyuanOrSiyuanNewWin、isInChromeExtension等，用于代理策略与UI行为的分支。

**章节来源**
- [useSiyuanDevice.ts:16-82](file://src/composables/useSiyuanDevice.ts#L16-L82)

### useChatGPT：实验性AI能力
- 设计原则
  - 按偏好设置动态创建官方或反代实例，支持流式与非流式响应。
  - 通过getChatInput统一输入裁剪与HTML解析，控制最大token长度。
- 关键点
  - getAPI惰性初始化，避免不必要的资源占用。
  - chat方法统一错误处理与消息提示。

**章节来源**
- [useChatGPT.ts:26-127](file://src/composables/useChatGPT.ts#L26-L127)

## 依赖关系分析
- 组件到composables
  - SinglePublishDoPublish.vue依赖usePublish、usePublishConfig、useSiyuanApi、useVueI18n、useLoadingTimer、useChatGPT等。
  - **V2App.vue**依赖**useV2QuickPublish**、**V2PlatformCard**等。
- composables之间的耦合
  - usePublish依赖usePublishConfig与useSiyuanApi；usePublishConfig依赖usePublishSettingStore；useSiyuanApi依赖useSiyuanDevice与偏好设置store。
  - **useV2QuickPublish依赖usePublishSettingStore、useSiyuanApi、usePreferenceSettingStore与dynamicConfig**。
- 状态管理
  - usePublishSettingStore提供发布配置的读写；usePlatformMetadataStore提供平台元数据的读写与去重合并。
  - **usePreferenceSettingStore提供V2 UI偏好设置的只读访问**。

```mermaid
graph LR
DSP["SinglePublishDoPublish.vue"] --> UP["usePublish"]
DSP --> UPC["usePublishConfig"]
DSP --> USA["useSiyuanApi"]
DSP --> ULT["useLoadingTimer"]
DSP --> UC["useChatGPT"]
V2A["V2App.vue"] --> UV2QP["useV2QuickPublish"]
V2A --> V2PC["V2PlatformCard.vue"]
UP --> UPC
UP --> USA
UPC --> UPS["usePublishSettingStore"]
USA --> USD["useSiyuanDevice"]
UP --> UPM["usePlatformMetadataStore"]
UV2QP --> UPS
UV2QP --> USA
UV2QP --> UPREF["usePreferenceSettingStore"]
UV2QP --> DC["dynamicConfig"]
```

**图表来源**
- [V2App.vue:112-131](file://src/components/v2/V2App.vue#L112-L131)
- [useV2QuickPublish.ts:20-22](file://src/composables/v2/useV2QuickPublish.ts#L20-L22)
- [dynamicConfig.ts:13-113](file://src/platforms/dynamicConfig.ts#L13-L113)

**章节来源**
- [V2App.vue:112-131](file://src/components/v2/V2App.vue#L112-L131)
- [useV2QuickPublish.ts:20-22](file://src/composables/v2/useV2QuickPublish.ts#L20-L22)
- [dynamicConfig.ts:13-113](file://src/platforms/dynamicConfig.ts#L13-L113)

## 性能考量
- 响应式数据选择
  - 对于简单标量与布尔值，优先使用ref；对于复杂对象与需要深度响应的场景使用reactive，避免过度拆分导致的性能损耗。
  - 在usePublish中对Post对象使用深拷贝，避免对原始对象的意外修改引发的重复渲染。
  - **useV2QuickPublish使用reactive管理复杂状态对象，包括加载状态、文档信息与平台项目列表**。
- 计算与缓存
  - 使用computed封装只读派生状态，如配置读取与平台元数据查询，减少重复计算。
  - store中对settingRef进行缓存，避免频繁IO。
  - **useV2QuickPublish使用computed属性hasPlatforms，避免在模板中重复计算平台数量**。
- 异步与并发
  - 在批量发布时，先处理系统平台，再处理常规平台，减少不必要的等待。
  - 对于代理请求，合理设置超时与编码策略，避免阻塞UI线程。
  - **useV2QuickPublish在init方法中串行处理异步操作，确保状态的一致性**。
- 生命周期与副作用
  - 在onBeforeMount中启动计时器，在watch中根据状态切换停止计时，避免多余的时间计算。
  - **useV2QuickPublish在onMounted钩子中调用init方法，确保组件挂载后立即初始化**。
- 代理与网络
  - 根据运行环境选择最优代理路径，减少跨域与CSP限制带来的失败重试成本。

## 故障排查指南
- 发布失败
  - 检查配置中的posidKey是否为空；确认postMeta中是否存在对应键值。
  - 查看错误消息与日志输出，定位是适配器错误还是平台返回异常。
- 预览链接无效
  - 核对平台返回的URL是否为绝对路径，若非绝对路径需与cfg.home拼接。
- 目录变更导致postid变化
  - usePublish会检测并更新配置中的postid，确保后续操作指向正确文章。
- 代理请求异常
  - 检查isUseSiyuanProxy与运行环境，必要时切换到中间件代理；关注不安全header的过滤与透传。
- 多语言显示异常
  - 确认useVueI18n的locale与messages配置，避免key缺失导致回退显示。
- **V2快速发布问题**
  - **检查DynamicConfig的isAuth字段是否正确设置，确保授权状态计算准确**。
  - **验证DYNAMIC_CONFIG_KEY常量与动态配置的键名一致**。
  - **确认文档ID检测是否正常工作，检查WidgetPageUtils.getPageId()的返回值**。

**章节来源**
- [useV2QuickPublish.ts:50-58](file://src/composables/v2/useV2QuickPublish.ts#L50-L58)
- [constants.ts:18-19](file://src/utils/constants.ts#L18-L19)

## 结论
本项目通过清晰的composables分层与Pinia状态管理，实现了多平台发布场景下的高内聚、低耦合与强可复用性。usePublish作为核心编排器，将平台差异隐藏在适配器之下；usePublishConfig与useSiyuanApi分别承担配置与API接入的职责；useLoadingTimer、useProxy、useSiyuanDevice等辅助composables提供了横切关注点的统一处理。**新增的useV2QuickPublish组合式函数进一步增强了V2快速发布功能，通过动态授权状态计算与完善的平台项目接口定义，为用户提供了更加直观和高效的发布体验**。遵循本文档的开发规范与性能建议，可在保证可维护性的前提下持续扩展更多发布平台与功能特性。

## 附录
- 开发规范建议
  - 组合式API命名：以use前缀，语义明确，职责单一。
  - 响应式数据：优先使用ref管理标量，reactive管理复杂对象；避免在模板中直接修改响应式对象。
  - 生命周期：在composables中集中处理副作用，组件中仅负责渲染与事件绑定。
  - 错误处理：统一在composables中捕获与上报，组件中仅负责用户可见的提示。
  - 状态管理：store仅存放持久化与全局状态，避免在store中存放临时UI状态。
  - **V2快速发布：确保DynamicConfig的isAuth字段正确设置，授权状态计算逻辑清晰可维护**。
- 性能优化清单
  - 避免不必要的深拷贝与序列化；对大对象使用浅拷贝或局部更新。
  - 合理使用computed与watch，避免在watch中进行昂贵操作。
  - 在批量操作中合并多次更新，减少store写入次数。
  - 对代理请求设置合理的超时与编码策略，避免阻塞UI。
  - **useV2QuickPublish中避免在模板中重复计算平台状态，使用computed属性缓存结果**。