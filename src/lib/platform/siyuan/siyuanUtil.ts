/**
 * 获取挂件所在的块ID
 * @returns {Promise<string>}
 */
import {getJSONConf, setJSONConf} from "../../config";
import {exportMdContent, getBlockAttrs, getBlockByID, lsNotebooks, setBlockAttrs} from "./siYuanApi.js";
import logUtil from "../../logUtil";
import {getEnv} from "../../envUtil";
import {inBrowser} from "../../util";

export async function getWidgetId() {
    if (import.meta.env.MODE == "test") {
        return {
            isInSiyuan: true,
            widgetId: getEnv("VITE_SIYUAN_DEV_PAGE_ID")
        }
    }

    if (!window.frameElement
        || !window.frameElement.parentElement
        || !window.frameElement.parentElement.parentElement) {
        logUtil.logWarn("正在已非挂件模式运行，部分功能将不可用，请知悉")
        return {
            isInSiyuan: false,
            widgetId: ""
        }
    }

    let self = window.frameElement.parentElement.parentElement;
    if (!self) {
        logUtil.logWarn("正在已非挂件模式运行，部分功能将不可用，请知悉")
        return {
            isInSiyuan: false,
            widgetId: ""
        }
    }

    const widgetId = self.getAttribute('data-node-id')
    if (!widgetId) {
        logUtil.logWarn("正在已非挂件模式运行，部分功能将不可用，请知悉")
        return {
            isInSiyuan: false,
            widgetId: ""
        }
    }

    logUtil.logWarn("恭喜你，正在已挂件模式运行")
    return {
        isInSiyuan: true,
        widgetId: widgetId
    }
}

/**
 * 获取本地缓存的思源笔记页面信息（不是实时的）
 * @param force true代表强制调用查询不获取缓存
 * @returns {Promise<any>}
 */
async function getWidgetPage(force?: boolean) {
    const widgetResult = await getWidgetId()
    if (!widgetResult.isInSiyuan) {
        return
    }

    const widgetId = widgetResult.widgetId
    logUtil.logInfo("获取挂件的widgetId=>", widgetId)
    // 默认读取缓存
    const pageObj = getJSONConf(widgetId);
    if (!force && pageObj) {
        logUtil.logInfo("获取本地缓存的思源笔记页面信息（不是实时的）=>", pageObj)
        return pageObj;
    }

    // 如果本地不存在，或者需要强制读取，调用api查询
    const page = await getBlockByID(widgetId);
    if (page) {
        setJSONConf(widgetId, page)
        logUtil.logInfo("调用API设置查询思源页面信息并更新本地缓存", page)
    }
    return page;
}

/**
 * 获取本地缓存的思源笔记页面ID
 * @param force
 * true 强制调用查询不获取缓存
 * false 优先读取本地缓存，缓存不存在再去查询
 * @returns {Promise<*|string>}
 */
async function getSiyuanPageId(force?: boolean) {
    const page = await getWidgetPage(force);
    if (!page) {
        return
    }

    const pageId = page.root_id
    logUtil.logInfo("获取思源笔记页面ID=>", pageId)
    return pageId
}

/**
 * 获取页面ID，如果不是挂件模式，可以自己提供一个页面ID
 * 优先级
 * 1、挂件ID
 * 2、自己显式的传递一个ID
 * 3、浏览器参数id=传递的ID
 * 4、VITE_SIYUAN_DEV_PAGE_ID写死的测试ID
 * @param force 是否强制刷新
 * @param pageId 页面ID，可选的（挂件模式无需传递，开发阶段或者非挂件模式可以传递ID模拟运行）
 */
export async function getPageId(force?: boolean, pageId?: string) {
    let syPageId

    // 先兼容挂件
    const widgetResult = await getWidgetId()
    if (widgetResult.isInSiyuan) {
        // 尝试读取挂件的ID
        syPageId = await getSiyuanPageId(force)
    }

    //如果其他地方想使用，也可以显式的传入一个页面ID
    // logUtil.logWarn("pageId=>", pageId)
    if (!syPageId) {
        logUtil.logWarn("显示指定pageId=>", pageId)
        syPageId = pageId
    }

    // logUtil.logWarn("syPageId=>", syPageId)
    if (!syPageId) {
        //  开发模式模拟传递一个ID
        if (!pageId) {
            const testPageId = getEnv("VITE_SIYUAN_DEV_PAGE_ID")
            if (!testPageId && inBrowser()) {
                // 尝试从url参数解析ID
                const curl = window.location.href
                const urlIdx = curl.lastIndexOf("=")
                const qPageId = curl.substring(urlIdx + 1, curl.length)
                if (qPageId != "") {
                    syPageId = qPageId
                }
            } else {
                syPageId = testPageId
            }
        }
    }

    logUtil.logWarn("当前页面ID是=>", syPageId)
    return syPageId;
}

/**
 * 获取页面
 * @param pageId 页面ID
 */
export async function getPage(pageId: string) {
    return await getBlockByID(pageId)
}

/**
 * 获取页面属性
 * @param pageId 页面ID
 */
export async function getPageAttrs(pageId: string) {
    return await getBlockAttrs(pageId)
}

/**
 * 保存页面属性
 * @param pageId 页面ID
 * @param attrs 属性对象
 */
export async function setPageAttrs(pageId: string, attrs: any) {
    return await setBlockAttrs(pageId, attrs)
}

/**
 * 获取页面的Markdown
 * @param pageId
 */
export async function getPageMd(pageId: string) {
    return await exportMdContent(pageId);
}

/**
 * 列出笔记本
 */
export async function getNotebooks() {
    return await lsNotebooks()
}