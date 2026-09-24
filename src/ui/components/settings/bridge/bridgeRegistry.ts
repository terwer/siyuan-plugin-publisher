import type { Component } from "vue"
import ConfluenceSetting from "~/src/ui/components/bridge/set/publish/singleplatform/commonblog/ConfluenceSetting.vue"
import HaloSetting from "~/src/ui/components/bridge/set/publish/singleplatform/commonblog/HaloSetting.vue"
import NotionSetting from "~/src/ui/components/bridge/set/publish/singleplatform/commonblog/NotionSetting.vue"
import TelegraphSetting from "~/src/ui/components/bridge/set/publish/singleplatform/commonblog/TelegraphSetting.vue"
import YuqueSetting from "~/src/ui/components/bridge/set/publish/singleplatform/commonblog/YuqueSetting.vue"
import LocalSystemSetting from "~/src/ui/components/bridge/set/publish/singleplatform/fs/LocalSystemSetting.vue"
import BilibiliSetting from "~/src/ui/components/bridge/set/publish/singleplatform/web/BilibiliSetting.vue"
import CsdnSetting from "~/src/ui/components/bridge/set/publish/singleplatform/web/CsdnSetting.vue"
import HalowebSetting from "~/src/ui/components/bridge/set/publish/singleplatform/web/HalowebSetting.vue"
import JianshuSetting from "~/src/ui/components/bridge/set/publish/singleplatform/web/JianshuSetting.vue"
import JuejinSetting from "~/src/ui/components/bridge/set/publish/singleplatform/web/JuejinSetting.vue"
import WechatSetting from "~/src/ui/components/bridge/set/publish/singleplatform/web/WechatSetting.vue"
import YuquewebSetting from "~/src/ui/components/bridge/set/publish/singleplatform/web/YuquewebSetting.vue"
import ZhihuSetting from "~/src/ui/components/bridge/set/publish/singleplatform/web/ZhihuSetting.vue"
import AstroSetting from "~/src/ui/components/bridge/set/publish/singleplatform/github/AstroSetting.vue"
import HexoSetting from "~/src/ui/components/bridge/set/publish/singleplatform/github/HexoSetting.vue"
import HugoSetting from "~/src/ui/components/bridge/set/publish/singleplatform/github/HugoSetting.vue"
import JekyllSetting from "~/src/ui/components/bridge/set/publish/singleplatform/github/JekyllSetting.vue"
import QuartzSetting from "~/src/ui/components/bridge/set/publish/singleplatform/github/QuartzSetting.vue"
import VitepressSetting from "~/src/ui/components/bridge/set/publish/singleplatform/github/VitepressSetting.vue"
import Vuepress2Setting from "~/src/ui/components/bridge/set/publish/singleplatform/github/Vuepress2Setting.vue"
import VuepressSetting from "~/src/ui/components/bridge/set/publish/singleplatform/github/VuepressSetting.vue"
import GitlabastroSetting from "~/src/ui/components/bridge/set/publish/singleplatform/gitlab/GitlabastroSetting.vue"
import GitlabhexoSetting from "~/src/ui/components/bridge/set/publish/singleplatform/gitlab/GitlabhexoSetting.vue"
import GitlabhugoSetting from "~/src/ui/components/bridge/set/publish/singleplatform/gitlab/GitlabhugoSetting.vue"
import GitlabjekyllSetting from "~/src/ui/components/bridge/set/publish/singleplatform/gitlab/GitlabjekyllSetting.vue"
import GitlabvitepressSetting from "~/src/ui/components/bridge/set/publish/singleplatform/gitlab/GitlabvitepressSetting.vue"
import Gitlabvuepress2Setting from "~/src/ui/components/bridge/set/publish/singleplatform/gitlab/Gitlabvuepress2Setting.vue"
import GitlabvuepressSetting from "~/src/ui/components/bridge/set/publish/singleplatform/gitlab/GitlabvuepressSetting.vue"
import CnblogsSetting from "~/src/ui/components/bridge/set/publish/singleplatform/metaweblog/CnblogsSetting.vue"
import JvueSetting from "~/src/ui/components/bridge/set/publish/singleplatform/metaweblog/JvueSetting.vue"
import OthermetaSetting from "~/src/ui/components/bridge/set/publish/singleplatform/metaweblog/OthermetaSetting.vue"
import TypechoSetting from "~/src/ui/components/bridge/set/publish/singleplatform/metaweblog/TypechoSetting.vue"
import WordpressSetting from "~/src/ui/components/bridge/set/publish/singleplatform/metaweblog/WordpressSetting.vue"
import WordpressdotcomSetting from "~/src/ui/components/bridge/set/publish/singleplatform/metaweblog/WordpressdotcomSetting.vue"
import { SubPlatformType } from "~/src/platforms/dynamicConfig.ts"

const BRIDGE_COMPONENTS: Partial<Record<SubPlatformType, Component>> = {
  [SubPlatformType.Common_Yuque]: YuqueSetting,
  [SubPlatformType.Common_Notion]: NotionSetting,
  [SubPlatformType.Common_Halo]: HaloSetting,
  [SubPlatformType.Common_Telegraph]: TelegraphSetting,
  [SubPlatformType.Common_Confluence]: ConfluenceSetting,

  [SubPlatformType.Github_Hexo]: HexoSetting,
  [SubPlatformType.Github_Hugo]: HugoSetting,
  [SubPlatformType.Github_Jekyll]: JekyllSetting,
  [SubPlatformType.Github_Quartz]: QuartzSetting,
  [SubPlatformType.Github_Vuepress]: VuepressSetting,
  [SubPlatformType.Github_Vuepress2]: Vuepress2Setting,
  [SubPlatformType.Github_Vitepress]: VitepressSetting,
  [SubPlatformType.Github_Astro]: AstroSetting,

  [SubPlatformType.Gitlab_Hexo]: GitlabhexoSetting,
  [SubPlatformType.Gitlab_Hugo]: GitlabhugoSetting,
  [SubPlatformType.Gitlab_Jekyll]: GitlabjekyllSetting,
  [SubPlatformType.Gitlab_Vuepress]: GitlabvuepressSetting,
  [SubPlatformType.Gitlab_Vuepress2]: Gitlabvuepress2Setting,
  [SubPlatformType.Gitlab_Vitepress]: GitlabvitepressSetting,
  [SubPlatformType.Gitlab_Astro]: GitlabastroSetting,

  [SubPlatformType.Metaweblog_Metaweblog]: OthermetaSetting,
  [SubPlatformType.Metaweblog_Cnblogs]: CnblogsSetting,
  [SubPlatformType.Metaweblog_Typecho]: TypechoSetting,
  [SubPlatformType.Metaweblog_Jvue]: JvueSetting,

  [SubPlatformType.Wordpress_Wordpress]: WordpressSetting,
  [SubPlatformType.Wordpress_Wordpressdotcom]: WordpressdotcomSetting,

  [SubPlatformType.Custom_Zhihu]: ZhihuSetting,
  [SubPlatformType.Custom_CSDN]: CsdnSetting,
  [SubPlatformType.Custom_Wechat]: WechatSetting,
  [SubPlatformType.Custom_Jianshu]: JianshuSetting,
  [SubPlatformType.Custom_Juejin]: JuejinSetting,
  [SubPlatformType.Custom_Haloweb]: HalowebSetting,
  [SubPlatformType.Custom_Yuqueweb]: YuquewebSetting,
  [SubPlatformType.Custom_Bilibili]: BilibiliSetting,
}

export const SUPPORTED_BRIDGE_SUBTYPES = new Set<SubPlatformType>([
  ...Object.keys(BRIDGE_COMPONENTS),
  SubPlatformType.Fs_LocalSystem,
] as SubPlatformType[])

export const getBridgeComponent = (subtype: SubPlatformType | "" | undefined, options?: { electron?: boolean }) => {
  if (!subtype) {
    return null
  }

  if (subtype === SubPlatformType.Fs_LocalSystem) {
    return options?.electron ? LocalSystemSetting : null
  }

  return BRIDGE_COMPONENTS[subtype] ?? null
}
