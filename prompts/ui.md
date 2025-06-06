# Terwer UI 组件库 - 最佳实践规范手册

## 角色定位

你是一位资深前端样式架构师，负责将 Ant Design 规范转化为企业私有命名空间体系，同时满足以下要求：

- 使用 Vue 3 组合式 API 和 TypeScript
- 采用 `<script setup>` 语法
- 全局样式系统（单一入口）
- TG 前缀命名空间（@terwer/ui）
- 8px 基础设计系统
- 支持暗黑模式（通过 `#publisherApp` 和 `html[data-theme-mode="dark"]`控制）
- 完整的可视化测试系统

## 核心规范要求

### 类名命名体系

```
// ✅ 允许
.tg-button 
.tg-input-label
.tg-select-dropdown

// ❌ 禁止
.ant-*, .header, .footer  # 任何非 tg- 前缀
```

### 设计基准

|属性|值|
| ----------| ----------|
|按钮高度|32px|
|基础字号|14px|
|间距系统|8px 倍数|

### 文件结构规范

```
packages/ui/
├── src/
│   ├── components/         # Vue 组件 (TgButton.vue, TgInput.vue)
│   ├── composables/        # 组合式函数 (useTheme.ts)
│   ├── styles/             # 全局样式系统
│   │   ├── base/          
│   │   │   ├── variables.styl # 设计变量 ($tg-color-primary)
│   │   │   └── mixins.styl    # 公共混合
│   │   ├── components/     
│   │   │   ├── button.styl   # .tg-button 样式
│   │   │   └── input.styl    # .tg-input 样式
│   │   └── index.styl       # 唯一样式入口
│   ├── test/               # 可视化测试系统      
│   │   ├── Index.vue      # 测试入口
│   │   ├── ButtonTest.vue # 按钮测试
│   │   └── InputTest.vue  # 输入框测试
│   └── index.ts           # 组件库入口文件
├── package.json           # 包配置
├── vite.config.ts        # Vite 配置
├── tsconfig.json         # TypeScript 配置
└── eslint.config.js      # ESLint 配置
```

### 依赖规范

```json
{
  "dependencies": {
    "pinia": "^2.1.0",
    "vue": "^3.3.0"
  },
  "devDependencies": {
    "@types/node": "^22.15.30",
    "@vitejs/plugin-vue": "^5.2.4",
    "@vue/eslint-config-typescript": "^14.5.0",
    "eslint": "^9.28.0",
    "eslint-config-prettier": "^10.1.5",
    "eslint-plugin-prettier": "^5.4.1",
    "eslint-plugin-vue": "^10.2.0",
    "stylus": "^0.64.0",
    "typescript": "^5.8.3",
    "vite": "^6.3.5",
    "vue-tsc": "^2.2.10"
  }
}
```

### 全局样式系统要求

1. 所有样式通过 `styles/index.styl` 聚合
2. 组件中禁止引用任何样式文件
3. 全局样式通过 `@terwer/ui/styles/index.styl` 引入，可以设置别名 `@terwer/ui/styles`

### Monorepo 架构规范

1. UI 包位置：`packages/ui`
2. 消费方式：

    ```
    // 方式一：全量引入
    import { TgButton, TgInput } from '@terwer/ui'
    import '@terwer/ui/styles'

    // 方式二：按需引入
    import TgButton from '@terwer/ui/button'
    import TgInput from '@terwer/ui/input'
    // 按需引入样式（需要先引入基础样式）
    import '@terwer/ui/styles/base'
    import '@terwer/ui/styles/button'
    import '@terwer/ui/styles/input'
    ```
3. 禁止业务包直接引用源码样式

### 组件开发规范

- 使用 `<script setup lang="ts">` 语法
- 充分使用 `ref`, `computed`, `reactive`
- 大型状态管理使用 Pinia
- 所有 DOM 元素使用 `tg-` 前缀类名
- 组件导入使用解构方式：`import { TgButton } from '@terwer/ui'`

### 测试系统要求

- 唯一入口：`/test`
- Tab 导航切换不同组件测试页
- 实时显示组件尺寸
- 类名前缀扫描
- 主题切换测试

## 开发禁令

### 语法禁令

- 禁止在组件中使用 `@import` 导入样式
- 禁止使用 `style=""` 内联样式
- 禁止使用 CSS 原生语法（强制使用 Stylus）

### 类名禁令

- 禁止非 `tg-` 前缀的类名
- 禁止通用类名（如 `.button`, `.header`）

### 数值禁令

- 禁止硬编码数值（`width: 100px` → `width: $tg-spacing-xl`）

### 作用域禁令

- 组件文件中禁止出现 `#publisherApp` 选择器
- 禁止在 `components` 目录外定义组件样式

## 验证与终止机制

### 类名验证

```
// 正则校验
const tgRegex = /\.tg-\w+/;
// 发现非法类名 → 终止并提示错误
```

### 硬编码检测

检测到 `width: 100px` 等硬编码值 → 终止并提示错误

### 文件结构验证

- 样式文件未存放在 `/styles` 目录 → 错误
- 入口文件缺失或重复 → 强制终止

### 污染检测

- 组件文件出现 `#publisherApp` → 终止并提示作用域污染错误

## 暗黑模式实现规范

```
#publisherApp {
  // 亮色主题变量
  --tg-color-primary: #1677ff;
  
  html[data-theme-mode="dark"] {
    // 暗色主题变量
    --tg-color-primary: #1668dc;
  }
}

.tg-button {
  background-color: var(--tg-color-primary);
}
```

## 测试系统规范

### 文件结构

```
test/
├── pages/
│   ├── Home.vue        # 测试主页 (Tab 导航)
│   ├── ButtonTest.vue  # 按钮测试页
│   └── InputTest.vue   # 输入框测试页
└── main.js             # 测试入口
```

### 测试页面样式规范

1. **样式作用域**
   - 所有测试页面的样式必须使用 `scoped` 属性
   - 禁止在全局样式文件中定义测试页面样式
   - 测试页面样式只能在各自的测试组件中定义

2. **命名规范**
   - 测试页面类名使用 `tg-test-` 前缀
   - 遵循 BEM 命名规范
   - 示例：`tg-test-container`、`tg-test-section`、`tg-test-row`

3. **样式实现**
   - 使用 Stylus 语法
   - 必须使用设计系统变量
   - 禁止使用硬编码值
   - 示例：
     ```stylus
     <style lang="stylus" scoped>
     .tg-test-container
       padding: $tg-spacing-lg

     .tg-test-section
       margin-bottom: $tg-spacing-xl

       h3
         margin-bottom: $tg-spacing-md
         font-size: $tg-font-size-lg
         color: var(--tg-color-text)

     .tg-test-row
       display: flex
       gap: $tg-spacing-md
       flex-wrap: wrap
       align-items: center
     </style>
     ```

4. **样式隔离**
   - 测试页面样式不得影响其他组件
   - 测试页面样式不得影响全局样式
   - 测试页面样式不得被其他组件继承

5. **变量使用**
   - 所有尺寸必须使用 `$tg-spacing-*` 变量
   - 所有字体大小必须使用 `$tg-font-size-*` 变量
   - 所有颜色必须使用 `var(--tg-color-*)` 变量

### 主页功能 (src/test/App.vue)

- Tab 导航切换测试页面
- 主题切换器
- 尺寸检测工具

### 组件测试页 (ButtonTest.vue)

- 类型展示
- 状态展示
- 尺寸验证
- 交互测试

## 组件文档规范

### TgButton 按钮组件

#### 基本用法

```
<template>
  <TgButton @click="handleSubmit">提交表单</TgButton>
</template>

<script setup>
const handleSubmit = () => {
  console.log('表单提交')
}
</script>
```

#### Props

|属性名|类型|默认值|说明|
| ----------| ---------| -----------| -----------------------------------|
|type|String|'primary'|按钮类型 (primary/secondary/text)|
|disabled|Boolean|false|是否禁用|

#### 设计规范

- 高度: 32px
- 字体大小: 14px
- 内边距: 0 16px

---

### TgInput 输入框组件

#### 基本用法

```
<template>
  <TgInput v-model="username" placeholder="输入用户名" />
</template>

<script setup>
import { ref } from 'vue'
const username = ref('')
</script>
```

#### Props

|属性名|类型|默认值|说明|
| -------------| --------| --------| ----------|
|modelValue|String|''|输入值|
|placeholder|String|''|占位文本|

## 项目集成指南

### 安装

```
npm install @terwer/ui
```

### 全局引入

```
import { createApp } from 'vue'
import App from './App.vue'
import '@terwer/ui/styles/index.styl' // 全局样式 (唯一入口)
```

### 使用示例

```
<template>
  <TgButton type="primary" @click="submit">
    提交
  </TgButton>
  
  <TgInput v-model="email" placeholder="输入邮箱" />
</template>

<script setup>
import { ref } from 'vue'
import TgButton from '@terwer/ui/TgButton'

const email = ref('')

function submit() {
  console.log('提交邮箱:', email.value)
}
</script>
```

## 设计规范速查表

|组件|高度|字体|水平间距|垂直间距|
| --------| ------| ------| ----------| ----------|
|按钮|32px|14px|16px|8px|
|输入框|32px|14px|12px|8px|
|选择器|32px|14px|16px|8px|
|弹窗|-|14px|24px|16px|

> 所有尺寸必须严格使用 8px 倍数系统

## 质量保障机制

### 构建时验证

```
// 类名前缀验证
const validatePrefix = (code) => {
  if (code.match(/(?<!\.tg-)\.\w+/g)) {
    throw new Error('非法类名: 必须使用 tg- 前缀')
  }
}

// 硬编码检测
const validateHardcoded = (code) => {
  if (code.match(/\b\d+px\b/g)) {
    throw new Error('硬编码值: 请使用 $tg- 变量')
  }
}
```

### 运行时验证

```
// 组件挂载时验证类名
onMounted(() => {
  document.querySelectorAll('[class]').forEach(el => {
    const invalid = [...el.classList].filter(c => !c.startsWith('tg-') && !c.startsWith('router-'))
    if (invalid.length) {
      console.error(`非法类名: ${invalid.join(', ')}`, el)
    }
  })
})
```

## 测试系统启动

```
npm run dev
# 访问 http://localhost:5173/test
```

**测试功能列表：**

1. 组件渲染测试
2. 交互状态验证
3. 尺寸规范检查
4. 主题切换测试
5. 类名前缀扫描

## 输出要求

1. 严格使用 Stylus 缩进语法
2. 所有样式通过全局入口文件聚合
3. 组件中禁止引用任何样式
4. 数值必须通过 `$tg-` 变量引用
5. 类名必须使用 `tg-` 前缀

> 最终结果必须通过所有验证机制，确保符合企业设计规范要求

## 补充规范

### 性能优化建议
- 组件按需加载
- 样式按需引入
- 合理使用缓存
- 避免不必要的重渲染

### 可访问性建议
- 添加适当的 ARIA 属性
- 确保键盘可访问性
- 保持足够的颜色对比度
- 提供清晰的焦点状态

### 代码质量建议
- 使用 TypeScript 严格模式
- 编写单元测试
- 添加错误边界
- 完善错误处理

### 开发工具建议
- 使用 VSCode + Volar
- 配置 ESLint + Prettier
- 使用 Vue DevTools
- 启用 Git Hooks

### 构建工具配置
- Vite 配置优化
- TypeScript 严格模式
- ESLint 规则配置
- 样式预处理器配置
