# Fork 发现：Hugo V2 验证

## 图片路径结构性差异（与 Hexo 本质不同）
- Hexo：文章 `source/_posts/x.md` 与图片 `source/images/` 同在 `source/` 下 → 相对 `../images/<名>` 源码/构建产物均成立。
- Hugo：文章 `content/post/x.md` 与图片 `static/images/` 是**兄弟目录**，且 Hugo 构建把 `static/` 内容**去掉 `static/` 前缀**复制到站点根 → 源码相对路径（`../../static/images/…`）与构建相对路径（`../images/…`）数学上不可能相等。
- 结论：Hugo 不存在单一相对路径同时满足源码 blob + 构建产物；采用绝对 `/images/<名>`（官方 static/ 契约）。

## 源码 blob 视图不内联（平台固有限制）
- 文章引用 `/images/<名>`（站点部署路径）；源码仓库 blob 视角 GitHub 把它解析为**仓库根 `images/`**（不存在，图片在 `static/images/`）→ blob 内联 404。
- 构建产物站点 `/images/<名>` 可靠显示（用户实测 `https://hugo.terwer.space/post/halo-image-upload-test-1plnjn.html` 可显示）。
- 判定：非插件缺陷；Img 通过标准 = 构建产物可显示。

## 验证证据
- 账号 `github_Hugo-z1y7ssd`；提交链：Pub `2ab9e55` / Img `03a554d` / Upd `6016692` / Del `5b3c4fd`。
- 文章 `content/post/halo-image-upload-test-1plnjn.md`（frontmatter + YAML 永久链接）；图片 `static/images/image-20250416184048-b30ozft.png`。
