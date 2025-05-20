# SiYuan Publisher Types

思源笔记发布插件类型定义包。

## 安装

```bash
npm install siyuan-plugin-publisher-types
```

## 使用

```typescript
import { IPlugin, PlatformType, SubPlatformType, AuthMode } from 'siyuan-plugin-publisher-types'

// 实现插件接口
class MyPlugin implements IPlugin {
  readonly id = 'my-plugin'
  readonly name = 'My Plugin'
  readonly version = '1.0.0'
  
  getPlatformType(): PlatformType {
    return PlatformType.BLOG
  }
  
  getSubPlatformType(): SubPlatformType {
    return SubPlatformType.WORDPRESS
  }
  
  getAuthMode(): AuthMode {
    return AuthMode.TOKEN
  }
  
  // 实现其他必要的方法...
}
```

## 类型定义

### 主要接口

- `IPlugin`: 插件主接口
- `PluginLoader`: 插件加载器接口
- `PluginHook`: 插件钩子接口

### 枚举

- `PlatformType`: 平台类型
- `SubPlatformType`: 子平台类型
- `AuthMode`: 认证模式
- `HookStage`: 钩子阶段

### 配置

- `DynamicConfig`: 动态配置
- `PublishConfig`: 发布配置
- `PluginConfig`: 插件配置

## 许可证

GPL-3.0 