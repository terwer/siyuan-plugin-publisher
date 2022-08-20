import {IApi} from "../../../api";
import {CommonblogApiAdaptor} from "../commonblogApiAdaptor";
import {Base64} from "js-base64";
import {KmsApi} from "./kmsApi";

/**
 * 知识仓库的API适配器
 */
export class KmsApiAdaptor extends CommonblogApiAdaptor implements IApi {
    private readonly kmsApi: KmsApi

    constructor() {
        super();

        const baseUrl = "http://localhost:9564/kms16_release/api/kms-multidoc/kmsMultidocKnowledgeRestService"

        const kmsUsername = ""
        const kmsPassword = ""
        const basicToken = Base64.toBase64(`${kmsUsername}:${kmsPassword}`)

        this.kmsApi = new KmsApi(baseUrl, basicToken)
    }
}