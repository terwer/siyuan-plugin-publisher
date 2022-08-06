import {config} from "./siYuanConfig"
import log from "../logUtil";

/**
 * 思源API v2.0.27
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

    // getBlockKramdown, ///api/block/getBlockKramdown

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
    getBlockByID,
    getBlockBySlug,

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
};

/**
 * 向思源请求数据
 * @param url url
 * @param data 数据
 * @param method 请求方法 GET | POST
 * @param useToken 权限TOKEN
 */
async function request(url: string, data: any, method?: string, useToken?: boolean) {
    let resData = null
    if (config.baseUrl != "") {
        url = config.baseUrl + url
    }

    let m = "POST"
    if (method) {
        m = method;
    }

    let fetchOps = {
        body: JSON.stringify(data),
        method: m
    }
    if (useToken != false) {
        Object.assign(fetchOps, {
            headers: {
                Authorization: `Token ${config.token}`,
            }
        })
    }

    log.logInfo("向思源请求数据，url=>", url)
    log.logInfo("向思源请求数据，fetchOps=>", fetchOps)
    await fetch(url, fetchOps).then(function (response) {
        resData = response.json()
        log.logInfo("向思源请求数据，resData=>", resData)
    })
    return resData
}

/**
 * 解析响应体
 * @param response 响应结果
 */
async function parseBody(response: any) {
    let r = await response
    return r.code === 0 ? r.data : null
}

/**
 * 以sql发送请求
 * @param sql sql
 */
async function sql(sql: string) {
    let sqldata = {
        stmt: sql,
    }
    let url = '/api/query/sql'
    return parseBody(request(url, sqldata))
}

/**
 * 显示笔记本列表
 */
async function lsNotebooks() {
    let data = {}
    let url = '/api/notebook/lsNotebooks'
    return parseBody(request(url, data))
}

/**
 * 打开笔记本
 * @param notebookid
 */
async function openNotebook(notebookid: string) {
    let data = {
        notebook: notebookid,
    }
    let url = '/api/notebook/openNotebook'
    return parseBody(request(url, data))
    //返回空数据
}

/**
 * 关闭笔记本
 * @param notebookid 笔记本id
 */
async function closeNotebook(notebookid: string) {
    let data = {
        notebook: notebookid,
    }
    let url = '/api/notebook/closeNotebook'
    return parseBody(request(url, data))
    //返回空数据
}

/**
 * 重命名思源笔记本
 * @param 笔记本id
 * @param 笔记本的新名称
 */
async function renameNotebook(notebookid: string, notebookName: string) {
    let data = {
        notebook: notebookid,
        name: notebookName,
    }
    let url = '/api/notebook/renameNotebook'
    return parseBody(request(url, data, "POST", true))
    //返回空数据
}

/**
 * 新建笔记本
 * @param 笔记本名称
 */
async function createNotebook(notebookName: string) {
    let data = {
        name: notebookName,
    }
    let url = '/api/notebook/createNotebook'
    return parseBody(request(url, data))
    //返回空数据
}

/**
 * 删除思源笔记本
 * @param 笔记本id
 */
async function removeNotebook(笔记本id: string) {
    let data = {notebook: 笔记本id}
    let url = '/api/notebook/removeNotebook'
    return parseBody(request(url, data))
    //返回空数据
}

/**
 * 获取笔记本配置
 * @param 笔记本id
 */
async function getNotebookConf(笔记本id: string) {
    let data = {notebook: 笔记本id}
    let url = '/api/notebook/getNotebookConf'
    return parseBody(request(url, data))
    //返回笔记本配置
}

/**
 * 保存笔记本配置
 * @param 笔记本id
 */
async function setNotebookConf(笔记本id: string) {
    let data = {notebook: 笔记本id}
    let url = '/api/notebook/setNotebookConf'
    return parseBody(request(url, data))
    //返回笔记本配置
}

/**
 * 通过markdown创建文档
 * @param notebook 笔记本
 * @param path 路径
 * @param markdown Markdown
 */
async function createDocWithMd(notebook: string, path: string, markdown: string) {
    let data = {
        notebook: notebook,
        path: path,
        markdown: markdown,
    }
    let url = '/api/filetree/createDocWithMd'
    return parseBody(request(url, data))
}

/**
 * 重命名思源文档
 * @param notebookid 笔记本id
 * @param docPath 文档路径
 * @param title 标题
 */
async function renameDoc(notebookid: string, docPath: string, title: string) {
    let data = {
        notebook: notebookid,
        path: docPath,
        title: title,
    }
    let url = '/api/filetree/renameDoc'
    return parseBody(request(url, data))
    //返回空数据
}

/**
 * 删除思源文档
 * @param notebookid 笔记本id
 * @param docPath 文档路径
 */
async function removeDoc(notebookid: string, docPath: string) {
    let data = {
        notebook: notebookid,
        path: docPath,
    }
    let url = '/api/filetree/removeDoc'
    return parseBody(request(url, data))
    //返回空数据
}

/**
 * 移动思源文档
 * @param srcId 源笔记本ID
 * @param srcPath 源路径
 * @param destId 目标笔记本ID
 * @param destPath 目标路径
 */
async function moveDoc(srcId: string, srcPath: string, destId: string, destPath: string) {
    let data = {
        fromNotebook: srcId,
        fromPath: srcPath,
        toNotebook: destId,
        toPath: destPath,
    }
    let url = '/api/filetree/moveDoc'
    return parseBody(request(url, data))
    //返回空数据
}

/**
 * 根据思源路径获取人类可读路径
 * @param notebookid  笔记本ID
 * @param docPath 路径
 */
async function getHPathByPath(notebookid: string, docPath: string) {
    let data = {
        Notebook: notebookid,
        Path: docPath,
    }
    let url = '/api/filetree/getHPathByPath'
    return parseBody(request(url, data))
    //返回路径
}

/**
 * 根据 ID 获取人类可读路径
 * @param blockId
 */
async function getHPathByID(blockId: string) {
    let data = {
        id: blockId,
    }
    let url = '/api/filetree/getHPathByID'
    return parseBody(request(url, data))
    //返回路径
}

/**
 * 分页获取根文档
 * @param page 页码
 * @param pagesize 数目
 */
async function getRootBlocks(page: number, pagesize: number, keyword: string) {
    let stmt = `SELECT b.content, tmp.root_id
                FROM (SELECT DISTINCT root_id
                      FROM blocks
                      WHERE 1 = 1
                        AND content LIKE '%${keyword}%'
                      ORDER BY created DESC LIMIT ${page}, ${pagesize}) tmp,
                     blocks b
                WHERE tmp.root_id = b.root_id
                  AND b.parent_id = ''
                ORDER BY b.created DESC`
    let data = await sql(stmt)
    return data
}

/**
 * 以id获取思源块信息
 * @param 内容块id
 */
async function getBlockByID(blockId: string) {
    let stmt = `select *
                from blocks
                where id = '${blockId}'`
    let data = await sql(stmt)
    console.log(data)
    return data[0]
}

/**
 * 以slug获取思源块信息
 * @param 内容块id
 */
async function getBlockBySlug(slug: string) {
    let stmt = `select root_id from attributes 
               where name='custom-slug' and value='${slug}' 
               limit 1`
    let data = await sql(stmt)
    console.log(data)
    return data[0]
}

/**
 * 导出markdown文本
 * @param 文档id
 */
async function exportMdContent(docId: string) {
    let data = {
        id: docId,
    }
    let url = '/api/export/exportMdContent'
    return parseBody(request(url, data))
    //文档hepath与Markdown 内容
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
//     //  log.logInfo ("临时块属性",临时块属性)
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
//     //   log.logInfo("锚文本",anchor)
//     return anchor
// }
//

/**
 * 获取块属性
 * @param blockId
 */
async function getBlockAttrs(blockId: string) {
    let data = {
        id: blockId,
    }
    let url = '/api/attr/getBlockAttrs'
    return parseBody(request(url, data))
}

/**
 * 设置块属性
 * @param blockId
 * @param attrs
 */
async function setBlockAttrs(blockId: string, attrs: any) {
    let url = '/api/attr/setBlockAttrs'
    return parseBody(request(url, {
        id: blockId,
        attrs: attrs,
    }))
}

/**
 * 以ID获取文档内容
 * @param id
 */
async function getDoc(id: string) {
    let data = {
        id: id,
        k: "",
        mode: 2,
        size: 36,
    }
    let url = '/api/filetree/getDoc'
    return parseBody(request(url, data))
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
//     // log.logInfo(output)
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