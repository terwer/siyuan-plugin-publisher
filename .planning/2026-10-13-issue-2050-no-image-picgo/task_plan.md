# 任务计划：修复 issue #2050 + 源码模式图床分流

## 目标
消除「无图片文章误触发图床」与「源码模式绕过图床服务分流」两个缺陷：源码模式不做任何图床预处理（显示原文 + 有图片时提示），发布链路无本地图片时不再触发内核校验；上游 zhi-siyuan-picgo 同步根治后升级依赖。

## 当前阶段
阶段 3（待开工）

## 各阶段

### 阶段 1：根因排查（只读）
- [x] 读取 issue #2050 原文
- [x] 定位报错文案来源（`usePicgoBridge.ts:46`）
- [x] 缺陷 2 链路确认：SourceMode → handlePicgo → 内核 `uploadMarkdownImages` 前置校验 uploader 配置
- [x] 确认内核 `uploadPostImagesToBed` 已有「文章中没有图片」短路
- [x] 确认发布流程同样受影响（`baseExtendApi.ts:497` 收集到 `imageUploadErrors`）
- [x] 缺陷 1 链路确认：语雀网页版实测暴露 SourceMode 无 `picbedService` 分流
- [x] 判据一致性确认：插件侧 `kernelApi.getImageBlocksByID` 与内核同类同 SQL
- [x] 数据流转、批量模式 cfg 未传、git 历史佐证
- **状态：** complete

### 阶段 2：方案确认与规划
- [x] 修复设计与实施范围对齐（proposal.md）：源码模式不做上传（含 PicGo）+ 有图片时统一文案提示；插件侧 + 上游都做；批量不预处理
- [x] 上游计划建立：`siyuan-plugin-picgo/.planning/2026-10-13-skip-uploader-validation-when-no-images/`（U1 方案）
- **状态：** complete

### 阶段 3：实施（插件侧）
- [x] `SourceMode.vue`：移除图床预处理调用；按场景显示原文 + 有图片时提示（i18n 新增中英文案，文案已定稿）
- [x] `usePicgoBridge.handlePicgo`：无图片短路（`kernelApi.getImageBlocksByID` 判空）
- [x] 「上传并预览替换后的内容」按钮：`previewMode` 默认 false；点击走发布同源链路（`previewImageProcess` → `handlePictures` 分流）上传并切换显示、再点恢复原文；纯显示层不写文档；**单平台（PicGo / Bundled）且正文有图片时渲染**；批量分发无单平台上下文不提供
- [x] 安装上游本地包（tgz）用于端到端验证——**临时 `file:` 引用，发版后改回正式版本依赖**
- **状态：** complete

### 阶段 4：测试与验证
- [x] 单测（新增 usePicgoBridge 3 例；全量 74 文件 / 402 用例通过）
- [x] `vue-tsc --noEmit` 通过；`pnpm build` 通过（产物含上游修复 + 分流 + 新文案）
- [x] 宿主人工验证（作者）：语雀网页版 + 源码模式通过；提示条 `warning` 类型并已重建同步
- [ ] 其余清单项（无图发布 / PicGo 有图发布 / 「不使用」无提示）待作者确认
- **状态：** in_progress

### 阶段 5：交付
- [ ] 回复 issue #2050（按作者安排）
- **状态：** pending

## 上下游顺序（契约约束）
1. **上游先行**：zhi-siyuan-picgo 按 U1 修改 `uploadMarkdownImages` → 构建 → 本地 tgz 验证 → 发版（发版前向作者确认）
2. **本仓库随后**：升级依赖 + 插件侧改动（阶段 3）
- 契约依据：`picgo-publisher-integration-contract`「PicGo 库发版先于 Publisher 集成」
- 上游计划：`siyuan-plugin-picgo/.planning/2026-10-13-skip-uploader-validation-when-no-images/`

## 错误记录
（暂无）
