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

import { createRouter, createWebHashHistory, Router, RouteRecordRaw } from "vue-router"
import BatchPublish from "~/src/pages/BatchPublish.vue"
import SinglePublish from "~/src/pages/SinglePublish.vue"
import SinglePublishDoPublish from "~/src/components/publish/SinglePublishDoPublish.vue"
import Setting from "~/src/pages/Setting.vue"
import GeneralSetting from "~/src/components/set/GeneralSetting.vue"
import PublishSetting from "~/src/components/set/PublishSetting.vue"
import SettingEntry from "~/src/components/set/publish/singleplatform/SingleSettingIndex.vue"
import PlatformAddForm from "~/src/components/set/publish/PlatformAddForm.vue"
import PlatformUpdateForm from "~/src/components/set/publish/PlatformUpdateForm.vue"
import PlatformQuickAdd from "~/src/components/set/publish/PlatformQuickAdd.vue"
import QuickPublish from "~/src/workers/QuickPublish.vue"

const ApiTest = () => import("~/src/pages/ApiTest.vue")
const SiyuanTest = () => import("~/src/components/test/SiyuanTest.vue")
const CnblogsTest = () => import("~/src/components/test/CnblogsTest.vue")
const WordpressTest = () => import("~/src/components/test/WordpressTest.vue")
const TypechoTest = () => import("~/src/components/test/TypechoTest.vue")
const YuqueTest = () => import("~/src/components/test/YuqueTest.vue")
const ZhihuTest = () => import("~/src/components/test/ZhihuTest.vue")

const routes: RouteRecordRaw[] = [
  // 极速发布
  { path: "/workers/quickPublish/:key/:id", component: QuickPublish },
  // 常规发布
  // ?id=<id>
  { path: "/publish/singlePublish", component: SinglePublish },
  { path: "/publish/singlePublish/doPublish/:key/:id", component: SinglePublishDoPublish },
  // 批量分发
  // /?id=<id>
  { path: "/", component: BatchPublish },
  { path: "/publish/batchPublish", component: BatchPublish },

  {
    path: "/test",
    component: ApiTest,
    children: [
      { path: "", component: SiyuanTest },
      { path: "siyuan", component: SiyuanTest },
      { path: "cnblogs", component: CnblogsTest },
      { path: "wordpress", component: WordpressTest },
      { path: "typecho", component: TypechoTest },
      { path: "yuque", component: YuqueTest },
      { path: "zhihu", component: ZhihuTest },
    ],
  },

  {
    path: "/setting",
    component: Setting,
  },
  {
    path: "/setting/publish",
    component: PublishSetting,
  },
  {
    path: "/setting/platform/quickadd/:type",
    component: PlatformQuickAdd,
  },
  {
    path: "/setting/platform/add/:type",
    component: PlatformAddForm,
  },
  {
    path: "/setting/platform/update/:key",
    component: PlatformUpdateForm,
  },
  {
    name: "setting-platform-single",
    path: "/setting/platform/single/:key",
    component: SettingEntry,
  },
  // /?id=<id>
  {
    path: "/setting/general",
    component: GeneralSetting,
  },
]

export const useVueRouter = (): Router => {
  return createRouter({
    history: createWebHashHistory(),
    routes,
  })
}
