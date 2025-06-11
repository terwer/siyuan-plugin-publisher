# Switch 开关

开关组件，用于表示两种互斥选项，用来打开或关闭选项的选择。

## 基础用法

```vue
<template>
  <TgSwitch v-model="checked" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const checked = ref(false)
</script>
```

## 不同尺寸

```vue
<template>
  <TgSwitch size="small" v-model="checked" />
  <TgSwitch v-model="checked" />
  <TgSwitch size="large" v-model="checked" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const checked = ref(false)
</script>
```

## 禁用状态

```vue
<template>
  <TgSwitch disabled v-model="checked" />
  <TgSwitch disabled v-model="checked2" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const checked = ref(false)
const checked2 = ref(true)
</script>
```

## 自定义颜色

```vue
<template>
  <TgSwitch v-model="checked" color="success" />
  <TgSwitch v-model="checked" color="warning" />
  <TgSwitch v-model="checked" color="danger" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const checked = ref(false)
</script>
```

## 带文字描述

```vue
<template>
  <TgSwitch v-model="checked">
    <template #checked>开</template>
    <template #unchecked>关</template>
  </TgSwitch>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const checked = ref(false)
</script>
```

## 加载状态

```vue
<template>
  <TgSwitch v-model="checked" loading />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const checked = ref(false)
</script>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| modelValue | 绑定值 | `boolean` | `false` |
| size | 开关尺寸 | `'small' \| 'default' \| 'large'` | `'default'` |
| disabled | 是否禁用 | `boolean` | `false` |
| loading | 是否加载中 | `boolean` | `false` |
| color | 自定义颜色 | `'primary' \| 'success' \| 'warning' \| 'danger'` | `'primary'` |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| update:modelValue | 在开关状态改变时触发 | `(value: boolean) => void` |
| change | 在开关状态改变时触发 | `(value: boolean) => void` |

### Slots

| 插槽名 | 说明 |
|--------|------|
| checked | 开关打开时的内容 |
| unchecked | 开关关闭时的内容 |

## 设计规范

### 尺寸

- 小型开关：
  - 宽度：28px
  - 高度：16px
  - 圆形大小：12px
- 默认开关：
  - 宽度：40px
  - 高度：20px
  - 圆形大小：16px
- 大型开关：
  - 宽度：52px
  - 高度：24px
  - 圆形大小：20px

### 颜色

- 关闭状态背景色：`var(--tg-color-bg-disabled)`
- 开启状态背景色：`var(--tg-color-primary)`
- 圆形颜色：`var(--tg-color-bg)`
- 禁用状态透明度：0.5
- 加载状态背景色：`var(--tg-color-bg-disabled)`

### 动画

- 开关切换动画：0.3s cubic-bezier(0.4, 0, 0.2, 1)
- 加载动画：1s linear infinite
- 文字切换动画：0.2s ease

### 禁用状态

- 透明度：0.5
- 鼠标样式：not-allowed
- 禁止点击事件

### 加载状态

- 显示加载图标
- 禁止点击事件
- 保持禁用样式

### 文字描述

- 文字大小：12px
- 文字颜色：`var(--tg-color-text-inverse)`
- 文字间距：4px
- 文字动画：0.2s ease 