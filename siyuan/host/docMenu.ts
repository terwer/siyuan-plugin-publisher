/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2023-2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { ObjectUtil } from "zhi-common"
import PageUtils from "~/common/pageUtils.ts"
import { DYNAMIC_CONFIG_KEY } from "~/src/utils/constants.ts"
import { icons } from "../utils/svg.ts"
import { PluginHost } from "./pluginHost.ts"

/**
 * 文档块菜单的「快速发布」子菜单。
 *
 * 每个已启用平台一项，点击后在 面板内对该文档直接发布该平台
 * （保留原先「文档菜单一次点击即发布」的操作路径，不改成先进面板再点一次）。
 * 未授权的平台仍然列出但置灰，与改造前一致。
 */
export const buildDocQuickPublishMenus = (
  setting: any,
  pluginHost: PluginHost,
  pageId: string,
  anchorElement?: HTMLElement
) => {
  if (ObjectUtil.isEmptyObject(setting)) {
    return undefined
  }

  const totalCfg = (setting[DYNAMIC_CONFIG_KEY] as any)?.totalCfg as any[] | undefined
  if (!Array.isArray(totalCfg)) {
    return undefined
  }

  const submenus = totalCfg
    .filter((config) => config?.isEnabled === true)
    .map((config) => {
      let icon = `<span class="iconfont-icon">${config.platformIcon}</span>`
      // 平台图标里的 ./images 是相对插件目录的，菜单需要绝对地址
      if (/^<img/.test(config.platformIcon) && config.platformIcon.indexOf("./images") > -1) {
        icon = `<span class="img-icon">${config.platformIcon.replace(
          /\.\/images/g,
          `${window.location.origin}/plugins/siyuan-plugin-publisher/images`
        )}</span>`
      }

      return {
        iconHTML: icon,
        label: PageUtils.longPlatformName(config.platformName, 11),
        disabled: !config.isAuth,
        click: async () => {
          await pluginHost.show({
            anchorElement,
            initialView: "quick_publish",
            docId: pageId,
            autoPublishPlatformKey: config.platformKey,
          })
        },
      }
    })

  return submenus.length === 0 ? undefined : submenus
}

/** 文档块菜单的图标（与顶栏同源，避免重复定义） */
export const docMenuIcons = {
  quickPublish: icons.iconPlane,
  aiChat: icons.iconEye,
}
