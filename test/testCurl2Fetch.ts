// @ts-ignore
import parse from 'curl-to-fetch';
import * as fs from "fs";
import path from "path";

// See also
// https://kigiri.github.io/fetch/

/**
 * 从文件路径转换
 * @param filePath
 */
export function curlFileToFetch(filePath: string) {
    // src/lib/platform/commonblog/kms/test/curl.local
    const __dirname = path.dirname(import.meta.url);
    const fullPath = path.join(__dirname, '..', 'src/lib/platform/commonblog/kms/test/curl.local').replace("file:", "");
    console.log(fullPath);

    const cstr = fs.readFileSync(fullPath, 'utf8');
    return curl2fetch(cstr)
}

/**
 * curl转换为fetch
 * @param cstr curl
 */
export function curl2fetch(cstr: string) {
    const fetchCode = parse(cstr);
    if (!fetchCode) {
        throw new Error("转换异常")
    }
    return fetchCode;
}
