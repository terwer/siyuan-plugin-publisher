# @siyuan-publisher/plugin-system

思源笔记发布工具的插件系统。

[English](./README.md)

## 特性

- 动态插件加载和卸载
- 插件生命周期管理
- 插件依赖管理
- 类型安全的插件 API
- 支持热重载

## 安装

```bash
pnpm add @siyuan-publisher/plugin-system
```

## 使用方法

```typescript
import { PluginManager } from '@siyuan-publisher/plugin-system'

const pluginManager = new PluginManager()

// 加载插件
await pluginManager.loadPlugin(myPlugin)

// 卸载插件
await pluginManager.unloadPlugin('plugin-name')

// 获取所有已加载的插件
const plugins = pluginManager.getAllPlugins()
```

## API 参考

### PluginManager

```typescript
class PluginManager {
  loadPlugin(plugin: Plugin): Promise<void>
  unloadPlugin(name: string): Promise<void>
  getPlugin(name: string): Plugin | undefined
  getAllPlugins(): Plugin[]
  unloadAll(): Promise<void>
}
```

## 插件开发

要创建一个插件，需要实现 Plugin 接口：

```typescript
import { Plugin } from '@siyuan-publisher/core'

class MyPlugin implements Plugin {
  name = 'my-plugin'
  version = '1.0.0'

  async init() {
    // 初始化插件
  }

  async destroy() {
    // 清理插件
  }
}
```

## 许可证

MIT 