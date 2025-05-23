# @siyuan-publisher/platform-adapters

Platform adapters for SiYuan Publisher.

[中文文档](./README_zh_CN.md)

## Features

- Multiple platform support
- Unified adapter interface
- Easy to extend
- Type-safe
- Configurable

## Installation

```bash
pnpm add @siyuan-publisher/platform-adapters
```

## Usage

```typescript
import { GithubAdapter } from '@siyuan-publisher/platform-adapters'

const githubAdapter = new GithubAdapter()

// Connect to GitHub
await githubAdapter.connect({
  apiKey: 'your-api-key',
  apiSecret: 'your-api-secret'
})

// Publish content
const result = await githubAdapter.publish(content, {
  title: 'My Post',
  tags: ['blog', 'tech']
})
```

## Available Adapters

### GitHub

```typescript
class GithubAdapter implements PlatformAdapter {
  name = 'github'
  version = '1.0.0'
  
  async connect(config: PlatformConfig): Promise<void>
  async disconnect(): Promise<void>
  async publish(content: string, options: PublishOptions): Promise<PublishResult>
}
```

## Creating New Adapters

To create a new platform adapter, implement the PlatformAdapter interface:

```typescript
import { PlatformAdapter } from '@siyuan-publisher/core'

class MyPlatformAdapter implements PlatformAdapter {
  name = 'my-platform'
  version = '1.0.0'

  async connect(config: PlatformConfig) {
    // Connect to your platform
  }

  async disconnect() {
    // Disconnect from your platform
  }

  async publish(content: string, options: PublishOptions) {
    // Publish content to your platform
  }
}
```

## License

MIT 