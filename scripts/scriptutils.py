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

import distutils
import glob
import json
import os
import pathlib
import shutil
import sys
import time
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


def mv_file(src, dst):
    """
    移动文件
    :param src: 源文件
    :param dst: 目标文件
    """
    if os.path.exists(dst):
        rm_file(dst)
    if os.path.exists(src):
        file_util.move_file(src, dst)


def rm_files(regex):
    """
    正则删除文件
    :param regex: 正则
    """
    file_list = glob.glob(regex)
    for file in file_list:
        rm_file(file)


def cp_folder(src, dst):
    """
    拷贝文件夹
    :param src: 源文件夹，例如："/path/to/source/folder"
    :param dst: 目的地，例如："/path/to/destination/folder"
    """
    if os.path.exists(dst):
        rm_folder(dst)

    if not os.path.exists(dst):
        mkdir(dst)

    try:
        shutil.copytree(src, dst)
    except FileExistsError:
        # 如果目标文件夹已经存在，则删除它并重试
        shutil.rmtree(dst)
        shutil.copytree(src, dst)
    except Exception as e:
        print(f"无法拷贝文件夹,{e}")
        raise e


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


def zip_folder(src_folder, tmp_folder_name, build_zip_path, build_zip_name):
    """
    压缩文件夹为zip
    :param src_folder: 需要压缩的文件所在的目录
    :param tmp_folder_name: 临时目录，也是解压后的默认目录
    :param build_zip_path: zip保存目录
    :param build_zip_name: zip文件名称
    """
    mkdir(tmp_folder_name)
    cp_folder(src_folder, tmp_folder_name)

    mkdir(build_zip_path)
    print("tmp_folder_name:" + tmp_folder_name)
    print("build_zip_path:" + build_zip_path)
    print("build_zip_name:" + build_zip_name)

    rm_file(build_zip_name)
    create_zip(tmp_folder_name, build_zip_name, [], build_zip_path)
    rm_folder(tmp_folder_name)


def create_zip(root_path, file_name, ignored=None, storage_path=None):
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
    if ignored is None:
        ignored = []
    if storage_path is not None:
        zip_root = os.path.join(storage_path, file_name)
    else:
        zip_root = os.path.join(root_path, file_name)

    zipf = zipfile.ZipFile(zip_root, 'w', zipfile.ZIP_STORED)

    def iter_subtree(path, layer=0):
        # iter the directory
        path = pathlib.Path(path)
        for p in path.iterdir():
            if layer == 0 and p.name in ignored:
                continue
            zipf.write(p, str(p).replace(root_path, '').lstrip('/'))

            if p.is_dir():
                iter_subtree(p, layer=layer + 1)

    iter_subtree(root_path)
    zipf.close()


def get_filename_from_time():
    """
    根据时间命名文件
    :return: 根据时间生成的名称
    """
    # 获取当前的时间
    now_time = time.localtime()
    # 使用strftime函数把时间转换成想要的格式
    filename = time.strftime("%Y%m%d%H%M%S", now_time)  # 输出结果为：20210126095555
    return filename
