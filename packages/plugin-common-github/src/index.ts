import { BaseClient, BaseClientOptions } from 'siyuan-plugin-publisher-common-base';

export interface GitHubClientOptions extends BaseClientOptions {
  token?: string;
}

export interface GitHubRelease {
  id: number;
  tag_name: string;
  name: string;
  body: string;
  draft: boolean;
  prerelease: boolean;
  created_at: string;
  published_at: string;
  assets: Array<{
    id: number;
    name: string;
    size: number;
    download_count: number;
    browser_download_url: string;
  }>;
}

export class GitHubClient extends BaseClient {
  constructor(options: GitHubClientOptions = {}) {
    super({
      baseURL: 'https://api.github.com',
      ...options
    });

    if (options.token) {
      this.setHeader('Authorization', `token ${options.token}`);
    }
  }

  public async getReleases(owner: string, repo: string): Promise<GitHubRelease[]> {
    return this.request<GitHubRelease[]>({
      method: 'GET',
      url: `/repos/${owner}/${repo}/releases`
    });
  }

  public async getLatestRelease(owner: string, repo: string): Promise<GitHubRelease> {
    return this.request<GitHubRelease>({
      method: 'GET',
      url: `/repos/${owner}/${repo}/releases/latest`
    });
  }

  public async createRelease(owner: string, repo: string, release: Partial<GitHubRelease>): Promise<GitHubRelease> {
    return this.request<GitHubRelease>({
      method: 'POST',
      url: `/repos/${owner}/${repo}/releases`,
      data: release
    });
  }
}

export default GitHubClient; 