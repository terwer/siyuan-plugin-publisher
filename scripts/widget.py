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
    parser.add_argument("-t", "--test", action="store_true", help="copy files to public workspace for local testing")
    parser.add_argument("-p", "--publish", action="store_true", help="copy files to sy-post-publisher for publishing")
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
        os.environ["BUILD_TYPE"] = "siyuan"
        build_cmd = "vue-tsc --noEmit && vite build --outDir " + dist_name
        print("构建命令:" + build_cmd)
        os.system(build_cmd)

        # 复制挂件需要的其他文件
        scriptutils.cp_file("./LICENSE", dist_folder)
        scriptutils.cp_file("./README.md", dist_folder)
        scriptutils.cp_file("./policy.md", dist_folder)
        print("复制挂件需要的其他文件.")

        # 删除Chrome插件专属文件
        scriptutils.rm_file(dist_folder + "background.js")
        scriptutils.rm_files(dist_folder + "manifest*.json")
        print("删除Chrome插件专属文件.")

        # 删除Firefox的专属文件
        scriptutils.rm_folder(dist_folder + "mv2")
        print("删除Firefox的专属文件.")

        # 删除Picgo配置文件
        scriptutils.rm_file(dist_folder + "lib/picgo/picgo.cfg.json")
        scriptutils.rm_file(dist_folder + "lib/picgo/picgo.cfg.dev.json")
        print("删除Picgo配置文件.")

        print("项目构建完成.")

        # 挂件打包
        # 读取 JSON 文件
        data = scriptutils.read_json_file(cwd + "package.json")
        v = data["version"]

        src_folder = dist_folder
        tmp_folder_name = "./sy-post-publisher"
        build_zip_path = "./build"
        build_zip_name = "sy-post-publisher-widget-" + v + ".zip"

        # 压缩dist为zip
        scriptutils.zip_folder(src_folder, tmp_folder_name, build_zip_path, build_zip_name)
        print("将dist文件打包成zip，用于挂件版本发布.")

    if args.test:
        scriptutils.cp_folder(dist_folder, "../SiYuanWorkspace/public/data/widgets/sy-post-publisher/", True)
        print("拷贝文件到本地 public 工作空间测试.")

    if args.publish:
        os.chdir("../sy-post-publisher")
        print("挂件发布切换路径，当前路径:" + os.getcwd())

        # 删除所有文件
        os.system("git rm -rf .")

        # 拷贝文件
        os.chdir("../src-sy-post-publisher")
        scriptutils.cp_folder("./dist", "../sy-post-publisher")
        scriptutils.cp_file("./.gitignore", "../sy-post-publisher")

        # 添加新文件到仓库
        os.chdir("../sy-post-publisher")
        os.system("git add -A")

        os.chdir("../src-sy-post-publisher")
        print("路径还原，当前路径:" + os.getcwd())
        print("拷贝文件到 sy-post-publisher 用于挂件版本发布.")

    print("发布完毕.")
