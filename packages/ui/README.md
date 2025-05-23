# @siyuan-publisher/ui

UI component library for SiYuan Publisher.

[中文文档](./README_zh_CN.md)

## Features

- Vue 3 components
- Follows SiYuan Note's design system
- Fully customizable
- Type-safe
- No external UI dependencies

## Installation

```bash
pnpm add @siyuan-publisher/ui
```

## Usage

```typescript
import { createApp } from 'vue'
import SiYuanUI from '@siyuan-publisher/ui'

const app = createApp(App)
app.use(SiYuanUI)
```

## Components

### Button

```vue
<template>
  <siyuan-button type="primary" size="medium" @click="handleClick">
    Click me
  </siyuan-button>
</template>
```

## Props

### Button Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| type | 'primary' \| 'secondary' \| 'text' | 'primary' | Button type |
| size | 'small' \| 'medium' \| 'large' | 'medium' | Button size |
| disabled | boolean | false | Whether the button is disabled |

## License

MIT 