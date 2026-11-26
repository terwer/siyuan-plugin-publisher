/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

/**
 * Hugo 内容组织方式（Content Layout）
 *
 * Hugo 支持两种常见的内容组织方式：
 * - 单文件：`content/post/<slug>.md`，图片放在 `static/images/`，正文用站点绝对路径引用；
 * - 页面目录（Leaf Bundle）：`content/post/<slug>/index.md`，图片与 index.md 同目录，
 *   正文用相对文件名引用，由 Hugo 作为 page resource 发布到同一 URL 目录。
 *
 * 这里只做纯字符串/路径推导，不依赖 Vue、SiYuan 或网络，方便在适配器和单测中复用。
 * 路径统一按 POSIX 仓库路径处理（GitHub/GitLab 仓库路径均使用 `/`）。
 */
export type ContentLayout = "single" | "leaf-bundle"

export const CONTENT_LAYOUT_SINGLE: ContentLayout = "single"
export const CONTENT_LAYOUT_LEAF_BUNDLE: ContentLayout = "leaf-bundle"

const normalizeRepoPath = (value?: string): string =>
  (value ?? "")
    .replace(/\\/g, "/")
    .replace(/\/+/g, "/")
    .replace(/^\/+|\/+$/g, "")

/** 拼接仓库内 POSIX 路径，自动去掉首尾斜杠并合并重复斜杠 */
export const joinRepoPath = (...parts: Array<string | undefined>): string =>
  parts
    .map((part) => normalizeRepoPath(part))
    .filter((part) => part.length > 0)
    .join("/")

/** 去掉 Markdown 扩展名，得到文章文件名（不含目录） */
export const stripMarkdownExtension = (filename?: string): string =>
  (filename ?? "").replace(/\.(md|markdown)$/i, "")

/** 文章在仓库中的目录（不含文件名） */
export const dirnameRepoPath = (repoPath?: string): string => {
  const normalized = normalizeRepoPath(repoPath)
  const index = normalized.lastIndexOf("/")
  return index >= 0 ? normalized.slice(0, index) : ""
}

/** 文章在仓库中的文件名（不含目录） */
export const basenameRepoPath = (repoPath?: string): string => {
  const normalized = normalizeRepoPath(repoPath)
  const index = normalized.lastIndexOf("/")
  return index >= 0 ? normalized.slice(index + 1) : normalized
}

/** 是否为页面目录（Leaf Bundle）布局 */
export const isLeafBundleLayout = (cfg?: { contentLayout?: string } | null): boolean =>
  cfg?.contentLayout === CONTENT_LAYOUT_LEAF_BUNDLE

/** 当前 postid 是否指向页面目录里的 index.md */
export const isLeafBundlePostPath = (postid?: string): boolean =>
  /(^|\/)index\.(md|markdown)$/i.test(normalizeRepoPath(postid))

/**
 * 这篇文章本次是否应按页面目录布局处理。
 *
 * 新文章（无 postid）跟随平台配置；已发布文章按它**实际所在的文件形态**处理：
 * 旧的 `<slug>.md` 即使平台已切到 leaf-bundle，更新时仍走单文件，
 * 避免把图片写到 bundle 目录而正文仍指向旧的单文件路径。
 */
export const usesLeafBundleForPost = (
  cfg: { contentLayout?: string } | null | undefined,
  post: { postid?: string } | null | undefined
): boolean => isLeafBundleLayout(cfg) && (!post?.postid || isLeafBundlePostPath(post.postid))

/**
 * 解析文章实际使用的 md 文件名。
 *
 * `mdFilename` 由 `BaseExtendApi.handleFilename()` 按 `mdFilenameRule` 生成；
 * 没有规则时用 slug 兜底，保证“先上传图片、后提交 md”两次推导使用同一个目录名。
 */
export const resolvePostMdFilename = (post?: { mdFilename?: string; wp_slug?: string } | null): string =>
  post?.mdFilename || `${post?.wp_slug || "post"}.md`

/** 页面目录布局下，文章的完整仓库路径：`<savePath>/<stem>/index.md` */
export const resolveLeafBundlePostPath = (savePath: string | undefined, mdFilename: string | undefined): string =>
  joinRepoPath(savePath, stripMarkdownExtension(resolvePostMdFilename({ mdFilename })), "index.md")

/** 页面目录布局下，图片的完整仓库路径：`<savePath>/<stem>/<imageName>` */
export const resolveLeafBundleImagePath = (
  savePath: string | undefined,
  mdFilename: string | undefined,
  imageName: string
): string => joinRepoPath(savePath, stripMarkdownExtension(resolvePostMdFilename({ mdFilename })), imageName)

/**
 * 页面目录布局下，图片落库路径（优先使用文章已有 postid 的目录）。
 *
 * 更新已发布文章时，文章可能因为标题/文件规则变化导致 `mdFilename` 与仓库里
 * 已有的 bundle 目录名不一致；此时必须沿用 postid 指向的目录，否则图片会被写到
 * 新目录，原 `index.md` 反而变成断图。新建文章没有 postid，按 mdFilename 推导。
 */
export const resolveLeafBundleImagePathForPost = (
  post: { postid?: string; mdFilename?: string; cate_slugs?: string[] } | null | undefined,
  imageName: string,
  fallbackSavePath?: string
): string => {
  if (post?.postid && isLeafBundlePostPath(post.postid)) {
    return joinRepoPath(dirnameRepoPath(post.postid), imageName)
  }
  return resolveLeafBundleImagePath(
    post?.cate_slugs?.[0] ?? fallbackSavePath,
    resolvePostMdFilename(post),
    imageName
  )
}

/** 页面目录布局下，正文中使用的图片链接：与 index.md 同目录，直接写文件名 */
export const resolveLeafBundleImageLink = (imageName: string): string => imageName

/**
 * 从 postid 推导预览用的 slug。
 *
 * - `content/posts/my-post/index.md` → `my-post`
 * - `content/posts/my-post.md` → `my-post`
 *
 * 这样页面目录和单文件两种布局都能沿用现有的 `previewPostUrl` 模板（`[postid]`）。
 */
export const resolvePreviewSlug = (postid?: string): string => {
  const normalized = normalizeRepoPath(postid)
  if (isLeafBundlePostPath(normalized)) {
    return basenameRepoPath(dirnameRepoPath(normalized))
  }
  return stripMarkdownExtension(basenameRepoPath(normalized))
}

/**
 * 解析 Hugo 内容目录对应的站点 section。
 *
 * `defaultPath` 通常是仓库内的 `content/post`、`content/posts`；
 * Hugo 的站点 URL 不包含 `content/`，因此这里去掉该前缀。
 * 若用户填的是不含 `content/` 的目录，则按内容根目录的相对路径处理。
 */
export const resolveHugoSection = (cfg?: { defaultPath?: string; blogid?: string } | null): string => {
  let section = normalizeRepoPath(cfg?.defaultPath || cfg?.blogid || "")
  if (section === "content") {
    return ""
  }
  if (section.startsWith("content/")) {
    section = section.slice("content/".length)
  }
  return section
}

/**
 * 页面目录布局下，Front Matter `url` 的目录式地址。
 *
 * 例如 `defaultPath=content/posts`、`slug=my-post` → `/posts/my-post/`。
 * Hugo 页面目录的默认输出就是目录形式；这里显式写入可锁定地址，并确保
 * 页面内的相对图片链接解析到同一个 URL 目录。
 */
export const resolveHugoBundleUrl = (
  cfg: { defaultPath?: string; blogid?: string } | null | undefined,
  slug?: string
): string => {
  const path = joinRepoPath(resolveHugoSection(cfg), slug)
  return path.length > 0 ? `/${path}/` : "/"
}
