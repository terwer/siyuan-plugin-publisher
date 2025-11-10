/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

/**
 * 模拟浏览器的一些行为
 */
class MockBrowser {
  // macOS Chrome 浏览器的请求头
  public static HEADERS = {
    MACOS_CHROME: {
      // Accept:
      //   "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      // "Accept-Encoding": "gzip, deflate, br, zstd",
      // "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
      // "Cache-Control": "no-cache",
      // Pragma: "no-cache",
      // Priority: "u=0, i",
      // "Sec-Ch-Ua": '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
      // "Sec-Ch-Ua-Mobile": "?0",
      // "Sec-Ch-Ua-Platform": '"macOS"',
      // "Sec-Fetch-Dest": "document",
      // "Sec-Fetch-Mode": "navigate",
      // "Sec-Fetch-Site": "none",
      // "Sec-Fetch-User": "?1",
      // "Upgrade-Insecure-Requests": "1",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    },
  }
}

export { MockBrowser }
