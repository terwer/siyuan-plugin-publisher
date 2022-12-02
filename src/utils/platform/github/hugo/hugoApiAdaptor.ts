import { GithubApiAdaptor } from "~/utils/platform/github/githubApiAdaptor"
import { IApi } from "~/utils/api"
import { API_TYPE_CONSTANTS } from "~/utils/constants/apiTypeConstants"

/**
 * Hugo的Api适配器
 */
export class HugoApiAdaptor extends GithubApiAdaptor implements IApi {
  constructor() {
    super(API_TYPE_CONSTANTS.API_TYPE_HUGO)
  }
}
