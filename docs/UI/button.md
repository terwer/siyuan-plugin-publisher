```vue
<!-- 基础按钮 -->
<Button>默认按钮</Button>
<Button type="primary">主要按钮</Button>
<Button type="dashed">虚线按钮</Button>
<Button type="text">文本按钮</Button>
<Button type="link">链接按钮</Button>

<!-- 尺寸控制 -->
<Button size="small">小号</Button>
<Button size="medium">中号</Button>
<Button size="large">大号</Button>

<!-- 形状控制 -->
<Button shape="square">直角</Button>
<Button shape="circle">圆形</Button>
<Button shape="pill">胶囊</Button>

<!-- 状态组合 -->
<Button danger>危险默认</Button>
<Button type="primary" danger>危险主色</Button>
<Button disabled>禁用状态</Button>
<Button loading>加载中</Button>
<Button ghost>幽灵按钮</Button>
<Button block>块级按钮</Button>

<!-- 图标按钮 -->
<Button>
  <template #icon><span>🔍</span></template>
  搜索
</Button>

<!-- 纯图标按钮 -->
<Button shape="circle">
  <template #icon><span>➕</span></template>
</Button>

<!-- 事件处理 -->
<Button @click="handleSubmit">提交表单</Button>

<!-- 链接按钮 -->
<Button href="https://example.com" type="link">
  外部链接
</Button>

<!-- 完整组合示例 -->
<Button
  type="primary"
  size="large"
  shape="pill"
  danger
  block
  @click="handleDangerAction"
>
  <template #icon>⚠️</template>
  危险操作
</Button>
```