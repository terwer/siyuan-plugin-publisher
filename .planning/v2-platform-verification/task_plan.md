# 任务计划：V2 全平台验证（T1 全链路）

## 目标
按 openspec/changes/v2-platform-verification-v1-retirement/platform-checklist.md（SSOT）自上而下完成 T1 全部 35 个平台的 V2 验证（每站六格 V2C/Pub/Upd/Del/Img/查看 + SOP §3 help/tour/doc），通过/失败实时回写 checklist；全部完成后再归档 OpenSpec change。

## 当前阶段
阶段 3（逐个平台宿主手验）**暂停中** —— 插入独立任务 `add-field-guide-tips`（字段级指引接线 + 已验证平台回填），见 `.planning/2026-09-07-add-field-guide-tips/`；该任务完成后回到本计划继续 #12。

## 大盘进度（换电脑先读这里）
- **T1 共 35 项。当前全链路 ✅ = 22，未测 = 13，进行中 0，阻塞 0。**
- 已全链路 ✅（六格 + 帮助引导）：#1–#11（语雀、Notion、Halo29、Telegraph、Confluence、Hexo、Hugo、Jekyll、Quartz、Vuepress、Vuepress2）、#21、#25、#27–#35。
- **未测（下一步自上而下）**：#12 Vitepress、#13 Astro、#14–#20 Gitlab 七站、#22 Typecho、#23 Jvue、#24 Metaweblog、#26 Wordpress.com。
- **#12 目标仓库已查实**：`terwer/siyuan-developer-docs`（VitePress 1.0.0-beta.1，根 `package.json` + `docs/` 含 `.vitepress`，与插件 `defaultPath="docs"` 对齐）；#13 可用 `terwer/astro-blog`（astro + `@astrojs/mdx`）。
- **验证点新增**：`add-field-guide-tips` 落地后，SOP §3 的「字段指引必须真实渲染」与五格、help/tour/doc 同等必过，后续每站一并核验。

## 各阶段

### 阶段 1：规划与平台族调研
- [x] 读 checklist SSOT，确认顺序与每站标准
- [x] 调研 Github/Gitlab/Metaweblog/Wordpress 平台族共享基类与差异
- **状态：** complete

### 阶段 2：Github 平台族首站 Hexo
- [x] #6 Hexo 六格 + 帮助引导 ✅；图片策略：相对 `../images`（content 与图片同在 `source/` 下）
- **状态：** complete
- （已归档 `.planning/archive/2026-08-25-hexo-v2-verification/`）

### 阶段 3：逐个平台宿主手验（当前在此）
- [x] #7 Hugo 六格 + 帮助引导 ✅；图片策略：绝对 `/images`（content 与 `static/` 兄弟目录，无单一相对路径满足双模式，经用户确认）
- [x] #8 Jekyll、#9 Quartz、#10 Vuepress、#11 Vuepress2 六格 + 帮助引导 ✅
- [ ] #12 Vitepress
- [ ] #13 Astro
- [ ] #14-20 Gitlab 七站
- [ ] #22 Typecho、#23 Jvue、#24 Metaweblog
- [ ] #26 Wordpress.com
- **状态：** in_progress

### 阶段 4：全部完成后的收尾
- [ ] 核对 checklist 35 行全绿/明确失败标注
- [ ] 检查「当前阻塞」段与 T1 小结
- [ ] 归档 OpenSpec change
- **状态：** pending

## 每站标准流程（从本计划快速恢复）
1. 读 checklist 该行 + 适配器代码（`src/adaptors/api/<platform>/`），确认图片/permalink/字段语义。
2. 建/改 help 配置 `src/helpConfigs/pages/platform-config/<platform>.ts`（helpUrl+summary+fields+faq+tour）→ 注册进 `/pages/index.ts` → 移出 `remaining-t1.ts` → 纳入 `verifiedConfigs`（registry.spec.ts）；写 `docs/draft/platforms/<platform>.md`。
3. `pnpm build:v2` + 相关单测通过。
4. 宿主（Electron，test 工作空间 / dist-v2 / 9222）六格手验 + HelpPanel/TourGuide。
5. checklist 该行回写 ✅/说明 + 修订记录 + T1 小结更新；英文 Conventional Commit。

## 关键问题
1. （未决）#24 Metaweblog 是否有真实测试账号可验。
2. （记录）Hugo 图片 `/images` 源码 blob 内联不显示为平台固有限制（已确认）。

## 已做决策
| 决策 | 理由 |
|------|------|
| 每站六格 + SOP §3 help/tour/doc 三件套，缺一算未过 | AGENTS.md 固化要求 |
| Hexo 图片用相对 `../images` | content 与图片同在 `source/`，源码+构建双模式均可显示（用户原则） |
| Hugo 图片用绝对 `/images` | content 与 `static/` 兄弟目录，构建去掉 `static/` 前缀，无单一相对路径；用户实测构建产物站点可显示，确认接受 |
| 验证/发布证据记录在 checklist SSOT，不另建冗余报告 | SSOT 唯一维护位置 |

## 遇到的错误
| 错误 | 尝试次数 | 解决方案 |
|------|---------|---------|
| Hugo blob 视图 `/images/…` 404（仓库根无 images/） | 1 | 确认为平台固有限制（构建产物可显示），经用户确认，非插件缺陷 |
| `window.siyuan.plugins` 为 null、`.syp-panel` 检索不到 | 2 | 插件 UI 需点顶栏「发布工具」图标才挂载 `.syp-panel`；改从顶栏入口打开，从 `.syp-panel` 内交互 |

## 备注
- 敏感凭据（GitHub PAT 等）只放 `tmp/` 或 `gh auth`，不入库、不写进此类文件。
- 宿主启动：`/Applications/SiYuan.app/Contents/MacOS/SiYuan --remote-debugging-port=9222 --workspace=/Volumes/workspace/mydocs/SiYuanWorkspace/test`；软链 `test/data/plugins/siyuan-plugin-publisher -> dist-v2`。
- 每个已完成的平台计划归档到 `.planning/archive/<date>-<platform>/`；本文件为总进度锚点，不归档。
