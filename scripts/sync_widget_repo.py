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

    # 打包文件夹
    archive_name = 'archive.zip'  # 替换为要创建的压缩文件名
    os.system(f"git archive --format=zip --output={archive_name} HEAD")

    # 解压文件到目标路径
    destination_directory = '../../siyuan-widgets/sy-post-publisher'  # 替换为目标解压路径
    scriptutils.unzip_file(archive_name, destination_directory)
