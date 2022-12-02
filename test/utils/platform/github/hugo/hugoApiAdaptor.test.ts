import { describe } from "vitest"
import { API } from "~/utils/api"
import { API_TYPE_CONSTANTS } from "~/utils/constants/apiTypeConstants"
import logUtil from "~/utils/logUtil"
import { HugoCfg } from "~/utils/platform/github/hugo/hugoCfg"
import { setJSONConf } from "~/utils/config"
import { getEnv } from "~/utils/envUtil"
import { Post } from "~/utils/common/post"

beforeEach(async (context) => {
  logUtil.logInfo("beforeEach start")
  // 设置为true，重新初始化配置，false忽略
  const inited = true
  if (inited) {
    logUtil.logInfo("beforeEach already inited")
    return
  }

  const cfg = new HugoCfg()
  cfg.githubUser = "terwer"
  cfg.githubRepo = "hugo-blog"
  cfg.githubToken = getEnv("VITE_TEST_GITHUB_TOKEN")

  cfg.home = "https://hugo.terwer.space"

  setJSONConf(API_TYPE_CONSTANTS.API_TYPE_HUGO, cfg)
  logUtil.logInfo("beforeEach end")
})

describe("hugoApiAdaptor test", () => {
  it("getUsersBlogs test", async () => {
    const api = new API(API_TYPE_CONSTANTS.API_TYPE_HUGO)
    const usersBlogs = await api.getUsersBlogs()
    logUtil.logInfo("usersBlogs=>", usersBlogs)
  })

  it("getPost test", async () => {
    const api = new API(API_TYPE_CONSTANTS.API_TYPE_HUGO)
    const post = await api.getPost("content/post/hello-world.md")
    logUtil.logInfo("post=>", post)
  })

  it("newPost test", async () => {
    const api = new API(API_TYPE_CONSTANTS.API_TYPE_HUGO)
    const commonPost: Post = new Post()
    commonPost.postid = "content/post/test.md"
    commonPost.description = "# Hello world"

    const res = await api.newPost(commonPost)
    logUtil.logInfo("newPost=>", res)
  })

  it("editPost test", async () => {
    const api = new API(API_TYPE_CONSTANTS.API_TYPE_HUGO)
    const commonPost: Post = new Post()
    commonPost.postid = "content/post/test.md"
    commonPost.description = "# Hello world3"

    const res = await api.editPost(commonPost.postid, commonPost)
    logUtil.logInfo("editPost=>", res)
  })

  it("deletePost test", async () => {
    const api = new API(API_TYPE_CONSTANTS.API_TYPE_HUGO)
    const postid = "content/post/test.md"
    const res = await api.deletePost(postid)
    logUtil.logInfo("deletePost=>", res)
  })

  it("getCategories test", async () => {
    const api = new API(API_TYPE_CONSTANTS.API_TYPE_HUGO)
    const res = await api.getCategories()
    logUtil.logInfo("getCategories=>", res)
  })

  it("getPrevireUrl test", async () => {
    const api = new API(API_TYPE_CONSTANTS.API_TYPE_HUGO)
    const postid = "content/post/test.md"
    const res = await api.getPreviewUrl(postid)
    logUtil.logInfo("previewUrl=>", res)
  })
})
