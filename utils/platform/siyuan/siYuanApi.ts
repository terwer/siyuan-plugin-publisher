/*
 * Copyright (c) 2022, Terwer . All rights reserved.
 *  DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 *  This code is free software; you can redistribute it and/or modify it
 *  under the terms of the GNU General Public License version 2 only, as
 *  published by the Free Software Foundation.  Terwer designates this
 *  particular file as subject to the "Classpath" exception as provided
 *  by Terwer in the LICENSE file that accompanied this code.
 *
 *  This code is distributed in the hope that it will be useful, but WITHOUT
 *  ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 *  FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
 *  version 2 for more details (a copy is included in the LICENSE file that
 *  accompanied this code).
 *
 *  You should have received a copy of the GNU General Public License version
 *  2 along with this work; if not, write to the Free Software Foundation,
 *  Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 *  Please contact Terwer, Shenzhen, Guangdong, 518000 China
 *  or visit www.terwer.space if you need additional information or have any
 *  questions.
 */

/* eslint-disable @typescript-eslint/explicit-function-return-type,@typescript-eslint/no-use-before-define */
import { getSiyuanCfg } from "./siYuanConfig"
import logUtil from "../../logUtil"

/**
 * 思源API v2.5.0
 *
 * @author terwer
 * @date 2022-08-02 23:17
 *
 * https://github.com/siyuan-note/siyuan/blob/master/API_zh_CN.md#%E9%89%B4%E6%9D%83
 */
export {
  lsNotebooks,
  openNotebook,
  closeNotebook,
  renameNotebook,
  createNotebook,
  removeNotebook,
  getNotebookConf,
  setNotebookConf,
  createDocWithMd,
  renameDoc,
  removeDoc,
  moveDoc,
  getHPathByPath,
  getHPathByID,

  // upload, // /api/asset/upload
  // insertBlock, // /api/block/insertBlock
  // 插入块 as insertBlock,
  // 插入前置子块 as prependBlock,
  // 插入后置子块 as appendBlock,
  // 更新块 as updateBlock,
  // 删除块 as deleteBlock,

  // getBlockKramdown, // /api/block/getBlockKramdown
  getBlockAttrs,
  setBlockAttrs,

  // 渲染模板 as render,
  // getFile, /api/file/getFile
  // putFile, /api/file/putFile
  exportMdContent,

  // pushMsg, /api/notification/pushMsg
  // pushErrMsg, /api/notification/pushErrMsg

  // bootProgress, /api/system/bootProgress
  // version, /api/system/version
  // currentTime, /api/system/currentTime

  // 以关键词搜索文档 as searchDocs,
  getRootBlocks,
  getRootBlocksCount,
  getBlockByID,
  getBlockBySlug,

  // 获取子文档数目
  getSubdocCount,
  // 获取子文档
  getSubdocs,

  // --------------
  // 下面的api未经验证
  // -------------
  // 获取思源块链接锚文本 as getAnchor,
  //
  //
  getDoc,
  // 以id获取文档聚焦内容 as getFocusedDoc,
  //

  // 列出指定路径下文档 as listDocsByPath,
  // 以id获取反向链接 as getBacklink,
  // 以sql获取嵌入块内容 as searchEmbedBlock,
  // 获取标签列表 as getTag,
  //
  // 以id获取局部图谱 as getLocalGraph,
  // 获取全局图谱 as getGraph,
  //
  // 以关键词搜索块 as searchBlock,
  // 以关键词搜索模板 as searchTemplate,
}

/**
 * 向思源请求数据
 * @param url url
 * @param data 数据
 * @param method 请求方法 GET | POST
 * @param useToken 权限TOKEN
 */
async function request(
  url: string,
  data: any,
  method?: string,
  useToken?: boolean
) {
  let resData = null
  const siyuanCfg = getSiyuanCfg()

  if (siyuanCfg.baseUrl !== "") {
    url = siyuanCfg.baseUrl + url
  }

  let m = "POST"
  if (method != null) {
    m = method
  }

  const fetchOps = {
    body: JSON.stringify(data),
    method: m,
  }
  if (useToken !== false) {
    Object.assign(fetchOps, {
      headers: {
        Authorization: `Token ${siyuanCfg.token}`,
      },
    })
  }

  logUtil.logInfo("开始向思源请求数据，url=>", url)
  logUtil.logInfo("开始向思源请求数据，fetchOps=>", fetchOps)
  await fetch(url, fetchOps).then(function (response) {
    resData = response.json()
    logUtil.logInfo("向思源请求数据完成，resData=>", resData)
  })
  logUtil.logInfo("思源请求数据返回，resData=>", resData)
  return resData
}

/**
 * 解析响应体
 * @param response 响应结果
 */
async function parseBody(response: any) {
  const r = await response
  if (r.code === -1) {
    throw new Error(r.msg)
  }
  return r.code === 0 ? r.data : null
}

/**
 * 以sql发送请求
 * @param sql sql
 */
async function sql(sql: string) {
  const sqldata = {
    stmt: sql,
  }
  const url = "/api/query/sql"
  return await parseBody(request(url, sqldata))
}

/**
 * 显示笔记本列表
 */
async function lsNotebooks() {
  const data = {}
  const url = "/api/notebook/lsNotebooks"
  return await parseBody(request(url, data))
}

/**
 * 打开笔记本
 * @param notebookid
 */
async function openNotebook(notebookid: string) {
  const data = {
    notebook: notebookid,
  }
  const url = "/api/notebook/openNotebook"
  return await parseBody(request(url, data))
  // 返回空数据
}

/**
 * 关闭笔记本
 * @param notebookid 笔记本id
 */
async function closeNotebook(notebookid: string) {
  const data = {
    notebook: notebookid,
  }
  const url = "/api/notebook/closeNotebook"
  return await parseBody(request(url, data))
  // 返回空数据
}

/**
 * 重命名思源笔记本
 * @param 笔记本id
 * @param 笔记本的新名称
 */
async function renameNotebook(notebookid: string, notebookName: string) {
  const data = {
    notebook: notebookid,
    name: notebookName,
  }
  const url = "/api/notebook/renameNotebook"
  return await parseBody(request(url, data, "POST", true))
  // 返回空数据
}

/**
 * 新建笔记本
 * @param 笔记本名称
 */
async function createNotebook(notebookName: string) {
  const data = {
    name: notebookName,
  }
  const url = "/api/notebook/createNotebook"
  return await parseBody(request(url, data))
  // 返回空数据
}

/**
 * 删除思源笔记本
 * @param 笔记本id
 */
async function removeNotebook(笔记本id: string) {
  const data = { notebook: 笔记本id }
  const url = "/api/notebook/removeNotebook"
  return await parseBody(request(url, data))
  // 返回空数据
}

/**
 * 获取笔记本配置
 * @param 笔记本id
 */
async function getNotebookConf(笔记本id: string) {
  const data = { notebook: 笔记本id }
  const url = "/api/notebook/getNotebookConf"
  return await parseBody(request(url, data))
  // 返回笔记本配置
}

/**
 * 保存笔记本配置
 * @param 笔记本id
 */
async function setNotebookConf(笔记本id: string) {
  const data = { notebook: 笔记本id }
  const url = "/api/notebook/setNotebookConf"
  return await parseBody(request(url, data))
  // 返回笔记本配置
}

/**
 * 通过markdown创建文档
 * @param notebook 笔记本
 * @param path 路径
 * @param markdown Markdown
 */
async function createDocWithMd(
  notebook: string,
  path: string,
  markdown: string
) {
  const data = {
    notebook,
    path,
    markdown,
  }
  const url = "/api/filetree/createDocWithMd"
  return await parseBody(request(url, data))
}

/**
 * 重命名思源文档
 * @param notebookid 笔记本id
 * @param docPath 文档路径
 * @param title 标题
 */
async function renameDoc(notebookid: string, docPath: string, title: string) {
  const data = {
    notebook: notebookid,
    path: docPath,
    title,
  }
  const url = "/api/filetree/renameDoc"
  return await parseBody(request(url, data))
  // 返回空数据
}

/**
 * 删除思源文档
 * @param notebookid 笔记本id
 * @param docPath 文档路径
 */
async function removeDoc(notebookid: string, docPath: string) {
  const data = {
    notebook: notebookid,
    path: docPath,
  }
  const url = "/api/filetree/removeDoc"
  return await parseBody(request(url, data))
  // 返回空数据
}

/**
 * 移动思源文档
 * @param srcId 源笔记本ID
 * @param srcPath 源路径
 * @param destId 目标笔记本ID
 * @param destPath 目标路径
 */
async function moveDoc(
  srcId: string,
  srcPath: string,
  destId: string,
  destPath: string
) {
  const data = {
    fromNotebook: srcId,
    fromPath: srcPath,
    toNotebook: destId,
    toPath: destPath,
  }
  const url = "/api/filetree/moveDoc"
  return await parseBody(request(url, data))
  // 返回空数据
}

/**
 * 根据思源路径获取人类可读路径
 * @param notebookid  笔记本ID
 * @param docPath 路径
 */
async function getHPathByPath(notebookid: string, docPath: string) {
  const data = {
    Notebook: notebookid,
    Path: docPath,
  }
  const url = "/api/filetree/getHPathByPath"
  return await parseBody(request(url, data))
  // 返回路径
}

/**
 * 根据 ID 获取人类可读路径
 * @param blockId
 */
async function getHPathByID(blockId: string) {
  const data = {
    id: blockId,
  }
  const url = "/api/filetree/getHPathByID"
  return await parseBody(request(url, data))
  // 返回路径
}

/**
 * 分页获取根文档
 * @param keyword 关键字
 */
async function getRootBlocksCount(keyword: string) {
  const stmt = `SELECT COUNT(DISTINCT b1.root_id) as count
        FROM blocks b1
        WHERE 1 = 1
        AND ((b1.content LIKE '%${keyword}%') OR (b1.tag LIKE '%${keyword}%')
    )`
  const data = await sql(stmt)
  // logUtil.logError("getRootBlocksCount data=>", data[0].count)
  return data[0].count
}

/**
 * 分页获取根文档
 * @param page 页码
 * @param pagesize 数目
 *
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
 */
async function getRootBlocks(page: number, pagesize: number, keyword: string) {
  const stmt = `select DISTINCT b2.root_id,b2.parent_id,b2.content from blocks b2 
        WHERE 1==1
        AND b2.id IN (
             SELECT DISTINCT b1.root_id
                FROM blocks b1
                WHERE 1 = 1
                AND ((b1.content LIKE '%${keyword}%') OR (b1.tag LIKE '%${keyword}%'))
                ORDER BY b1.updated DESC,b1.created DESC LIMIT ${
                  page * pagesize
                },${pagesize}
        )
        ORDER BY b2.updated DESC,b2.created DESC`
  const data = await sql(stmt)
  return data
}

/**
 * 获取该文档下面的子文档个数
 *
 * SELECT COUNT(DISTINCT b1.root_id) AS count
 * FROM blocks b1
 * WHERE b1.path LIKE '%/20220927094918-1d85uyp%';
 *
 * @param docId 文档ID
 */
async function getSubdocCount(docId: string) {
  const stmt = `SELECT COUNT(DISTINCT b1.root_id) AS count
        FROM blocks b1
        WHERE b1.path LIKE '%/${docId}%'`
  const data = await sql(stmt)
  return data[0].count
}

/**
 * 分页获取子文档
 *
 * SELECT DISTINCT b2.root_id,b2.content,b2.path FROM blocks b2
 * WHERE b2.id IN (
 *   SELECT DISTINCT b1.root_id
 *      FROM blocks b1
 *      WHERE b1.path like '%/20220927094918-1d85uyp%'
 *      AND ((b1.content LIKE '%文档%') OR (b1.tag LIKE '%文档%'))
 *      ORDER BY b1.updated DESC,b1.created DESC LIMIT 0,10
 * )
 * ORDER BY b2.updated DESC,b2.created DESC
 * @param docId 文档ID
 * @param page 页码
 * @param pagesize 数目
 * @param keyword 关键字
 */
async function getSubdocs(
  docId: string,
  page: number,
  pagesize: number,
  keyword: string
) {
  const stmt = `SELECT DISTINCT b2.root_id,b2.content,b2.path FROM blocks b2
        WHERE b2.id IN (
          SELECT DISTINCT b1.root_id
             FROM blocks b1
             WHERE b1.path like '%/${docId}%'
             AND ((b1.content LIKE '%${keyword}%') OR (b1.tag LIKE '%${keyword}%'))
             ORDER BY b1.updated DESC,b1.created DESC LIMIT ${
               page * pagesize
             },${pagesize}
        )
        ORDER BY b2.content,b2.updated DESC,b2.created DESC,id`
  const data = await sql(stmt)
  return data
}

/**
 * 以id获取思源块信息
 * @param blockId
 */
async function getBlockByID(blockId: string) {
  const stmt = `select *
                from blocks
                where id = '${blockId}'`
  const data = await sql(stmt)
  logUtil.logInfo(data)
  return data[0]
}

/**
 * 以slug获取思源块信息
 * @param 内容块id
 */
async function getBlockBySlug(slug: string) {
  const stmt = `select root_id from attributes 
               where name='custom-slug' and value='${slug}' 
               limit 1`
  const data = await sql(stmt)
  logUtil.logInfo(data)
  return data[0]
}

/**
 * 导出markdown文本
 * @param 文档id
 */
async function exportMdContent(docId: string) {
  const data = {
    id: docId,
  }
  const url = "/api/export/exportMdContent"
  return await parseBody(request(url, data))
  // 文档hepath与Markdown 内容
}

// async function 以关键词搜索文档(k: string) {
//     let data = {
//         k: k,
//     }
//     let url = '/api/filetree/searchDocs'
//     return 解析响应体(向思源请求数据(url, data, "POST", true))
// }

// async function 获取思源块链接锚文本(链接源文本: string) {
//     链接源文本 = 链接源文本.replace("((", "").replace("))", "")
//     let sql = `select *
//                from blocks
//                where id = '${链接源文本}'`
//     let 临时块属性 = await 以sql向思源请求块数据(sql)
//     //  logUtil.logInfo ("临时块属性",临时块属性)
//     let anchor = ""
//     if (临时块属性) {
//         try {
//             // @ts-ignore
//             if (临时块属性[0][name]) {
//                 // @ts-ignore
//                 anchor = 临时块属性[0][name]
//             } else if (临时块属性[0]["content"]) {
//                 anchor = 临时块属性[0]["content"]
//             } else {
//                 anchor = 链接源文本
//             }
//         } catch (e) {
//             anchor = "解析错误"
//         }
//     }
//     //   logUtil.logInfo("锚文本",anchor)
//     return anchor
// }
//

/**
 * 获取块属性
 * @param blockId
 */
async function getBlockAttrs(blockId: string) {
  const data = {
    id: blockId,
  }
  const url = "/api/attr/getBlockAttrs"
  return await parseBody(request(url, data))
}

/**
 * 设置块属性
 * @param blockId
 * @param attrs
 */
async function setBlockAttrs(blockId: string, attrs: any) {
  const url = "/api/attr/setBlockAttrs"
  return await parseBody(
    request(url, {
      id: blockId,
      attrs,
    })
  )
}

/**
 * 以ID获取文档内容
 * @param id
 */
async function getDoc(id: string) {
  const data = {
    id,
    k: "",
    mode: 2,
    size: 36,
  }
  const url = "/api/filetree/getDoc"
  return await parseBody(request(url, data))
}

// async function 列出指定路径下文档(路径: string) {
//     let data = {
//         path: 路径,
//     }
//     let url = '/api/filetree/listDocsByPath'
//     return 解析响应体(向思源请求数据(url, data, "POST", true))
//     //文档hepath与Markdown 内容
// }
//
// // eslint-disable-next-line no-unused-vars
// function html转义(原始字符串: string) {
//     var 临时元素 = document.createElement("div");
//     临时元素.innerHTML = 原始字符串;
//     var output = 临时元素.innerText || 临时元素.textContent;
//     // @ts-ignore
//     临时元素 = null;
//     // logUtil.logInfo(output)
//     return output;
// }
//
// async function 以id获取反向链接(id: string) {
//     let data = {
//         id: id,
//         beforeLen: 10,
//         k: "",
//         mk: ""
//     }
//     let url = '/api/ref/getBacklink'
//     return 解析响应体(向思源请求数据(url, data, "POST", true))
// }
//
// async function 以sql获取嵌入块内容(外部id数组: any, sql: string) {
//     let data = {
//         stmt: sql,
//         excludeIDs: 外部id数组,
//     }
//     let url = '/api/search/searchEmbedBlock'
//     return 解析响应体(向思源请求数据(url, data, "POST", true))
//
// }

// async function 以id获取文档聚焦内容(id: string) {
//     let data = {
//         id: id,
//         k: "",
//         mode: 0,
//         size: 36,
//     }
//     let url = '/api/filetree/getDoc'
//     return 解析响应体(向思源请求数据(url, data, "POST", true))
// }
//
// async function 获取标签列表() {
//     let data = {}
//     let url = '/api/tag/getTag'
//     return 解析响应体(向思源请求数据(url, data, "POST", true))
// }
//
// async function 以id获取局部图谱(k: string, id: string, conf: any, reqId: string) {
//     let data = {
//         id: id,
//         k: k,
//         conf: conf,
//         reqId: reqId,
//     }
//     let url = '/api/graph/getLocalGraph'
//     return 解析响应体(向思源请求数据(url, data, "POST", true))
// }
//
// async function 获取全局图谱(k: string, conf: any, reqId: string) {
//     let data = {
//         k: k,
//         conf: conf,
//         reqId: reqId,
//     }
//     let url = '/api/graph/getGraph'
//     return 解析响应体(向思源请求数据(url, data, "POST", true))
// }
//

//
// async function 以关键词搜索块(query: string) {
//     let data = {
//         "query": query,
//     }
//     let url = '/api/search/searchBlock'
//     return 解析响应体(向思源请求数据(url, data, "POST", true))
// }
//
// async function 以关键词搜索模板(k: string) {
//     let data = {
//         k: k,
//     }
//     let url = '/api/search/searchTemplate'
//     return 解析响应体(向思源请求数据(url, data, "POST", true))
// }
//

// async function 渲染模板(data: any) {
//     let url = '/api/template/render'
//     return 解析响应体(向思源请求数据(url, data, "POST", true))
// }
//
// async function 插入块(previousID: string, dataType: string, data: any) {
//     let url = '/api/block/insertBlock'
//     return 解析响应体(向思源请求数据(
//         // eslint-disable-next-line no-self-assign
//         url,
//         {
//             previousID: previousID,
//             dataType: dataType,
//             data: data,
//         }, "POST", true
//     ))
// }
//
// async function 插入前置子块(parentID: string, dataType: string, data: any) {
//     let url = '/api/block/prependBlock'
//     return 解析响应体(向思源请求数据(
//         // eslint-disable-next-line no-self-assign
//         url,
//         {
//             parentID: parentID,
//             dataType: dataType,
//             data: data,
//         }, "POST", true
//     ))
// }
//
// async function 插入后置子块(parentID: string, dataType: string, data: any) {
//     let url = '/api/block/appendBlock'
//     return 解析响应体(向思源请求数据(
//         // eslint-disable-next-line no-self-assign
//         url,
//         data = {
//             parentID: parentID,
//             dataType: dataType,
//             data: data,
//         }, "POST", true
//     ))
// }
//
// async function 更新块(id: string, dataType: string, data: any) {
//     let url = '/api/block/updateBlock'
//     return 解析响应体(向思源请求数据(
//         // eslint-disable-next-line no-self-assign
//         url,
//         {
//             id: id,
//             dataType: dataType,
//             data: data,
//         }, "POST", true
//     ))
// }
//
// async function 删除块(id: string) {
//     let url = '/api/block/deleteBlock'
//     let data;
//     return 解析响应体(向思源请求数据(
//         // eslint-disable-next-line no-self-assign
//         url,
//         // eslint-disable-next-line no-undef
//         // @ts-ignore
//         data = {
//             id: id,
//         }, "POST", true
//     ))
// }
