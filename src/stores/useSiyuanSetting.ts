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

import { SiyuanConfig } from "zhi-siyuan-api"
import { RemovableRef, StorageSerializers, useLocalStorage } from "@vueuse/core"
import { readonly } from "vue"
import { SiyuanDevice } from "zhi-device"
import { useSiyuanDevice } from "~/src/composables/useSiyuanDevice.ts"

/**
 * 思源笔记设置
 *
 * @author terwer
 * @version 1.8.0
 * @since 1.8.0
 */
const useSiyuanSetting = () => {
  const storageKey = "siyuan-cfg"
  const { isInSiyuanOrSiyuanNewWin } = useSiyuanDevice()

  /**
   * 获取思源笔记配置
   *
   * @author terwer
   * @since 0.6.0
   */
  const getSiyuanSetting = (): RemovableRef<SiyuanConfig> => {
    let baseUrl = "http://127.0.0.1:6806"
    let token = ""
    let middlewareUrl = "https://api.terwer.space/api/middleware"
    // PC客户端多个工作空间情况下，自动读取思源地址
    let origin: string
    if (isInSiyuanOrSiyuanNewWin()) {
      const win = SiyuanDevice.siyuanWindow()
      origin = win?.location.origin
    }

    const initialValue = new SiyuanConfig(origin ?? baseUrl, token)
    initialValue.middlewareUrl = middlewareUrl
    const siyuanConfig = useLocalStorage<SiyuanConfig>(storageKey, initialValue, {
      serializer: StorageSerializers.object,
    })

    // 更新apiUrl
    if (origin) {
      siyuanConfig.value.apiUrl = origin
    }
    return siyuanConfig
  }

  /**
   * 获取只读版本的思源笔记配置
   * 调用现有的 getSiyuanSetting 并转化为只读
   *
   * @author terwer
   * @since 0.6.0
   */
  const getReadOnlySiyuanSetting = () => {
    const siyuanConfigRef = getSiyuanSetting()
    const readOnlySiyuanConfigRef = readonly(siyuanConfigRef)
    return readOnlySiyuanConfigRef
  }

  return { getSiyuanSetting, getReadOnlySiyuanSetting }
}

export { useSiyuanSetting }
