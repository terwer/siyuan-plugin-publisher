import { describe, expect, it } from "vitest"
import { toStoreRelativeMediaUrl } from "~/src/adaptors/fs/LocalSystem/FsUtils.ts"

describe("toStoreRelativeMediaUrl", () => {
  it("normalizes mixed separators and returns a relative markdown URL", () => {
    expect(
      toStoreRelativeMediaUrl(
        "D:\\Users\\Administrator\\Downloads\\syp\\assets\\syp-diagram-a.png",
        "D:\\Users\\Administrator/Downloads/syp"
      )
    ).toBe("./assets/syp-diagram-a.png")
  })

  it("keeps forward slashes on non-Windows paths", () => {
    expect(toStoreRelativeMediaUrl("/home/user/syp/assets/a.png", "/home/user/syp/")).toBe("./assets/a.png")
  })

  it("returns the original path when it is outside the store directory", () => {
    expect(toStoreRelativeMediaUrl("C:\\tmp\\a.png", "D:\\syp")).toBe("C:\\tmp\\a.png")
  })
})
