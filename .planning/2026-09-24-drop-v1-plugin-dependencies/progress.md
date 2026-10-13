# 清理 v1 时代残留：跨插件依赖 + 过时登录表述

## 一、跨插件依赖（v1 行为，v2 已不依赖）

v1 的「查看文章」依赖 `siyuan-blog`、「图床」依赖 `siyuan-plugin-picgo`，并且**按这两个插件是否安装来决定按钮是否显示**。
作者裁定：v2 不再依赖这两个插件，**两个行内按钮直接删除**（v2 的「查看文章」在快速发布卡片上已有，图床配置在「设置 → 图床设置」）。

删除清单：

| 文件 | 处理 |
| --- | --- |
| `src/utils/pluginUtils.ts` | **删除**（整个文件只有两个安装探测：`/data/plugins/siyuan-plugin-picgo/plugin.json`、`/data/plugins/siyuan-blog/plugin.json`） |
| `src/ui/composables/useArticleManageView.ts` | **删除**（去掉 view/picgo 后，其余批量/单平台发布函数已无任何消费者） |
| `src/ui/composables/useArticleManageView.spec.ts` | **删除**（6 例：4 例发布流 + 2 例跨插件 URL） |
| `src/ui/components/ArticleManage.vue` | 去掉 `enableView`/`enablePicgo` 绑定、`onMounted` 探测、`view`/`picgo` 分支与组合式函数引用 |
| `src/ui/components/bridge/common/ArticleManageList.vue` | 去掉两个按钮、两个 prop、两个图标导入 |
| `src/composables/useArticleManage.ts` | 动作联合类型去掉 `"view"` / `"picgo"` |
| `siyuan/i18n/{zh_CN,en_US}.json` | 删除 `articleManage.action.view` / `articleManage.action.picgo` |

## 二、过时的登录表述（已支持扫码，靠 host 白名单放开）

依据：`b3b8575a feat: wechat support scan login` 引入 `src/platforms/pre.ts` 的
`cookieWhiteList = [Custom_Wechat, Custom_Zhihu]`（同提交同时注释掉了 `cookieLimit` 里的对应项），
即**微信与知乎都已允许在插件内登录**，而文案仍停留在「只能复制 Cookie」。

| 文件 | 原文案 → 新文案 |
| --- | --- |
| `docs/guide/faq.md`（公众号） | 「微信公众号为什么不能直接登录 / 请自行访问…复制 Cookie」→「微信公众号怎么登录：点去登录 → 扫码 → **关窗** → 自动读取 Cookie」 |
| `docs/guide/faq.md`（知乎） | 「知乎已限制在 Electron 内登录，只能复制 Cookie」→ 说明现在可直接在插件内登录；仅旧版才需手动复制 |
| `docs/platforms/custom-zhihu.md` | 同上结论修正 |
| `src/helpConfigs/pages/platform-config/custom-wechat.ts` | tour 步骤从「先在浏览器登录」改为插件内标准授权流程（与固化规则一致） |
| `src/helpConfigs/pages/platform-config/common-halo.ts` | 「发布后点「查看」」→「点「查看文章」」（按钮实名，避免指向已删除的行内按钮） |

## 验证

| 项 | 结果 |
| --- | --- |
| `npx vitest run` | 73 文件 / **399 用例通过**（较上次 74/405 少 1 文件 6 例，即删除的 `useArticleManageView.spec.ts`） |
| `npx vue-tsc --noEmit` | 通过 |
| `pnpm build` | 通过（0 error），`dist/index.js` 12481218 B、`build/package.zip` 17792685 B 均为新产物 |
| 产物复查 | `dist/index.js` 中 `plugins/siyuan-blog`、`plugins/siyuan-plugin-picgo` 出现次数 **0** |
| 残留引用 | `enableView` / `enablePicgo` / `PluginUtils` / `useArticleManageView` / 两个 i18n 键 全仓 **0 命中** |

## 仍可继续（待作者决定）

多份平台帮助/文档里还有 **v1 口吻的「确认浏览器已登录 X」**（掘金、知乎、CSDN、哔哩哔哩、简书、Halo 网页版，
以及 `docs/platforms/custom-juejin.md` 等）。它们不构成「依赖其他插件」，但会让人误以为用外部浏览器登录就能被读到；
按 v2 实际流程应统一为「在插件内点『去登录』登录后重新读取 Cookie」。本次未改，等你确认口径。
