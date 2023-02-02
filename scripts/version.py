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
import json
import os
import sys


def parse_json(filename, version_field, new_version):
    """
    解析json文件，并修改版本号未指定的值
    :param filename: 文件路径
    :param version_field: 版本号字段
    :param new_version: 版本号
    """

    # 读取 JSON 文件
    print("读取文件:" + os.path.abspath(filename))
    with open(filename, "r", encoding="utf-8") as f:
        data = json.load(f)
    # print(data)

    # 修改 JSON 文件中的属性
    data[version_field] = new_version

    # 将修改后的 JSON 写回到文件中
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


if __name__ == "__main__":
    CWD = "./"
    if os.getcwd().endswith("scripts"):
        CWD = "../"

    # 打印当前python版本
    print("当前python版本:" + sys.version)
    # 打印当前路径
    print("当前路径:" + os.path.abspath(CWD))

    parser = argparse.ArgumentParser()
    parser.add_argument("version", help="the file to be processed")
    parser.add_argument("-v", "--verbose", action="store_true", help="enable verbose output")
    args = parser.parse_args()

    if args.verbose:
        print("Verbose mode enabled")

    # widget.json
    parse_json(CWD + "public/widget.json", "version", args.version)

    # manifest.json
    parse_json(CWD + "public/manifest.dev.json", "version", args.version)
    parse_json(CWD + "public/manifest.prod.json", "version", args.version)

    # mv2 manifest.json
    parse_json(CWD + "public/mv2/manifest-v2-for-firefox.json", "version", args.version)

    print("修改完毕，新版本为：" + args.version)
