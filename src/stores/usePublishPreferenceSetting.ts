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

import { RemovableRef, StorageSerializers, useLocalStorage } from "@vueuse/core"
import { PublishPreferenceCfg } from "~/src/models/publishPreferenceCfg.ts"
import { readonly } from "vue"

/**
 * 使用发布偏好设置的自定义钩子
 */
const usePublishPreferenceSetting = () => {
  // 存储键
  const storageKey = "publish-preference-cfg"

  /**
   * 获取思源笔记配置
   *
   * @returns {RemovableRef<PublishPreferenceCfg>} 可移除引用的发布偏好设置
   * @author terwer
   * @since 0.6.0
   */
  const getPublishPreferenceSetting = (): RemovableRef<PublishPreferenceCfg> => {
    const initialValue = new PublishPreferenceCfg()
    const siyuanConfig = useLocalStorage<PublishPreferenceCfg>(storageKey, initialValue, {
      serializer: StorageSerializers.object,
    })
    return siyuanConfig
  }

  /**
   * 获取只读版本的思源笔记配置
   * 调用现有的 getPublishPreferenceSetting 并将其转化为只读引用
   *
   * @returns 只读引用的发布偏好设置
   * @author
   * @since 0.6.0
   */
  const getReadOnlyPublishPreferenceSetting = () => {
    const siyuanConfigRef = getPublishPreferenceSetting()
    const readOnlySiyuanConfigRef = readonly(siyuanConfigRef)
    return readOnlySiyuanConfigRef
  }

  return {
    getPublishPreferenceSetting,
    getReadOnlyPublishPreferenceSetting,
  }
}

export { usePublishPreferenceSetting }
