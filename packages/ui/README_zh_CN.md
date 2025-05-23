# @siyuan-publisher/ui

思源笔记发布工具的 UI 组件库。

[English](./README.md)

## 特性

- Vue 3 组件
- 遵循思源笔记的设计系统
- 完全可定制
- 类型安全
- 无外部 UI 依赖

## 安装

```bash
pnpm add @siyuan-publisher/ui
```

## 使用方法

```typescript
import { createApp } from 'vue'
import SiYuanUI from '@siyuan-publisher/ui'

const app = createApp(App)
app.use(SiYuanUI)
```

## 组件

### Button 按钮

```vue
<template>
  <siyuan-button type="primary" size="medium" @click="handleClick">
    点击我
  </siyuan-button>
</template>
```

## 属性

### Button 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|---------|-------------|
| type | 'primary' \| 'secondary' \| 'text' | 'primary' | 按钮类型 |
| size | 'small' \| 'medium' \| 'large' | 'medium' | 按钮大小 |
| disabled | boolean | false | 是否禁用 |

## 许可证

MIT 