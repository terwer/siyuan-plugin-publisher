import { PlatformAdapter, PlatformConfig, PublishOptions, PublishResult } from '@siyuan-publisher/core'
import { GithubConfig, GithubPublishOptions, GithubPublishResult } from '../types'
import { Octokit } from '@octokit/rest'

export class GithubAdapter implements PlatformAdapter {
  name = 'github'
  version = '1.0.0'
  private config: GithubConfig | null = null
  private octokit: Octokit | null = null

  async connect(config: PlatformConfig): Promise<void> {
    const githubConfig = config as GithubConfig
    if (!githubConfig.token || !githubConfig.owner || !githubConfig.repo) {
      throw new Error('Missing required GitHub configuration')
    }

    this.config = githubConfig
    this.octokit = new Octokit({
      auth: githubConfig.token
    })
  }

  async disconnect(): Promise<void> {
    this.config = null
    this.octokit = null
  }

  async publish(content: string, options: PublishOptions): Promise<PublishResult> {
    if (!this.octokit || !this.config) {
      throw new Error('GitHub adapter is not connected')
    }

    const githubOptions = options as GithubPublishOptions
    const branch = githubOptions.branch || this.config.branch || 'main'
    const path = githubOptions.path || this.config.path || 'README.md'
    const commitMessage = githubOptions.commitMessage || 'Update content'

    try {
      // 获取当前文件内容（如果存在）
      let currentSha: string | undefined
      try {
        const response = await this.octokit.repos.getContent({
          owner: this.config.owner,
          repo: this.config.repo,
          path,
          ref: branch
        })

        // 处理返回的数据
        if (Array.isArray(response.data)) {
          // 如果是目录，找到匹配的文件
          const file = response.data.find(item => item.path === path)
          if (file && 'sha' in file) {
            currentSha = file.sha
          }
        } else if ('sha' in response.data) {
          // 如果是单个文件
          currentSha = response.data.sha
        }
      } catch (error) {
        // 文件不存在，继续创建
      }

      // 创建或更新文件
      const response = await this.octokit.repos.createOrUpdateFileContents({
        owner: this.config.owner,
        repo: this.config.repo,
        path,
        message: commitMessage,
        content: Buffer.from(content).toString('base64'),
        branch,
        ...(currentSha && { sha: currentSha })
      })

      const result: GithubPublishResult = {
        success: true,
        url: response.data.content?.html_url || '',
        commitSha: response.data.commit.sha,
        htmlUrl: response.data.content?.html_url,
        rawUrl: response.data.content?.download_url
      }

      return result
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
} 