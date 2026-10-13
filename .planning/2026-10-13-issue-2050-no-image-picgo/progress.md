# 会话进度：issue #2050 排查与规划

## 2026-10-13

### 排查

1. 读取 issue #2050 原文（`gh issue view`）
2. 调用链静态排查：`SourceMode.vue` → `handlePicgo` → `usePicgoBridge.ts` → `usePublisherPicgoManager.ts` → 内核 `zhi-siyuan-picgo@3.0.3` dist
3. 定位报错文案来源：`usePicgoBridge.ts:46`、`baseExtendApi.ts:503/508`
4. 确认内核 `uploadPostImagesToBed` 已有「文章中没有图片」短路；报错来自 headless 包装层的前置 uploader 校验
5. 确认发布流程（`baseExtendApi.handlePictures`）与源码模式（`SourceMode.initPage`）共用同一 `handlePicgo`
6. 作者提供语雀网页版实测：选「当前平台」仍报 smms 错 → 排查确认 SourceMode 无 `picbedService` 分流
7. 判据一致性验证：内核 minified `Zd` = `SiyuanKernelApi`（日志佐证）；插件侧 `useSiyuanApi` 同持有 → `kernelApi.getImageBlocksByID` 同判据可用
8. 检查批量模式（`BatchPublishIndex.vue:413` 未传 cfg）与 git 历史（分流机制 2024-03 引入，SourceMode 未跟进）

### 工作区未提交改动核对

对照 `.planning/2026-09-24-drop-v1-plugin-dependencies/progress.md`，全部吻合（v1 清理任务成果，已验证 399 用例通过），建议保留：

| 类别 | 文件 | 备注 |
| --- | --- | --- |
| 已暂存删除（3 文件） | `useArticleManageView.ts/.spec.ts`、`pluginUtils.ts` | v1 跨插件依赖清理 |
| 未暂存修改（9 文件） | `ArticleManage.vue`、`ArticleManageList.vue`、`useArticleManage.ts`、i18n ×2、help 配置 ×2、docs ×2 | 同上 + 登录表述修正 |
| 新文件 | `.mcp.json` | 会话启动时生成的 WebStorm MCP 配置，未入 gitignore，待作者决定 |
| 规划目录 | `.planning/2026-09-24-*`、`.planning/2026-10-13-*` | 任务规划文档 |

### 规划产出

- 本仓库：`proposal.md`（修复设计）、`findings.md`（排查证据）、`task_plan.md`（阶段）
- 上游：`siyuan-plugin-picgo/.planning/2026-10-13-skip-uploader-validation-when-no-images/`（U1 方案、发版流程、契约约束）
- 设计对齐：源码模式不做上传（含 PicGo）+ 有图片时统一文案提示；插件侧 + 上游都做；批量不预处理；上游 U1 方案；不建 OpenSpec change

### 实施（插件侧）

1. `usePicgoBridge.handlePicgo`：无图片短路（`kernelApi.getImageBlocksByID` 判空，不初始化内核、不校验配置）
2. `SourceMode.vue`：移除无条件 `handlePicgo` 调用；新增 `initImageNotice`（有图片且图床服务非「不使用」时提示）
3. i18n：新增 `yaml.image.tip`（中英；文案定稿「此处为原始 Markdown；图片将在发布时上传并替换链接」）
4. 新增 `usePicgoBridge.spec.ts`（3 例：无图片短路 / 无 md 时读思源 / 有图片走内核）

### 测试与验证结果

| 项 | 结果 |
| --- | --- |
| `npx vitest run` | **74 文件 / 402 用例通过**（此前 399 + 新增 3） |
| `npx vue-tsc --noEmit` | 通过 |
| `pnpm build` | 通过；产物含上游修复（`parsePostLocalImages`）、新文案、提示逻辑 |

### 上游联调

- 上游修改后构建 → 打包 tgz（`/tmp/picgo-headless-packs/zhi-siyuan-picgo-3.0.3.tgz`）→ 安装到 Publisher（package.json **临时 `file:` 引用**）
- `node_modules/zhi-siyuan-picgo` 确认含修复（`parsePostLocalImages` 3 处）
- Publisher 重新构建完成（dist / build/package.zip）
- 开发链接：`SiYuanWorkspace/test` → 本仓库 `dist`（人工验证在该工作区进行）

### 「上传并预览」按钮（作者追加需求，2026-10-13）

- 形态：`previewMode` 默认 `false`；点击按钮 → 上传图床 → 显示替换后内容（`true`）；再点 → 恢复原文（`false`）
- 三态：idle（原文 + 「上传并预览替换后的内容」）/ loading（「正在上传图片…」）/ preview（「当前显示为图片上传后的预览内容（仅预览，不写入文档）」+「恢复原文」）
- 覆盖视图：MD 正文 / YAML+MD / HTML（HTML 用 `LuteUtil.mdToHtml` 重渲染，与发布时一致）
- **硬边界（已明确落地）**：按钮仅当 `picbedService === PicGo` 且正文有图片时渲染；Bundled / 批量 / 不使用下不出现（上传依赖发布上下文）；代码注释已写明
- 数据安全：预览内容仅存于显示层字段（`previewMd`/`previewHtml`），不写 `yamlFormatObj`/`siyuanPost`——保存与发布永远使用原文
- 验证：`vue-tsc` 通过；全量 74 文件 / 402 用例通过；构建通过并同步 public

### 预览能力修正：扩展到 Bundled（2026-10-13，作者实测反馈）

- 作者在语雀（Bundled）下测试预览按钮未出现，指出应支持
- 复核代码：`YuquewebWebAdaptor.newMediaObject` 只依赖 Cookie + 文件（`/api/upload/attach`），**不依赖发布上下文**——此前「Bundled 无法预览」的结论有误
- 修正设计：预览统一改为**与发布同源的图片处理链路**
  - `baseExtendApi.previewImageProcess(doc, id, publishCfg)` → `handlePictures`（按 `picbedService` 分流：PicGo 内核 / 平台图床）
  - `baseWebApi` / `baseBlogApi` 增加转发（全部平台类继承链已确认覆盖）
  - `SourceMode.toggleImagePreview` 改调 `Adaptors.getAdaptor(...).previewImageProcess(...)`，不再直接调 `handlePicgo`
  - 按钮条件：**单平台 + 正文有图片**（PicGo / Bundled 均可）；批量分发不提供
- 验证：`vue-tsc` 通过；74 文件 / 402 用例通过；构建通过；已同步 public（`previewImageProcess` 3 处）

### 宿主人工验证（2026-10-13）

- 首轮不通过原因：作者在 `public` 工作区验证，而该工作区是 9 月 24 日的实体安装（旧 2.1.0），新构建只进了 `test` 开发链接
- 处理：rsync 新构建到 `public` 工作区插件目录（增量覆盖，未动其它文件），验证含上游修复与新文案
- 作者重载插件后重测：**语雀网页版 + 源码模式通过**（不再报 smms 错；提示条正常显示）
- 作者反馈：提示条 `info` → **`warning`** 类型；已改并重建、重新同步 public
- 其余清单项（无图发布 / PicGo 有图发布 / 「不使用」无提示）待确认

### 现状

- 阶段 3/4 完成（含提交与回归）；待作者推送 dev 发布 v2.2.0 并回复 issue

### 发布准备与提交（2026-10-13 下午，续）

- 提示条按作者反馈改 `warning` 类型并重建同步 public
- 上游发布：3.0.4（headless 修复）+ 3.0.5（集市清单规范，bazaar 官方校验全绿）——详见上游计划
- 依赖升级：`zhi-siyuan-picgo` `^3.0.5`；工具链最终组合 vite 8.3.4 / vitest 5.0.4 / undici 8.10.2 / vue-tsc 3.3.13（作者选定，回归全绿）
- 文档站补充四处：single-publish（源码模式与图片）/ picbed / faq / index
- README 中英更新（预览功能条目，不喧宾夺主）

**提交（dev，未推送）**：

| 提交 | 说明 |
|---|---|
| `536f80a3` | refactor：v1 跨插件依赖清理 |
| `99db1b81` | fix(#2050)：图床误报修复 |
| `b20cdd0f` | chore(deps)：工具链升级（amend 并入最终 lock） |
| `d1001283` | docs：文档站四处补充 |
| `c341aaa1` | feat：README 预览条目 → 触发 release-please 生成 **v2.2.0** |

- 回归验证（最终依赖组合）：402 用例 / vue-tsc / 构建 全绿
- 待办（作者）：推送 dev → release-please 发布 v2.2.0 → 回复 issue #2050

### 错误

（暂无）
