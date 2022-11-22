import {describe, expect, it} from "vitest";
import logUtil from "../../src/utils/logUtil";
import {pathJoin, zhSlugify} from "../../src/utils/util";

describe('util test', () => {
    it('pathJoin', () => {
        const path1 = "http://localhost:3000/"
        const path2 = "/post/test.html"

        const result = pathJoin(path1, path2)

        logUtil.logInfo("pathJoin test=>", result)
    })

    it("zhSlugify", async () => {
        const str = "在Vite+TypeScript的项目中使用~和@代替src根路径的方法"
        const result = await zhSlugify(str)
        logUtil.logInfo("zhSlugify result=>", result)
        expect(result).toBeTruthy()
    })
})