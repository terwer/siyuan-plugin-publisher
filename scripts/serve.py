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

    URL = 'http://127.0.0.1:6806'
    COOKIE = open('cookie.txt').read().strip()
    TOKEN = open('token.txt').read().strip()
    DEV_PAGE_ID = open('pageId.txt').read().strip()

    # 设置环境变量
    os.environ['IS_SERVE'] = 'true'
    os.environ['VITE_DEFAULT_TYPE'] = 'siyuan'
    os.environ['VITE_SIYUAN_API_URL'] = URL
    os.environ['VITE_SIYUAN_AUTH_TOKEN'] = TOKEN
    os.environ['VITE_SIYUAN_COOKIE'] = COOKIE
    os.environ['VITE_SIYUAN_DEV_PAGE_ID'] = DEV_PAGE_ID
    # os.environ['VITE_CJS_TRACE'] = 'true'
    os.environ['VITE_CJS_IGNORE_WARNING'] = 'true'

    os.system("vite")
