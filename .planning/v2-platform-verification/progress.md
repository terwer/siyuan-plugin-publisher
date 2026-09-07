# 进度日志：V2 全平台验证

## 会话：2026-09-07（Vuepress2 #11 验证 + 共用层修正）

### 本次执行
- #10 Vuepress 收尾：Del 在 sha 稳定后重试成功（提交 `225cc85`），六格 + help/tour 全绿，checklist 回写并推送 `944752b7`。
- #11 Vuepress2 全链路 ✅（Electron test 工作空间 / dist-v2 / 9222，目标 `terwer/vuepress2-blog` main，`src/post`）：
  - V2C：新建账号为动态实例 key `github_Vuepress2-ig1w6`（预置 key 已有空配置）→ 验证通过、运行中、`apiStatus=true`、发布目录自动拉取 `src/post`。
  - Pub `11b01c5` / Upd `0009677`(blob `1f76bf55`) / Del `9f20441` 首次即成功；查看 blob 200。
  - Img：资源就近契约实证——图片落 `src/post/images/`，正文 `./images/<名>`，raw 200。
  - 该平台转换器不读 `yamlLinkEnabled`（不写 permalink），表单「YAML永久链接」对 Vuepress2 无效果。
  - 仓库复核：368 篇真实文章、`src/.vuepress/config.ts`、就近图片均未被误删。
- 代码侧产物（本站新建）：`github-vuepress2.ts` help 配置、`docs/draft/platforms/github-vuepress2.md`、注册/移出 remaining-t1/纳入 verifiedConfigs、`vuepress2ImagePath.spec.ts`。
- **共用层缺陷两处（宿主引导复验时暴露，均已修）**：
  1. 引导锚点写错：`defaultPath` 锚点根本不存在（真实为 `knowledgeSpace`）；Token 型平台鉴权行锚点是 `token` 不是 `password`。影响 hexo/hugo/jekyll/quartz/vuepress/vuepress2 六个配置（前五个此前记录为「9 步全部可定位」，实际第 4/5 步高亮框为空）→ 全部改正 + 新增 `tourAnchors.spec.ts` 回归。
  2. `helpRegistry.hasConfig()` 只做精确匹配，而 `get()` 有预置平台回落 → 动态实例 key 账号面板误报「当前页面暂无专属帮助文档」→ `hasConfig()` 复用同一回落链 + `registry.spec.ts` 用例。
- 记录：`FieldGuide.vue` 组件已实现但全仓库未被引用，平台 `fields` tip 目前不渲染 → 本次只做事实记录，未擅自接线（27 测试绿、build:v2 通过）。

### Commit（英文 Conventional）
- `fix(help-configs)` 锚点与实例 key 回落修正 + `feat(vuepress2)` 平台产物 + checklist/progress 回写

## 会话：2026-09-07（Vuepress #10 验证）

### 本次执行
- 拉取远端：#9 Quartz 已全链路 ✅（远端 commit），#10 Vuepress 代码侧产物（help/docs/注册/verifiedConfigs）已随 `5393fbdb` 拉入；宿主六格未验，本次补验。
- 目标仓库确认：用户指明 `D:\...\myproject\terwer.github.io` 即 Vuepress1（Vdoing，`vuepress@1.9.5`）博客 → GitHub `terwer/terwer.github.io` **main 分支**、存储目录 `docs`（与 #8 Jekyll 的 gh-pages 分支同仓不同分支互不冲突）。
- #10 Vuepress 六格 + 帮助引导全链路 ✅（Electron test 工作空间 / dist-v2 / 9222）：
  - V2C：新增账号 `github_Vuepress`（terwer/terwer.github.io/main/docs/[filename].md，PAT，图床「当前平台」），「验证」通过，「配置已保存并验证通过」，账号「运行中」，blogid=docs 自动拉取。
  - Pub：`docs/掘金-V2-验证测试-更新.md`（frontmatter title/date/meta/tags/permalink `/post/nuggets-v2-verification-test---update-ztyowq.html`/author + `![cat](/images/cat-…jpg)`），提交 `7fe6740`。
  - Upd：改正文「发布验证完成。（已更新 Vuepress 内容）」→ 新提交 `2cac735` 真实变更。
  - Img：cat 图上传 `docs/.vuepress/public/images/`，引用绝对 `/images/<名>`（raw 200；站点域名当前部署 Jekyll，站点 `/images` 404 属部署口径）。
  - 查看：UI blob 预览 → 200。
  - Del：首次 422 sha 暂态（同 Quartz，非插件缺陷）→ sha 稳定重试成功，提交 `225cc85`，UI 回未发布。其他历史文件（Halo图片上传测试.md、photo-nested.png）保留未误删。
- SOP §3：宿主实测 HelpPanel（summary+完整文档+FAQ+引导按钮）+ TourGuide 9 步全部可定位 ✅。
- 清理：误建的 `vuepress-blog` 仓库已 DELETE（204）；test.md 残留 404 已清理。
- checklist #10 六格 ✅ + T1 小结 21；registry+image spec 24 测试绿、build:v2 通过。

### Commit（英文 Conventional）
- `feat(vuepress)` 记录 #10 宿主全链路验证 + checklist 回写（见本次提交）

## 会话：2026-09-07（Quartz 验证）

### 本次执行
- #9 Quartz 六格 + 帮助引导全链路 ✅（Electron test 工作空间 / dist-v2 / 9222）：
  - V2C：新增账号 `github_Quartz`（terwer/quartz-blog/main/content/[filename].md，PAT，图床「当前平台 推荐」），「验证」通过，「配置已保存并验证通过」，账号「运行中/已启用」，发布目录自动拉取 content。
  - Pub：`content/Halo图片上传测试.md`（frontmatter title/date/updated/permalink `/post/halo-image-upload-test-z9puw4.html`/enableToc/enableBackLinks + `![图](/assets/images/image-…png)`）。
  - Upd：点「更新」→ 新提交，内容真实变更（`updated:2026-09-07 10:18:30`）。
  - Img：图床「当前平台」cat 图上传 `assets/images/image-…png`，引用绝对 `/assets/images/<名>`。
  - 查看：blob 预览规则 `[user]/[repo]/blob/[branch]/[docpath]` 指向真实存在的仓库文件；站点 `/post/<postid>.html` 需站点部署（无自动构建，平台限制非 bug）。
  - Del：repo .md 移除（API 404），UI 回「未发布」。**首次删除报 GitHub 422 sha 不匹配**——`getPageSha`/`getPageData` 单独复现返回当前 sha（删除代码取当前 sha，非插件缺陷），为更新后 contents 接口 sha 暂态不一致，sha 稳定后重试成功。
- 图片路径定论：Quartz 来源目录 `content/`；图上传仓库根 `assets/images/`，文章引用绝对 `/assets/images/<名>`；能否在构建产物显示取决于站点对 `/assets` 的处理（同 Hugo 口径）。
- SOP §3 help/tour/doc ✅：`github-quartz.ts`（helpUrl+summary+fields+faq4+tour9）+ `github-quartz.md`（顶部 TODO 占位）+ 注册进 `/pages/index.ts` + 移出 remaining-t1 + 纳入 verifiedConfigs。宿主实测 HelpPanel（summary+「查看完整帮助文档」+FAQ）+ TourGuide 9 步全部可定位。
- checklist #9 行六格 ✅ + T1 小结更新为 20 + 修订记录；build:v2 通过、registry+quartz 测试 20 绿。

### Commit（英文 Conventional）
- `8b66eeb1` feat(quartz): Quartz help 配置 + 文档 + 图片路径 spec
- `d43b2c50` docs(checklist): Quartz 六格 ✅ + T1 小结 20

## 会话：2026-09-04（Hugo 验证 + 总进度锚点）

### 阶段 3：逐个平台宿主手验
- **状态：** in_progress
- **开始时间：** 2026-09-04

### 本次执行
- #7 Hugo 六格 + 帮助引导全链路 ✅（Electron test 工作空间 / dist-v2 / 9222）：
  - V2C：新增账号 `github_Hugo-z1y7ssd`（terwer/hugo-blog/main/content/post，PAT），「验证」通过，"配置已保存并验证通过"，账号「运行中/已启用」，发布目录自动拉取 content/post。
  - Pub：`content/post/halo-image-upload-test-1plnjn.md`（frontmatter + YAML 永久链接 + `/images/…png`），提交 `2ab9e55`。
  - Upd：新提交 `6016692`。
  - Img：图床「当前平台」cat 图上传 `static/images/image-…png`（提交 `03a554d`），引用绝对 `/images/…`。
  - 查看：blob 预览规则解析到真实存在的仓库文件。
  - Del：repo .md 移除（API 404），提交 `5b3c4fd`，UI 回「未发布」。
- 图片路径定论：Hugo 用绝对 `/images`（兄弟目录 + 去 static/ 前缀，无单一相对路径）；用户实测 `https://hugo.terwer.space/post/halo-image-upload-test-1plnjn.html` 图片可显示（构建产物可靠）；源码 blob 视图 `/images/…` 内联 404 为平台固有限制，非插件缺陷。
- checklist #7 行六格 ✅ + T1 小结更新为 18 + 修订记录。
- 建立总进度锚点 `.planning/v2-platform-verification/`（本计划）供换电脑恢复。

### 创建/修改的文件
- `.planning/v2-platform-verification/{task_plan,findings,progress}.md`（本锚点）
- `.planning/2026-09-04-hugo-v2-verification/{task_plan,progress,findings}.md`（Hugo 单站计划，已闭环）
- `openspec/.../platform-checklist.md`（#7 行 + 小结）
- 归档 `.planning/archive/2026-08-25-hexo-v2-verification/`

### Commit（英文 Conventional）
- `1769b4fb` feat(help): Hugo help 配置 + 文档 + 注册
- `1571ccd9` docs(checklist): Hugo 六格 ✅ + T1 小结 18
- `ef8f916a` docs(planning): 归档 hexo + 新增 Hugo 计划
- （归档/锚点本次尚未提交，见下方待提交）

## 测试结果
| 测试 | 输入 | 预期结果 | 实际结果 | 状态 |
|------|------|---------|---------|------|
| #7 Hugo V2C | terwer/hugo-blog/main/content/post + PAT | 验证通过 | "配置已保存并验证通过"，运行中/已启用，发布目录拉取 content/post | ✅ |
| #7 Hugo Pub | 快速发布「Halo 图片上传测试」 | repo 新增 .md | `content/post/halo-image-upload-test-1plnjn.md`（提交 2ab9e55） | ✅ |
| #7 Hugo Upd | 点「更新」 | 新提交 | 6016692 | ✅ |
| #7 Hugo Img | 图床「当前平台」 | 图传 static/images + /images 引用 | 图上传（03a554d），引用 /images；hugo.terwer.space 可显示 | ✅ |
| #7 Hugo 查看 | 「查看文章」 | blob 链接指向真实文件 | blob 规则正确，文件真实存在 | ✅ |
| #7 Hugo Del | 「删除」+确认 | repo .md 移除 | API 404，提交 5b3c4fd，UI 回未发布 | ✅ |

## 错误日志
| 时间戳 | 错误 | 尝试次数 | 解决方案 |
|--------|------|---------|---------|
| 2026-09-04 | 宿主 `window.siyuan.plugins` 为 null、`.syp-panel` 不存在 | 2 | 点顶栏「发布工具」图标才挂载 `.syp-panel`，改从该入口 |
| 2026-09-04 | Hugo blob 视图 `/images/…png` 404 | 1 | 确认为平台固有限制（构建产物可显示），用户确认非插件缺陷 |

## 五问重启检查
| 问题 | 答案 |
|------|------|
| 我在哪里？ | 阶段 3（逐个平台宿主手验），#11 Vuepress2 已完成；#1–#11、#21、#25、#27–#35 已全链路 ✅ |
| 我要去哪里？ | #12 Vitepress（`github_Vitepress`，`imageStorePath=[docpath]/images` 同 Vuepress2 就近族），然后 Astro → Gitlab 七站 |
| 目标是什么？ | 完成 T1 全部 35 平台 V2 验证（六格 + help/tour/doc），回写 checklist |
| 我学到了什么？ | 见 findings.md；引导锚点必须来自设置组件真实 `data-syp-tour`（`password/token/cookie` 三选一 + `knowledgeSpace`，无 `defaultPath`）；`hasConfig()` 与 `get()` 必须同一条解析链；Vuepress2/Vitepress/Astro 转换器不读 `yamlLinkEnabled` |
| 我做了什么？ | #11 Vuepress2 六格+help 全绿（含共用层锚点/回落修正 + 两组回归测试），checklist T1 小结 22 |

---
*每个阶段完成后或遇到错误时更新此文件*
