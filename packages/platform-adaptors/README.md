# @siyuan-publisher/platform-adaptors

Platform adaptors for SiYuan Publisher.

[中文文档](./README_zh_CN.md)

## Features

- Multiple platform support
- Unified adaptor interface
- Easy to extend
- Type-safe
- Configurable

## Installation

```bash
pnpm add @siyuan-publisher/platform-adaptors
```

## Usage

```typescript
import { GithubAdaptor } from '@siyuan-publisher/platform-adaptors'

const githubAdaptor = new GithubAdaptor()

// Connect to GitHub
await githubAdaptor.connect({
  apiKey: 'your-api-key',
  apiSecret: 'your-api-secret'
})

// Publish content
const result = await githubAdaptor.publish(content, {
  title: 'My Post',
  tags: ['blog', 'tech']
})
```

## Available Adaptors

### GitHub

```typescript
class GithubAdaptor implements PlatformAdaptor {
  name = 'github'
  version = '1.0.0'
  
  async connect(config: PlatformConfig): Promise<void>
  async disconnect(): Promise<void>
  async publish(content: string, options: PublishOptions): Promise<PublishResult>
}
```

## Creating New Adaptors

To create a new platform adaptor, implement the PlatformAdaptor interface:

```typescript
import { PlatformAdaptor } from '@siyuan-publisher/core'

class MyPlatformAdaptor implements PlatformAdaptor {
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