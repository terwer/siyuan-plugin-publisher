import {assert, describe, expect, it} from 'vitest'
import {KmsApi} from "../../../../../src/lib/platform/commonblog/kms/kmsApi";
import logUtil from "../../../../../src/lib/logUtil";

describe('kmsApi test', () => {
    it('kmsFetch', () => {
        const baseUrl = ""
        const basicToken = ""
        const kmsApi = new KmsApi(baseUrl, basicToken)
        const result = kmsApi.addDoc()
        logUtil.logInfo(result)
    })
})