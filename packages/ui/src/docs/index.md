# Terwer UI 组件库

## 组件列表

### 基础表单组件

- [Button 按钮](./components/button.md)
- [Input 输入框](./components/input.md)
- [Select 选择器](./components/select.md)
- [Radio 单选框](./components/radio.md)
- [Checkbox 复选框](./components/checkbox.md)
- [Switch 开关](./components/switch.md)
- [DatePicker 日期选择器](./components/date-picker.md)

### 布局组件

- [Space 间距](./components/space.md)
- [AppShell 应用外壳](./components/app-shell.md)

### 导航组件

- [Tabs 标签页](./components/tabs.md)

### 表单容器组件

- [Form 表单](./components/form.md)

### 反馈组件

- [Message 消息提示](./components/message.md)

### 数据展示组件

- [Card 卡片](./components/card.md)

## 设计规范

### 命名规范

- 所有类名必须使用 `tg-` 前缀
- 禁止使用 `ant-*` 或其他非 `tg-` 前缀的类名
- 禁止使用通用类名（如 `.button`, `.header`）

### 文件命名

- 组件文件使用 PascalCase（如 `TgButton.vue`）
- 样式文件使用 kebab-case（如 `button.styl`）
- 类型定义文件使用 camelCase（如 `types.ts`）

### 代码规范

- 使用 Vue 3 组合式 API
- 使用 `<script setup lang="ts">` 语法
- 使用 TypeScript 进行类型定义
- 组件导入使用解构方式：`import { TgButton } from '@terwer/ui'`

### 样式规范

- 使用 Stylus 预处理器
- 禁止使用内联样式 `style=""`
- 禁止在组件中使用 `@import` 导入样式
- 所有样式必须通过 `styles/index.styl` 统一管理
- 使用 8px 作为基础设计单位
- 所有尺寸必须使用 `$tg-spacing-*` 变量
- 所有字体大小必须使用 `$tg-font-size-*` 变量
- 所有颜色必须使用 `var(--tg-color-*)` 变量

### 暗黑模式规范

- 通过 `#tg-app` 和 `html[data-theme-mode="dark"]` 控制
- 使用 CSS 变量实现主题切换
- 所有颜色必须支持暗黑模式 