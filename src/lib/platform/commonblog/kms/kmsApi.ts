import {CommonblogApi} from "../commonblogApi";

/**
 * KMS的API
 *
 * http://localhost:9564/kms16_release/kms/multidoc/restservice/kmsMultidocDocHelp.jsp?name=%E6%96%87%E6%A1%A3%E7%9F%A5%E8%AF%86%E5%BA%93%E6%96%87%E6%A1%A3%E7%BB%B4%E6%8A%A4rest%E6%9C%8D%E5%8A%A1(%E6%96%B0)&s_css=default
 */
export class KmsApi extends CommonblogApi {
    private readonly baseUrl: string
    private readonly basicToken: string

    constructor(baseUrl: string, basicToken: string) {
        super();
        this.baseUrl = baseUrl;
        this.basicToken = basicToken;
    }

    /**
     * 新增文档
     */
    public async addDoc() {
        let url = "/addDoc"
        const formJson = [
            {
                key: "fdDocTemplateId",
                value: "181f20dcfc5744e90b0b8254499b4af0"
            },
            {
                key: "docSubject",
                value: "测试文档标题"
            },
            {
                key: "docContent",
                value: "测试文档内容"
            },
            {
                key: "fdDocCreator",
                value: "180f58069509ef61dd964994e4591dab"
            },
            {
                key: "authorType",
                value: "1"
            },
            {
                key: "docAuthor",
                value: "180f58069509ef61dd964994e4591dab"
            },
        ]

        return this.kmsRequestForm(url, formJson)

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

    // ==========================================================================
    // ==========================================================================
    /**
     * 向KMS请求数据
     * @param url 请求地址，例如 "/addDoc"
     * @param formJson
     * @private
     */
    private async kmsRequestForm(url: string, formJson: any) {
        const apiUrl = this.baseUrl + url
        const fetchOps = {
            headers: {
                Authorization: `Basic ${this.basicToken}`
            },
            method: "POST"
        }

        // const response = await fetch(apiUrl, fetchOps)
        // const resText = await response.text()
        // logUtil.logInfo("向KMS请求数据，resText=>", resText)

        const json = await this.doFormFetch(apiUrl, fetchOps, formJson)

        // 解析响应体并返回响应结果
        const statusCode = json.code
        const msg = json.msg

        if (200 != statusCode) {
            if (401 == statusCode) {
                throw new Error("因权限不足操作已被禁止：" + msg)
            } else {
                throw new Error("请求错误")
            }
        }

        return json.data
    }
}