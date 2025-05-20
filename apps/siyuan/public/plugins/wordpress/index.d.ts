import { IPlugin, PlatformCapabilities, PublishOptions, PublishResult, PlatformType, SubPlatformType, AuthMode } from 'siyuan-plugin-publisher-types';
import { Post } from 'zhi-blog-api';

declare class WordPressPlugin implements IPlugin {
    readonly id = "wordpress";
    readonly name = "WordPress";
    readonly group = "blog";
    readonly version = "0.0.1";
    readonly description = "WordPress publishing platform";
    readonly author = "Terwer";
    readonly capabilities: PlatformCapabilities;
    readonly configSchema: {
        type: string;
        properties: {
            endpoint: {
                type: string;
                title: string;
                description: string;
            };
            username: {
                type: string;
                title: string;
                description: string;
            };
            password: {
                type: string;
                title: string;
                description: string;
                format: string;
            };
        };
        required: string[];
    };
    readonly defaultConfig: {
        endpoint: string;
        username: string;
        password: string;
    };
    private config;
    init(config: Record<string, any>): Promise<void>;
    destroy(): Promise<void>;
    publish(post: Post, options?: PublishOptions): Promise<PublishResult>;
    getPlatformType(): PlatformType;
    getSubPlatformType(): SubPlatformType;
    getAuthMode(): AuthMode;
    validateConfig(config: Record<string, any>): {
        valid: boolean;
        error?: string;
    };
}

export { WordPressPlugin, WordPressPlugin as default };
