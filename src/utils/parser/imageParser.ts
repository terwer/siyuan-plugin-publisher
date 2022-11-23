import logUtil from "~/utils/logUtil";
import {imageToBase64} from "~/utils/parser/imageToBase64";
import {inSiyuan} from "~/utils/platform/siyuan/siyuanUtil";
import {getEnv} from "~/utils/envUtil";

/**
 * 图片解析器
 * 自动解析文章中的img标签
 * 自动处理src外链、base64数据
 * @author terwer
 * @since 0.1.0
 */
export default class ImageParser {
    /**
     * 剔除外链图片
     * @param content
     */
    public removeImages(content: string): string {
        let newcontent = content

        newcontent = newcontent.replace(/!\[.*]\((http|https):\/.*\/.*\)/g, "")

        return newcontent;
    }

    /**
     * 将外链外链图片替换为base64
     * @param content
     */
    public async replaceImagesWithBase64(content: string): Promise<string> {
        let newcontent = content

        const imgRegex = /!\[.*]\((http|https):\/.*\/.*\)/g
        const matches = newcontent.match(imgRegex);
        // 没有图片，无需处理
        if (matches == null || matches.length == 0) {
            return newcontent;
        }

        for (let i = 0; i < matches.length; i++) {
            const match = matches[i];
            logUtil.logInfo("img=>", match)

            const src = match.replace(/!\[]\(/g, "")
                .replace(/\)/, "")
            logUtil.logInfo("src=>", src)

            let newImg
            if (inSiyuan()) {
                let imageBase64WithURI
                    = await imageToBase64({uri: src})
                newImg = imageBase64WithURI?.base64 || "no pic";
            } else {
                const middleWareUrl = getEnv("VITE_MIDDLEWARE_URL") || "/api/middleware"
                const middleApiUrl = middleWareUrl + "/imageToBase64"

                const data = {
                    fetchParams: {
                        imgUrl: src,
                    }
                }

                let middleFetchOption = {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                }

                logUtil.logInfo("middleApiUrl=>")
                logUtil.logInfo(middleApiUrl)
                logUtil.logInfo("middleFetchOption=>")
                logUtil.logInfo(middleFetchOption)

                const resJson: any = await fetch(middleApiUrl, middleFetchOption)
                logUtil.logInfo("resJson=>")
                logUtil.logInfo(resJson)
                newImg = resJson?.body?.base64str || "parse error"
            }

            newImg = "<img src=\"data:image/png;base64," + newImg + "\"  alt=\"base64Image\"/>"
            newcontent = newcontent.replace(match, newImg)
        }

        return newcontent;
    }

    /**
     * 将外链外链图片替换为ascii码
     * @param content
     */
    public replaceImagesWithAscii(content: string): string {
        let newcontent = content
        return newcontent;
    }

    /**
     * 将外链外链图片替换为彩色ascii码
     * @param content
     */
    public replaceImagesWithColorAscii(content: string): string {
        let newcontent = content
        return newcontent;
    }

    /**
     * 上传外链图片到图床
     * @param content
     */
    public async uploadImageToBeds(content: string): Promise<string> {
        let newcontent = content

        return newcontent
    }

    /**
     * 下载图片到本地并打包成zip
     */
    public async dounloadMdWithImages() {

    }

    /**
     * 下载图片到本地并保存到思源
     * @deprecated 思源笔记已经有此功能
     */
    public async dounloadImagesToSiyuan() {
        throw new Error("思源笔记已经有此功能，无需重新实现")
    }
}