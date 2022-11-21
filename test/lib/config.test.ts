import {assert, describe, it} from 'vitest'
import {getConf, setConf} from "../../src/lib/config";
import logUtil from "../../src/lib/logUtil";

describe('config test', () => {
    it('setConf', () => {
        const key = "test"
        const value = "testValue"
        setConf(key, value)

        const newValue = localStorage.getItem(key)
        logUtil.logInfo("getConf test=>")
        logUtil.logInfo("value=>", value)
        logUtil.logInfo("newValue=>", newValue)
        assert(newValue, value);
    })

    it('getConf', () => {
        const key = "test"
        const result = getConf(key)
        logUtil.logInfo("getConf test=>")
        logUtil.logInfo(result)
    })
})