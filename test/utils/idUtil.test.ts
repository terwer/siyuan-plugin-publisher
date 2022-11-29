import {describe, expect} from "vitest";
import {newID} from "~/utils/idUtil";
import logUtil from "~/utils/logUtil";

describe("isUtil test", () => {
    it("newID test", () => {
        const result = newID()
        logUtil.logInfo("newID result=>", result)
        expect(result).toBeTruthy()
    })
})