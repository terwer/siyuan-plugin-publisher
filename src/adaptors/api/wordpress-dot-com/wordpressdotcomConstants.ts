/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

/**
 * 预定义 WordPress 变量
 *
 * @author terwer
 * @version 0.9.0
 * @since 0.9.0
 */
class WordpressdotcomConstants {
    // wordpress.com 不支持 metaWeblog.getUsersBlogs 只支持 blogger.getUsersBlogs
    public static METHOD_GET_USERS_BLOGS = "blogger.getUsersBlogs"
    // wordpress.com 不支持 metaWeblog.deletePost 只支持 blogger.deletePost
    public static METHOD_DELETE_POST = "blogger.deletePost"
}

export { WordpressdotcomConstants }
