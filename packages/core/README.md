# @siyuan-publisher/core

Core functionality package for SiYuan Publisher.

[中文文档](./README_zh_CN.md)

## Features

- Core interfaces and types
- Plugin system interfaces
- Platform adaptor interfaces
- Utility functions
- Type-safe API design

## Installation

```bash
pnpm add @siyuan-publisher/core
```

## Usage

```typescript
import { Publisher, Plugin, PlatformAdaptor } from '@siyuan-publisher/core'

// Use the interfaces to implement your own publishers, plugins, or platform adaptors
```

## API Reference

### Publisher Interface

```typescript
interface Publisher {
  name: string;
  version: string;
  publish: (content: string, options: PublishOptions) => Promise<PublishResult>;
}

interface PublishOptions {
  title?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

interface PublishResult {
  success: boolean;
  url?: string;
  error?: string;
}
```

### Plugin Interface

```typescript
interface Plugin {
  name: string;
  version: string;
  init: () => Promise<void>;
  destroy: () => Promise<void>;
}
```

### PlatformAdaptor Interface

```typescript
interface PlatformAdaptor {
  name: string;
  version: string;
  connect: (config: PlatformConfig) => Promise<void>;
  disconnect: () => Promise<void>;
  publish: (content: string, options: PublishOptions) => Promise<PublishResult>;
}

interface PlatformConfig {
  apiKey?: string;
  apiSecret?: string;
  endpoint?: string;
  [key: string]: any;
}
```

## Development

This package provides the core interfaces and types that other packages in the project depend on. When developing new features:

1. Define interfaces in this package
2. Implement them in other packages
3. Keep the interfaces simple and focused
4. Document all public APIs

## License

MIT 