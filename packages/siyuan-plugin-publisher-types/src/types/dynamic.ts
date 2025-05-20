/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { AuthMode, PlatformType, SubPlatformType } from "./platform"

/**
 * 动态配置接口定义
 *
 * @interface IDynamicConfig
 */
export interface IDynamicConfig {
  /**
   * 平台插件路径，2.0.0+
   */
  pluginPath: string

  /**
   * 动态平台类型(通用类型)
   */
  platformType: PlatformType

  /**
   * 子平台类型(细分子类型)
   */
  subPlatformType: SubPlatformType

  /**
   * 平台Key
   */
  platformKey: string

  /**
   * 平台名称
   */
  platformName: string

  /**
   * 平台图标(svg代码)
   */
  platformIcon?: string

  /**
   * 是否启用
   */
  isEnabled: boolean

  /**
   * 是否授权
   */
  isAuth: boolean

  /**
   * 授权模式
   */
  authMode: AuthMode

  /**
   * 登录地址，网页授权需要
   */
  authUrl?: string

  /**
   * 取消登录地址，网页授权需要
   */
  logoutUrl?: string

  /**
   * 域名
   */
  domain?: string

  /**
   * cookie限制
   */
  cookieLimit?: boolean

  /**
   * 是否内置
   */
  isSys: boolean
}
