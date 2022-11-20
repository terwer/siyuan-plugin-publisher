import {describe, it} from "vitest";
import logUtil from "../../../../src/lib/logUtil";
import {SiYuanApiAdaptor} from "../../../../src/lib/platform/siyuan/siYuanApiAdaptor";

describe('SiyuanApi test', () => {
    it('getUsersBlogs', async () => {
        const api = new SiYuanApiAdaptor()
        const result = await api.getUsersBlogs()
        logUtil.logInfo("getUsersBlogs测试结果=>", result)
    })

    it('getSubdocCount', async () => {
        const api = new SiYuanApiAdaptor()
        const postid = "20220927094918-1d85uyp"
        const result = await api.getSubPostCount(postid)
        logUtil.logInfo("getSubdocCount测试结果=>", result)
    })

    it('getSubPosts', async () => {
        const api = new SiYuanApiAdaptor()
        const postid = "20220927094918-1d85uyp"
        const result = await api.getSubPosts(postid, 10, 0)
        logUtil.logInfo("getSubPosts测试结果=>", result)
    })
});