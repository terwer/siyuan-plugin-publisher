# @siyuan-publisher/core

思源笔记发布工具的核心功能包。

[English](./README.md)

## 特性

- 核心接口和类型定义
- 插件系统接口
- 平台适配器接口
- 工具函数

## 安装

```bash
pnpm add @siyuan-publisher/core
```

## 使用方法

```typescript
import { Publisher, Plugin, PlatformAdaptor } from '@siyuan-publisher/core'

// 使用这些接口来实现你自己的发布器、插件或平台适配器
```

## API 参考

### Publisher 接口

```typescript
interface Publisher {
  name: string;
  version: string;
  publish: (content: string, options: PublishOptions) => Promise<PublishResult>;
}
```

### Plugin 接口

```typescript
interface Plugin {
  name: string;
  version: string;
  init: () => Promise<void>;
  destroy: () => Promise<void>;
}
```

### PlatformAdaptor 接口

```typescript
interface PlatformAdaptor {
  name: string;
  version: string;
  connect: (config: PlatformConfig) => Promise<void>;
  disconnect: () => Promise<void>;
  publish: (content: string, options: PublishOptions) => Promise<PublishResult>;
}
```

## 许可证

MIT 