/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { RouteRecordRaw } from "vue-router"
import QuickPublish from "~/src/workers/QuickPublish.vue"
import SinglePublish from "~/src/pages/SinglePublish.vue"
import SinglePublishDoPublish from "~/src/components/publish/SinglePublishDoPublish.vue"
import BatchPublish from "~/src/pages/BatchPublish.vue"
import AiChat from "~/src/pages/AiChat.vue"
import Test from "~/src/pages/Test.vue"
import SiyuanTest from "~/src/components/test/SiyuanTest.vue"
import CnblogsTest from "~/src/components/test/CnblogsTest.vue"
import WordpressTest from "~/src/components/test/WordpressTest.vue"
import TypechoTest from "~/src/components/test/TypechoTest.vue"
import YuqueTest from "~/src/components/test/YuqueTest.vue"
import ZhihuTest from "~/src/components/test/ZhihuTest.vue"
import CsdnTest from "~/src/components/test/CsdnTest.vue"
import PicgoTest from "~/src/components/test/PicgoTest.vue"
import OtherTest from "~/src/components/test/OtherTest.vue"
import ChatgptTest from "~/src/components/test/ChatgptTest.vue"
import Setting from "~/src/pages/Setting.vue"
import PublishSetting from "~/src/components/set/PublishSetting.vue"
import PlatformQuickAdd from "~/src/components/set/publish/form/PlatformQuickAdd.vue"
import PlatformAddForm from "~/src/components/set/publish/form/PlatformAddForm.vue"
import PlatformUpdateForm from "~/src/components/set/publish/form/PlatformUpdateForm.vue"
import SettingEntry from "~/src/components/set/publish/singleplatform/SingleSettingIndex.vue"
import GeneralSetting from "~/src/components/set/GeneralSetting.vue"
import SiyuanSetting from "~/src/components/set/SiyuanSetting.vue"
import About from "~/src/pages/About.vue"
import Admin from "~/src/pages/Admin.vue"
import QuickPublishSelectPlatform from "~/src/components/publish/QuickPublishSelectPlatform.vue"

/**
 * 路由配置
 */
export const routeConfig: RouteRecordRaw[] = [
  // 极速发布
  { path: "/publish/quickSelect", component: QuickPublishSelectPlatform },
  { path: "/workers/quickPublish/:key/:id", component: QuickPublish },
  // 常规发布
  // ?id=<id>
  { path: "/publish/singlePublish", component: SinglePublish },
  { path: "/publish/singlePublish/doPublish/:key/:id", component: SinglePublishDoPublish },
  // 文章管理
  // /?id=<id>
  { path: "/", component: Admin },
  // 批量分发
  // /publish/batchPublish?id=<id>
  { path: "/publish/batchPublish", component: BatchPublish },

  // AI
  {
    path: "/ai/chat",
    component: AiChat,
  },

  // 测试
  {
    path: "/test",
    component: Test,
  },
  {
    path: "/test/siyuan",
    component: SiyuanTest,
  },
  {
    path: "/test/cnblogs",
    component: CnblogsTest,
  },
  {
    path: "/test/wordpress",
    component: WordpressTest,
  },
  {
    path: "/test/typecho",
    component: TypechoTest,
  },
  {
    path: "/test/yuque",
    component: YuqueTest,
  },
  {
    path: "/test/zhihu",
    component: ZhihuTest,
  },
  {
    path: "/test/csdn",
    component: CsdnTest,
  },
  {
    path: "/test/picgo",
    component: PicgoTest,
  },
  {
    path: "/test/other",
    component: OtherTest,
  },
  {
    path: "/test/chat",
    component: ChatgptTest,
  },

  // 设置
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
  {
    path: "/setting/siyuan",
    component: SiyuanSetting,
  },

  // 关于
  {
    path: "/about",
    component: About,
  },
]
