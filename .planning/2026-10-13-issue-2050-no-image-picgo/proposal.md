# 修复设计：issue #2050 + 源码模式图床分流

> 排查依据见 findings.md。设计与实施范围已与作者对齐，实施待开工。

## 问题全景（3 个缺陷）

| # | 缺陷 | 位置 | 表现 |
| --- | --- | --- | --- |
| 1 | 源码模式绕过图床服务分流，无条件走 PicGo 内核 | `SourceMode.vue:220` | 语雀网页版选「当前平台」（Bundled）仍报 smms 错；批量模式同样 |
| 2 | 无本地图片时内核仍前置校验 uploader 配置 | `zhi-siyuan-picgo` `uploadMarkdownImages` | PicGo 模式下无图片文章也报错；发布链路误报「图片上传存在 N 个错误」 |
| 3 | 源码模式容错缺失 | `SourceMode.vue:239` | 图床失败 → YAML/md 整体不渲染 |

缺陷 1 与 2 叠加造成 issue #2050 的完整现象。

---

## 修复设计

### P1（治缺陷 1）：源码模式不做任何图床预处理，显示原文

`SourceMode.initPage` 移除对 `handlePicgo` 的无条件调用，不再在打开源码模式时上传图片；发布时的图片处理仍由发布主流程 `baseExtendApi.handlePictures` 按 `picbedService` 分流执行（该分流逻辑正确，不动）。

| 场景 | SourceMode 行为 |
| --- | --- |
| `PicGo` | 不处理；显示原文 md；有图片时给出提示 |
| `Bundled` | 不处理；显示原文 md；有图片时给出提示 |
| `None` / 未设置 | 不处理；显示原文 md；不提示（无上传发生） |
| 批量模式（未传 cfg） | 不处理；显示原文 md；有图片时给出提示（按各平台配置在发布时处理） |

**提示规格**：
- 形式：`el-alert` warning，位置与现有 `top-yaml-tip` 一致（源码模式顶部）
- 触发条件：`kernelApi.getImageBlocksByID(pageId)` 非空（有图片才提示）
- 文案（i18n key：`yaml.image.tip`）：
  - zh：「此处为原始 Markdown；图片将在发布时上传并替换链接」
  - en：「The raw Markdown is shown here; images are uploaded and links replaced at publish time」

**「上传并预览替换后的内容」按钮（手动触发）**：
- `previewMode` 默认 `false`——不点不触发任何上传；点击后**按发布链路处理图片**（`previewImageProcess` → `handlePictures` 按 `picbedService` 分流：PicGo 内核 / 平台图床），显示替换后内容；再次点击恢复原文
- 纯显示层：预览内容（`previewMd`/`previewHtml`）不写入文档，保存/发布始终使用原文
- 覆盖视图：MD 正文 / YAML+MD / HTML（`LuteUtil.mdToHtml` 重渲染，与发布一致）
- 适用场景：**单平台**（PicGo / Bundled 均可预览）；批量分发无单平台上下文，不提供
- 图片上传失败不中断（与发布语义一致），收集后以提示呈现

### P2（治缺陷 2）：无本地图片短路——插件侧 + 上游

- **插件侧**：`usePicgoBridge.handlePicgo` 开头用 `kernelApi.getImageBlocksByID(pageId)` 判断——与内核判据一致（同一个 `SiyuanKernelApi` 类、同一 SQL）。
  - SQL 命中为空 ⇒ 必定无图片 ⇒ 安全短路：直接返回 md（不初始化内核、不校验配置、不报 smms 错）
  - SQL 命中的宽松情况（如代码块中的 `![`）仍走原逻辑，由内核内部二次过滤——不会漏处理
  - 此修复同时覆盖**发布链路**（`baseExtendApi.handlePictures` 的 PicGo 分支）：无图片文章不再误报「图片上传存在 N 个错误」
- **上游（根治）**：`zhi-siyuan-picgo` 采用 U1 方案——抽取 `parsePostLocalImages` 公共方法（复用 detect 逻辑），`uploadMarkdownImages` 先检测，无本地图片则跳过 uploader 校验，直接走底层「文章中没有图片」短路。
  - 上游计划：`siyuan-plugin-picgo/.planning/2026-10-13-skip-uploader-validation-when-no-images/`
- **顺序**（契约 `picgo-publisher-integration-contract` 要求「PicGo 库发版先于 Publisher 集成」）：
  1. 上游先改先发版（zhi-siyuan-picgo）
  2. 本插件升级依赖版本 + 插件侧改动

### P3（治缺陷 3）：容错

源码模式不再调用图床后，「图床错误阻断源码渲染」的路径自然消除；`initPage` 剩余步骤（YAML 适配器、`handlePostToHoHtml`）保持现有错误处理，无额外改动。

---

## 影响面 checklist（实施时逐项验证）

- [ ] 语雀网页版：源码模式不再报 smms；YAML/md 正常显示
- [ ] 支持 PicGo 的平台（如 Hexo）+ 无图片文章：源码模式无报错；发布结果无「图片上传存在 1 个错误」
- [ ] 支持 PicGo 的平台 + 有图片：源码模式显示原文 + 提示；发布时正常上传并替换
- [ ] Bundled 平台（语雀/掘金等）：源码模式显示原文 + 提示；发布时图片正常上传平台
- [ ] 批量分发源码模式：不报错、正常显示
- [ ] `None`：不处理、不提示
- [ ] 单测 / `vue-tsc` / `pnpm build`
