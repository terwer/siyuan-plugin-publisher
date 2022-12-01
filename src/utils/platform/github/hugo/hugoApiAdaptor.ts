import {GithubApiAdaptor} from "~/utils/platform/github/githubApiAdaptor";
import {IApi} from "~/utils/api";
import {HugoApi} from "~/utils/platform/github/hugo/hugoApi";
import {API_TYPE_CONSTANTS} from "~/utils/constants/apiTypeConstants";
import {HugoCfg} from "~/utils/platform/github/hugo/hugoCfg";

/**
 * Hugo的Api适配器
 */
export class HugoApiAdaptor extends GithubApiAdaptor implements IApi {
    private readonly hugoApi: HugoApi

    constructor() {
        super(API_TYPE_CONSTANTS.API_TYPE_HUGO);

        const hugoCfg = new HugoCfg()
        hugoCfg.githubUser = this.cfg.githubUser
        hugoCfg.githubRepo = this.cfg.githubRepo
        hugoCfg.githubToken = this.cfg.githubToken
        this.hugoApi = new HugoApi(hugoCfg)
    }
}