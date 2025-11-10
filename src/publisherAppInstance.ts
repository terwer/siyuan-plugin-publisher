/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { createAppLogger } from "~/src/utils/appLogger.ts"
import { DeviceDetection, SiyuanDevice } from "zhi-device"
import { Deserializer, Serializer, SimpleXmlRpcClient, XmlrpcUtil } from "simple-xmlrpc"
import fetch from "cross-fetch"
import { create } from "xmlbuilder2"
import { appBase } from "~/src/utils/constants.ts"

/**
 * 应用实例
 */
export class PublisherAppInstance {
  public logger: any
  public deviceType: any

  public win: any
  public moduleBase: string

  public fetch: any
  public xmlbuilder2: any
  public simpleXmlrpc: any

  constructor() {
    this.logger = createAppLogger("app-instance")
    this.deviceType = DeviceDetection.getDevice()

    this.fetch = fetch
    this.xmlbuilder2 = {
      create,
    }
    this.simpleXmlrpc = {
      SimpleXmlRpcClient: SimpleXmlRpcClient,
      Serializer: Serializer,
      Deserializer: Deserializer,
      XmlrpcUtil: XmlrpcUtil,
    }

    this.win = SiyuanDevice.siyuanWindow()
    this.moduleBase = `${this.win?.siyuan?.config?.system?.workspaceDir}/data${appBase}`
  }
}
