/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { StrUtil } from "zhi-common"
import type { MediaObject } from "zhi-blog-api"

/**
 * 解析「当前平台」图床的图片落库路径
 *
 * 各平台的 `imageStorePath` 允许三种写法，GitHub 与 GitLab 两族必须行为一致：
 *
 * 1. `[docpath]/images` —— 图片就近放到**文章所在目录**下的 images 子目录。
 *    `[docpath]` 取文章的分类路径（`cate_slugs[0]`），拿不到时回落到 `fallbackDocPath`
 *    （平台预置的发布目录，如 `src/post`、`docs`）。Vitepress / Vuepress2 用这种写法。
 * 2. `./images`、`../images` —— 相对链接，保留相对前缀、不前置站点根斜杠。
 * 3. 其余（含空值）—— 相对仓库根的目录，空值回落到 `defaultPath`。
 *
 * 返回的 `imagePath` 用于提交到仓库，`absImgPath` 是带根斜杠的绝对路径形式。
 *
 * @param path 平台配置的 `imageStorePath`
 * @param mediaObject 待上传的媒体对象（需要 `post.cate_slugs` 来解析 `[docpath]`）
 * @param defaultPath `imageStorePath` 为空时的回落目录
 * @param fallbackDocPath 解析不出文章目录时，`[docpath]` 的回落值（通常取 `cfg.blogid`）
 */
export function resolvePlatformImagePath(
  path: string,
  mediaObject: MediaObject,
  defaultPath: string,
  fallbackDocPath: string
): { imagePath: string; absImgPath: string } {
  let imagePath: string
  let absImgPath: string

  if (path.startsWith("[docpath]")) {
    const post = mediaObject.post
    const docPath = post?.cate_slugs?.[0] ?? fallbackDocPath
    const savePath = StrUtil.pathJoin(docPath, path.replace("[docpath]", ""))
    imagePath = StrUtil.pathJoin(savePath, mediaObject.name)
  } else if (path.startsWith("./") || path.startsWith("../")) {
    // 相对链接路径：保留相对前缀并拼接文件名，不前置站点根斜杠（如 ./images/… 或 ../images/…）
    const relImgPath = StrUtil.pathJoin(path, mediaObject.name)
    return {
      imagePath: relImgPath,
      absImgPath: relImgPath,
    }
  } else {
    const savePath = StrUtil.isEmptyString(path) ? defaultPath : path
    imagePath = StrUtil.pathJoin(savePath, mediaObject.name)
  }

  // 处理相对路径
  if (imagePath.startsWith("/")) {
    imagePath = imagePath.substring(1)
  }
  absImgPath = StrUtil.pathJoin("/", imagePath)

  return {
    imagePath,
    absImgPath,
  }
}
