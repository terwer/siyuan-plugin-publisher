import {assert, describe, expect, it} from 'vitest'
import {KmsApi} from "../../../../../src/lib/platform/commonblog/kms/kmsApi";
import logUtil from "../../../../../src/lib/logUtil";

describe('kmsApi test', () => {
    it('kmsFetch', () => {
        const baseUrl = ""
        const basicToken = ""
        const kmsApi = new KmsApi(baseUrl, basicToken)
        const result = kmsApi.addDoc("测试标题", "测试内容")
        logUtil.logInfo(result)
    })
})