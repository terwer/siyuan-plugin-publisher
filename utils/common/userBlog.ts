export class UserBlog {
  blogid: string
  url: string
  blogName: string
  isAdmin?: boolean
  xmlrpc?: string

  constructor() {
    this.blogid = ""
    this.url = ""
    this.blogName = ""
  }
}
