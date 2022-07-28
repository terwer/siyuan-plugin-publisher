/**
 * 获取挂件所在的块ID
 * @returns {Promise<string>}
 */
import {getJSONConf, setJSONConf} from "../config";
import {getBlockByID} from "./siYuanApi.js";

export async function getWidgetId() {
    const self = window.frameElement.parentElement.parentElement;
    return self.getAttribute('data-node-id');
}

/**
 * 获取本地缓存的思源笔记页面ID
 * @param force
 * true 强制调用查询不获取缓存
 * false 优先读取本地缓存，缓存不存在再去查询
 * @returns {Promise<*|string>}
 */
export async function getSiyuanPageId(force) {
    const page = await getSiyuanPage(force);
    if (!page) {
        return
    }

    const pageId = page.root_id || ""
    console.log("获取思源笔记页面ID=>", pageId)
    return pageId
}

/**
 * 获取本地缓存的思源笔记页面信息（不是实时的）
 * @param force true代表强制调用查询不获取缓存
 * @returns {Promise<any>}
 */
export async function getSiyuanPage(force) {
    const widgetId = await getWidgetId()
    console.log("获取挂件的widgetId=>", widgetId)
    // 默认读取缓存
    const pageObj = getJSONConf(widgetId);
    if (!force && pageObj) {
        console.log("获取本地缓存的思源笔记页面信息（不是实时的）=>", pageObj)
        return pageObj;
    }

    // 如果本地不存在，或者需要强制读取，调用api查询
    const page = await getBlockByID(widgetId);
    if (page) {
        setJSONConf(widgetId, page)
        console.warn("调用API设置查询思源页面信息并更新本地缓存", page)
    }
    return page;
}