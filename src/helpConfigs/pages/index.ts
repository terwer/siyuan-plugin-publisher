/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { helpRegistry } from "~/src/helpConfigs/registry"

// 通用页面
import { quickPublishHelpConfig } from "./quick-publish"
import { platformSelectHelpConfig } from "./platform-select"
import { accountListHelpConfig } from "./account-list"
import { preferenceGeneralHelpConfig } from "./preference-general"
import { preferencePicbedHelpConfig } from "./preference-picbed"
import { preferenceAiHelpConfig } from "./preference-ai"
import { aiChatHelpConfig } from "./ai-chat"
import { aboutHelpConfig } from "./about"

// 平台配置
import { platformConfigDefaultHelpConfig } from "./platform-config/_default"
import { cnblogsHelpConfig } from "./platform-config/metaweblog-cnblogs"
import { wordpressHelpConfig } from "./platform-config/wordpress-wordpress"
import { yuqueHelpConfig } from "./platform-config/common-yuque"
import { haloHelpConfig } from "./platform-config/common-halo"
import { yuquewebHelpConfig } from "./platform-config/custom-yuqueweb"
import { halowebHelpConfig } from "./platform-config/custom-haloweb"
import { localSystemHelpConfig } from "./platform-config/fs-local-system"
import { zhihuHelpConfig } from "./platform-config/custom-zhihu"
import { csdnHelpConfig } from "./platform-config/custom-csdn"
import { jianshuHelpConfig } from "./platform-config/custom-jianshu"
import { juejinHelpConfig } from "./platform-config/custom-juejin"
import { remainingT1HelpConfigs } from "./platform-config/remaining-t1"

/**
 * 注册所有页面帮助配置
 *
 * 后续新增平台只需在 helpConfigs/pages/ 下添加配置文件并在此处 import + register。
 */
export function registerAllHelpConfigs(): void {
  // 通用页面
  helpRegistry.register(quickPublishHelpConfig)
  helpRegistry.register(platformSelectHelpConfig)
  helpRegistry.register(accountListHelpConfig)
  helpRegistry.register(preferenceGeneralHelpConfig)
  helpRegistry.register(preferencePicbedHelpConfig)
  helpRegistry.register(preferenceAiHelpConfig)
  helpRegistry.register(aiChatHelpConfig)
  helpRegistry.register(aboutHelpConfig)

  // 平台配置
  helpRegistry.register(platformConfigDefaultHelpConfig)
  helpRegistry.register(cnblogsHelpConfig)
  helpRegistry.register(wordpressHelpConfig)
  helpRegistry.register(yuqueHelpConfig)
  helpRegistry.register(haloHelpConfig)
  helpRegistry.register(yuquewebHelpConfig)
  helpRegistry.register(halowebHelpConfig)
  helpRegistry.register(localSystemHelpConfig)
  helpRegistry.register(zhihuHelpConfig)
  helpRegistry.register(csdnHelpConfig)
  helpRegistry.register(jianshuHelpConfig)
  helpRegistry.register(juejinHelpConfig)

  // 其余 T1 平台
  for (const cfg of remainingT1HelpConfigs) {
    helpRegistry.register(cfg)
  }
}

// 模块加载时立即注册
registerAllHelpConfigs()
