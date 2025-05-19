/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { AuthMode, DynamicConfig, PlatformType, SubPlatformType } from "@/models/dynamicConfig.ts"
import { svgIcons } from "@utils/svgIcons.ts"
import { PLATFORM_CONSTANTS } from "@/presets/platformConstants.ts"

/**
 * 平台特殊配置
 */
export const specialPlatformConfig = {
  // 白名单（作用是以前限制了，但是后来可用的情况，以前就能用的和新平台不必加）
  cookieWhiteList: [SubPlatformType.Custom_Wechat.toString(), SubPlatformType.Custom_Zhihu.toString()],
  // UA白名单（有 UA 限制的必须加，而且是慎之又慎）
  uaWhiteList: ["https://*.qq.com/*", "https://*.bilibili.com/*", "https://*.xiaohongshu.com/*"],
  // 黑名单
  cookieLimit: [],
  cookieLimitTipsAuth: {},
  cookieLimitTipsImg: {},
  headersMap: {},
}

/**
 * 平台分组定义
 */
export const platformGroups = (t: any) => {
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
 * 单个平台模板配置
 */
export const platformTemplates = (t: any) => {
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
        subPlatformType: SubPlatformType.Metaweblog_Metaweblog,
        platformKey: "metaweblog_Metaweblog",
        platformName: t("platform.metaweblog.metaweblog"),
        platformIcon: svgIcons.iconIFMetaweblog,
        authMode: AuthMode.API,
        isEnabled: false,
      },
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
      // {
      //   platformType: PlatformType.Custom,
      //   subPlatformType: SubPlatformType.Custom_Flowus,
      //   platformKey: "custom_Flowus",
      //   platformName: t("platform.custom.flowus"),
      //   platformIcon: svgIcons.iconIFFlowus,
      //   authMode: AuthMode.WEBSITE,
      //   authUrl: "https://flowus.cn/login",
      //   domain: "flowus.cn",
      //   isEnabled: false,
      // },
      {
        platformType: PlatformType.Custom,
        subPlatformType: SubPlatformType.Custom_Haloweb,
        platformKey: PLATFORM_CONSTANTS.PLATFORM_CUSTOM_HALOWEB,
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
        platformKey: PLATFORM_CONSTANTS.PLATFORM_CUSTOM_BILIBILI,
        platformName: t("platform.custom.bilibili"),
        platformIcon: svgIcons.iconIFBilibili,
        authMode: AuthMode.WEBSITE,
        authUrl: "https://passport.bilibili.com/login",
        domain: "bilibili.com",
        isEnabled: false,
      },
      // {
      //   platformType: PlatformType.Custom,
      //   subPlatformType: SubPlatformType.Custom_Xiaohongshu,
      //   platformKey: PLATFORM_CONSTANTS.PLATFORM_CUSTOM_XIAOHONGSHU,
      //   platformName: t("platform.custom.xiaohongshu"),
      //   platformIcon: svgIcons.iconIFXiaohongshu,
      //   authMode: AuthMode.WEBSITE,
      //   authUrl: "https://www.xiaohongshu.com/login",
      //   domain: "xiaohongshu.com",
      //   isEnabled: false,
      //   extraScript: `(function() { console.log("xiaohongshu适配成功") })();`,
      // },
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

export const findAllTemplates = (config: ReturnType<typeof platformTemplates>) => {
  return [
    ...config.commonCfg,
    ...config.githubCfg,
    ...config.gitlabCfg,
    ...config.metaweblogCfg,
    ...config.wordpressCfg,
    ...config.customCfg,
  ]
}

/**
 * 根据 platformKey 查找配置
 * @param key platformKey
 * @param config 配置对象
 * @returns 找到的配置项，如果未找到则返回 undefined
 */
export const findConfigByKey = (key: string, config: ReturnType<typeof platformTemplates>) => {
  const allConfigs = [
    ...config.commonCfg,
    ...config.githubCfg,
    ...config.gitlabCfg,
    ...config.metaweblogCfg,
    ...config.wordpressCfg,
    ...config.customCfg,
  ]
  return allConfigs.find((item) => item.platformKey === key) as DynamicConfig
}
