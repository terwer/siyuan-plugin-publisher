import {describe, expect} from "vitest";
import {renderHTML} from "~/utils/markdownUtil";

describe("markdownUtil test", () => {
    it("renderHTML", () => {
        const md = "# hello"
        const result = renderHTML(md)
        console.log("result=>", result)
        expect(result).contains("<h1>hello</h1>")
    })
})