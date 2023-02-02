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

import distutils
import glob
import json
import os
import shutil
import sys
import zipfile
from distutils import dir_util
from distutils import file_util


def get_workdir():
    """
    获取工作空间
    """
    cwd = "./"
    if os.getcwd().endswith("scripts"):
        cwd = "../"

    # 打印当前python版本
    print("当前python版本:" + sys.version)
    # 打印当前路径
    print("当前路径:" + os.path.abspath(cwd))

    return cwd


def switch_workdir():
    """
    切换工作空间
    """
    # 获取当前工作空间
    cwd = get_workdir()

    print("切换路径")
    os.chdir(cwd)
    print("当前路径:" + os.getcwd())


def cp_file(f, t):
    """
    拷贝文件
    :param f: 源路径
    :param t: 目的地
    """
    distutils.file_util.copy_file(f, t)


def rm_file(filename):
    """
    删除文件
    :param filename:文件名
    """
    if os.path.exists(filename):
        os.remove(filename)


def rm_files(regex):
    """
    正则删除文件
    :param regex: 正则
    """
    file_list = glob.glob(regex)
    for file in file_list:
        rm_file(file)


def mkdir(dirname):
    """
    创建目录
    :param dirname: 目录
    """
    if not os.path.exists(dirname):
        distutils.dir_util.mkpath(dirname)


def rm_folder(folder):
    """
    删除文件夹，它会递归的删除文件夹中的所有文件和子文件夹
    :param folder: 文件夹
    """
    if os.path.exists(folder):
        shutil.rmtree(folder)


def read_json_file(filename):
    """
    读取 JSON 文件
    :param filename: 文件名
    """
    # 读取 JSON 文件
    print("读取文件:" + os.path.abspath(filename))
    with open(filename, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data


def write_json_file(filename, data):
    """
    写入 JSON 文件
    :param filename: 文件名
    :param data: JSON 数据
    """
    # 写入 JSON 文件
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def zip_folder(folder, filename):
    """
    压缩文件夹为zip
    :param folder: 文件夹
    :param filename: 文件名
    :return:
    """
    print("aaa")


def create_zip(root_path, file_name, ignored=[], storage_path=None):
    """Create a ZIP

    This function creates a ZIP file of the provided root path.

    Args:
        root_path (str): Root path to start from when picking files and directories.
        file_name (str): File name to save the created ZIP file as.
        ignored (list): A list of files and/or directories that you want to ignore. This
                        selection is applied in root directory only.
        storage_path: If provided, ZIP file will be placed in this location. If None, the
                        ZIP will be created in root_path
    """
    if storage_path is not None:
        zip_root = os.path.join(storage_path, file_name)
    else:
        zip_root = os.path.join(root_path, file_name)

    zipf = zipfile.ZipFile(zip_root, 'w', zipfile.ZIP_DEFLATED)

    def iter_subtree(path, layer=0):
        # iter the directory
        path = zipfile.Path(path)
        for p in path.iterdir():
            if layer == 0 and p.name in ignored:
                continue
            zipf.write(p, str(p).replace(root_path, '').lstrip('/'))

            if p.is_dir():
                iter_subtree(p, layer=layer + 1)

    iter_subtree(root_path)
    zipf.close()
