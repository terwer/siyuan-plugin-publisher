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


def do_chrome_package(source_folder, is_chrome):
    """
    Package the Chrome extension.
    :param source_folder: The source folder to build.
    :param is_chrome: Whether to build for Chrome.
    """
    # Delete Firefox configuration.
    scriptutils.rm_folder(source_folder + "mv2")
    print("Deleted Firefox configuration.")

    # Package Chrome extension.
    data = scriptutils.read_json_file(cwd + "package.json")
    version = data["version"]
    if is_chrome is None:
        # Package for both Chrome and Edge.
        scriptutils.zip_folder("./extension/chrome", "./sy-post-publisher-chrome", "./build",
                               "sy-post-publisher-chrome-" + version + ".zip")
        print("Packaged zip for Chrome browser extension.")
        scriptutils.zip_folder("./extension/chrome", "./sy-post-publisher-edge", "./build",
                               "sy-post-publisher-edge-" + version + ".zip")
        print("Packaged zip for Edge browser extension.")
        print("Browser extension packaging complete.")
    elif is_chrome:
        # Package only for Chrome.
        scriptutils.zip_folder("./extension/chrome", "./sy-post-publisher-chrome", "./build",
                               "sy-post-publisher-chrome-" + version + ".zip")
        print("Packaged zip for Chrome browser extension.")
        print("Chrome extension packaging complete.")
    else:
        # Package only for Edge.
        scriptutils.zip_folder("./extension/chrome", "./sy-post-publisher-edge", "./build",
                               "sy-post-publisher-edge-" + version + ".zip")
        print("Packaged zip for Edge browser extension.")
        print("Edge extension packaging complete.")


def do_firefox_package(source_folder):
    """
    Package the Firefox extension.
    :param source_folder: The source folder to build.
    """
    scriptutils.mv_file(source_folder + "mv2/manifest-v2-for-firefox.json", source_folder + "manifest.json")
    scriptutils.mv_file(source_folder + "mv2/background-v2-for-firefox.js", source_folder + "background.js")
    scriptutils.rm_folder(source_folder + "mv2")
    print("Deleted Chrome configuration.")

    # Package Firefox extension.
    data = scriptutils.read_json_file(cwd + "package.json")
    version = data["version"]

    src_folder = "./extension/firefox"
    tmp_folder_name = "./sy-post-publisher-firefox"
    build_zip_path = "./build"
    build_zip_name = "sy-post-publisher-firefox-" + version + ".zip"

    scriptutils.zip_folder(src_folder, tmp_folder_name, build_zip_path, build_zip_name)
    print("Packaged zip for Firefox browser extension.")


if __name__ == "__main__":
    # Switch to the working directory.
    scriptutils.switch_workdir()

    # Get the current working directory.
    cwd = scriptutils.get_workdir()

    # Parse arguments.
    parser = argparse.ArgumentParser()
    parser.add_argument("-d", "--dist", required=False, help="The dist for building files.")
    parser.add_argument("-v", "--verbose", action="store_true", help="Enable verbose output.")
    parser.add_argument("-nb", "--nobuild", action="store_true", help="Ignore build.")
    parser.add_argument("-t", "--type", help="Build browser extension for publishing, like chrome, edge, firefox.")
    args = parser.parse_args()

    if args.verbose:
        print("Verbose mode enabled.")

    # Build the project.
    if not args.type:
        args.type = "chrome"
    dist_name = f"extension/{args.type}"
    if args.dist is not None and args.dist != "":
        dist_name = str(args.dist)
    dist_folder = "./" + dist_name + "/"
    print("Building folder for " + dist_name)
    print("Building folder path: " + dist_folder)

    if args.nobuild:
        print("Ignoring project build.")
    else:
        # Copy necessary files.
        scriptutils.cp_folder("./src/extensions", dist_folder)
        scriptutils.cp_file("./LICENSE", dist_folder)
        # scriptutils.cp_file("./src/assets/key.pem", dist_folder)
        print("Copied required extension files.")

        # Set the BUILD_TYPE environment variable in node
        os.environ["BUILD_TYPE"] = args.type
        os.environ["VITE_SIYUAN_API_URL"] = "http://127.0.0.1:6806"
        print(f"BUILD_TYPE=>{args.type}")
        build_cmd = "vue-tsc --noEmit && vite build --outDir " + dist_name
        print("Build command: " + build_cmd)
        os.system(build_cmd)
        print("Build finished")

    # Package extensions.
    if args.type == "chrome":
        do_chrome_package(dist_folder, is_chrome=True)
        print("Google Chrome extension packaging complete.")
    elif args.type == "edge":
        do_chrome_package(dist_folder, is_chrome=False)
        print("Microsoft Edge extension packaging complete.")
    elif args.type == "firefox":
        do_firefox_package(dist_folder)
        print("Firefox extension packaging complete.")
    else:
        do_chrome_package(dist_folder, None)
        print("Browser extension packaging complete.")

        print("Project build complete.")
