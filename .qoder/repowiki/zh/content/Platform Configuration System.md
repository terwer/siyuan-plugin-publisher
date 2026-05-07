# 平台配置系统

<cite>
**本文档引用的文件**
- [syp.config.ts](file://syp.config.ts)
- [dynamicConfig.ts](file://src/platforms/dynamicConfig.ts)
- [usePublishSettingStore.ts](file://src/stores/usePublishSettingStore.ts)
- [usePreferenceSettingStore.ts](file://src/stores/usePreferenceSettingStore.ts)
- [useSiyuanSettingStore.ts](file://src/stores/useSiyuanSettingStore.ts)
- [useCommonLocalStorage.ts](file://src/stores/common/useCommonLocalStorage.ts)
- [useCommonStorageAsync.ts](file://src/stores/common/useCommonStorageAsync.ts)
- [commonStorageAsync.ts](file://src/stores/common/commonStorageAsync.ts)
- [jsonStorage.ts](file://src/stores/common/jsonStorage.ts)
- [constants.ts](file://src/utils/constants.ts)
- [usePublishConfig.ts](file://src/composables/usePublishConfig.ts)
- [publishPreferenceCfg.ts](file://src/models/publishPreferenceCfg.ts)
- [IPublishCfg.ts](file://src/types/IPublishCfg.ts)
- [config.ts](file://siyuan/store/config.ts)
- [preferenceConfigManager.ts](file://siyuan/store/preferenceConfigManager.ts)
- [utils.ts](file://src/utils/utils.ts)
- [pre.ts](file://src/platforms/pre.ts)
- [docsifyApiAdaptor.ts](file://src/adaptors/api/docsify/docsifyApiAdaptor.ts)
- [gitlabdocsifyApiAdaptor.ts](file://src/adaptors/api/gitlab-docsify/gitlabdocsifyApiAdaptor.ts)
- [docsifyConfig.ts](file://src/adaptors/api/docsify/docsifyConfig.ts)
- [gitlabdocsifyConfig.ts](file://src/adaptors/api/gitlab-docsify/gitlabdocsifyConfig.ts)
- [adaptors/index.ts](file://src/adaptors/index.ts)
- [svgIcons.ts](file://src/utils/svgIcons.ts)
</cite>

## 更新摘要
**变更内容**
- 新增 Docsify 子平台类型支持，包括 GitHub 和 GitLab 两个子平台
- 添加 Docsify 平台的配置初始化和图标显示功能
- 实现 Docsify 适配器的平台注册和 API 调用支持
- 完善 Docsify 平台的配置管理和存储机制

## 目录
1. [简介](#简介)
2. [项目结构](#项目结构)
3. [核心组件](#核心组件)
4. [架构概览](#架构概览)
5. [详细组件分析](#详细组件分析)
6. [Docsify 子平台支持](#docsify-子平台支持)
7. [依赖关系分析](#依赖关系分析)
8. [性能考虑](#性能考虑)
9. [故障排除指南](#故障排除指南)
10. [结论](#结论)

## 简介

平台配置系统是思源插件发布器的核心基础设施，负责管理各种发布平台的配置信息、用户偏好设置以及系统配置。该系统支持多种发布平台（如GitHub、GitLab、WordPress、自定义平台等），提供了统一的配置管理和存储机制。

系统采用模块化设计，通过动态配置管理、存储抽象层和适配器模式，实现了对不同平台配置的灵活支持。配置数据既可以在思源笔记环境中持久化存储，也可以在浏览器环境中使用本地存储。

**更新** 新增 Docsify 子平台类型支持，包括 GitHub Docsify 和 GitLab Docsify 两个子平台，为静态网站生成器提供完整的发布支持。

## 项目结构

平台配置系统主要分布在以下目录结构中：

```mermaid
graph TB
subgraph "配置系统核心"
A[syp.config.ts] --> B[动态配置管理]
B --> C[平台类型枚举]
B --> D[认证模式]
end
subgraph "存储层"
E[useCommonStorageAsync.ts] --> F[CommonStorageAsync.ts]
G[useCommonLocalStorage.ts] --> H[JsonStorage.ts]
F --> I[异步存储]
H --> J[JSON存储]
end
subgraph "配置存储"
K[usePublishSettingStore.ts] --> L[发布设置存储]
M[usePreferenceSettingStore.ts] --> N[偏好设置存储]
O[useSiyuanSettingStore.ts] --> P[思源设置存储]
end
subgraph "配置模型"
Q[publishPreferenceCfg.ts] --> R[发布偏好配置]
S[IPublishCfg.ts] --> T[发布配置接口]
end
subgraph "Docsify 支持"
U[docsifyApiAdaptor.ts] --> V[Docsify API 适配器]
W[gitlabdocsifyApiAdaptor.ts] --> X[GitLab Docsify 适配器]
Y[docsifyConfig.ts] --> Z[Docsify 配置]
end
A --> K
B --> U
E --> U
K --> U
```

**图表来源**
- [syp.config.ts:1-52](file://syp.config.ts#L1-L52)
- [dynamicConfig.ts:1-534](file://src/platforms/dynamicConfig.ts#L1-L534)
- [usePublishSettingStore.ts:1-95](file://src/stores/usePublishSettingStore.ts#L1-L95)
- [docsifyApiAdaptor.ts:1-63](file://src/adaptors/api/docsify/docsifyApiAdaptor.ts#L1-L63)
- [gitlabdocsifyApiAdaptor.ts:1-63](file://src/adaptors/api/gitlab-docsify/gitlabdocsifyApiAdaptor.ts#L1-L63)

**章节来源**
- [syp.config.ts:1-52](file://syp.config.ts#L1-L52)
- [dynamicConfig.ts:1-534](file://src/platforms/dynamicConfig.ts#L1-L534)

## 核心组件

### 配置模型层

系统定义了多个核心配置模型来管理不同类型的数据：

1. **SypConfig**: 主配置模型，包含语言设置和动态配置键
2. **DynamicConfig**: 动态平台配置模型，支持多种平台类型
3. **PublishPreferenceCfg**: 发布偏好设置模型，扩展基础配置
4. **IPublishCfg**: 发布配置接口，定义配置组合结构

### 存储管理层

系统提供了多层次的存储解决方案：

1. **异步存储**: 支持Promise的存储操作，适用于服务器端或异步场景
2. **本地存储**: 基于localStorage的响应式存储
3. **JSON存储**: 在思源笔记环境中使用的文件系统存储

### 配置管理器

系统包含专门的配置管理器来处理不同类型的配置：

1. **ConfigManager**: 基础配置管理器
2. **PreferenceConfigManager**: 偏好设置配置管理器
3. **平台特定配置管理器**: 针对不同平台的配置处理器

**章节来源**
- [publishPreferenceCfg.ts:1-101](file://src/models/publishPreferenceCfg.ts#L1-L101)
- [IPublishCfg.ts:1-50](file://src/types/IPublishCfg.ts#L1-L50)
- [config.ts:1-47](file://siyuan/store/config.ts#L1-L47)
- [preferenceConfigManager.ts:1-52](file://siyuan/store/preferenceConfigManager.ts#L1-L52)

## 架构概览

平台配置系统采用分层架构设计，确保了良好的可扩展性和维护性：

```mermaid
graph TB
subgraph "应用层"
A[发布配置钩子] --> B[平台适配器]
B --> C[API调用]
end
subgraph "配置管理层"
D[发布设置存储] --> E[动态配置管理]
F[偏好设置存储] --> E
G[思源设置存储] --> E
end
subgraph "存储抽象层"
H[通用存储接口] --> I[异步存储实现]
H --> J[本地存储实现]
H --> K[JSON存储实现]
end
subgraph "平台支持层"
L[GitHub平台] --> M[API适配器]
N[WordPress平台] --> M
O[自定义平台] --> M
P[Docsify平台] --> M
end
A --> D
D --> H
E --> L
E --> N
E --> O
E --> P
```

**图表来源**
- [usePublishConfig.ts:1-99](file://src/composables/usePublishConfig.ts#L1-L99)
- [usePublishSettingStore.ts:1-95](file://src/stores/usePublishSettingStore.ts#L1-L95)
- [dynamicConfig.ts:1-534](file://src/platforms/dynamicConfig.ts#L1-L534)

系统架构特点：

1. **分层设计**: 清晰的层次结构，便于维护和扩展
2. **抽象接口**: 统一的存储接口，支持多种存储后端
3. **平台无关**: 通过适配器模式支持多种发布平台
4. **响应式更新**: 基于Vue响应式的配置管理

## 详细组件分析

### 动态配置管理系统

动态配置系统是整个配置系统的核心，负责管理各种发布平台的配置信息。

```mermaid
classDiagram
class DynamicConfig {
+PlatformType platformType
+SubPlatformType subPlatformType
+string platformKey
+string platformName
+boolean isEnabled
+boolean isAuth
+AuthMode authMode
+string domain
+boolean isSys
+constructor(platformType, platformKey, platformName)
}
class PlatformType {
<<enumeration>>
Common
Github
Gitlab
Metaweblog
Wordpress
Custom
Fs
System
}
class SubPlatformType {
<<enumeration>>
Common_Yuque
Github_Hexo
Github_Hugo
Github_Docsify
Gitlab_Docsify
Custom_Zhihu
System_Siyuan
}
class AuthMode {
<<enumeration>>
API
WEBSITE
}
DynamicConfig --> PlatformType : uses
DynamicConfig --> SubPlatformType : uses
DynamicConfig --> AuthMode : uses
```

**图表来源**
- [dynamicConfig.ts:13-166](file://src/platforms/dynamicConfig.ts#L13-L166)

动态配置系统的主要功能：

1. **平台类型管理**: 支持8种主要平台类型
2. **子平台细分**: 每个平台类型下支持多个具体平台，包括新增的 Docsify 子平台
3. **认证模式**: 支持API和WEBSITE两种认证方式
4. **配置验证**: 提供配置完整性和有效性的验证机制

**更新** 新增 Docsify 子平台类型，包括：
- `Github_Docsify`: GitHub 上的 Docsify 静态站点
- `Gitlab_Docsify`: GitLab 上的 Docsify 静态站点

**章节来源**
- [dynamicConfig.ts:1-534](file://src/platforms/dynamicConfig.ts#L1-L534)

### 存储抽象层

存储抽象层提供了统一的存储接口，支持多种存储后端：

```mermaid
classDiagram
class StorageLike {
<<interface>>
+getItem(key) string
+setItem(key, value) void
+removeItem(key) void
}
class StorageLikeAsync {
<<interface>>
+getItem(key) Promise~string~
+setItem(key, value) Promise~void~
+removeItem(key) Promise~void~
}
class CommonStorageAsync {
-kernelApi
-storageViaSiyuanApi
+getItem(key) Promise~string~
+setItem(key, value) Promise~void~
+removeItem(key) Promise~void~
}
class JsonStorage {
-fs
-path
-filePath
+getItem(key) string
+setItem(key, value) void
+removeItem(key) void
}
StorageLike <|.. JsonStorage
StorageLikeAsync <|.. CommonStorageAsync
CommonStorageAsync --> StorageLikeAsync : uses
```

**图表来源**
- [commonStorageAsync.ts:24-117](file://src/stores/common/commonStorageAsync.ts#L24-L117)
- [jsonStorage.ts:23-110](file://src/stores/common/jsonStorage.ts#L23-L110)

存储层的设计优势：

1. **环境适配**: 自动检测运行环境并选择合适的存储方案
2. **统一接口**: 提供一致的API接口，简化上层代码
3. **错误处理**: 完善的异常处理机制
4. **日志记录**: 详细的日志记录便于调试和监控

**章节来源**
- [useCommonStorageAsync.ts:1-85](file://src/stores/common/useCommonStorageAsync.ts#L1-L85)
- [useCommonLocalStorage.ts:1-58](file://src/stores/common/useCommonLocalStorage.ts#L1-L58)

### 配置存储管理器

配置存储管理器提供了针对不同配置类型的专用存储解决方案：

```mermaid
sequenceDiagram
participant App as 应用程序
participant Store as 配置存储
participant Storage as 存储层
participant Platform as 平台配置
App->>Store : getSetting()
Store->>Storage : getItem(storageKey)
Storage-->>Store : 返回配置数据
Store->>Store : 解析和验证配置
Store-->>App : 返回配置对象
App->>Store : updateSetting(newConfig)
Store->>Storage : setItem(storageKey, newConfig)
Storage-->>Store : 确认保存
Store->>Store : 更新缓存
Store-->>App : 确认更新
```

**图表来源**
- [usePublishSettingStore.ts:21-95](file://src/stores/usePublishSettingStore.ts#L21-L95)
- [usePreferenceSettingStore.ts:21-90](file://src/stores/usePreferenceSettingStore.ts#L21-L90)

配置存储管理器的功能特性：

1. **智能初始化**: 自动检测和初始化配置数据
2. **类型安全**: 编译时类型检查，减少运行时错误
3. **缓存机制**: 内存缓存提高访问性能
4. **异步操作**: 支持非阻塞的配置操作

**章节来源**
- [usePublishSettingStore.ts:1-95](file://src/stores/usePublishSettingStore.ts#L1-L95)
- [usePreferenceSettingStore.ts:1-90](file://src/stores/usePreferenceSettingStore.ts#L1-L90)
- [useSiyuanSettingStore.ts:1-81](file://src/stores/useSiyuanSettingStore.ts#L1-L81)

### 发布配置管理器

发布配置管理器是系统的核心组件，负责协调各个配置组件的工作：

```mermaid
flowchart TD
A[获取发布配置] --> B{是否指定平台键}
B --> |是| C[加载主配置]
B --> |否| D[返回基础配置]
C --> E[解析动态配置]
E --> F[查找平台配置]
F --> G[获取适配器配置]
G --> H[构建发布配置对象]
H --> I[返回完整配置]
D --> I
J[获取发布API] --> K[初始化适配器]
K --> L[创建API实例]
L --> M[返回API对象]
```

**图表来源**
- [usePublishConfig.ts:26-99](file://src/composables/usePublishConfig.ts#L26-L99)

发布配置管理器的核心功能：

1. **配置聚合**: 将多个配置源的数据整合为统一的配置对象
2. **平台适配**: 根据平台类型提供相应的配置和适配器
3. **动态加载**: 支持运行时动态添加和修改平台配置
4. **错误处理**: 完善的异常处理和回退机制

**章节来源**
- [usePublishConfig.ts:1-99](file://src/composables/usePublishConfig.ts#L1-L99)

## Docsify 子平台支持

**新增** Docsify 子平台支持为静态网站生成器提供了完整的发布能力。

### Docsify 平台类型定义

Docsify 子平台类型在 `SubPlatformType` 枚举中定义：

```mermaid
classDiagram
class SubPlatformType {
<<enumeration>>
// ... 其他平台类型
Github_Docsify = "Docsify"
Gitlab_Docsify = "Gitlabdocsify"
// ... 其他平台类型
}
```

**图表来源**
- [dynamicConfig.ts:192](file://src/platforms/dynamicConfig.ts#L192)
- [dynamicConfig.ts:203](file://src/platforms/dynamicConfig.ts#L203)

### Docsify 平台预定义配置

Docsify 平台在 `pre.ts` 文件中进行了预定义配置：

```mermaid
classDiagram
class DocsifyConfig {
+platformType : PlatformType.Github
+subPlatformType : SubPlatformType.Github_Docsify
+platformKey : "github_Docsify"
+platformName : "Docsify"
+platformIcon : svgIcons.iconIFDocsify
+authMode : AuthMode.API
+isEnabled : false
}
class GitlabDocsifyConfig {
+platformType : PlatformType.Gitlab
+subPlatformType : SubPlatformType.Gitlab_Docsify
+platformKey : "gitlab_Gitlabdocsify"
+platformName : "Gitlabdocsify"
+platformIcon : svgIcons.iconIFDocsify
+authMode : AuthMode.API
+isEnabled : false
}
```

**图表来源**
- [pre.ts:224](file://src/platforms/pre.ts#L224)
- [pre.ts:298](file://src/platforms/pre.ts#L298)

### Docsify API 适配器实现

Docsify 平台提供了专门的 API 适配器：

```mermaid
classDiagram
class DocsifyApiAdaptor {
+getYamlAdaptor() YamlConvertAdaptor
+preEditPost(post, id, publishCfg) Promise~Post~
}
class GitlabdocsifyApiAdaptor {
+getYamlAdaptor() YamlConvertAdaptor
+preEditPost(post, id, publishCfg) Promise~Post~
}
class DocsifyConfig {
+tokenSettingUrl : "https : //github.com/settings/tokens"
+defaultPath : "docs"
+previewUrl : "/[user]/[repo]/blob/[branch]/[docpath]"
+previewPostUrl : "/#/post/[postid]"
+mdFilenameRule : "[slug].md"
+imageStorePath : "docs/images"
+imageLinkPath : "/images"
+knowledgeSpaceEnabled : true
+knowledgeSpaceType : CategoryType_Tree_Single
}
class GitlabdocsifyConfig {
+home : "[your-gitlab-home]"
+apiUrl : "[your-gitlab-api-url]"
+tokenSettingUrl : "[your-gitlab-host]/settings/access-tokens"
+defaultPath : "docs"
+previewUrl : "/[user]/[repo]/blob/[branch]/[docpath]"
+previewPostUrl : "/#/post/[postid]"
+mdFilenameRule : "[slug].md"
+imageStorePath : "docs/images"
+imageLinkPath : "/images"
+knowledgeSpaceEnabled : true
+knowledgeSpaceType : CategoryType_Tree_Single
}
DocsifyApiAdaptor --> DocsifyConfig : uses
GitlabdocsifyApiAdaptor --> GitlabdocsifyConfig : uses
```

**图表来源**
- [docsifyApiAdaptor.ts:23](file://src/adaptors/api/docsify/docsifyApiAdaptor.ts#L23)
- [gitlabdocsifyApiAdaptor.ts:23](file://src/adaptors/api/gitlab-docsify/gitlabdocsifyApiAdaptor.ts#L23)
- [docsifyConfig.ts:19](file://src/adaptors/api/docsify/docsifyConfig.ts#L19)
- [gitlabdocsifyConfig.ts:20](file://src/adaptors/api/gitlab-docsify/gitlabdocsifyConfig.ts#L20)

### Docsify 适配器索引配置

Docsify 适配器在适配器索引中进行了注册：

```mermaid
flowchart TD
A[平台类型判断] --> B{SubPlatformType.Github_Docsify}
B --> C[useDocsifyApi]
D[平台类型判断] --> E{SubPlatformType.Gitlab_Docsify}
E --> F[useGitlabdocsifyApi]
C --> G[YAML 适配器初始化]
F --> G
```

**图表来源**
- [adaptors/index.ts:542](file://src/adaptors/index.ts#L542)
- [adaptors/index.ts:582](file://src/adaptors/index.ts#L582)

### Docsify 图标支持

Docsify 平台使用专门的 SVG 图标：

```mermaid
classDiagram
class SvgIcons {
iconIFDocsify : "<svg t='1773592921880' class='icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http : //www.w3.org/2000/svg' p-id='7893' width='16' height='16'><path d='M128 128h768v64H192v672h-64V128z m128 128h512v64H320v608h544V256H256z m192 320h256v64H448v-64z m0-128h256v64H448v-64z m0 256h256v64H448v-64z' fill='#2E86DE' p-id='7894'></path></svg>"
}
```

**图表来源**
- [svgIcons.ts:53](file://src/utils/svgIcons.ts#L53)

**章节来源**
- [dynamicConfig.ts:174-242](file://src/platforms/dynamicConfig.ts#L174-L242)
- [pre.ts:222-304](file://src/platforms/pre.ts#L222-L304)
- [docsifyApiAdaptor.ts:1-63](file://src/adaptors/api/docsify/docsifyApiAdaptor.ts#L1-L63)
- [gitlabdocsifyApiAdaptor.ts:1-63](file://src/adaptors/api/gitlab-docsify/gitlabdocsifyApiAdaptor.ts#L1-L63)
- [docsifyConfig.ts:1-53](file://src/adaptors/api/docsify/docsifyConfig.ts#L1-L53)
- [gitlabdocsifyConfig.ts:1-56](file://src/adaptors/api/gitlab-docsify/gitlabdocsifyConfig.ts#L1-L56)
- [adaptors/index.ts:540-605](file://src/adaptors/index.ts#L540-L605)
- [svgIcons.ts:50-55](file://src/utils/svgIcons.ts#L50-L55)

## 依赖关系分析

平台配置系统的依赖关系体现了清晰的分层架构：

```mermaid
graph TB
subgraph "外部依赖"
A[zhi-blog-api]
B[@vueuse/core]
C[zhi-common]
D[zhi-device]
E[zhi-siyuan-api]
end
subgraph "内部模块"
F[配置模型]
G[存储层]
H[配置管理]
I[平台支持]
J[Docsify 适配器]
end
subgraph "应用层"
K[发布配置钩子]
L[设置界面]
M[平台适配器]
N[Docsify API]
end
A --> F
B --> G
C --> F
D --> G
E --> F
F --> G
G --> H
H --> I
I --> J
J --> N
N --> K
K --> L
K --> M
```

**图表来源**
- [dynamicConfig.ts:1-534](file://src/platforms/dynamicConfig.ts#L1-L534)
- [usePublishSettingStore.ts:1-95](file://src/stores/usePublishSettingStore.ts#L1-L95)

依赖关系特点：

1. **最小依赖**: 外部依赖数量有限，降低维护成本
2. **接口隔离**: 通过接口定义明确模块边界
3. **循环依赖避免**: 设计上避免了循环依赖问题
4. **可测试性**: 清晰的依赖关系便于单元测试

**章节来源**
- [constants.ts:1-54](file://src/utils/constants.ts#L1-L54)

## 性能考虑

平台配置系统在设计时充分考虑了性能优化：

### 存储性能优化

1. **缓存策略**: 配置数据在内存中有缓存，减少重复读取
2. **懒加载**: 配置按需加载，避免不必要的初始化
3. **批量操作**: 支持批量配置更新，减少存储操作次数

### 内存管理

1. **响应式更新**: 使用Vue响应式系统，只在必要时更新UI
2. **对象复用**: 配置对象在内存中复用，减少垃圾回收压力
3. **类型优化**: TypeScript类型检查在编译时完成，运行时无额外开销

### 网络优化

1. **异步操作**: 所有网络请求都是异步的，不阻塞主线程
2. **错误重试**: 网络错误有适当的重试机制
3. **超时控制**: 请求超时和取消机制防止资源泄露

## 故障排除指南

### 常见问题及解决方案

#### 配置加载失败

**问题症状**: 应用启动时配置无法加载

**可能原因**:
1. 存储权限问题
2. 配置文件损坏
3. 网络连接异常

**解决步骤**:
1. 检查存储权限设置
2. 验证配置文件格式
3. 确认网络连接状态

#### 平台配置无效

**问题症状**: 添加的平台配置无法使用

**可能原因**:
1. 认证信息错误
2. 平台类型选择错误
3. 网络连接问题

**解决步骤**:
1. 重新输入认证信息
2. 确认平台类型正确
3. 测试网络连接

#### Docsify 平台问题

**问题症状**: Docsify 平台配置或发布失败

**可能原因**:
1. Docsify 配置路径错误
2. YAML 前言元数据格式问题
3. 知识空间配置不匹配

**解决步骤**:
1. 检查 Docsify 配置路径设置
2. 验证 Markdown 文件的 YAML 前言格式
3. 确认知识空间树形结构配置

#### 性能问题

**问题症状**: 应用响应缓慢

**可能原因**:
1. 配置数据过大
2. 存储操作频繁
3. 内存泄漏

**解决步骤**:
1. 清理不必要的配置
2. 减少存储操作频率
3. 检查内存使用情况

**章节来源**
- [utils.ts:1-97](file://src/utils/utils.ts#L1-L97)

## 结论

平台配置系统通过精心设计的架构和实现，为思源插件发布器提供了强大而灵活的配置管理能力。系统的主要优势包括：

1. **高度模块化**: 清晰的模块划分便于维护和扩展
2. **多环境支持**: 同时支持思源笔记和浏览器环境
3. **类型安全**: 完整的TypeScript类型定义
4. **性能优化**: 多层次的性能优化策略
5. **易于使用**: 简洁的API设计和丰富的配置选项

**更新** 新增的 Docsify 子平台支持进一步增强了系统的灵活性，为静态网站生成器提供了完整的发布能力。Docsify 平台支持包括：

- **GitHub Docsify**: 支持 GitHub 仓库中的 Docsify 静态站点发布
- **GitLab Docsify**: 支持 GitLab 仓库中的 Docsify 静态站点发布
- **统一配置管理**: 通过适配器模式实现统一的配置和 API 调用
- **图标支持**: 完整的 Docsify 图标和平台标识
- **YAML 处理**: 专门的 YAML 前言元数据处理机制

该系统为未来的功能扩展奠定了坚实的基础，能够支持更多发布平台的集成和更复杂的配置需求。通过持续的优化和改进，平台配置系统将继续为用户提供优秀的配置管理体验。