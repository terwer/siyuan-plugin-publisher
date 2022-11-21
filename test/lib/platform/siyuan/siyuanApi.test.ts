import {describe, it} from "vitest";
import logUtil from "../../../../src/lib/logUtil";
import {SiYuanApiAdaptor} from "../../../../src/lib/platform/siyuan/siYuanApiAdaptor";

describe('SiyuanApi test', () => {
    it('getUsersBlogs', async () => {
        const api = new SiYuanApiAdaptor()
        const result = await api.getUsersBlogs()
        logUtil.logInfo("getUsersBlogs测试结果=>", result)
    })
});