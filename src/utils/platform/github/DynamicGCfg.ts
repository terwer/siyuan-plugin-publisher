import {GithubCfg} from "~/utils/platform/github/githubCfg";
import {DynamicConfig, getDynPostidKey, SubPlantformType} from "~/utils/dynamicConfig";
import logUtil from "~/utils/logUtil";

/**
 * 动态Github配置类
 */
export class DynamicGCfg extends GithubCfg {

    constructor(cfg: DynamicConfig) {
        super();

        switch (cfg.subPlantformType) {
            case SubPlantformType.Github_Hugo:
                this.defaultPath = "content/post"
                break
            default:
                break
        }

        this.posidKey = getDynPostidKey(cfg.plantformKey)
    }
}