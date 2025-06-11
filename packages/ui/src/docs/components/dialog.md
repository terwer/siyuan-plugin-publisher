# Dialog 对话框

用于展示重要信息或需要用户确认的内容。

## 基础用法

Dialog 弹出一个对话框，适合需要定制性更大的场景。

```vue
<template>
  <TgButton @click="dialogVisible = true">打开对话框</TgButton>
  <TgDialog v-model="dialogVisible" title="提示">
    <span>这是一段内容</span>
    <template #footer>
      <span class="dialog-footer">
        <TgButton @click="dialogVisible = false">取消</TgButton>
        <TgButton type="primary" @click="dialogVisible = false">确定</TgButton>
      </span>
    </template>
  </TgDialog>
</template>

<script setup lang="ts">
import { ref } from "vue"

const dialogVisible = ref(false)
</script>
```

## 自定义内容

Dialog 组件可以自定义内容，包括标题、内容和底部按钮。

```vue
<template>
  <TgButton @click="dialogVisible = true">打开对话框</TgButton>
  <TgDialog v-model="dialogVisible" title="自定义内容">
    <template #header>
      <div class="custom-header">
        <h3>自定义标题</h3>
      </div>
    </template>
    <div class="custom-content">
      <p>这是自定义内容</p>
    </div>
    <template #footer>
      <div class="custom-footer">
        <TgButton @click="dialogVisible = false">取消</TgButton>
        <TgButton type="primary" @click="dialogVisible = false">确定</TgButton>
      </div>
    </template>
  </TgDialog>
</template>
```

## 不同尺寸

Dialog 组件提供了三种尺寸：small、default 和 large。

```vue
<template>
  <div class="demo-dialog-size">
    <TgButton @click="smallDialogVisible = true">小型对话框</TgButton>
    <TgButton @click="defaultDialogVisible = true">默认对话框</TgButton>
    <TgButton @click="largeDialogVisible = true">大型对话框</TgButton>

    <TgDialog v-model="smallDialogVisible" title="小型对话框" size="small">
      <span>这是一个小型对话框</span>
    </TgDialog>

    <TgDialog v-model="defaultDialogVisible" title="默认对话框" size="default">
      <span>这是一个默认对话框</span>
    </TgDialog>

    <TgDialog v-model="largeDialogVisible" title="大型对话框" size="large">
      <span>这是一个大型对话框</span>
    </TgDialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"

const smallDialogVisible = ref(false)
const defaultDialogVisible = ref(false)
const largeDialogVisible = ref(false)
</script>
```

## 居中布局

通过 `center` 属性可以让对话框的内容居中显示。

```vue
<template>
  <TgButton @click="dialogVisible = true">居中对话框</TgButton>
  <TgDialog v-model="dialogVisible" title="居中对话框" center>
    <span>这是一个居中显示的对话框</span>
  </TgDialog>
</template>
```

## 关闭前确认

可以通过 `before-close` 属性来设置关闭前的回调函数。

```vue
<template>
  <TgButton @click="dialogVisible = true">打开对话框</TgButton>
  <TgDialog
    v-model="dialogVisible"
    title="提示"
    :before-close="handleClose"
  >
    <span>这是一段内容</span>
  </TgDialog>
</template>

<script setup lang="ts">
import { ref } from "vue"

const dialogVisible = ref(false)

const handleClose = (done: () => void) => {
  // 在这里添加确认逻辑
  if (confirm("确定要关闭吗？")) {
    done()
  }
}
</script>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| modelValue | 是否显示对话框 | boolean | false |
| title | 对话框标题 | string | - |
| width | 对话框宽度 | string / number | 50% |
| fullscreen | 是否为全屏对话框 | boolean | false |
| top | 对话框距离顶部的距离 | string | 15vh |
| modal | 是否需要遮罩层 | boolean | true |
| appendToBody | 是否将对话框插入至 body 元素 | boolean | true |
| lockScroll | 是否在对话框显示时锁定 body 滚动 | boolean | true |
| customClass | 自定义类名 | string | - |
| closeOnClickModal | 是否可以通过点击 modal 关闭对话框 | boolean | true |
| closeOnPressEscape | 是否可以通过按下 ESC 关闭对话框 | boolean | true |
| showClose | 是否显示关闭按钮 | boolean | true |
| showHeader | 是否显示头部 | boolean | true |
| center | 是否居中显示 | boolean | false |
| size | 对话框大小 | 'small' / 'default' / 'large' | 'default' |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| update:modelValue | 当对话框显示状态改变时触发 | 新的显示状态 |
| close | 当对话框关闭时触发 | - |
| open | 当对话框打开时触发 | - |
| opened | 当对话框打开动画结束时触发 | - |
| closed | 当对话框关闭动画结束时触发 | - |

### Slots

| 插槽名 | 说明 |
|--------|------|
| default | 对话框的内容 |
| header | 对话框标题的内容 |
| footer | 对话框底部的内容 |

## 设计规范

### 尺寸

- 小型对话框：宽度为 30%
- 默认对话框：宽度为 50%
- 大型对话框：宽度为 70%

### 颜色

- 背景色：使用 `--tg-color-bg` 变量
- 文字颜色：使用 `--tg-color-text-1` 变量
- 遮罩层颜色：rgba(0, 0, 0, 0.5)

### 动画

- 使用淡入淡出动画
- 动画时长：0.3s
- 动画曲线：ease

### 间距

- 内边距：使用 `$tg-spacing-lg` 变量
- 标题底部间距：使用 `$tg-spacing-md` 变量

### 圆角

- 使用 `--tg-border-radius-lg` 变量

### 阴影

- 使用 `--tg-box-shadow-lg` 变量 