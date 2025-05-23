# @siyuan-publisher/platform-adapters

思源笔记发布工具的平台适配器。

[English](./README.md)

## 特性

- 多平台支持
- 统一的适配器接口
- 易于扩展
- 类型安全
- 可配置

## 安装

```bash
pnpm add @siyuan-publisher/platform-adapters
```

## 使用方法

```typescript
import { GithubAdapter } from '@siyuan-publisher/platform-adapters'

const githubAdapter = new GithubAdapter()

// 连接到 GitHub
await githubAdapter.connect({
  apiKey: 'your-api-key',
  apiSecret: 'your-api-secret'
})

// 发布内容
const result = await githubAdapter.publish(content, {
  title: '我的文章',
  tags: ['博客', '技术']
})
```

## 可用的适配器

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

## 创建新的适配器

要创建新的平台适配器，需要实现 PlatformAdapter 接口：

```typescript
import { PlatformAdapter } from '@siyuan-publisher/core'

class MyPlatformAdapter implements PlatformAdapter {
  name = 'my-platform'
  version = '1.0.0'

  async connect(config: PlatformConfig) {
    // 连接到你的平台
  }

  async disconnect() {
    // 断开与平台的连接
  }

  async publish(content: string, options: PublishOptions) {
    // 将内容发布到你的平台
  }
}
```

## 许可证

MIT 