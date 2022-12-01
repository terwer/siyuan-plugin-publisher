import {GithubCfg} from "~/utils/platform/github/githubCfg";
import {DynamicConfig, getDynPostidKey, SubPlantformType} from "~/utils/dynamicConfig";

/**
 * 动态Github配置类
 */
export class DynamicGCfg extends GithubCfg {

    constructor(cfg: DynamicConfig) {
        super();

        this.previewUrl = "/post/[postid].html"
        this.posidKey = getDynPostidKey(cfg.plantformKey)

        switch (cfg.subPlantformType) {
            case SubPlantformType.Github_Vuepress:
                this.defaultPath = "docs"
                break
            case SubPlantformType.Github_Hugo:
                this.defaultPath = "content/post"
                break
            case SubPlantformType.Github_Hexo:
                this.defaultPath = "source/_posts"
                this.previewUrl = "/[date]/[postid]/"
                break
            case SubPlantformType.Github_Jekyll:
                this.defaultPath = "_posts"
                this.previewUrl = "/[cats]/[date]/[postid].html"
                break
            default:
                break
        }
    }
}