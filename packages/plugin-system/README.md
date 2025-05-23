# @siyuan-publisher/plugin-system

Plugin system for SiYuan Publisher.

[中文文档](./README_zh_CN.md)

## Features

- Dynamic plugin loading and unloading
- Plugin lifecycle management
- Plugin dependency management
- Type-safe plugin API
- Hot reload support

## Installation

```bash
pnpm add @siyuan-publisher/plugin-system
```

## Usage

```typescript
import { PluginManager } from '@siyuan-publisher/plugin-system'

const pluginManager = new PluginManager()

// Load a plugin
await pluginManager.loadPlugin(myPlugin)

// Unload a plugin
await pluginManager.unloadPlugin('plugin-name')

// Get all loaded plugins
const plugins = pluginManager.getAllPlugins()
```

## API Reference

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

## Plugin Development

To create a plugin, implement the Plugin interface:

```typescript
import { Plugin } from '@siyuan-publisher/core'

class MyPlugin implements Plugin {
  name = 'my-plugin'
  version = '1.0.0'

  async init() {
    // Initialize your plugin
  }

  async destroy() {
    // Clean up your plugin
  }
}
```

## License

MIT 