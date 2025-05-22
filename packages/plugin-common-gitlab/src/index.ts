import { BaseClient, BaseClientOptions } from 'siyuan-plugin-publisher-common-base';

export interface GitLabClientOptions extends BaseClientOptions {
  token?: string;
  projectId?: string | number;
}

export interface GitLabRelease {
  id: number;
  tag_name: string;
  name: string;
  description: string;
  created_at: string;
  released_at: string;
  assets: {
    count: number;
    links: Array<{
      id: number;
      name: string;
      url: string;
      external: boolean;
    }>;
  };
}

export class GitLabClient extends BaseClient {
  private projectId?: string | number;

  constructor(options: GitLabClientOptions = {}) {
    super({
      baseURL: 'https://gitlab.com/api/v4',
      ...options
    });

    this.projectId = options.projectId;

    if (options.token) {
      this.setHeader('PRIVATE-TOKEN', options.token);
    }
  }

  public async getReleases(): Promise<GitLabRelease[]> {
    if (!this.projectId) {
      throw new Error('Project ID is required');
    }

    return this.request<GitLabRelease[]>({
      method: 'GET',
      url: `/projects/${this.projectId}/releases`
    });
  }

  public async getLatestRelease(): Promise<GitLabRelease> {
    if (!this.projectId) {
      throw new Error('Project ID is required');
    }

    const releases = await this.getReleases();
    return releases[0];
  }

  public async createRelease(release: Partial<GitLabRelease>): Promise<GitLabRelease> {
    if (!this.projectId) {
      throw new Error('Project ID is required');
    }

    return this.request<GitLabRelease>({
      method: 'POST',
      url: `/projects/${this.projectId}/releases`,
      data: release
    });
  }
}

export default GitLabClient; 