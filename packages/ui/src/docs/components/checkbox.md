# Checkbox 复选框

复选框组件，用于多选场景。

## 基础用法

```vue
<template>
  <TgCheckbox v-model="checked">复选框</TgCheckbox>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const checked = ref(false)
</script>
```

## 不同尺寸

```vue
<template>
  <TgCheckbox size="small">小型复选框</TgCheckbox>
  <TgCheckbox>默认复选框</TgCheckbox>
  <TgCheckbox size="large">大型复选框</TgCheckbox>
</template>
```

## 禁用状态

```vue
<template>
  <TgCheckbox disabled>禁用复选框</TgCheckbox>
  <TgCheckbox disabled checked>禁用已选</TgCheckbox>
</template>
```

## 复选框组

```vue
<template>
  <TgCheckboxGroup v-model="checkedList">
    <TgCheckbox value="1">选项1</TgCheckbox>
    <TgCheckbox value="2">选项2</TgCheckbox>
    <TgCheckbox value="3">选项3</TgCheckbox>
  </TgCheckboxGroup>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const checkedList = ref(['1'])
</script>
```

## 中间状态

```vue
<template>
  <TgCheckbox v-model="checked" indeterminate>中间状态</TgCheckbox>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const checked = ref(false)
</script>
```

## 自定义颜色

```vue
<template>
  <TgCheckbox v-model="checked" color="success">成功色</TgCheckbox>
  <TgCheckbox v-model="checked" color="warning">警告色</TgCheckbox>
  <TgCheckbox v-model="checked" color="danger">危险色</TgCheckbox>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const checked = ref(false)
</script>
```

## API

### Checkbox Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| modelValue | 绑定值 | `boolean` | `false` |
| value | 选中状态的值 | `string \| number \| boolean` | - |
| size | 复选框尺寸 | `'small' \| 'default' \| 'large'` | `'default'` |
| disabled | 是否禁用 | `boolean` | `false` |
| indeterminate | 设置 indeterminate 状态 | `boolean` | `false` |
| color | 自定义颜色 | `'primary' \| 'success' \| 'warning' \| 'danger'` | `'primary'` |

### CheckboxGroup Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| modelValue | 绑定值 | `Array<string \| number \| boolean>` | `[]` |
| disabled | 是否禁用 | `boolean` | `false` |
| size | 复选框尺寸 | `'small' \| 'default' \| 'large'` | `'default'` |
| color | 自定义颜色 | `'primary' \| 'success' \| 'warning' \| 'danger'` | `'primary'` |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| update:modelValue | 在选中状态改变时触发 | `(value: boolean \| Array<string \| number \| boolean>) => void` |
| change | 在选中状态改变时触发 | `(value: boolean \| Array<string \| number \| boolean>) => void` |

### Slots

| 插槽名 | 说明 |
|--------|------|
| default | 复选框文本内容 |

## 设计规范

### 尺寸

- 小型复选框：16px
- 默认复选框：20px
- 大型复选框：24px
- 复选框间距：8px
- 文本间距：8px

### 颜色

- 默认边框色：`var(--tg-color-border)`
- 选中背景色：`var(--tg-color-primary)`
- 选中边框色：`var(--tg-color-primary)`
- 禁用边框色：`var(--tg-color-border-disabled)`
- 禁用背景色：`var(--tg-color-bg-disabled)`
- 文本色：`var(--tg-color-text-1)`
- 禁用文本色：`var(--tg-color-text-3)`

### 动画

- 选中动画：0.2s ease
- 悬停效果：0.2s ease

### 禁用状态

- 透明度：0.5
- 鼠标样式：not-allowed
- 禁止点击事件

### 中间状态

- 边框色：`var(--tg-color-primary)`
- 背景色：`var(--tg-color-primary-light)`
- 内部填充色：`var(--tg-color-primary)` 