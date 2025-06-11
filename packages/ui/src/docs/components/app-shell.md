# AppShell 应用外壳

应用外壳组件，用于构建应用的整体布局结构。

## 基础用法

```vue
<template>
  <TgAppShell
    :nav-items="[
      { label: '首页', route: '/' },
      { label: '发布', route: '/publish' },
      { label: '设置', route: '/settings' }
    ]"
    @nav-change="handleNavChange"
    @collapse-change="handleCollapseChange"
  >
    <div>内容区域</div>
  </TgAppShell>
</template>

<script setup lang="ts">
const handleNavChange = (route: string) => {
  console.log('导航到:', route)
}

const handleCollapseChange = (collapsed: boolean) => {
  console.log('折叠状态:', collapsed)
}
</script>
```

## 自定义宽度

通过 `nav-width` 属性可以自定义导航栏的宽度。

```vue
<template>
  <TgAppShell
    :nav-items="navItems"
    :nav-width="240"
  >
    <div>内容区域</div>
  </TgAppShell>
</template>
```

## 禁用导航项

通过设置导航项的 `disabled` 属性可以禁用该导航项。

```vue
<template>
  <TgAppShell
    :nav-items="[
      { label: '首页', route: '/' },
      { label: '发布', route: '/publish', disabled: true },
      { label: '设置', route: '/settings' }
    ]"
  >
    <div>内容区域</div>
  </TgAppShell>
</template>
```

## 带图标的导航项

通过设置导航项的 `icon` 属性可以添加图标。

```vue
<template>
  <TgAppShell
    :nav-items="[
      { label: '首页', route: '/', icon: '🏠' },
      { label: '发布', route: '/publish', icon: '📝' },
      { label: '设置', route: '/settings', icon: '⚙️' }
    ]"
  >
    <div>内容区域</div>
  </TgAppShell>
</template>
```

## 固定定位

通过设置 `fixed` 属性可以将应用外壳固定在视口中。

```vue
<template>
  <TgAppShell
    :nav-items="navItems"
    :fixed="true"
  >
    <div>内容区域</div>
  </TgAppShell>
</template>
```

## 隐藏导航栏

通过设置 `show-nav` 属性可以隐藏导航栏。

```vue
<template>
  <TgAppShell
    :nav-items="navItems"
    :show-nav="false"
  >
    <div>内容区域</div>
  </TgAppShell>
</template>
```

## 隐藏折叠按钮

通过设置 `show-collapse-button` 属性可以隐藏折叠按钮。

```vue
<template>
  <TgAppShell
    :nav-items="navItems"
    :show-collapse-button="false"
  >
    <div>内容区域</div>
  </TgAppShell>
</template>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| nav-items | 导航项列表 | `AppShellNavItem[]` | - |
| collapsed | 是否折叠导航栏 | `boolean` | `false` |
| nav-width | 导航栏宽度 | `number` | `200` |
| show-collapse-button | 是否显示折叠按钮 | `boolean` | `true` |
| fixed | 是否固定在视口 | `boolean` | `false` |
| show-nav | 是否显示导航栏 | `boolean` | `true` |

### AppShellNavItem

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| label | 导航项标签 | `string` | - |
| route | 导航项路由 | `string` | - |
| icon | 导航项图标 | `string` | - |
| disabled | 是否禁用 | `boolean` | `false` |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| nav-change | 导航变更时触发 | `(route: string) => void` |
| collapse-change | 折叠状态变更时触发 | `(collapsed: boolean) => void` |

### Slots

| 插槽名 | 说明 |
|--------|------|
| default | 内容区域 |

## 设计规范

### 尺寸

- 导航栏默认宽度：200px
- 导航项内边距：16px 24px
- 折叠按钮尺寸：32px x 32px
- 内容区域内边距：8px 16px

### 颜色

- 背景色：`var(--tg-color-bg)`
- 边框色：`var(--tg-color-border)`
- 文本色：`var(--tg-color-text-2)`
- 悬停背景色：`var(--tg-color-bg-hover)`
- 激活背景色：`var(--tg-color-primary)`
- 激活文本色：`var(--tg-color-text-inverse)`

### 动画

- 导航栏折叠/展开：0.3s ease
- 折叠按钮悬停：0.2s ease
- 导航项悬停：0.2s ease

### 响应式

- 导航栏宽度可自定义
- 内容区域自适应宽度
- 支持固定定位
- 支持隐藏导航栏
- 支持隐藏折叠按钮 