import type {
    GithubConfig,
    GithubPublishOptions,
    GithubPublishResult,
    PlatformAdapter,
    WordPressConfig,
    WordPressPublishOptions,
} from "@siyuan-publisher/common"
import { DefaultPlatformAdapterRegistry } from "./DefaultPlatformAdapterRegistry"
import { GithubAdapter } from "./github"
import { WordPressAdapter } from "./wordpress"


export { GithubAdapter, WordPressAdapter,DefaultPlatformAdapterRegistry }
export type {
    GithubConfig,
    GithubPublishOptions,
    GithubPublishResult,
    PlatformAdapter,
    WordPressConfig,
    WordPressPublishOptions
}

