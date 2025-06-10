import { describe, it, expect, vi, beforeEach } from "vitest"
import { WordPressClient, WordPressConfig } from "./wordpressClient"
import { PostData } from "@/types"
import XMLRPCClient from "siyuan-plugin-publisher-common-xmlrpc"

// Mock XMLRPCClient
vi.mock("siyuan-plugin-publisher-common-xmlrpc", () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      methodCall: vi.fn(),
    })),
  }
})

describe("WordPressClient", () => {
  let wordpressClient: WordPressClient
  let mockConfig: WordPressConfig
  let mockClient: any

  beforeEach(() => {
    mockConfig = {
      options: {
        endpoint: "http://test.wordpress.com/xmlrpc.php",
      },
      username: "testuser",
      password: "testpass",
    }
    wordpressClient = new WordPressClient(mockConfig)
    mockClient = (XMLRPCClient as any).mock.results[0].value
  })

  // Posts API
  // ----------------------------------
  describe("Posts API", () => {
    describe("getPost", () => {
      it("should get a specific post", async () => {
        const postId = "123"
        const mockResponse = { postid: postId, title: "Test Post" }
        mockClient.methodCall.mockResolvedValueOnce(mockResponse)

        const result = await wordpressClient.getPost(postId)

        expect(mockClient.methodCall).toHaveBeenCalledWith(
          "wp.getPost",
          1,
          mockConfig.username,
          mockConfig.password,
          postId,
        )
        expect(result).toEqual(mockResponse)
      })
    })

    describe("getPosts", () => {
      it("should get recent posts with default limit", async () => {
        const mockResponse = [
          { postid: "1", title: "Post 1" },
          { postid: "2", title: "Post 2" },
        ]
        mockClient.methodCall.mockResolvedValueOnce(mockResponse)

        const result = await wordpressClient.getPosts()

        expect(mockClient.methodCall).toHaveBeenCalledWith("wp.getPosts", 1, mockConfig.username, mockConfig.password, {
          number: 10,
        })
        expect(result).toEqual(mockResponse)
      })

      it("should get recent posts with custom limit", async () => {
        const mockResponse = [{ postid: "1", title: "Post 1" }]
        mockClient.methodCall.mockResolvedValueOnce(mockResponse)

        const result = await wordpressClient.getPosts(1)

        expect(mockClient.methodCall).toHaveBeenCalledWith("wp.getPosts", 1, mockConfig.username, mockConfig.password, {
          number: 1,
        })
        expect(result).toEqual(mockResponse)
      })
    })

    describe("newPost", () => {
      it("should create a new post with correct parameters", async () => {
        const postData: PostData = {
          title: "Test Post",
          content: "Test Content",
          categories: ["Test Category"],
          tags: ["test", "post"],
          status: "draft" as const,
        }

        const mockResponse = "123" // post ID
        mockClient.methodCall.mockResolvedValueOnce(mockResponse)

        const result = await wordpressClient.newPost(postData)

        expect(mockClient.methodCall).toHaveBeenCalledWith("wp.newPost", 1, mockConfig.username, mockConfig.password, {
          post_title: postData.title,
          post_content: postData.content,
          post_categories: postData.categories,
          mt_keywords: postData.tags?.join(","),
          post_status: postData.status,
        })
        expect(result).toBe(mockResponse)
      })
    })

    describe("editPost", () => {
      it("should update an existing post with correct parameters", async () => {
        const postId = "123"
        const postData: PostData = {
          title: "Updated Post",
          content: "Updated Content",
          categories: ["Updated Category"],
          tags: ["updated", "post"],
          status: "publish" as const,
        }

        const mockResponse = true
        mockClient.methodCall.mockResolvedValueOnce(mockResponse)

        const result = await wordpressClient.editPost(postId, postData)

        expect(mockClient.methodCall).toHaveBeenCalledWith(
          "wp.editPost",
          1,
          mockConfig.username,
          mockConfig.password,
          postId,
          {
            post_title: postData.title,
            post_content: postData.content,
            post_categories: postData.categories,
            mt_keywords: postData.tags?.join(","),
            post_status: postData.status,
          },
        )
        expect(result).toBe(mockResponse)
      })
    })

    describe("deletePost", () => {
      it("should delete a post", async () => {
        const postId = "123"
        const mockResponse = true
        mockClient.methodCall.mockResolvedValueOnce(mockResponse)

        const result = await wordpressClient.deletePost(postId)

        expect(mockClient.methodCall).toHaveBeenCalledWith(
          "wp.deletePost",
          1,
          mockConfig.username,
          mockConfig.password,
          postId,
        )
        expect(result).toBe(mockResponse)
      })
    })

    describe("getPostType", () => {
      it("should get post type information", async () => {
        const postType = "post"
        const mockResponse = { name: "post", label: "Posts" }
        mockClient.methodCall.mockResolvedValueOnce(mockResponse)

        const result = await wordpressClient.getPostType(postType)

        expect(mockClient.methodCall).toHaveBeenCalledWith(
          "wp.getPostType",
          1,
          mockConfig.username,
          mockConfig.password,
          postType,
        )
        expect(result).toEqual(mockResponse)
      })
    })

    describe("getPostTypes", () => {
      it("should get all post types", async () => {
        const mockResponse = [
          { name: "post", label: "Posts" },
          { name: "page", label: "Pages" },
        ]
        mockClient.methodCall.mockResolvedValueOnce(mockResponse)

        const result = await wordpressClient.getPostTypes()

        expect(mockClient.methodCall).toHaveBeenCalledWith(
          "wp.getPostTypes",
          1,
          mockConfig.username,
          mockConfig.password,
        )
        expect(result).toEqual(mockResponse)
      })
    })

    describe("getPostStatusList", () => {
      it("should get post status list", async () => {
        const mockResponse = {
          publish: "Published",
          draft: "Draft",
          pending: "Pending Review",
        }
        mockClient.methodCall.mockResolvedValueOnce(mockResponse)

        const result = await wordpressClient.getPostStatusList()

        expect(mockClient.methodCall).toHaveBeenCalledWith(
          "wp.getPostStatusList",
          1,
          mockConfig.username,
          mockConfig.password,
        )
        expect(result).toEqual(mockResponse)
      })
    })
  })

  // Media API
  // ----------------------------------
  describe("Media API", () => {
    describe("uploadFile", () => {
      it("should upload a file", async () => {
        const name = "test.jpg"
        const type = "image/jpeg"
        const bits = Buffer.from("test")
        const overwrite = false

        const mockResponse = {
          id: "123",
          file: "test.jpg",
          url: "http://example.com/test.jpg",
        }
        mockClient.methodCall.mockResolvedValueOnce(mockResponse)

        const result = await wordpressClient.uploadFile(name, type, bits, overwrite)

        expect(mockClient.methodCall).toHaveBeenCalledWith(
          "wp.uploadFile",
          1,
          mockConfig.username,
          mockConfig.password,
          {
            name,
            type,
            bits,
            overwrite,
          },
        )
        expect(result).toEqual(mockResponse)
      })
    })
  })

  // Comments API
  // ----------------------------------
  describe("Comments API", () => {
    describe("newComment", () => {
      it("should create a new comment", async () => {
        const postId = "123"
        const commentData = {
          content: "Test comment",
          author: "Test User",
          author_email: "test@example.com",
        }

        const mockResponse = "456" // comment ID
        mockClient.methodCall.mockResolvedValueOnce(mockResponse)

        const result = await wordpressClient.newComment(postId, commentData)

        expect(mockClient.methodCall).toHaveBeenCalledWith(
          "wp.newComment",
          1,
          mockConfig.username,
          mockConfig.password,
          postId,
          commentData,
        )
        expect(result).toBe(mockResponse)
      })
    })
  })

  // Options API
  // ----------------------------------
  describe("Options API", () => {
    describe("setOptions", () => {
      it("should set options", async () => {
        const options = {
          blogname: "Test Blog",
          blogdescription: "Test Description",
        }

        const mockResponse = {
          blogname: { value: "Test Blog", desc: "Site Title" },
          blogdescription: { value: "Test Description", desc: "Tagline" },
        }
        mockClient.methodCall.mockResolvedValueOnce(mockResponse)

        const result = await wordpressClient.setOptions(options)

        expect(mockClient.methodCall).toHaveBeenCalledWith(
          "wp.setOptions",
          1,
          mockConfig.username,
          mockConfig.password,
          options,
        )
        expect(result).toEqual(mockResponse)
      })
    })
  })

  // Users API
  // ----------------------------------
  describe("Users API", () => {
    describe("getUsersBlogs", () => {
      it("should get user's blogs", async () => {
        const mockResponse = [
          {
            blogid: "1",
            blogName: "Test Blog",
            url: "http://example.com",
            xmlrpc: "http://example.com/xmlrpc.php",
          },
        ]
        mockClient.methodCall.mockResolvedValueOnce(mockResponse)

        const result = await wordpressClient.getUsersBlogs()

        expect(mockClient.methodCall).toHaveBeenCalledWith("wp.getUsersBlogs", mockConfig.username, mockConfig.password)
        expect(result).toEqual(mockResponse)
      })
    })

    describe("getUser", () => {
      it("should get user information", async () => {
        const userId = "1"
        const mockResponse = {
          user_id: "1",
          username: "testuser",
          email: "test@example.com",
        }
        mockClient.methodCall.mockResolvedValueOnce(mockResponse)

        const result = await wordpressClient.getUser(userId)

        expect(mockClient.methodCall).toHaveBeenCalledWith(
          "wp.getUser",
          mockConfig.username,
          mockConfig.password,
          userId,
        )
        expect(result).toEqual(mockResponse)
      })
    })
  })
})
