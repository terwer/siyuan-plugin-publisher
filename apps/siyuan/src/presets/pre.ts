import {
  AuthMode,
  DynamicConfig,
  PlatformType,
  SubPlatformType,
} from "@/models/dynamicConfig.ts"
import { PRE_COMTANTS } from "@/presets/PreConstants.ts"
import { svgIcons } from "@utils/svgIcons.ts"
// import { MockBrowser } from "@utils/MockBrowser.ts"

/**
 * 一些因为政策原因必须要特殊处理的平台
 */
export const extraPreCfg = {
  // 白名单（作用是以前限制了，但是后来可用的情况，以前就能用的和新平台不必加）
  cookieWhiteList: [
    SubPlatformType.Custom_Wechat.toString(),
    SubPlatformType.Custom_Zhihu.toString(),
  ],
  // UA白名单（有 UA 限制的必须加，而且是慎之又慎）
  uaWhiteList: [
    "https://*.qq.com/*",
    "https://*.bilibili.com/*",
    "https://*.xiaohongshu.com/*",
  ],
  // 黑名单
  cookieLimit: [
    // SubPlatformType.Custom_Wechat.toString()
    // SubPlatformType.Custom_Zhihu.toString(),
  ],
  cookieLimitTipsAuth: {
    // [SubPlatformType.Custom_Wechat.toString()]: "https://mp.weixin.qq.com",
    // [SubPlatformType.Custom_Zhihu.toString()]: "https://www.zhihu.com/people/terwer",
  },
  cookieLimitTipsImg: {
    // [SubPlatformType.Custom_Wechat.toString()]: "https://img1.terwer.space/api/public/202309051734289.png",
    // [SubPlatformType.Custom_Zhihu.toString()]: "https://img1.siyuan.wiki/api/vip/open/media/aHR0cHM6Ly9jZG4uc2EubmV0LzIwMjQvMTEvMjYvdFpmSWp6VjE2U3U4djRXLnBuZw==",
  },
  // 这里需要全路径匹配，没有使用默认的，只增加 UA
  headersMap: {
    // "https://www.xiaohongshu.com/login": {
    //   "User-Agent": MockBrowser.HEADERS.MACOS_CHROME["User-Agent"],
    //   Referer: "https://creator.xiaohongshu.com/publish/publish?from=menu",
    // },
  },
}

/**
 * 通用平台定义
 */
export const mainPre = (t: any) => {
  return [
    {
      type: PlatformType.Common,
      title: t("platform.group.common"),
      img: "./images/universal.webp",
      description: t("platform.group.common.desc"),
    },
    {
      type: PlatformType.Github,
      title: t("platform.group.github"),
      img: "./images/github.png",
      description: t("platform.group.github.desc"),
    },
    {
      type: PlatformType.Gitlab,
      title: t("platform.group.gitlab"),
      img: "./images/gitlab.jpg",
      description: t("platform.group.gitlab.desc"),
    },
    {
      type: PlatformType.Metaweblog,
      title: t("platform.group.metaweblog"),
      img: "./images/xmlrpc.png",
      description: t("platform.group.metaweblog.desc"),
    },
    {
      type: PlatformType.Wordpress,
      title: t("platform.group.wordpress"),
      img: "./images/wordpress-logo.svg",
      description: t("platform.group.wordpress.desc"),
    },
    {
      type: PlatformType.Custom,
      title: t("platform.group.custom"),
      img: "./images/http.png",
      description: t("platform.group.custom.desc"),
    },
  ]
}

/**
 * 子平台预定义
 */
export const pre = (t: any) => {
  const config = {
    commonCfg: <DynamicConfig[]>[
      {
        platformType: PlatformType.Common,
        subPlatformType: SubPlatformType.Common_Yuque,
        platformKey: "common_Yuque",
        platformName: t("platform.common.yuque"),
        platformIcon: svgIcons.iconIFYuque,
        authMode: AuthMode.API,
        isEnabled: false,
      },
      {
        platformType: PlatformType.Common,
        subPlatformType: SubPlatformType.Common_Notion,
        platformKey: "common_Notion",
        platformName: t("platform.common.notion"),
        platformIcon: svgIcons.iconIFNotion,
        authMode: AuthMode.API,
        isEnabled: false,
      },
      {
        platformType: PlatformType.Common,
        subPlatformType: SubPlatformType.Common_Halo,
        platformKey: "common_Halo",
        platformName: t("platform.common.halo"),
        platformIcon: svgIcons.iconIFHalo,
        authMode: AuthMode.API,
        isEnabled: false,
      },
      {
        platformType: PlatformType.Common,
        subPlatformType: SubPlatformType.Common_Telegraph,
        platformKey: "common_Telegraph",
        platformName: t("platform.common.telegraph"),
        platformIcon: svgIcons.iconTelegraph,
        authMode: AuthMode.API,
        isEnabled: false,
      },
    ],
    githubCfg: <DynamicConfig[]>[
      {
        platformType: PlatformType.Github,
        subPlatformType: SubPlatformType.Github_Hexo,
        platformKey: "github_Hexo",
        platformName: t("platform.github.hexo"),
        platformIcon: svgIcons.iconIFHexo,
        authMode: AuthMode.API,
        isEnabled: false,
      },
      {
        platformType: PlatformType.Github,
        subPlatformType: SubPlatformType.Github_Hugo,
        platformKey: "github_Hugo",
        platformName: t("platform.github.hugo"),
        platformIcon: svgIcons.iconIFHugo,
        authMode: AuthMode.API,
        isEnabled: false,
      },
      {
        platformType: PlatformType.Github,
        subPlatformType: SubPlatformType.Github_Jekyll,
        platformKey: "github_Jekyll",
        platformName: t("platform.github.jekyll"),
        platformIcon: svgIcons.iconIFJekyll,
        authMode: AuthMode.API,
        isEnabled: false,
      },
      {
        platformType: PlatformType.Github,
        subPlatformType: SubPlatformType.Github_Vuepress,
        platformKey: "github_Vuepress",
        platformName: t("platform.github.vuepress"),
        platformIcon: svgIcons.iconIFVuepress,
        authMode: AuthMode.API,
        isEnabled: false,
      },
      {
        platformType: PlatformType.Github,
        subPlatformType: SubPlatformType.Github_Vuepress2,
        platformKey: "github_Vuepress2",
        platformName: t("platform.github.vuepress2"),
        platformIcon: svgIcons.iconIFVuepress2,
        authMode: AuthMode.API,
        isEnabled: false,
      },
      {
        platformType: PlatformType.Github,
        subPlatformType: SubPlatformType.Github_Vitepress,
        platformKey: "github_Vitepress",
        platformName: t("platform.github.vitepress"),
        platformIcon: svgIcons.iconIFVue,
        authMode: AuthMode.API,
        isEnabled: false,
      },
    ],
    gitlabCfg: <DynamicConfig[]>[
      {
        platformType: PlatformType.Gitlab,
        subPlatformType: SubPlatformType.Gitlab_Hexo,
        platformKey: "gitlab_Gitlabhexo",
        platformName: t("platform.gitlab.hexo"),
        platformIcon: svgIcons.iconIFHexo,
        authMode: AuthMode.API,
        isEnabled: false,
      },
      {
        platformType: PlatformType.Gitlab,
        subPlatformType: SubPlatformType.Gitlab_Hugo,
        platformKey: "gitlab_Gitlabhugo",
        platformName: t("platform.gitlab.hugo"),
        platformIcon: svgIcons.iconIFHugo,
        authMode: AuthMode.API,
        isEnabled: false,
      },
      {
        platformType: PlatformType.Gitlab,
        subPlatformType: SubPlatformType.Gitlab_Jekyll,
        platformKey: "gitlab_Gitlabjekyll",
        platformName: t("platform.gitlab.jekyll"),
        platformIcon: svgIcons.iconIFJekyll,
        authMode: AuthMode.API,
        isEnabled: false,
      },
      {
        platformType: PlatformType.Gitlab,
        subPlatformType: SubPlatformType.Gitlab_Vuepress,
        platformKey: "gitlab_Gitlabvuepress",
        platformName: t("platform.gitlab.vuepress"),
        platformIcon: svgIcons.iconIFVuepress,
        authMode: AuthMode.API,
        isEnabled: false,
      },
      {
        platformType: PlatformType.Gitlab,
        subPlatformType: SubPlatformType.Gitlab_Vuepress2,
        platformKey: "gitlab_Gitlabvuepress2",
        platformName: t("platform.gitlab.vuepress2"),
        platformIcon: svgIcons.iconIFVuepress2,
        authMode: AuthMode.API,
        isEnabled: false,
      },
      {
        platformType: PlatformType.Gitlab,
        subPlatformType: SubPlatformType.Gitlab_Vitepress,
        platformKey: "gitlab_Gitlabvitepress",
        platformName: t("platform.gitlab.vitepress"),
        platformIcon: svgIcons.iconIFVue,
        authMode: AuthMode.API,
        isEnabled: false,
      },
    ],
    metaweblogCfg: <DynamicConfig[]>[
      {
        platformType: PlatformType.Metaweblog,
        subPlatformType: SubPlatformType.Metaweblog_Cnblogs,
        platformKey: "metaweblog_Cnblogs",
        platformName: t("platform.metaweblog.cnblogs"),
        platformIcon: svgIcons.iconIFCnblogs,
        authMode: AuthMode.API,
        isEnabled: false,
      },
      {
        platformType: PlatformType.Metaweblog,
        subPlatformType: SubPlatformType.Metaweblog_Typecho,
        platformKey: "metaweblog_Typecho",
        platformName: t("platform.metaweblog.typecho"),
        platformIcon: svgIcons.iconIFTypecho,
        authMode: AuthMode.API,
        isEnabled: false,
      },
      {
        platformType: PlatformType.Metaweblog,
        subPlatformType: SubPlatformType.Metaweblog_Jvue,
        platformKey: "metaweblog_Jvue",
        platformName: t("platform.metaweblog.jvue"),
        platformIcon: svgIcons.iconOTJVue,
        authMode: AuthMode.API,
        isEnabled: false,
      },
    ],
    wordpressCfg: <DynamicConfig[]>[
      {
        platformType: PlatformType.Wordpress,
        subPlatformType: SubPlatformType.Wordpress_Wordpress,
        platformKey: "wordpress_Wordpress",
        platformName: t("platform.wordpress.wordpress"),
        platformIcon: svgIcons.iconIFWordpress,
        authMode: AuthMode.API,
        isEnabled: false,
      },
      {
        platformType: PlatformType.Wordpress,
        subPlatformType: SubPlatformType.Wordpress_Wordpressdotcom,
        platformKey: "wordpress_Wordpressdotcom",
        platformName: t("platform.wordpress.wordpressdotcom"),
        platformIcon: svgIcons.iconOTWordpressdotcom,
        authMode: AuthMode.API,
        isEnabled: false,
      },
    ],
    customCfg: <DynamicConfig[]>[
      {
        platformType: PlatformType.Custom,
        subPlatformType: SubPlatformType.Custom_Zhihu,
        platformKey: "custom_Zhihu",
        platformName: t("platform.custom.zhihu"),
        platformIcon: svgIcons.iconIFZhihu,
        authMode: AuthMode.WEBSITE,
        authUrl: "https://www.zhihu.com/signin",
        domain: "zhihu.com",
        isEnabled: false,
      },
      {
        platformType: PlatformType.Custom,
        subPlatformType: SubPlatformType.Custom_CSDN,
        platformKey: "custom_Csdn",
        platformName: t("platform.custom.csdn"),
        platformIcon: svgIcons.iconIFCSDN,
        authMode: AuthMode.WEBSITE,
        authUrl: "https://passport.csdn.net/login",
        domain: "csdn.net",
        isEnabled: false,
      },
      {
        platformType: PlatformType.Custom,
        subPlatformType: SubPlatformType.Custom_Wechat,
        platformKey: "custom_Wechat",
        platformName: t("platform.custom.wechat"),
        platformIcon: svgIcons.iconIFWechat,
        authMode: AuthMode.WEBSITE,
        authUrl: "https://mp.weixin.qq.com/",
        domain: "qq.com",
        isEnabled: false,
      },
      {
        platformType: PlatformType.Custom,
        subPlatformType: SubPlatformType.Custom_Jianshu,
        platformKey: "custom_Jianshu",
        platformName: t("platform.custom.jianshu"),
        platformIcon: svgIcons.iconIFJianshu,
        authMode: AuthMode.WEBSITE,
        authUrl: "https://www.jianshu.com/sign_in",
        domain: "jianshu.com",
        isEnabled: false,
      },
      {
        platformType: PlatformType.Custom,
        subPlatformType: SubPlatformType.Custom_Juejin,
        platformKey: "custom_Juejin",
        platformName: t("platform.custom.juejin"),
        platformIcon: svgIcons.iconIFJuejin,
        authMode: AuthMode.WEBSITE,
        authUrl: "https://juejin.cn/login",
        domain: "juejin.cn",
        isEnabled: false,
      },
      {
        platformType: PlatformType.Custom,
        subPlatformType: SubPlatformType.Custom_Haloweb,
        platformKey: PRE_COMTANTS.PRE_CUSTOM_HALOWEB,
        platformName: t("platform.custom.haloweb"),
        platformIcon: svgIcons.iconIFHaloweb,
        authMode: AuthMode.WEBSITE,
        authUrl: "/login",
        domain: "",
        isEnabled: false,
      },
      {
        platformType: PlatformType.Custom,
        subPlatformType: SubPlatformType.Custom_Bilibili,
        platformKey: PRE_COMTANTS.PRE_CUSTOM_BILIBILI,
        platformName: t("platform.custom.bilibili"),
        platformIcon: svgIcons.iconIFBilibili,
        authMode: AuthMode.WEBSITE,
        authUrl: "https://passport.bilibili.com/login",
        domain: "bilibili.com",
        isEnabled: false,
      },
    ],
    systemCfg: <DynamicConfig[]>[
      {
        platformType: PlatformType.System,
        subPlatformType: SubPlatformType.System_Siyuan,
        platformKey: "system_Siyuan",
        platformName: t("platform.system.siyuan"),
        platformIcon: svgIcons.iconIFSiyuan,
        authMode: AuthMode.API,
        isEnabled: true,
        isSys: true,
      },
    ],
  }

  return config
}
