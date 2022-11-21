import {describe, it} from "vitest";
import logUtil from "../src/lib/logUtil";
import {pathJoin} from "../src/lib/util";

describe('util test', () => {
    it('pathJoin', () => {
        const path1 = "http://localhost:3000/"
        const path2 = "/post/test.html"

        const result = pathJoin(path1, path2)

        logUtil.logInfo("pathJoin test=>", result)
    })
})