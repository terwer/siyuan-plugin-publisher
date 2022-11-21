import {describe, it} from "vitest";
import logUtil from "../../src/utils/logUtil";
import {pathJoin} from "../../src/utils/util";

describe('util test', () => {
    it('pathJoin', () => {
        const path1 = "http://localhost:3000/"
        const path2 = "/post/test.html"

        const result = pathJoin(path1, path2)

        logUtil.logInfo("pathJoin test=>", result)
    })
})