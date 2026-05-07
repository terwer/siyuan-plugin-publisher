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

import PublisherPlugin from "../index"
import { JsonUtil } from "zhi-common"
import { PublishPreferenceCfg } from "~/src/models/publishPreferenceCfg.ts"
import { Utils } from "~/src/utils/utils.ts"

/**
 * 偏好配置接口
 */
export type PreferenceConfig = Partial<PublishPreferenceCfg>

export const parsePreferenceStorageValue = (raw: unknown): PreferenceConfig => {
  if (typeof raw === "string") {
    return JsonUtil.safeParse<PreferenceConfig>(raw, {} as PreferenceConfig)
  }

  if (raw && typeof raw === "object") {
    return raw as PreferenceConfig
  }

  return {} as PreferenceConfig
}

export const normalizePreferenceConfig = (raw?: PreferenceConfig): PublishPreferenceCfg => {
  const normalized = Object.assign(new PublishPreferenceCfg(), raw ?? {})

  normalized.showDocQuickMenu = Utils.emptyBooleanOrDefault(raw?.showDocQuickMenu, true)
  normalized.showQuickMenu = Utils.emptyBooleanOrDefault(raw?.showQuickMenu, true)
  normalized.showSingleMenu = Utils.emptyBooleanOrDefault(raw?.showSingleMenu, true)
  normalized.showBatchMenu = Utils.emptyBooleanOrDefault(raw?.showBatchMenu, true)
  normalized.showAIMenu = Utils.emptyBooleanOrDefault(raw?.showAIMenu, true)
  normalized.showExtendMenu = Utils.emptyBooleanOrDefault(raw?.showExtendMenu, true)
  normalized.showArticleManageMenu = Utils.emptyBooleanOrDefault(raw?.showArticleManageMenu, true)
  normalized.ignoreBlockRef = Utils.emptyBooleanOrDefault(raw?.ignoreBlockRef, false)
  normalized.allowChangeSlug = Utils.emptyBooleanOrDefault(raw?.allowChangeSlug, false)
  normalized.useV2UI = Utils.emptyBooleanOrDefault(raw?.useV2UI, false)

  return normalized
}

/**
 * 配置管理类
 * 提供配置的加载、保存和删除功能
 */
export class PreferenceConfigManager {
  private static storageKey = "/data/storage/syp/publish-preference-cfg.json"
  private static cfgKey = "publish-preference-cfg"

  /**
   * 加载配置
   *
   * @param pluginInstance PublisherPlugin的实例
   * @returns 返回配置对象
   */
  public static async loadConfig(pluginInstance: PublisherPlugin): Promise<PublishPreferenceCfg> {
    const configStr = await pluginInstance.kernelApi.getFile(this.storageKey, "text")
    const config = JsonUtil.safeParse<any>(configStr, {} as any)
    if (!config || !config[this.cfgKey]) {
      return normalizePreferenceConfig()
    }

    return normalizePreferenceConfig(parsePreferenceStorageValue(config[this.cfgKey]))
  }

  /**
   * 保存配置
   *
   * @param pluginInstance PublisherPlugin的实例
   * @param cfg 配置对象
   */
  public static async saveConfig(pluginInstance: PublisherPlugin, cfg: PreferenceConfig): Promise<void> {
    const configStr = await pluginInstance.kernelApi.getFile(this.storageKey, "text")
    const config = JsonUtil.safeParse<any>(configStr, {} as any)
    config[this.cfgKey] = JSON.stringify(normalizePreferenceConfig(cfg))
    await pluginInstance.kernelApi.saveTextData(this.storageKey, JSON.stringify(config))
  }
}
