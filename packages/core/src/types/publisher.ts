export interface Publisher {
  name: string;
  version: string;
  publish: (content: string, options: PublishOptions) => Promise<PublishResult>;
}

export interface PublishOptions {
  title?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface PublishResult {
  success: boolean;
  url?: string;
  error?: string;
} 