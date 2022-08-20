import {CommonblogCfg} from "../commonblogCfg";
import {POSTID_KEY_CONSTANTS} from "../../../constants/postidKeyConstants";
import {PageType} from "../../metaweblog/IMetaweblogCfg";

/**
 * Kms配置
 */
export class KmsCfg extends CommonblogCfg {

    constructor() {
        super();

        this.home = "http://localhost:9564/kms16_release/kms/multidoc"
        this.apiUrl = "http://localhost:9564/kms16_release/api/kms-multidoc/kmsMultidocKnowledgeRestService"
        this.tokenSettingUrl = "http://localhost:9564/kms16_release/sys/profile/index.jsp#integrate/RestService/"
        this.posidKey = POSTID_KEY_CONSTANTS.KMS_POSTID_KEY
        this.previewUrl = "/kms_multidoc_knowledge/kmsMultidocKnowledge.do?method=view&fdId=[postid]"
        this.pageType = PageType.Html
    }
}