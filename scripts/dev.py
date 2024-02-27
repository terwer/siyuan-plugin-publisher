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
    # Switch to the working directory.
    scriptutils.switch_workdir()

    # Get the current working directory.
    cwd = scriptutils.get_workdir()

    # Parse arguments.
    parser = argparse.ArgumentParser()
    parser.add_argument("-v", "--verbose", action="store_true", help="Enable verbose output.")
    parser.add_argument("-p", "--platform", help="Build for different platforms, like siyuan, widget, static.")
    parser.add_argument("-d", "--dist", required=False, help="the dist for building files")
    args = parser.parse_args()

    if args.verbose:
        print("Verbose mode enabled.")

    # 设置环境变量
    if not args.platform or args.platform == '':
        args.platform = 'siyuan'
    if not args.dist or args.dist == '':
        args.dist = args.platform
    dist_name = args.dist
    os.environ['BUILD_TYPE'] = args.platform

    if args.platform == 'siyuan':
        dist_name = 'dist'
        # zhi-build
        zhi_build_cmd = "zhi-build --production -d " + dist_name
        print(zhi_build_cmd)
        os.system(zhi_build_cmd)
    elif args.platform == 'widget':
        # 复制挂件需要的其他文件
        dist_folder = f"./{dist_name}/"
        if not os.path.exists(dist_folder):
            os.makedirs(dist_folder)
        scriptutils.cp_file("./LICENSE", dist_folder)
        scriptutils.cp_file("./src/assets/README.md", dist_folder)
        scriptutils.cp_file("./src/assets/README_zh_CN.md", dist_folder)
        scriptutils.cp_file("./widget.json", dist_folder)
        scriptutils.cp_file("./src/assets/icon.png", dist_folder)
        scriptutils.cp_file("./src/assets/preview.png", dist_folder)
        scriptutils.cp_file("./policy.md", dist_folder)
        print("复制挂件需要的其他文件.")
    elif args.platform == 'chrome' or args.platform == 'edge' or args.platform == 'firefox':
        dist_name = f"extension/{dist_name}"
        dist_folder = "./" + dist_name + "/"
        print("Building folder for " + dist_name)
        print("Building folder path: " + dist_folder)

        # Copy necessary files.
        scriptutils.cp_folder("./src/extensions", dist_folder)
        scriptutils.cp_file("./LICENSE", dist_folder)
        # scriptutils.cp_file("./src/assets/key.pem", dist_folder)
        print("Copied required extension files.")

        # Make some adaptors
        if args.platform == 'chrome' or args.platform == 'edge':
            # Delete Firefox configuration.
            scriptutils.rm_folder(dist_folder + "mv2")
            print("Deleted Firefox configuration.")
        elif args.platform == 'firefox':
            scriptutils.mv_file(dist_folder + "mv2/manifest-v2-for-firefox.json", dist_folder + "manifest.json")
            scriptutils.mv_file(dist_folder + "mv2/background-v2-for-firefox.js", dist_folder + "background.js")
            scriptutils.rm_folder(dist_folder + "mv2")
            print("Deleted Chrome configuration.")
        else:
            raise Exception("Not supported platform: " + args.platform)

        os.environ["VITE_SIYUAN_API_URL"] = "http://127.0.0.1:6806"
    elif args.platform == 'nginx':
        pass
    else:
        pass

    # vite-build
    vite_cmd = "vue-tsc --noEmit && vite build --watch --outDir " + dist_name
    print(vite_cmd)
    os.system(vite_cmd)
