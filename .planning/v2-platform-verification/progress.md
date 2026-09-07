# 进度日志：V2 全平台验证

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
| 我在哪里？ | 阶段 3（逐个平台宿主手验），#9 Quartz 已完成；#1–#9、#21、#25、#27–#35 已全链路 ✅ |
| 我要去哪里？ | #10 Vuepress（自上而下），然后 Vuepress2/Vitepress/Astro/Gitlab 七站等 |
| 目标是什么？ | 完成 T1 全部 35 平台 V2 验证（六格 + help/tour/doc），回写 checklist |
| 我学到了什么？ | 见 findings.md（平台族共享基类、图片路径结构性差异、宿主交互）；Quartz 更新后 contents 接口 sha 暂态不一致 → 删除重试即恢复 |
| 我做了什么？ | 完成 #9 Quartz 六格+help，checklist 更新（T1 小结 20），build:v2 通过 |

---
*每个阶段完成后或遇到错误时更新此文件*
