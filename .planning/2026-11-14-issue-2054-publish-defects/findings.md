# findings：issue #2054 各条根因

## A1 源码模式 YAML 读不到现存属性（#2026）
- 思源自定义属性名只允许小写字母、数字、连字符；`setBlockAttrs` 保存时按小写写入（内核 `setNodeAttrsData`）。
- 旧实现：`getDynYamlKey("github_Hexo-xxxx")` → `custom-github-Hexo-xxxx-yaml`（含大写），写入后存成小写，`getSingleBlockAttr` 用含大写的名字做 SQL 精确匹配 → 查不到 → 走「未保存过 YAML」分支重新生成默认值。
- 修复：key 统一小写；读取先取 `getBlockAttrs` 做大小写不敏感匹配，异常/未命中再回退单属性查询。

## A2 自定义预览规则不生效
- `hexoYamlConverterAdaptor` / `quartzYamlConverterAdaptor` 用 `cfg instanceof CommonGithubConfig` 判断平台。
- 发布链路的 cfg 来自设置反序列化（`usePublishConfig.getPublishCfg` → 普通对象），不是类实例 → 判断恒为 false → permalink 永远是硬编码 `/post/<slug>.html`。
- 默认规则展开后与兜底值相同，因此默认配置下无差异、改规则后静默无效。
- 修复：与 Jekyll 一致直接按配置读取；`yamlLinkCapability.spec` 覆盖的是实例路径，新增 `permalinkPlainConfig.spec` 覆盖普通对象路径。

## A3 更新时间不统一
- 已发布文章初始化时用 YAML 的 `updated` 覆盖 `post.dateUpdated`，发布时又原样写回 → 更新时间从首次发布起冻结。
- 修复：`assignInitAttrs` 取「文档更新时间 vs YAML updated」较晚者；`doInitSinglePage` 编辑流先取文档时间。`date`（发布日）不变。

## A4 「同步修改到思源笔记」无效（#1796）
- 按钮写回 `mergedPost.yaml`（初始化快照）；详细模式只改模型字段，`post.yaml` 不更新。
- 标签另有思源文档属性 `tags`，所以表现为「标签同步、时间不同步」。
- 修复：写回前按当前模型重算平台 YAML；源码模式仍以编辑框内容为准。

## B1 去除自动编号不生效
- 思源「标题块自动编号」在导出 Markdown 时把编号写进标题文本（`1.1 `、`一、` 等），插件此前只在文章标题上调用去编号。
- 额外问题：`HtmlUtil.removeTitleNumber` 只处理 `^\d+\.`，`1.1 标题` 会残留 `1 标题`。
- 修复：新增 `src/utils/titleNumber.ts`，标题与正文各级标题共用；跳过代码块，纯数字+空白限 1–2 位以免误伤年份标题。

## B3 桌面端插件设置入口出现移动端容器（本次未改）
- `siyuan/index.ts openSetting()` 调用 `pluginHost.show({ initialView: "settings" })`，未传 `anchorElement`。
- `pluginHost.openMenu` 无锚点时桌面端也执行 `menu.fullscreen("all")`：思源给菜单加全屏样式并显示标题条，空的 items 容器占满剩余高度，插件内容被顶到下方。
- 顶栏图标入口传了锚点 → 普通弹出菜单，正常。
- 修复方向：缓存顶栏按钮元素作为 settings 入口的锚点；需宿主截图比对，单独跟进。
