# 本地系统配置指南

把文档导出为 Markdown 到本地文件系统，附带静态站点 Front Matter（YAML）。仅在桌面端（Electron）环境可用。

## 一、适用场景

- 把思源文档批量导出为 Markdown，供 Hexo / Hugo / Jekyll / VuePress / VitePress 等静态站点使用。
- 仅 Electron 桌面环境可用（需访问本机文件路径）。

## 二、配置

| 字段 | 填什么 |
|------|--------|
| 存储路径 | Markdown 写入位置，默认 `下载目录/syp`，可含 `[auto]`（发布时替换为文章分类名） |
| 媒体存储路径 | 图片、附件相对文章目录的保存位置，默认 `assets` |
| YAML 类型 | 默认 / Hexo / Hugo / Jekyll / Vuepress / Vuepress2 / Vitepress / Quartz / Astro；选具体框架时按该框架的 Front Matter 输出 |
| 内容组织方式 | 仅 Hugo YAML 类型：单文件（默认）/ 页面目录（Leaf Bundle）；后者写成 `<输出目录>/<目录名>/index.md` + 同目录图片 |
| 发布格式 | 默认 Markdown；目标流程要求 HTML 时才改 |
| 图床服务 | 默认「当前平台」：图片写入配置的媒体目录；也可选「PicGo 强烈推荐」用你配置的 PicGo；「不使用」跳过图片处理、按原图地址引用 |

## 三、Hugo 页面目录（Leaf Bundle）

把「YAML 类型」选为 Hugo 后，可在「内容组织方式」选择「页面目录（Leaf Bundle）」：

- 文章写入 `<输出目录>/<目录名>/index.md`（目录名优先取文件规则，没有规则时沿用原有标题命名）。
- 图片写入 `index.md` 同目录，正文使用相对文件名；不再使用「媒体存储路径 / assets」。
- 本地导出不写死 front matter `url`，由 Hugo 按实际导出路径生成，避免猜错站点 section。
- 更新沿用已有 `index.md` 所在目录；删除时清理 `index.md` 与同目录根级资源（子目录中的自定义资源保留）。
- 默认仍为单文件模式；切换只影响之后新发布的文章，已有文章不会自动搬迁或改造。

## 四、发布

快速发布 → 选本地系统 → 发布，文档会导出到配置的输出目录。

## 常见问题

- **为什么只有桌面环境可用**：需要访问本机文件路径，浏览器环境不可用。
- **图片存哪**：单文件模式默认在文章目录下的 `assets` 子目录；Hugo 页面目录模式在 `index.md` 同目录。实际路径随输出目录与 `[auto]` 的解析结果变化。
- **怎么导出 Hugo Leaf Bundle**：YAML 类型选 Hugo，内容组织方式选「页面目录（Leaf Bundle）」；文章写成 `<输出目录>/<目录名>/index.md`，图片同目录。
- **YAML 类型选哪个**：按后续消费 Markdown 的静态站点框架选；不确定就保持默认。
- **按分类分文件夹**：输出目录里写 `[auto]`，例如 `下载目录/syp/[auto]`，发布时替换成该文章的分类名。
