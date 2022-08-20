import {describe} from "vitest";
import {LiandiApi} from "../../../../../src/lib/platform/commonblog/liandi/liandiApi";
import logUtil from "../../../../../src/lib/logUtil";

describe("liandiApi", async () => {

    it("init", async () => {

    })

    it("getUser", async () => {
        const liandiApi = new LiandiApi("", "")
        const result = await liandiApi.getUser()
        logUtil.logInfo(result)
    })
})