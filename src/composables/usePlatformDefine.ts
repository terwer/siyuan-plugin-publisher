/*
 * Copyright (c) 2023, Terwer . All rights reserved.
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * This code is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License version 2 only, as
 * published by the Free Software Foundation.  Terwer designates this
 * particular file as subject to the "Classpath" exception as provided
 * by Terwer in the LICENSE file that accompanied this code.
 *
 * This code is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
 * version 2 for more details (a copy is included in the LICENSE file that
 * accompanied this code).
 *
 * You should have received a copy of the GNU General Public License version
 * 2 along with this work; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * Please contact Terwer, Shenzhen, Guangdong, China, youweics@163.com
 * or visit www.terwer.space if you need additional information or have any
 * questions.
 */

import { DynamicConfig, PlatformType } from "~/src/components/set/publish/platform/dynamicConfig.ts"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { pre } from "~/src/utils/import/pre.ts"

/**
 * 通用平台定义
 *
 * @returns {Object} - 包含平台类型列表、getPlatformType函数和getPrePlatform函数的对象。
 * @since 0.9.0
 */
export const usePlatformDefine = () => {
  const { t } = useVueI18n()

  const platformTypeList = [
    {
      type: PlatformType.Common,
      title: t("setting.platform.universal"),
      img: "./images/universal.webp",
      description: t("setting.platform.universal.desc"),
    },
    {
      type: PlatformType.Github,
      title: t("setting.platform.github"),
      img: "./images/github.png",
      description: t("setting.platform.github.desc"),
    },
    {
      type: PlatformType.Metaweblog,
      title: t("setting.platform.metaweblog"),
      img: "./images/xmlrpc.png",
      description: t("setting.platform.metaweblog.desc"),
    },
    {
      type: PlatformType.Wordpress,
      title: t("setting.platform.wordpress"),
      img: "./images/wordpress-logo.svg",
      description: t("setting.platform.wordpress.desc"),
    },
    {
      type: PlatformType.Custom,
      title: t("setting.platform.custom"),
      img: "./images/http.png",
      description: t("setting.platform.custom.desc"),
    },
  ]

  const prePlatformList: DynamicConfig[] = [
    ...pre.commonCfg,
    ...pre.githubCfg,
    ...pre.metaweblogCfg,
    ...pre.wordpressCfg,
    ...pre.customCfg
  ]

  /**
   * 根据键获取平台类型
   *
   * @param key - 平台类型的键
   */
  const getPlatformType = (key) => {
    return platformTypeList.find((platformType) => platformType.type === key)
  }

  /**
   * 根据类型获取预定义平台
   */
  const getPrePlatformList = (type: PlatformType): DynamicConfig[] => {
    return prePlatformList.filter((platform) => platform.platformType === type)
  }

  /**
   * 根据类型获取预定义平台
   */
  const getPrePlatform = (key: string): DynamicConfig => {
    return prePlatformList.find((platform) => platform.platformKey === key)
  }

  return {
    platformTypeList,
    getPlatformType,
    getPrePlatformList,
    getPrePlatform,
  }
}
