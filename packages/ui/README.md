# SiYuan Publisher UI

[English](README.md) | [简体中文](README_zh_CN.md)

A modern UI component library for SiYuan Publisher, built with Vue 3, TypeScript, and Stylus.

## Design Philosophy

- **Simplicity**: Clean and intuitive component design
- **Consistency**: Unified design language and interaction patterns
- **Maintainability**: Well-structured code with TypeScript support
- **Performance**: Optimized for SiYuan's specific use cases

## Technology Stack

- Vue 3
- TypeScript
- Stylus
- Vite
- ESLint + Prettier

## Directory Structure

```
src/
├── components/     # UI components
│   ├── form/      # Form components
│   └── ...
├── styles/        # Global styles and variables
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
└── index.ts       # Main entry point
```

## Installation

```bash
npm install @siyuan-publisher/ui
```

## Usage

First, import the global styles in your app's entry file (e.g., `main.ts`):

```typescript
import '@siyuan-publisher/ui/styles/global'
```

Then use components in your Vue files:

```vue
<template>
  <div id="publisherApp">
    <Button type="primary">Primary Button</Button>
    <Tab :tabs="tabs" @change="handleChange" />
    <Tooltip content="This is a tooltip">
      <Button>Hover me</Button>
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
  { key: '1', title: 'Tab 1' },
  { key: '2', title: 'Tab 2' }
]

const settingGroup = {
  title: 'Basic Settings',
  items: [
    {
      type: 'input',
      label: 'API Key',
      value: '',
      placeholder: 'Please input your API key',
      labelWidth: 120
    },
    {
      type: 'switch',
      label: 'Enable Feature',
      value: false,
      labelWidth: 120
    }
  ] as SettingItem[]
}

const handleChange = (key: string) => {
  console.log('Tab changed:', key)
}
</script>
```

## Components

### Button

```vue
<Button type="primary">Primary Button</Button>
<Button>Default Button</Button>
<Button type="dashed">Dashed Button</Button>
<Button type="text">Text Button</Button>
<Button type="link">Link Button</Button>
```

### Tab

```vue
<Tab
  :tabs="[
    { key: '1', title: 'Tab 1' },
    { key: '2', title: 'Tab 2' }
  ]"
  @change="handleChange"
/>
```

### Tooltip

```vue
<Tooltip content="This is a tooltip">
  <Button>Hover me</Button>
</Tooltip>
```

### SettingPanel

```vue
<template>
  <div id="publisherApp">
    <SettingPanel
      :plugin-instance="pluginInstance"
      :setting-group="{
        title: 'Basic Settings',
        items: [
          {
            type: 'input',
            label: 'API Key',
            value: '',
            placeholder: 'Please input your API key',
            labelWidth: 120
          },
          {
            type: 'switch',
            label: 'Enable Feature',
            value: false,
            labelWidth: 120
          },
          {
            type: 'select',
            label: 'Language',
            value: 'en',
            options: [
              { label: 'English', value: 'en' },
              { label: '中文', value: 'zh' }
            ],
            labelWidth: 120
          },
          {
            type: 'number',
            label: 'Max Retries',
            value: 3,
            labelWidth: 120
          },
          {
            type: 'textarea',
            label: 'Description',
            value: '',
            placeholder: 'Please input description',
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

## Type Definitions

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

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build library
npm run build
```

## Best Practices

1. **Component Usage**
   - Use components as intended
   - Follow the component API documentation
   - Maintain consistent prop usage

2. **Styling**
   - Use global styles for common elements
   - Follow the established design system
   - Avoid inline styles

3. **TypeScript**
   - Use proper type definitions
   - Avoid using `any` type
   - Document complex types

## Development Guidelines

1. **Code Style**
   - Follow ESLint and Prettier configurations
   - Use meaningful variable and function names
   - Write clear comments for complex logic

2. **Component Development**
   - Keep components focused and single-purpose
   - Use TypeScript for props and events
   - Follow Vue 3 composition API patterns

3. **Testing**
   - Write unit tests for components
   - Test edge cases and error states
   - Maintain good test coverage

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT 