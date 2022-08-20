import {Base64} from "js-base64";

/**
 * KMS的API
 */
export class KmsApi {
    private readonly baseUrl: string
    private readonly basicToken: string

    constructor(baseUrl: string, basicToken: string) {
        this.baseUrl = baseUrl;
        this.basicToken = basicToken;
    }

    /**
     * 新增文档
     */
    public async addDoc() {
        let url = "/addDoc"
        const form = new URLSearchParams();
        form.append("fdDocTemplateId", "181f20dcfc5744e90b0b8254499b4af0")
        form.append('docSubject', '测试文档内容');
        form.append("docContent", "测试文档内容")
        form.append("fdDocCreator", "180f58069509ef61dd964994e4591dab")
        form.append("authorType", "1")
        form.append("docAuthor", "180f58069509ef61dd964994e4591dab")

        return this.requestForm(url, form)

        // 这里返回的是response.data
        // 下面是完整返回
        // response
        // {
        //     "code": "200",
        //     "success": "success",
        //     "data": {
        //         "docContent": "测试文档内容",
        //         "docCreateTime": "2022-08-20 17:15",
        //         "fdId": "182ba88e8d8f4e3ad36314943b189939",
        //         "docSubject": "测试文档标题",
        //         "docCreatorId": "180f58069509ef61dd964994e4591dab"
        //      },
        //     "msg": "操作成功！"
        // }
    }

    /**
     * 向KMS请求数据
     * @param url 请求地址，例如 "/addDoc"
     * @param formData 表单数据
     * @private
     */
    private async requestForm(url: string, formData?: any) {
        const apiUrl = this.baseUrl + url

        const response = await fetch(apiUrl, {
            body: formData,
            headers: {
                Authorization: `Basic ${this.basicToken}`
            },
            method: "POST"
        })
        // const resText = await response.text()
        // log.logInfo("向KMS请求数据，resText=>", resText)

        const json = await response.json()

        // 解析响应体并返回响应结果
        const statusCode = json.code

        if (200 != statusCode) {
            if (401 == statusCode) {
                throw new Error("因权限不足操作已被禁止")
            } else {
                throw new Error("请求错误")
            }
        }

        return json.data
    }
}