import { PublishOptions, PublishResult } from './publisher';

export interface PlatformAdapter {
  name: string;
  version: string;
  connect: (config: PlatformConfig) => Promise<void>;
  disconnect: () => Promise<void>;
  publish: (content: string, options: PublishOptions) => Promise<PublishResult>;
}

export interface PlatformConfig {
  apiKey?: string;
  apiSecret?: string;
  endpoint?: string;
  [key: string]: any;
}

export interface PlatformMetadata {
  name: string;
  version: string;
  description?: string;
  supportedFeatures?: string[];
  requiredConfig?: string[];
} 