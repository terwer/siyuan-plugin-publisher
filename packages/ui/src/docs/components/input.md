# Input 输入框

输入框组件，用于接收用户输入。

## 基础用法

```vue
<template>
  <TgInput v-model="value" placeholder="请输入内容" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
</script>
```

## 不同尺寸

```vue
<template>
  <TgInput size="small" placeholder="小型输入框" />
  <TgInput placeholder="默认输入框" />
  <TgInput size="large" placeholder="大型输入框" />
</template>
```

## 禁用状态

```vue
<template>
  <TgInput disabled placeholder="禁用状态" />
</template>
```

## 只读状态

```vue
<template>
  <TgInput readonly value="只读内容" />
</template>
```

## 带图标的输入框

```vue
<template>
  <TgInput prefix-icon="🔍" placeholder="搜索" />
  <TgInput suffix-icon="📝" placeholder="输入" />
</template>
```

## 带清除按钮

```vue
<template>
  <TgInput v-model="value" clearable placeholder="可清除" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
</script>
```

## 密码输入框

```vue
<template>
  <TgInput type="password" placeholder="请输入密码" />
</template>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| modelValue | 绑定值 | `string \| number` | - |
| type | 输入框类型 | `'text' \| 'password' \| 'number' \| 'email' \| 'tel'` | `'text'` |
| size | 输入框尺寸 | `'small' \| 'default' \| 'large'` | `'default'` |
| disabled | 是否禁用 | `boolean` | `false` |
| readonly | 是否只读 | `boolean` | `false` |
| clearable | 是否可清除 | `boolean` | `false` |
| placeholder | 输入框占位文本 | `string` | - |
| prefix-icon | 输入框头部图标 | `string` | - |
| suffix-icon | 输入框尾部图标 | `string` | - |
| maxlength | 最大输入长度 | `number` | - |
| show-word-limit | 是否显示输入字数统计 | `boolean` | `false` |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| update:modelValue | 在输入值改变时触发 | `(value: string \| number) => void` |
| input | 在输入值改变时触发 | `(value: string \| number) => void` |
| change | 在值改变时触发 | `(value: string \| number) => void` |
| focus | 在输入框获得焦点时触发 | `(event: FocusEvent) => void` |
| blur | 在输入框失去焦点时触发 | `(event: FocusEvent) => void` |
| clear | 在点击清除按钮时触发 | `() => void` |

### Slots

| 插槽名 | 说明 |
|--------|------|
| prefix | 输入框头部内容 |
| suffix | 输入框尾部内容 |

## 设计规范

### 尺寸

- 小型输入框高度：24px
- 默认输入框高度：32px
- 大型输入框高度：40px
- 输入框内边距：0 12px
- 图标尺寸：16px
- 图标间距：8px

### 颜色

- 背景色：`var(--tg-color-bg)`
- 边框色：`var(--tg-color-border)`
- 文本色：`var(--tg-color-text-1)`
- 占位符文本色：`var(--tg-color-text-3)`
- 禁用背景色：`var(--tg-color-bg-disabled)`
- 禁用文本色：`var(--tg-color-text-3)`
- 聚焦边框色：`var(--tg-color-primary)`

### 动画

- 聚焦效果：0.2s ease
- 清除按钮显示：0.2s ease
- 字数统计显示：0.2s ease

### 禁用状态

- 背景色：`var(--tg-color-bg-disabled)`
- 文本色：`var(--tg-color-text-3)`
- 鼠标样式：not-allowed
- 禁止输入事件

### 只读状态

- 背景色：`var(--tg-color-bg-disabled)`
- 文本色：`var(--tg-color-text-1)`
- 鼠标样式：default
- 禁止输入事件 