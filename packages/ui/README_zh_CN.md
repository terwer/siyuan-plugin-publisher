# SiYuan Publisher UI

[English](README.md) | [简体中文](README_zh_CN.md)

一个基于 Vue 3、TypeScript 和 Stylus 构建的思源发布者现代化 UI 组件库。

## 设计理念

- **简洁性**：清晰直观的组件设计
- **一致性**：统一的设计语言和交互模式
- **可维护性**：结构良好的代码和 TypeScript 支持
- **性能**：针对思源特定用例优化

## 技术栈

- Vue 3
- TypeScript
- Stylus
- Vite
- ESLint + Prettier

## 目录结构

```
src/
├── components/     # UI 组件
│   ├── form/      # 表单组件
│   └── ...
├── styles/        # 全局样式和变量
├── types/         # TypeScript 类型定义
├── utils/         # 工具函数
└── index.ts       # 主入口文件
```

## 安装

```bash
npm install @siyuan-publisher/ui
```

## 使用方式

首先，在应用的入口文件（如 `main.ts`）中导入全局样式：

```typescript
import '@siyuan-publisher/ui/styles/global'
```

然后在 Vue 文件中使用组件：

```vue
<template>
  <div id="publisherApp">
    <Button type="primary">主要按钮</Button>
    <Tab :tabs="tabs" @change="handleChange" />
    <Tooltip content="这是一个提示">
      <Button>悬停显示提示</Button>
    </Tooltip>
    <SettingPanel
      :plugin-instance="pluginInstance"
      :setting-group="settingGroup"
    />
  </div>
</template>

<script setup lang="ts">
import { Button, Tab, Tooltip, SettingPanel } from '@siyuan-publisher/ui'
import type { SettingItem } from '@siyuan-publisher/ui'

const tabs = [
  { key: '1', title: '标签页1' },
  { key: '2', title: '标签页2' }
]

const settingGroup = {
  title: '基础设置',
  items: [
    {
      type: 'input',
      label: 'API 密钥',
      value: '',
      placeholder: '请输入 API 密钥',
      labelWidth: 120
    },
    {
      type: 'switch',
      label: '启用功能',
      value: false,
      labelWidth: 120
    }
  ] as SettingItem[]
}

const handleChange = (key: string) => {
  console.log('标签页切换:', key)
}
</script>
```

## 组件

### Button 按钮

```vue
<Button type="primary">主要按钮</Button>
<Button>默认按钮</Button>
<Button type="dashed">虚线按钮</Button>
<Button type="text">文本按钮</Button>
<Button type="link">链接按钮</Button>
```

### Tab 标签页

```vue
<Tab
  :tabs="[
    { key: '1', title: '标签页1' },
    { key: '2', title: '标签页2' }
  ]"
  @change="handleChange"
/>
```

### Tooltip 文字提示

```vue
<Tooltip content="这是一个提示">
  <Button>悬停显示提示</Button>
</Tooltip>
```

### SettingPanel 设置面板

```vue
<template>
  <div id="publisherApp">
    <SettingPanel
      :plugin-instance="pluginInstance"
      :setting-group="{
        title: '基础设置',
        items: [
          {
            type: 'input',
            label: 'API 密钥',
            value: '',
            placeholder: '请输入 API 密钥',
            labelWidth: 120
          },
          {
            type: 'switch',
            label: '启用功能',
            value: false,
            labelWidth: 120
          },
          {
            type: 'select',
            label: '语言',
            value: 'zh',
            options: [
              { label: 'English', value: 'en' },
              { label: '中文', value: 'zh' }
            ],
            labelWidth: 120
          },
          {
            type: 'number',
            label: '最大重试次数',
            value: 3,
            labelWidth: 120
          },
          {
            type: 'textarea',
            label: '描述',
            value: '',
            placeholder: '请输入描述',
            labelWidth: 120
          }
        ]
      }"
    />
  </div>
</template>

<script setup lang="ts">
import { SettingPanel } from '@siyuan-publisher/ui'
import type { SettingItem } from '@siyuan-publisher/ui'
</script>
```

## 类型定义

### SettingItem

```typescript
interface SettingItem {
  type: 'input' | 'switch' | 'select' | 'number' | 'textarea'
  label: string
  value: any
  placeholder?: string
  readonly?: boolean
  disabled?: boolean
  labelWidth?: number
  inputType?: string
  options?: Array<{
    label: string
    value: any
  }>
  onChange?: (value: any) => void
}
```

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建库
npm run build
```

## 最佳实践

1. **组件使用**
   - 按预期使用组件
   - 遵循组件 API 文档
   - 保持一致的属性使用方式

2. **样式**
   - 使用全局样式处理通用元素
   - 遵循既定的设计系统
   - 避免使用内联样式

3. **TypeScript**
   - 使用适当的类型定义
   - 避免使用 `any` 类型
   - 为复杂类型添加文档

## 开发指南

1. **代码风格**
   - 遵循 ESLint 和 Prettier 配置
   - 使用有意义的变量和函数名
   - 为复杂逻辑添加清晰的注释

2. **组件开发**
   - 保持组件功能单一
   - 使用 TypeScript 定义属性和事件
   - 遵循 Vue 3 组合式 API 模式

3. **测试**
   - 为组件编写单元测试
   - 测试边界情况和错误状态
   - 保持良好的测试覆盖率

## 贡献指南

1. Fork 仓库
2. 创建特性分支
3. 提交更改
4. 发起 Pull Request

## 许可证

MIT 