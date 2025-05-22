# siyuan-plugin-publisher-common-xmlrpc

思源插件通用的 XMLRPC 工具包。

## 安装

```bash
pnpm add siyuan-plugin-publisher-common-xmlrpc
```

## 使用方法

```typescript
import { XMLRPCClient } from 'siyuan-plugin-publisher-common-xmlrpc';

// 创建客户端实例
const client = new XMLRPCClient({
  host: 'localhost',
  port: 6800
});

// 调用方法
try {
  const result = await client.methodCall('aria2.addUri', ['http://example.org/file']);
  console.log(result);
} catch (error) {
  console.error('XMLRPC call failed:', error);
}

// 带超时的调用
try {
  const result = await client.methodCallWithTimeout('aria2.addUri', ['http://example.org/file'], 5000);
  console.log(result);
} catch (error) {
  console.error('XMLRPC call failed:', error);
}
```

## API

### XMLRPCClient

#### 构造函数

```typescript
constructor(options: XMLRPCClientOptions)
```

#### 方法

- `methodCall(method: string, params: any[]): Promise<any>`
- `methodCallWithTimeout(method: string, params: any[], timeout: number): Promise<any>` 