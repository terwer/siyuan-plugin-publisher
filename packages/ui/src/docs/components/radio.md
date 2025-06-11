# Radio 单选框

单选框组件，用于单选场景。

## 基础用法

```vue
<template>
  <TgRadio v-model="value" value="1">选项1</TgRadio>
  <TgRadio v-model="value" value="2">选项2</TgRadio>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('1')
</script>
```

## 不同尺寸

```vue
<template>
  <TgRadio size="small" v-model="value" value="1">小型单选框</TgRadio>
  <TgRadio v-model="value" value="2">默认单选框</TgRadio>
  <TgRadio size="large" v-model="value" value="3">大型单选框</TgRadio>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('1')
</script>
```

## 禁用状态

```vue
<template>
  <TgRadio disabled v-model="value" value="1">禁用单选框</TgRadio>
  <TgRadio disabled v-model="value" value="2">禁用已选</TgRadio>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('2')
</script>
```

## 单选框组

```vue
<template>
  <TgRadioGroup v-model="value">
    <TgRadio value="1">选项1</TgRadio>
    <TgRadio value="2">选项2</TgRadio>
    <TgRadio value="3">选项3</TgRadio>
  </TgRadioGroup>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('1')
</script>
```

## 按钮样式

```vue
<template>
  <TgRadioGroup v-model="value" button>
    <TgRadio value="1">选项1</TgRadio>
    <TgRadio value="2">选项2</TgRadio>
    <TgRadio value="3">选项3</TgRadio>
  </TgRadioGroup>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('1')
</script>
```

## 自定义颜色

```vue
<template>
  <TgRadio v-model="value" value="1" color="success">成功色</TgRadio>
  <TgRadio v-model="value" value="2" color="warning">警告色</TgRadio>
  <TgRadio v-model="value" value="3" color="danger">危险色</TgRadio>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('1')
</script>
```

## API

### Radio Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| modelValue | 绑定值 | `string \| number \| boolean` | - |
| value | 单选框的值 | `string \| number \| boolean` | - |
| size | 单选框尺寸 | `'small' \| 'default' \| 'large'` | `'default'` |
| disabled | 是否禁用 | `boolean` | `false` |
| color | 自定义颜色 | `'primary' \| 'success' \| 'warning' \| 'danger'` | `'primary'` |

### RadioGroup Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| modelValue | 绑定值 | `string \| number \| boolean` | - |
| disabled | 是否禁用 | `boolean` | `false` |
| size | 单选框尺寸 | `'small' \| 'default' \| 'large'` | `'default'` |
| button | 是否使用按钮样式 | `boolean` | `false` |
| color | 自定义颜色 | `'primary' \| 'success' \| 'warning' \| 'danger'` | `'primary'` |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| update:modelValue | 在选中状态改变时触发 | `(value: string \| number \| boolean) => void` |
| change | 在选中状态改变时触发 | `(value: string \| number \| boolean) => void` |

### Slots

| 插槽名 | 说明 |
|--------|------|
| default | 单选框文本内容 |

## 设计规范

### 尺寸

- 小型单选框：16px
- 默认单选框：20px
- 大型单选框：24px
- 单选框间距：8px
- 文本间距：8px
- 按钮内边距：0 16px
- 按钮高度：32px

### 颜色

- 默认边框色：`var(--tg-color-border)`
- 选中背景色：`var(--tg-color-primary)`
- 选中边框色：`var(--tg-color-primary)`
- 禁用边框色：`var(--tg-color-border-disabled)`
- 禁用背景色：`var(--tg-color-bg-disabled)`
- 文本色：`var(--tg-color-text-1)`
- 禁用文本色：`var(--tg-color-text-3)`
- 按钮背景色：`var(--tg-color-bg)`
- 按钮选中背景色：`var(--tg-color-primary)`
- 按钮选中文本色：`var(--tg-color-text-inverse)`

### 动画

- 选中动画：0.2s ease
- 悬停效果：0.2s ease
- 按钮切换动画：0.2s ease

### 禁用状态

- 透明度：0.5
- 鼠标样式：not-allowed
- 禁止点击事件

### 按钮样式

- 边框圆角：`var(--tg-border-radius-base)`
- 按钮间距：-1px
- 按钮组圆角：第一个和最后一个按钮保留圆角
- 按钮组边框：相邻按钮共享边框 