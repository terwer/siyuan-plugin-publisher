import {MetaweblogCfg} from "../MetaweblogCfg";
import {PageType} from "../IMetaweblogCfg";

/**
 * 动态Metaweblog配置类
 */
export class DynamicMCfg extends MetaweblogCfg {
    constructor(postidKey: string) {
        super("", "", "", "");
        this.posidKey = postidKey
        this.previewUrl = "/p/[postid].html"
        this.pageType = PageType.Html
    }
}