/*
 * Copyright (c) 2022-2023, Terwer . All rights reserved.
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

import { CommonblogApi } from "../commonblogApi"
import { appendStr } from "~/utils/strUtil"

/**
 * KMS的API
 *
 * http://localhost:9564/kms16_release/kms/multidoc/restservice/kmsMultidocDocHelp.jsp?name=%E6%96%87%E6%A1%A3%E7%9F%A5%E8%AF%86%E5%BA%93%E6%96%87%E6%A1%A3%E7%BB%B4%E6%8A%A4rest%E6%9C%8D%E5%8A%A1(%E6%96%B0)&s_css=default
 */
export class KmsApi extends CommonblogApi {
  private readonly baseUrl: string
  private readonly basicToken: string

  constructor(baseUrl: string, basicToken: string) {
    super()
    this.baseUrl = baseUrl
    this.basicToken = basicToken
  }

  /**
   * 新增文档
   */
  public async addDoc(title: string, content: string): Promise<string> {
    const url = "/addDoc"
    const formJson = [
      {
        key: "fdDocTemplateId",
        value: "181f20dcfc5744e90b0b8254499b4af0",
      },
      {
        key: "docSubject",
        value: title,
      },
      {
        key: "docContent",
        value: content,
      },
      {
        key: "fdDocCreator",
        value: "180f58069509ef61dd964994e4591dab",
      },
      {
        key: "authorType",
        value: "1",
      },
      {
        key: "docAuthor",
        value: "180f58069509ef61dd964994e4591dab",
      },
    ]

    const result = await this.kmsRequestForm(url, formJson)
    // 这里返回的是response.data
    // 下面是完整返回
    // response
    // {
    //     "code": "200",
    //     "success": "success",
    //     "data": {
    //         "docContent": "测试文档内容",
    //         "docCreateTime": "2022-08-20 17:15",
    //         "fdId": "182ba88e8d8f4e3ad36314943b189939",
    //         "docSubject": "测试文档标题",
    //         "docCreatorId": "180f58069509ef61dd964994e4591dab"
    //      },
    //     "msg": "操作成功！"
    // }
    return result.fdId
  }

  /**
   * 新增文档
   */
  public async updateDoc(fdId: string, title: string, content: string): Promise<boolean> {
    const url = "/updateDoc"
    const formJson = [
      {
        key: "fdId",
        value: fdId,
      },
      {
        key: "docSubject",
        value: title,
      },
      {
        key: "docContent",
        value: content,
      },
    ]

    await this.kmsRequestForm(url, formJson)
    // 这里返回的是response.data
    // 下面是完整返回
    // response
    // {
    //     "code": "200",
    //     "success": "success",
    //     "data": {
    //         "docContent": "测试文档内容",
    //         "docCreateTime": "2022-08-20 17:15",
    //         "fdId": "182ba88e8d8f4e3ad36314943b189939",
    //         "docSubject": "测试文档标题",
    //         "docCreatorId": "180f58069509ef61dd964994e4591dab"
    //      },
    //     "msg": "操作成功！"
    // }
    return true
  }

  /**
   * 删除文档
   * @param fdId 文档ID
   */
  public async delDoc(fdId: string): Promise<boolean> {
    const url = "/delDoc"
    const formJson = {
      fdId,
    }

    await this.kmsRequestJson(url, formJson)
    // 这里返回的是response.data
    // 下面是完整返回
    // response
    // {
    //     "code": "200",
    //     "success": "success",
    //     "data": [],
    //     "msg": "操作成功"
    // }
    return true
  }

  // ==========================================================================
  // ==========================================================================
  /**
   * 向KMS请求数据
   * @param url 请求地址，例如 "/addDoc"
   * @param formJson
   * @private
   */
  private async kmsRequestForm(url: string, formJson: any): Promise<any> {
    const apiUrl = this.baseUrl + url
    const fetchOps = {
      headers: {
        Authorization: `Basic ${this.basicToken}`,
      },
      method: "POST",
    }

    // const response = await fetch(apiUrl, fetchOps)
    // const resText = await response.text()
    // this.logger.debug("向KMS请求数据，resText=>", resText)

    const json = await this.doFormFetch(apiUrl, fetchOps, formJson)

    // 解析响应体并返回响应结果
    const statusCode = json.code
    const msg = json.msg

    if (statusCode !== 200) {
      if (statusCode === 401) {
        throw new Error(appendStr("因权限不足操作已被禁止：", msg))
      } else {
        throw new Error("请求错误")
      }
    }

    return json.data
  }

  /**
   * 使用JSON方式向KMS请求数据
   * @param url 请求地址，例如 "/delDoc"
   * @param formJson
   * @private
   */
  private async kmsRequestJson(url: string, formJson: any): Promise<any> {
    const apiUrl = this.baseUrl + url
    const fetchOps = {
      body: JSON.stringify(formJson),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${this.basicToken}`,
      },
      method: "POST",
    }

    // const response = await fetch(apiUrl, fetchOps)
    // const resText = await response.text()
    // this.logger.debug("向KMS请求数据，resText=>", resText)

    const json = await this.doFetch(apiUrl, fetchOps)

    // 解析响应体并返回响应结果
    const statusCode = json.code
    const msg = json.msg

    if (statusCode !== 200) {
      if (statusCode === 401) {
        throw new Error(appendStr("因权限不足操作已被禁止：", msg))
      } else {
        throw new Error("请求错误")
      }
    }

    return json.data
  }
}
