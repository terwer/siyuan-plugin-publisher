/**
 * 获取挂件所在的块ID
 * @returns {Promise<string>}
 */
import {getJSONConf, setJSONConf} from "../config";
import {getBlockByID} from "./siYuanApi.js";
import log from "../logUtil";

export async function getWidgetId() {
    // @ts-ignore
    if (!window.frameElement) {
        log.logWarn("正在已非挂件模式运行，部分功能将不可用，请知悉")
        return {
            isInSiyuan: false,
            widgetId: ""
        }
    }

    if (!window.frameElement.parentElement) {
        log.logWarn("正在已非挂件模式运行，部分功能将不可用，请知悉")
        return {
            isInSiyuan: false,
            widgetId: ""
        }
    }

    const self = window.frameElement.parentElement.parentElement;
    if (!self) {
        log.logWarn("正在已非挂件模式运行，部分功能将不可用，请知悉")
        return {
            isInSiyuan: false,
            widgetId: ""
        }
    }

    const widgetId = self.getAttribute('data-node-id')
    if (!widgetId) {
        log.logWarn("正在已非挂件模式运行，部分功能将不可用，请知悉")
        return {
            isInSiyuan: false,
            widgetId: ""
        }
    }

    log.logWarn("恭喜你，正在已挂件模式运行")
    return {
        isInSiyuan: true,
        widgetId: widgetId
    }
}

/**
 * 获取本地缓存的思源笔记页面ID
 * @param force
 * true 强制调用查询不获取缓存
 * false 优先读取本地缓存，缓存不存在再去查询
 * @returns {Promise<*|string>}
 */
export async function getSiyuanPageId(force: boolean) {
    const page = await getSiyuanPage(force);
    if (!page) {
        return
    }

    const pageId = page.root_id || ""
    log.logInfo("获取思源笔记页面ID=>", pageId)
    return pageId
}

/**
 * 获取本地缓存的思源笔记页面信息（不是实时的）
 * @param force true代表强制调用查询不获取缓存
 * @returns {Promise<any>}
 */
export async function getSiyuanPage(force?: boolean) {
    const widgetResult = await getWidgetId()
    if (!widgetResult.isInSiyuan) {
        return
    }

    const widgetId = widgetResult.widgetId
    log.logInfo("获取挂件的widgetId=>", widgetId)
    // 默认读取缓存
    const pageObj = getJSONConf(widgetId);
    if (!force && pageObj) {
        log.logInfo("获取本地缓存的思源笔记页面信息（不是实时的）=>", pageObj)
        return pageObj;
    }

    // 如果本地不存在，或者需要强制读取，调用api查询
    const page = await getBlockByID(widgetId);
    if (page) {
        setJSONConf(widgetId, page)
        log.logInfo("调用API设置查询思源页面信息并更新本地缓存", page)
    }
    return page;
}