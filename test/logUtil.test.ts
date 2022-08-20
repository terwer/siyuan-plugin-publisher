import {assert, describe, expect, it} from 'vitest'
import logUtil from "../src/lib/logUtil";

describe("logUtil test", () => {
    it("logInfo", () => {
        logUtil.logInfo("This is info logUtil")
    })
})