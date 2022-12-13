/*
 * Copyright (c) 2022, Terwer . All rights reserved.
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

import { reactive } from "vue"
import { SiyuanDataObj } from "~/utils/models/siyuanDataObj"
import { formatNumToZhDate } from "~/utils/dateUtil"
import { PostForm } from "~/utils/models/postForm"

/**
 * 发布时间组件
 */
export const usePublishTime = () => {
  const publishTimeData = reactive({
    created: "",
  })

  const publishTimeMethods = {
    getPublishTime: () => {
      return publishTimeData
    },

    initPublishTime: (siyuanData: SiyuanDataObj) => {
      publishTimeData.created = formatNumToZhDate(siyuanData.page.created)
    },

    /**
     * 同步FormData到属性
     * @param postForm
     */
    syncPublishTime: (postForm: PostForm) => {
      publishTimeData.created = postForm.formData.created
    },
  }

  return {
    publishTimeData,
    publishTimeMethods,
  }
}
