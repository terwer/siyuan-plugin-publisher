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

import { getSiyuanCfg } from "~/utils/platform/siyuan/siYuanConfig"
import { LogFactory } from "~/utils/logUtil"
import { appendStr } from "~/utils/strUtil"

/**
 * 思源API v2.5.0
 *
 * @author terwer
 * @date 2022-08-02 23:17
 *
 * https://github.com/siyuan-note/siyuan/blob/master/API_zh_CN.md#%E9%89%B4%E6%9D%83
 */
export class SiYuanApi {
  private readonly logger = LogFactory.getLogger("utils/platform/siyuan/siYuanApi.ts")

  /**
   * 分页获取根文档
   * @param keyword 关键字
   */
  public async getRootBlocksCount(keyword: string): Promise<number> {
    const stmt = `SELECT COUNT(DISTINCT b1.root_id) as count
        FROM blocks b1
        WHERE 1 = 1
        AND (b1.root_id ='${keyword}' OR (b1.content LIKE '%${keyword}%') OR (b1.tag LIKE '%${keyword}%')
    )`
    const data = await this.sql(stmt)
    this.logger.debug("getRootBlocksCount data=>", data[0].count)
    return data[0].count
  }

  /**
   * 分页获取根文档

   * ```sql
   * select DISTINCT b2.root_id,b2.parent_id,b2.content from blocks b2
   *        WHERE 1==1
   * AND b2.id IN (
   *     SELECT DISTINCT b1.root_id
   *        FROM blocks b1
   *        WHERE 1 = 1
   *        AND ((b1.content LIKE '%github%') OR (b1.tag LIKE '%github%'))
   *        ORDER BY b1.updated DESC,b1.created DESC LIMIT 0,10
   * )
   * ORDER BY b2.updated DESC,b2.created DESC
   * ```
   *
   * @param page 页码
   * @param pagesize 数目
   * @param keyword 可选，搜索关键字
   */
  public async getRootBlocks(page: number, pagesize: number, keyword: string): Promise<any> {
    const stmt = `select DISTINCT b2.root_id,b2.parent_id,b2.content from blocks b2 
        WHERE 1==1
        AND b2.id IN (
             SELECT DISTINCT b1.root_id
                FROM blocks b1
                WHERE 1 = 1
                AND (b1.root_id ='${keyword}' OR (b1.content LIKE '%${keyword}%') OR (b1.tag LIKE '%${keyword}%'))
                ORDER BY b1.updated DESC,b1.created DESC LIMIT ${page * pagesize},${pagesize}
        )
        ORDER BY b2.updated DESC,b2.created DESC`
    return await this.sql(stmt)
  }

  /**
   * 获取该文档下面的子文档个数
   *
   * ```sql
   * SELECT COUNT(DISTINCT b1.root_id) AS count
   * FROM blocks b1
   * WHERE b1.path LIKE '%/20220927094918-1d85uyp%';
   * ```
   *
   * @param docId 文档ID
   */
  public async getSubdocCount(docId: string): Promise<number> {
    const stmt = `SELECT COUNT(DISTINCT b1.root_id) AS count
        FROM blocks b1
        WHERE b1.root_id='${docId}' OR b1.path LIKE '%/${docId}%'`
    const data = await this.sql(stmt)
    return data[0].count
  }

  /**
   * 分页获取子文档
   *
   * ```sql
   * SELECT DISTINCT b2.root_id,b2.content,b2.path FROM blocks b2
   * WHERE b2.id IN (
   *   SELECT DISTINCT b1.root_id
   *      FROM blocks b1
   *      WHERE b1.path like '%/20220927094918-1d85uyp%'
   *      AND ((b1.content LIKE '%文档%') OR (b1.tag LIKE '%文档%'))
   *      ORDER BY b1.updated DESC,b1.created DESC LIMIT 0,10
   * )
   * ORDER BY b2.updated DESC,b2.created DESC
   * ```
   *
   * @param docId 文档ID
   * @param page 页码
   * @param pagesize 数目
   * @param keyword 关键字
   */
  public async getSubdocs(docId: string, page: number, pagesize: number, keyword: string): Promise<any> {
    const stmt = `SELECT DISTINCT b2.root_id,b2.content,b2.path FROM blocks b2
        WHERE b2.id IN (
          SELECT DISTINCT b1.root_id
             FROM blocks b1
             WHERE b1.root_id='${docId}' OR b1.path like '%/${docId}%'
             AND ((b1.content LIKE '%${keyword}%') OR (b1.tag LIKE '%${keyword}%'))
             ORDER BY b1.updated DESC,b1.created DESC LIMIT ${page * pagesize},${pagesize}
        )
        ORDER BY b2.content,b2.updated DESC,b2.created DESC,id`

    this.logger.debug("siyuanApi getSubdocs sql=>", stmt)
    return await this.sql(stmt)
  }

  /**
   * 获取Ankisiyuan标记信息
   *
   * ```sql
   * select b.id, b.content,ifnull(attr.name,'') as name, attr.value
   * from blocks b
   * left join attributes attr on attr.name = 'custom-ankilink' and attr.block_id = b.id
   * where b.root_id = '20220924223854-qygzxps'
   *   and b.type = 'h'
   * ```
   *
   * @param blockId 文档ID
   */
  public async getAnkilinkInfo(blockId: string): Promise<any> {
    const stmt = `select distinct b.id, b.content,ifnull(attr.name,'custom-ankilink') as name, attr.value
from blocks b
left join attributes attr on attr.name = 'custom-ankilink' and attr.block_id = b.id
where b.root_id = '${blockId}'
  and b.type = 'h'`

    this.logger.debug("siyuanApi getAnkilinkInfo sql=>", stmt)
    return await this.sql(stmt)
  }

  /**
   * 以id获取所有图片块
   * @param blockId 块ID
   */
  public async getImageBlocksByID(blockId: string): Promise<any[]> {
    const stmt = `select *
                from blocks
                where root_id = '${blockId}' and markdown like '%![%'`
    const data = await this.sql(stmt)
    if (!data) {
      throw new Error("通过ID查询图片块信息失败")
    }
    return data
  }

  /**
   * 以id获取思源块信息
   * @param blockId 块ID
   */
  public async getBlockByID(blockId: string): Promise<any> {
    const stmt = `select *
                from blocks
                where id = '${blockId}'`
    const data = await this.sql(stmt)
    if (!data || data.length === 0) {
      throw new Error("通过ID查询块信息失败")
    }
    return data[0]
  }

  /**
   * 以slug获取思源块信息
   * @param slug 内容快别名
   */
  public async getRootBlockBySlug(slug: string): Promise<any> {
    const stmt = `select root_id from attributes where name='custom-slug' and value='${slug}' limit 1`
    const data = await this.sql(stmt)
    return data[0]
  }

  /**
   * 以内容块ID获取根块
   *
   * @param blockID 内容块ID
   */
  public async getRootBlock(blockID: string): Promise<any> {
    const stmt = `select root_id from blocks where id='${blockID}' limit 1`
    const data = await this.sql(stmt)
    return data[0]
  }

  /**
   * 导出markdown文本
   * @param docId 文档id
   */
  public async exportMdContent(docId: string): Promise<any> {
    const data = {
      id: docId,
    }
    const url = "/api/export/exportMdContent"
    return await this.siyuanRequest(url, data)
  }

  /**
   * 获取块属性
   * @param blockId
   */
  public async getBlockAttrs(blockId: string): Promise<any> {
    const data = {
      id: blockId,
    }
    const url = "/api/attr/getBlockAttrs"
    return await this.siyuanRequest(url, data)
  }

  /**
   * 获取块属性
   * @param blockId
   */
  public async getRootBlockAttrs(blockId: string): Promise<any> {
    const data = {
      id: blockId,
    }
    const url = "/api/attr/getBlockAttrs"
    return await this.siyuanRequest(url, data)
  }

  /**
   * 设置块属性
   * @param blockId
   * @param attrs
   */
  public async setBlockAttrs(blockId: string, attrs: any): Promise<any> {
    const url = "/api/attr/setBlockAttrs"
    return await this.siyuanRequest(url, {
      id: blockId,
      attrs,
    })
  }

  /**
   * 以ID获取文档内容
   * @param id
   */
  public async getDoc(id: string): Promise<any> {
    const data = {
      id,
      k: "",
      mode: 2,
      size: 36,
    }
    const url = "/api/filetree/getDoc"
    return await this.siyuanRequest(url, data)
  }

  /**
   * 以sql发送请求
   * @param sql sql
   */
  public async sql(sql: string): Promise<any> {
    const sqldata = {
      stmt: sql,
    }
    const url = "/api/query/sql"
    this.logger.debug("sql=>", sql)
    return await this.siyuanRequest(url, sqldata)
  }

  /**
   * 向思源请求数据
   * @param url url
   * @param data 数据
   * @param method 请求方法 GET | POST
   * @param useToken 权限TOKEN
   */
  private async siyuanRequest(url: string, data: any, method?: string, useToken?: boolean): Promise<any> {
    const siyuanCfg = getSiyuanCfg()

    if (siyuanCfg.baseUrl !== "") {
      url = appendStr(siyuanCfg.baseUrl, url)
    }

    let m = "POST"
    if (method != null) {
      m = method
    }

    const fetchOps = {
      body: JSON.stringify(data),
      method: m,
    }
    if (useToken) {
      Object.assign(fetchOps, {
        headers: {
          Authorization: `Token ${siyuanCfg.token}`,
        },
      })
    }

    this.logger.debug("开始向思源请求数据，url=>", url)
    this.logger.debug("开始向思源请求数据，fetchOps=>", fetchOps)
    const response = await fetch(url, fetchOps)
    const resJson = await response.json()
    this.logger.debug("思源请求数据返回，resJson=>", resJson)

    if (resJson.code === -1) {
      throw new Error(resJson.msg)
    }
    return resJson.code === 0 ? resJson.data : null
  }
}
