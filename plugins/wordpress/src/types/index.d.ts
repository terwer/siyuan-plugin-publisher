import { XMLRPCClientOptions } from "siyuan-plugin-publisher-common-xmlrpc"

export interface WordPressConfig {
  options: XMLRPCClientOptions
  username: string
  password: string
}

export interface PostData {
  title: string
  content: string
  categories?: string[]
  tags?: string[]
  status?: "publish" | "draft" | "private"
}
