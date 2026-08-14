# 任务计划：Halo 网页版 Cookie 失效时给出友好错误

## 目标
Halo 网页版 `getHaloCategories` / `getHaloTags` 在 Cookie 失效（Halo 返回 HTML 登录页而非 JSON）时，不再抛 `TypeError: Cannot read properties of undefined (reading 'forEach')`，而是抛出可读的友好错误，提示用户重新授权。

## 当前阶段
阶段 2

## 各阶段

### 阶段 1：需求与发现
- [x] 复现：Electron 宿主下 Cookie 失效（Halo 容器重启）→ 验证报 `forEach undefined`
- [x] 定位根因链：Cookie 失效 → Halo 返回 200 + text/html → `parsePluginTextResponse` 对 text/html 返回 HTML 字符串 → `getHaloCategories` 的 `hcs.items` = undefined → `cates.forEach` 崩溃
- [x] 确认同类隐患：`getHaloCategories`（446-449）、`getHaloTags`（470-474）均有 `xxx.items` 无保护
- **状态：** complete

### 阶段 2：规划与结构
- [x] 确定修复位置：`getHaloCategories` / `getHaloTags` 校验响应为有效对象且含 items 数组
- [x] 确定友好错误文案：登录状态已失效 / 接口返回异常
- **状态：** complete

### 阶段 3：实现
- [ ] `getHaloCategories`：响应非对象或无 items 数组时抛友好错误
- [ ] `getHaloTags`：同样处理
- **状态：** pending

### 阶段 4：测试与验证
- [ ] 单测（如有相关 spec）
- [ ] `pnpm build:v2` 通过
- [ ] Electron 宿主复验：正常 Cookie 验证通过；失效 Cookie 给出友好提示
- **状态：** pending

### 阶段 5：交付
- [ ] 检查改动与 diff
- **状态：** pending

## 已做决策
| 决策 | 理由 |
|------|------|
| 在 `getHaloCategories`/`getHaloTags` 内校验响应结构 | 响应解析异常集中在数据适配入口，调用方 `getUsersBlogs` 不崩 |
| 抛 Error（含友好文案）而非静默返回空 | 空数组会掩盖授权失效，导致"验证通过但无分类"的误导 |

## 遇到的错误
| 错误 | 尝试次数 | 解决方案 |
|------|---------|---------|
| 手动 node-fetch 模拟登录 403 | 2 | 放弃猜测，改走插件标准"去登录/自动读取 Cookie"流程 |
