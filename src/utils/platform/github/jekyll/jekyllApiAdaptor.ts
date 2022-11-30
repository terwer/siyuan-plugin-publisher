import {GithubApiAdaptor} from "~/utils/platform/github/githubApiAdaptor";
import {IApi} from "~/utils/api";
import {API_TYPE_CONSTANTS} from "~/utils/constants/apiTypeConstants";

/**
 * Jekyll的API适配器
 */
export class JekyllApiAdaptor extends GithubApiAdaptor implements IApi{

    constructor() {
        super(API_TYPE_CONSTANTS.API_TYPE_JEKYLL);
    }
}