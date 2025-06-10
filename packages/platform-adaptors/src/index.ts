import type {
    GithubConfig,
    GithubPublishOptions,
    GithubPublishResult,
    PlatformAdaptor,
    WordPressConfig,
    WordPressPublishOptions,
} from "@siyuan-publisher/common"
import { DefaultPlatformAdaptorRegistry } from "./DefaultPlatformAdaptorRegistry"
import { GithubAdaptor } from "./github"


export { GithubAdaptor, DefaultPlatformAdaptorRegistry }
export type {
    GithubConfig,
    GithubPublishOptions,
    GithubPublishResult,
    PlatformAdaptor,
    WordPressConfig,
    WordPressPublishOptions
}

