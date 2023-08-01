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

import os

import scriptutils

if __name__ == "__main__":
    # Switch to the working directory.
    scriptutils.switch_workdir()

    # Get the current working directory.
    cwd = scriptutils.get_workdir()

    # 获取当前工作目录
    print(os.getcwd())

    os.system("zhi-build --production")
    dist_folder = "./dist"
    data = scriptutils.read_json_file(cwd + "package.json")
    v = data["version"]

    src_folder = dist_folder
    tmp_folder_name = "./siyuan-plugin-publisher"
    build_zip_path = "./build"
    build_zip_name = "siyuan-plugin-publisher-" + v + ".zip"

    try:
        # 压缩dist为zip
        scriptutils.zip_folder(src_folder, tmp_folder_name, build_zip_path, build_zip_name)
        scriptutils.cp_file(os.path.join(build_zip_path, build_zip_name), os.path.join(build_zip_path, "package.zip"))
    except Exception as e:
        print(f"打包错误,{str(e)}")
    print("插件打包完毕.")
