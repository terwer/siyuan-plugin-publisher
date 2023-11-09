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

/**
 * 配置管理类
 * 提供配置的加载、保存和删除功能
 */
export class PreferenceConfigManager {
  private static storageKey = "/data/storage/syp/publish-preference-cfg.json"
  private static cfgKey="publish-preference-cfg"

  /**
   * 加载配置
   *
   * @param pluginInstance PublisherPlugin的实例
   * @returns 返回配置对象
   */
  public static async loadConfig(pluginInstance: PublisherPlugin): Promise<any> {
    const configStr = await pluginInstance.kernelApi.getFile(this.storageKey, "text")
    const config= JsonUtil.safeParse<any>(configStr, {} as any)
    if(!config[this.cfgKey]){
      return {}
    }
    return JsonUtil.safeParse<any>(config[this.cfgKey],{} as any)
  }
}
