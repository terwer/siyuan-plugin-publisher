#  Copyright (c) 2023, Terwer . All rights reserved.
#  DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
#
#  This code is free software; you can redistribute it and/or modify it
#  under the terms of the GNU General Public License version 2 only, as
#  published by the Free Software Foundation.  Terwer designates this
#  particular file as subject to the "Classpath" exception as provided
#  by Terwer in the LICENSE file that accompanied this code.
#
#  This code is distributed in the hope that it will be useful, but WITHOUT
#  ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
#  FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
#  version 2 for more details (a copy is included in the LICENSE file that
#  accompanied this code).
#
#  You should have received a copy of the GNU General Public License version
#  2 along with this work; if not, write to the Free Software Foundation,
#  Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
#
#  Please contact Terwer, Shenzhen, Guangdong, China, youweics@163.com
#  or visit www.terwer.space if you need additional information or have any
#  questions.

import argparse
import os

import scriptutils


def do_chrome_package(df, is_chrome):
    """
    Chrome构建
    :param df: 源文件目录
    :param is_chrome: 是否是Chrome
    """
    # 删除火狐配置
    scriptutils.rm_folder(df + "mv2")
    scriptutils.mv_file(df + "manifest.prod.json", df + "manifest.json")
    scriptutils.rm_file(df + "manifest.dev.json")
    print("删除火狐配置.")

    scriptutils.mkdir("./extension/chrome")
    scriptutils.cp_folder(df, "./extension/chrome", True)

    # 打包
    # 读取 JSON 文件
    data = scriptutils.read_json_file(cwd + "package.json")
    v = data["version"]

    if is_chrome is None:
        # 压缩dist为zip
        scriptutils.zip_folder("./extension/chrome", "./sy-post-publisher-chrome", "./build",
                               "sy-post-publisher-chrome-" + v + ".zip")
        print("将dist文件打包成zip，用于Chrome浏览器插件版本发布.")
        # 压缩dist为zip
        scriptutils.zip_folder("./extension/chrome", "./sy-post-publisher-edge", "./build",
                               "sy-post-publisher-edge-" + v + ".zip")
        print("将dist文件打包成zip，用于Edge浏览器插件版本发布.")
        print("浏览器插件发布完毕.")
    elif is_chrome:
        # 压缩dist为zip
        scriptutils.zip_folder("./extension/chrome", "./sy-post-publisher-chrome", "./build",
                               "sy-post-publisher-chrome-" + v + ".zip")
        print("将dist文件打包成zip，用于Chrome浏览器插件版本发布.")
        print("Chrome插件发布完毕.")
    else:
        # 压缩dist为zip
        scriptutils.zip_folder("./extension/chrome", "./sy-post-publisher-edge", "./build",
                               "sy-post-publisher-edge-" + v + ".zip")
        print("将dist文件打包成zip，用于Edge浏览器插件版本发布.")
        print("Edge插件发布完毕.")


def do_firefox_package(df):
    """
    Firefox构建
    :param df: 源文件目录
    """
    # 删除Chrome配置
    scriptutils.rm_file(df + "manifest.dev.json")
    scriptutils.rm_file(df + "manifest.prod.json")

    scriptutils.mv_file(df + "mv2/manifest-v2-for-firefox.json", df + "manifest.json")
    scriptutils.mv_file(df + "mv2/background-v2-for-firefox.js", df + "background.js")
    scriptutils.rm_folder(df + "mv2")

    print("删除Chrome配置.")

    scriptutils.mkdir("./extension/firefox")
    scriptutils.cp_folder(df, "./extension/firefox", True)
    print("Firefox V2插件发布完毕.")

    # 打包
    # 读取 JSON 文件
    data = scriptutils.read_json_file(cwd + "package.json")
    v = data["version"]

    src_folder = "./extension/firefox"
    tmp_folder_name = "./sy-post-publisher-firefox"
    build_zip_path = "./build"
    build_zip_name = "sy-post-publisher-firefox-" + v + ".zip"

    # 压缩dist为zip
    scriptutils.zip_folder(src_folder, tmp_folder_name, build_zip_path, build_zip_name)
    print("将dist文件打包成zip，用于Firefox浏览器插件版本发布.")


if __name__ == "__main__":
    # 切换工作空间
    scriptutils.switch_workdir()

    # 获取当前工作空间
    cwd = scriptutils.get_workdir()

    # 参数解析
    parser = argparse.ArgumentParser()
    parser.add_argument("-d", "--dist", required=False, help="the dist for building files")
    parser.add_argument("-v", "--verbose", action="store_true", help="enable verbose output")
    parser.add_argument("-nb", "--nobuild", action="store_true", help="ignore build")
    parser.add_argument("-t", "--type", help="build browser extension for publishing,like chrome, edge, firefox")
    args = parser.parse_args()

    if args.verbose:
        print("Verbose mode enabled")

    # 构建项目到 dist 目录
    dist_name = "dist"
    if args.dist is not None and args.dist != "":
        dist_name = str(args.dist)
    dist_folder = "./" + dist_name + "/"
    print("dist_name:" + dist_name)
    print("dist_folder:" + dist_folder)

    if args.nobuild:
        print("忽略项目构建.")
    else:
        # 在 node 里面可以通过 process.env.BUILD_TYPE 读取
        build_cmd = "vue-tsc --noEmit && vite build --outDir " + dist_name
        print("构建命令:" + build_cmd)
        os.system(build_cmd)

        # 复制浏览器插件需要的其他文件
        scriptutils.cp_file("./LICENSE", dist_folder)
        scriptutils.cp_file("../backup/key.pem", dist_folder)
        print("复制浏览器插件需要的其他文件.")

        # 删除siyuan挂件专属文件
        scriptutils.rm_file(dist_folder + "widget.json")
        scriptutils.rm_file(dist_folder + "lib/siyuanhook.js")
        scriptutils.rm_folder(dist_folder + "lib/picgo")
        scriptutils.rm_folder(dist_folder + "lib/json-localstorage")
        scriptutils.rm_folder(dist_folder + "lib/siyuan")
        print("删除siyuan挂件专属文件.")

    # 插件打包
    if args.type == "chrome":
        do_chrome_package(dist_folder, is_chrome=True)
        print("构建Google Chrome浏览器插件完成.")
    elif args.type == "edge":
        do_chrome_package(dist_folder, is_chrome=False)
        print("构建Microsoft edge浏览器插件完成.")
    elif args.type == "firefox":
        do_firefox_package(dist_folder)
        print("构建Firefox浏览器插件完成.")
    else:
        do_chrome_package(dist_folder, None)
        print("构建浏览器插件完成.")

        print("项目构建完成.")
