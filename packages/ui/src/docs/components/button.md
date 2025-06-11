# Button 按钮

按钮组件，用于触发操作。

## 基础用法

```vue
<template>
  <TgButton>默认按钮</TgButton>
  <TgButton type="primary">主要按钮</TgButton>
  <TgButton type="success">成功按钮</TgButton>
  <TgButton type="warning">警告按钮</TgButton>
  <TgButton type="danger">危险按钮</TgButton>
</template>
```

## 禁用状态

```vue
<template>
  <TgButton disabled>禁用按钮</TgButton>
  <TgButton type="primary" disabled>禁用主要按钮</TgButton>
</template>
```

## 加载状态

```vue
<template>
  <TgButton loading>加载中</TgButton>
  <TgButton type="primary" loading>加载中</TgButton>
</template>
```

## 不同尺寸

```vue
<template>
  <TgButton size="small">小型按钮</TgButton>
  <TgButton>默认按钮</TgButton>
  <TgButton size="large">大型按钮</TgButton>
</template>
```

## 块级按钮

```vue
<template>
  <TgButton block>块级按钮</TgButton>
</template>
```

## 图标按钮

```vue
<template>
  <TgButton icon="🔍">搜索</TgButton>
  <TgButton type="primary" icon="➕">添加</TgButton>
  <TgButton type="danger" icon="🗑️">删除</TgButton>
</template>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| type | 按钮类型 | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger'` | `'default'` |
| size | 按钮尺寸 | `'small' \| 'default' \| 'large'` | `'default'` |
| disabled | 是否禁用 | `boolean` | `false` |
| loading | 是否加载中 | `boolean` | `false` |
| block | 是否为块级按钮 | `boolean` | `false` |
| icon | 按钮图标 | `string` | - |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| click | 点击按钮时触发 | `(event: MouseEvent) => void` |

### Slots

| 插槽名 | 说明 |
|--------|------|
| default | 按钮内容 |
| icon | 自定义图标 |

## 设计规范

### 尺寸

- 小型按钮高度：24px
- 默认按钮高度：32px
- 大型按钮高度：40px
- 按钮内边距：0 16px
- 图标按钮内边距：0 12px

### 颜色

- 默认按钮：
  - 背景色：`var(--tg-color-bg)`
  - 边框色：`var(--tg-color-border)`
  - 文本色：`var(--tg-color-text-1)`
  - 悬停背景色：`var(--tg-color-bg-hover)`
- 主要按钮：
  - 背景色：`var(--tg-color-primary)`
  - 文本色：`var(--tg-color-text-inverse)`
  - 悬停背景色：`var(--tg-color-primary-hover)`
- 成功按钮：
  - 背景色：`var(--tg-color-success)`
  - 文本色：`var(--tg-color-text-inverse)`
  - 悬停背景色：`var(--tg-color-success-hover)`
- 警告按钮：
  - 背景色：`var(--tg-color-warning)`
  - 文本色：`var(--tg-color-text-inverse)`
  - 悬停背景色：`var(--tg-color-warning-hover)`
- 危险按钮：
  - 背景色：`var(--tg-color-danger)`
  - 文本色：`var(--tg-color-text-inverse)`
  - 悬停背景色：`var(--tg-color-danger-hover)`

### 动画

- 点击效果：0.2s ease
- 悬停效果：0.2s ease
- 加载动画：1s linear infinite

### 禁用状态

- 透明度：0.5
- 鼠标样式：not-allowed
- 禁止点击事件

### 加载状态

- 显示加载图标
- 禁止点击事件
- 保持禁用样式 