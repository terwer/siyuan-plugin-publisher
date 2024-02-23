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
    parser.add_argument("-t", "--type", help="Build browser extension for publishing, like chrome, edge, firefox.")
    parser.add_argument("-d", "--dist", required=False, help="the dist for building files")
    args = parser.parse_args()

    if args.verbose:
        print("Verbose mode enabled.")

    # 设置环境变量
    if not args.platform:
        args.platform = 'siyuan'
    os.environ['BUILD_TYPE'] = args.platform

    # zhi-build
    zhi_build_cmd = "zhi-build --serve --production -d " + args.dist
    print(zhi_build_cmd)
    os.system(zhi_build_cmd)

    # vite-build
    vite_cmd = "vue-tsc --noEmit && vite build --watch --outDir " + args.dist
    print(vite_cmd)
    os.system(vite_cmd)
