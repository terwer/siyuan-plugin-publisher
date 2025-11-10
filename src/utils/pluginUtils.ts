/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { isFileExists } from "~/src/utils/siyuanUtils.ts"
import { useSiyuanApi } from "~/src/composables/useSiyuanApi.ts"

/**
 * 插件工具类
 *
 * @since 1.20.0
 * @author Terwer
 */
export class PluginUtils {
  public static async preCheckPicgoPlugin() {
    const { kernelApi } = useSiyuanApi()
    // 检测是否安装 picgo 插件
    return await isFileExists(kernelApi, "/data/plugins/siyuan-plugin-picgo/plugin.json", "text")
  }

  public static async preCheckBlogPlugin() {
    const { kernelApi } = useSiyuanApi()
    return await isFileExists(kernelApi, "/data/plugins/siyuan-blog/plugin.json", "text")
  }
}
