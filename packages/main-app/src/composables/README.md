# 组合式函数设计文档

## 设计原则

1. 单一职责原则
2. 依赖倒置原则
3. 关注点分离
4. 可组合性

## 核心组合式函数

### usePluginSystem

插件系统的核心组合式函数，负责管理插件和平台适配器的生命周期。

#### 职责
- 管理插件生命周期（加载、卸载）
- 管理平台适配器（注册、连接、配置）
- 提供插件和适配器的访问接口
- 维护插件和适配器的状态

#### 接口
```typescript
interface PluginSystem {
  plugins: Ref<Plugin[]>
  platformAdaptors: Ref<PlatformAdaptor[]>
  isLoading: Ref<boolean>
  error: Ref<string | null>
  getPluginConfig: (pluginId: string) => PlatformConfig | undefined
  loadExternalPlugin: (plugin: Plugin) => Promise<{ success: boolean; error?: string }>
}
```

### usePublisher

发布功能的核心组合式函数，专注于文章发布流程。

#### 职责
- 处理文章发布流程
- 管理发布状态
- 处理平台连接测试
- 错误处理

#### 接口
```typescript
interface Publisher {
  publish: (options: PublishOptions) => Promise<PublishResult>
  testConnection: (platform: PlatformAdaptor, config: PlatformConfig) => Promise<{ success: boolean; error?: string }>
  isPublishing: Ref<boolean>
  error: Ref<string | null>
}
```

## 组件职责

### Settings.vue

设置页面组件，负责管理插件和平台配置。

#### 职责
- 显示和管理平台配置
- 显示和管理插件
- 提供全局设置界面

#### 组合式函数使用
```typescript
// 使用 usePluginSystem 管理插件和平台
const { plugins, platformAdaptors, getPluginConfig, loadExternalPlugin } = usePluginSystem()

// 使用 usePublisher 处理发布相关操作
const { testConnection } = usePublisher()
```

### Publish.vue

发布页面组件，负责文章发布流程。

#### 职责
- 显示发布界面
- 处理文章发布
- 管理发布状态

#### 组合式函数使用
```typescript
// 使用 usePluginSystem 获取平台适配器
const { platformAdaptors, getPluginConfig } = usePluginSystem()

// 使用 usePublisher 处理发布
const { publish, isPublishing } = usePublisher()
```

## 数据流向

1. 平台配置管理
   - 由 `usePluginSystem` 统一管理
   - 组件通过 `getPluginConfig` 获取配置
   - 配置更新通过 `updateConfig` 方法

2. 发布状态管理
   - 由 `usePublisher` 管理
   - 组件通过 `isPublishing` 和 `error` 获取状态

3. 插件生命周期
   - 由 `usePluginSystem` 管理
   - 组件通过 `plugins` 和 `platformAdaptors` 访问

## 依赖关系

1. 组件依赖
   - 组件依赖 `usePluginSystem` 和 `usePublisher`
   - 不直接依赖其他组件

2. 组合式函数依赖
   - `usePublisher` 不依赖 `usePluginSystem`
   - 组合式函数之间保持独立

## 使用示例

### 平台配置更新
```typescript
// 在 Settings.vue 中
const handleConfigUpdate = async (platform: PlatformAdaptor, config: PlatformConfig) => {
  await platform.updateConfig(config)
  // 测试连接
  await testConnection(platform, config)
}
```

### 文章发布
```typescript
// 在 Publish.vue 中
const handlePublish = async () => {
  const platform = platformAdaptors.value.find(p => p.id === selectedPlatform.value)
  if (!platform) return
  
  await publish({
    platform,
    post: post.value,
    options: publishOptions.value
  })
}
```

## 注意事项

1. 避免在组合式函数中直接依赖其他组合式函数
2. 保持组合式函数的单一职责
3. 通过组件组合来实现完整功能
4. 使用 TypeScript 类型来保证接口的一致性 