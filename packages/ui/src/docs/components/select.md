# Select 选择器

选择器组件，用于从一组选项中选择一个或多个选项。

## 基础用法

```vue
<template>
  <TgSelect v-model="value" :options="options" placeholder="请选择" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
const options = [
  { label: '选项1', value: '1' },
  { label: '选项2', value: '2' },
  { label: '选项3', value: '3' }
]
</script>
```

## 不同尺寸

```vue
<template>
  <TgSelect size="small" :options="options" placeholder="小型选择器" />
  <TgSelect :options="options" placeholder="默认选择器" />
  <TgSelect size="large" :options="options" placeholder="大型选择器" />
</template>
```

## 禁用状态

```vue
<template>
  <TgSelect disabled :options="options" placeholder="禁用状态" />
</template>
```

## 可清空选择

```vue
<template>
  <TgSelect v-model="value" :options="options" clearable placeholder="可清空" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
const options = [
  { label: '选项1', value: '1' },
  { label: '选项2', value: '2' },
  { label: '选项3', value: '3' }
]
</script>
```

## 多选

```vue
<template>
  <TgSelect v-model="value" :options="options" multiple placeholder="多选" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref([])
const options = [
  { label: '选项1', value: '1' },
  { label: '选项2', value: '2' },
  { label: '选项3', value: '3' }
]
</script>
```

## 分组选项

```vue
<template>
  <TgSelect v-model="value" :options="options" placeholder="分组选项" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
const options = [
  {
    label: '分组1',
    options: [
      { label: '选项1', value: '1' },
      { label: '选项2', value: '2' }
    ]
  },
  {
    label: '分组2',
    options: [
      { label: '选项3', value: '3' },
      { label: '选项4', value: '4' }
    ]
  }
]
</script>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| modelValue | 绑定值 | `string \| number \| Array<string \| number>` | - |
| options | 选项数组 | `Array<Option \| OptionGroup>` | `[]` |
| multiple | 是否多选 | `boolean` | `false` |
| size | 选择器尺寸 | `'small' \| 'default' \| 'large'` | `'default'` |
| disabled | 是否禁用 | `boolean` | `false` |
| clearable | 是否可清空 | `boolean` | `false` |
| placeholder | 占位文本 | `string` | - |
| filterable | 是否可搜索 | `boolean` | `false` |
| loading | 是否加载中 | `boolean` | `false` |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| update:modelValue | 在选中值改变时触发 | `(value: string \| number \| Array<string \| number>) => void` |
| change | 在选中值改变时触发 | `(value: string \| number \| Array<string \| number>) => void` |
| clear | 在点击清除按钮时触发 | `() => void` |
| visible-change | 下拉框出现/隐藏时触发 | `(visible: boolean) => void` |

### Slots

| 插槽名 | 说明 |
|--------|------|
| prefix | 选择器头部内容 |
| suffix | 选择器尾部内容 |
| empty | 无选项时的列表内容 |

## 设计规范

### 尺寸

- 小型选择器高度：24px
- 默认选择器高度：32px
- 大型选择器高度：40px
- 选择器内边距：0 12px
- 下拉选项高度：32px
- 下拉选项内边距：0 12px

### 颜色

- 背景色：`var(--tg-color-bg)`
- 边框色：`var(--tg-color-border)`
- 文本色：`var(--tg-color-text-1)`
- 占位符文本色：`var(--tg-color-text-3)`
- 禁用背景色：`var(--tg-color-bg-disabled)`
- 禁用文本色：`var(--tg-color-text-3)`
- 聚焦边框色：`var(--tg-color-primary)`
- 选项悬停背景色：`var(--tg-color-bg-hover)`
- 选项选中背景色：`var(--tg-color-primary-light)`

### 动画

- 下拉框展开/收起：0.2s ease
- 选项悬停效果：0.2s ease
- 清除按钮显示：0.2s ease

### 禁用状态

- 背景色：`var(--tg-color-bg-disabled)`
- 文本色：`var(--tg-color-text-3)`
- 鼠标样式：not-allowed
- 禁止选择事件

### 多选状态

- 标签背景色：`var(--tg-color-primary-light)`
- 标签文本色：`var(--tg-color-primary)`
- 标签关闭图标色：`var(--tg-color-text-3)`
- 标签悬停背景色：`var(--tg-color-primary)`
- 标签悬停文本色：`var(--tg-color-text-inverse)` 