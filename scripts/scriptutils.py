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

import distutils
import glob
import os
import sys
from distutils import file_util


def switch_workdir():
    cwd = "./"
    if os.getcwd().endswith("scripts"):
        cwd = "../"

    # 打印当前python版本
    print("当前python版本:" + sys.version)
    # 打印当前路径
    print("当前路径:" + os.getcwd())

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
