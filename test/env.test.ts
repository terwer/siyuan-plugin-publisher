import {assert, describe, expect, it} from 'vitest'
import {getEnv} from "../src/lib/envUtil";

describe("env test", () => {
    it("getEnv", () => {
        const testPageId = getEnv("VITE_SIYUAN_DEV_PAGE_ID")
        expect(testPageId).toBeDefined()
        console.log("testPageId=>", testPageId)
    })
})