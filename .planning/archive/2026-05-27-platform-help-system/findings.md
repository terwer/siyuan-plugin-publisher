# 调研报告：产品导览/可视化指引方案

> 日期：2026-05-27
> 已通过 WebFetch 验证 npm/github 数据

## 需求约束

1. **必须在 SiYuan 插件环境中运行**
   - **Electron 桌面端**：Chromium 内嵌浏览器，`siyuan` 命名空间可用，`nodeIntegration: false`
   - **Web 端**（browser-desktop / browser-mobile）：普通浏览器环境，无 Node 能力，需通过 `vite-plugin-node-polyfills` 补丁
   - **移动端**（Android / iOS WebView）：触摸交互、小屏幕
   - **关键**：所有工具/组件不能依赖 `window.require`、Node built-in，必须纯 DOM/JS
2. **配置驱动**：定义后无需改代码
3. **渐进增强**：无配置的平台不能报错，降级到通用帮助
4. **Bundle 敏感**：插件产物不能太大（思源对插件包大小有隐式约束）
5. **支持暗色模式**（Element Plus 主题适配，插件需跟随思源亮/暗切换）

## 方案对比

### driver.js

| 维度 | 评分 | 备注 |
|------|------|------|
| Bundle 大小 | ★★★★★ | ~5KB gzip，零依赖 |
| Vue 3 兼容 | ★★★★☆ | 纯 vanilla JS，框架无关，直接操作 DOM 即可 |
| 自定义样式 | ★★★★☆ | CSS 变量可定制 |
| 维护状态 | ★★★★★ | 活跃维护，22k+ stars |
| 许可证 | ★★★★★ | **MIT** |
| Electron 兼容 | ★★★★★ | 纯 DOM 操作，不依赖 Node API，Chromium 内完全正常 |
| Web/Mobile 兼容 | ★★★★☆ | 官方称"all major browsers"，触摸交互需自行验证 |
| 暗色模式 | ★★★☆☆ | 需自写 CSS 覆盖 |

**结论**：最轻量，MIT 协议，纯 DOM 操作天然兼容 Electron + Web。但需手动管理 Vue 3 生命周期（onMounted 创建、onUnmounted 销毁）。

### shepherd.js

| 维度 | 评分 | 备注 |
|------|------|------|
| Bundle 大小 | ★★☆☆☆ | ~20KB gzip，依赖 Popper.js |
| Vue 3 兼容 | ★★★☆☆ | 有 `vue-shepherd` wrapper，但维护频率低 |
| 自定义样式 | ★★★★★ | 完善的主题系统，内置多套皮肤 |
| 维护状态 | ★★★★☆ | Ship Shape 团队维护 |
| 许可证 | ★☆☆☆☆ | **AGPL-3.0 / Commercial 双许可**，GPL 项目可用但需注意传染性 |
| Electron 兼容 | ★★★★☆ | Popper.js 纯 DOM，理论兼容 |
| Web/Mobile 兼容 | ★★★☆☆ | 桌面浏览器为主，未提及移动端 |

**结论**：功能最强，但 **AGPL-3.0 许可证** + 20KB 对插件来说太重。排除。

### intro.js

| 维度 | 评分 | 备注 |
|------|------|------|
| 许可证 | ★☆☆☆☆ | **AGPL / Commercial** — 商用需付费 |
| 直接排除 | | |

### 自研方案（推荐 MVP）

基于 Element Plus 现有组件：
- `ElPopover` / `ElTooltip` — 字段级提示
- 自定义 `TourOverlay` 组件 — 高亮遮罩 + 步骤引导

| 维度 | 评分 | 备注 |
|------|------|------|
| Bundle 大小 | ★★★★★ | 复用已有 Element Plus 组件，TourOverlay 约 200 行代码，~2KB |
| Vue 3 兼容 | ★★★★★ | 原生 Vue 3 Composition API + Teleport |
| 自定义样式 | ★★★★★ | 完全可控，继承 Element Plus CSS 变量 |
| 暗色模式 | ★★★★★ | 自动继承 `el-*` CSS 变量，跟随思源主题 |
| Electron + Web 兼容 | ★★★★★ | 纯 DOM + Vue Teleport，不依赖任何 Node API |
| 移动端适配 | ★★★★☆ | 弹窗位置自动计算，触摸友好的按钮尺寸需手写 |
| 维护成本 | ★★★☆☆ | 需自维护 TourOverlay（约 200 行） |
| 开发周期 | ★★★☆☆ | 约 1-2 天实现 TourOverlay |

**TourOverlay 自研核心逻辑预估**（~200 行）：

```ts
// 核心思路：
// 1. Teleport 到 body，渲染全屏遮罩
// 2. 根据 target 元素 getBoundingClientRect() 计算高亮区域
// 3. 遮罩挖洞（box-shadow 方案 or SVG clipPath 方案）
// 4. 在高亮区域旁渲染 Popover（ElPopover 手动定位）
// 5. 步骤间切换，watch currentStep 重新计算位置
```

## 推荐方案

**MVP：自研** — 字段内联提示 + 帮助面板先上，TourOverlay 作为 Phase 2 追加。

理由：
1. **0 额外依赖**，复用 Element Plus，不增加 bundle
2. **Electron + Web 双环境完全可控**，不会被第三方库的边界条件坑
3. driver.js（MIT）仍为备选，如果自研 TourOverlay 效果不佳可快速切换
4. Shepherd.js（AGPL-3.0）已排除，intro.js（AGPL/Commercial）已排除

## 额外发现：Electron vs Web 适配注意点

| 场景 | 处理 |
|------|------|
| `fixed` 定位 overlay | 两个环境一致，CSS `position: fixed` 正常 |
| 触摸交互 | TourGuide 的"下一步"按钮最小 44x44px（WCAG 触控标准） |
| 思源自定义 Tab 内渲染 | Vue App mount 在思源的 `<div>` 容器内，Teleport 到 `body` 仍可行 |
| 暗色模式跟随 | 监听思源 `theme` 变化 → 同步 Element Plus `el-theme` |

## 配置文件设计（不变）

每平台一份配置，放在 `src/platforms/helpConfigs/`。格式见前文。

## 决策记录

| 决策 | 结论 | 日期 |
|------|------|------|
| 第三方案 | 排除（shepherd AGPL / intro AGPL） | 2026-05-27 |
| driver.js | MIT 备选，不自研 TourOverlay 时使用 | 2026-05-27 |
| 自研方案 | 首选 MVP，FieldGuide + HelpPanel | 2026-05-27 |
| TourOverlay | 自研优先，driver.js 作为 Plan B | 2026-05-27 |