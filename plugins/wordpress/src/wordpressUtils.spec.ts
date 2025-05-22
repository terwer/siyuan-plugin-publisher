import { describe, it, expect, vi, beforeEach } from "vitest"
import { WordPressUtils, WordPressConfig, PostData } from "./wordpressUtils"
import XMLRPCClient from "siyuan-plugin-publisher-common-xmlrpc"

// Mock XMLRPCClient
vi.mock("siyuan-plugin-publisher-common-xmlrpc", () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      methodCall: vi.fn(),
    })),
  }
})

describe("WordPressUtils", () => {
  let wordpressUtils: WordPressUtils
  let mockConfig: WordPressConfig
  let mockClient: any

  beforeEach(() => {
    mockConfig = {
      endpoint: "http://test.wordpress.com/xmlrpc.php",
      username: "testuser",
      password: "testpass",
    }
    wordpressUtils = new WordPressUtils(mockConfig)
    mockClient = (XMLRPCClient as any).mock.results[0].value
  })

  describe("getBlogInfo", () => {
    it("should call wp.getProfile with correct parameters", async () => {
      const mockResponse = { user_id: 1, username: "testuser" }
      mockClient.methodCall.mockResolvedValueOnce(mockResponse)

      const result = await wordpressUtils.getBlogInfo()

      expect(mockClient.methodCall).toHaveBeenCalledWith("wp.getProfile", mockConfig.username, mockConfig.password)
      expect(result).toEqual(mockResponse)
    })
  })

  describe("createPost", () => {
    it("should create a new post with correct parameters", async () => {
      const postData: PostData = {
        title: "Test Post",
        content: "Test Content",
        categories: ["Test Category"],
        tags: ["test", "post"],
        status: "draft",
      }

      const mockResponse = "123" // post ID
      mockClient.methodCall.mockResolvedValueOnce(mockResponse)

      const result = await wordpressUtils.createPost(postData)

      expect(mockClient.methodCall).toHaveBeenCalledWith(
        "metaWeblog.newPost",
        1,
        mockConfig.username,
        mockConfig.password,
        {
          title: postData.title,
          description: postData.content,
          categories: postData.categories,
          mt_keywords: postData.tags?.join(","),
          post_status: postData.status,
        },
        true,
      )
      expect(result).toBe(mockResponse)
    })
  })

  describe("updatePost", () => {
    it("should update an existing post with correct parameters", async () => {
      const postId = "123"
      const postData: PostData = {
        title: "Updated Post",
        content: "Updated Content",
        categories: ["Updated Category"],
        tags: ["updated", "post"],
        status: "publish",
      }

      const mockResponse = true
      mockClient.methodCall.mockResolvedValueOnce(mockResponse)

      const result = await wordpressUtils.updatePost(postId, postData)

      expect(mockClient.methodCall).toHaveBeenCalledWith(
        "metaWeblog.editPost",
        postId,
        mockConfig.username,
        mockConfig.password,
        {
          title: postData.title,
          description: postData.content,
          categories: postData.categories,
          mt_keywords: postData.tags?.join(","),
          post_status: postData.status,
        },
        true,
      )
      expect(result).toBe(mockResponse)
    })
  })

  describe("getPosts", () => {
    it("should get recent posts with default limit", async () => {
      const mockResponse = [
        { postid: "1", title: "Post 1" },
        { postid: "2", title: "Post 2" },
      ]
      mockClient.methodCall.mockResolvedValueOnce(mockResponse)

      const result = await wordpressUtils.getPosts()

      expect(mockClient.methodCall).toHaveBeenCalledWith(
        "metaWeblog.getRecentPosts",
        1,
        mockConfig.username,
        mockConfig.password,
        10,
      )
      expect(result).toEqual(mockResponse)
    })

    it("should get recent posts with custom limit", async () => {
      const mockResponse = [{ postid: "1", title: "Post 1" }]
      mockClient.methodCall.mockResolvedValueOnce(mockResponse)

      const result = await wordpressUtils.getPosts(1)

      expect(mockClient.methodCall).toHaveBeenCalledWith(
        "metaWeblog.getRecentPosts",
        1,
        mockConfig.username,
        mockConfig.password,
        1,
      )
      expect(result).toEqual(mockResponse)
    })
  })

  describe("getPost", () => {
    it("should get a specific post", async () => {
      const postId = "123"
      const mockResponse = { postid: postId, title: "Test Post" }
      mockClient.methodCall.mockResolvedValueOnce(mockResponse)

      const result = await wordpressUtils.getPost(postId)

      expect(mockClient.methodCall).toHaveBeenCalledWith(
        "metaWeblog.getPost",
        postId,
        mockConfig.username,
        mockConfig.password,
      )
      expect(result).toEqual(mockResponse)
    })
  })

  describe("deletePost", () => {
    it("should delete a post", async () => {
      const postId = "123"
      const mockResponse = true
      mockClient.methodCall.mockResolvedValueOnce(mockResponse)

      const result = await wordpressUtils.deletePost(postId)

      expect(mockClient.methodCall).toHaveBeenCalledWith(
        "blogger.deletePost",
        "",
        postId,
        mockConfig.username,
        mockConfig.password,
        true,
      )
      expect(result).toBe(mockResponse)
    })
  })

  describe("getCategories", () => {
    it("should get all categories", async () => {
      const mockResponse = [
        { categoryId: "1", categoryName: "Category 1" },
        { categoryId: "2", categoryName: "Category 2" },
      ]
      mockClient.methodCall.mockResolvedValueOnce(mockResponse)

      const result = await wordpressUtils.getCategories()

      expect(mockClient.methodCall).toHaveBeenCalledWith(
        "wp.getCategories",
        1,
        mockConfig.username,
        mockConfig.password,
      )
      expect(result).toEqual(mockResponse)
    })
  })

  describe("getTags", () => {
    it("should get all tags", async () => {
      const mockResponse = [
        { tag_id: "1", name: "tag1" },
        { tag_id: "2", name: "tag2" },
      ]
      mockClient.methodCall.mockResolvedValueOnce(mockResponse)

      const result = await wordpressUtils.getTags()

      expect(mockClient.methodCall).toHaveBeenCalledWith("wp.getTags", 1, mockConfig.username, mockConfig.password)
      expect(result).toEqual(mockResponse)
    })
  })
})
