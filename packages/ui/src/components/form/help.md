统一规范说明：

1. Props 设计规范
```ts
// 通用属性（所有组件均支持）
interface BaseProps {
  modelValue: string | number    // 必须的v-model绑定
  disabled?: boolean            // 禁用状态
  error?: boolean               // 错误状态
  showCount?: boolean           // 显示字数统计
}

// Input特殊属性
interface InputProps extends BaseProps {
  type?: 'text' | 'password'    // 输入类型
  prefixIcon?: string           // 前缀图标
  suffixIcon?: string           // 后缀图标
}

// Textarea特殊属性
interface TextareaProps extends BaseProps {
  autoResize?: boolean          // 自动调整高度
  rows?: number                 // 初始行数
}
```

2. 事件处理规范
```html
<!-- 统一事件处理 -->
@input="$emit('update:modelValue', $event.target.value)"
@focus="$emit('focus', $event)"
@blur="$emit('blur', $event)"
```

3. 样式系统规范
```stylus
/* 颜色变量表 */
:root
  --primary-color: #1971c2        // 主色调
  --error-color: #dc3545          // 错误状态
  --input-bg-color: #ffffff       // 输入背景
  --input-border-color: #e0e0e0   // 边框颜色
  --text-primary: #2c3e50         // 主要文字
  --text-secondary: #666666       // 次要文字

[data-theme-mode="dark"]
  --primary-color: #90caf9
  --error-color: #ff6b6b
  --input-bg-color: #2d2d2d
  --input-border-color: #4a4a4a
  --text-primary: rgba(255,255,255,0.87)
```

4. 组件扩展示例
```html
<!-- 带图标的输入框 -->
<div class="input-with-icon">
  <Icon name="search" class="prefix-icon" />
  <Input v-model="searchText" />
</div>

<!-- 带验证的文本域 -->
<Textarea 
  v-model="content" 
  :maxlength="500"
  :auto-resize="true"
  :error="contentError"
  show-count
/>
```

高级功能实现：

1. 自动高度调整 (Textarea)
```ts
const resize = () => {
  if (textareaRef.value && props.autoResize) {
    textareaRef.value.style.height = 'auto'
    const scrollHeight = textareaRef.value.scrollHeight
    const minHeight = props.rows ? props.rows * 24 : 100 // 根据行数计算最小高度
    textareaRef.value.style.height = `${Math.max(scrollHeight, minHeight)}px`
  }
}
```

2. 复合输入框 (带前后缀)
```html
<!-- InputWithAddon.vue -->
<div class="input-addon">
  <span class="prefix">{{ prefix }}</span>
  <Input v-model="value" />
  <Button @click="handleSuffixClick">{{ suffix }}</Button>
</div>
```

3. 密码显示切换
```html
<Input 
  :type="showPassword ? 'text' : 'password'"
  :suffixIcon="showPassword ? 'eye-off' : 'eye'"
  @clickSuffix="showPassword = !showPassword"
/>
```

这些组件遵循以下设计原则：
1. 一致性：所有表单控件保持相同的外观和交互模式
2. 可访问性：原生HTML元素基础功能完整保留
3. 可扩展性：通过props和插槽支持各种定制需求
4. 状态管理：统一处理disabled、error等通用状态
5. 主题系统：通过CSS变量实现无缝主题切换