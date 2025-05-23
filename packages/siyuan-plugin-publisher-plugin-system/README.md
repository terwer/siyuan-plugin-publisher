# 思源笔记发布插件系统

这是思源笔记发布插件的核心插件系统，提供了插件开发所需的基础设施和工具。

## 功能特性

- 插件生命周期管理
- 插件配置管理
- 钩子系统
- 插件模板系统
- 插件实例管理

## 安装

```bash
pnpm add siyuan-plugin-publisher-plugin-system
```

## 使用

```typescript
import { usePlugin } from "siyuan-plugin-publisher-plugin-system"

// 获取插件实例
const { getPlugin } = usePlugin()
const plugin = await getPlugin("pluginId", "templateId", config)

// 获取所有插件模板
const { getAllPluginTemplates } = usePlugin()
const templates = await getAllPluginTemplates()

// 更新插件配置
const { updatePluginConfig } = usePlugin()
updatePluginConfig("pluginId", newConfig)
```

## 开发

```bash
# 安装依赖
pnpm install -F siyuan-plugin-publisher-plugin-system

# 开发模式
pnpm dev -F siyuan-plugin-publisher-plugin-system

# 构建
pnpm build -F siyuan-plugin-publisher-plugin-system

# 测试
pnpm test -F siyuan-plugin-publisher-plugin-system
```

## 许可证

GPL-3.0 