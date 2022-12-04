#
# Copyright (c) 2022, Terwer . All rights reserved.
# DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
#
# This code is free software; you can redistribute it and/or modify it
# under the terms of the GNU General Public License version 2 only, as
# published by the Free Software Foundation.  Terwer designates this
# particular file as subject to the "Classpath" exception as provided
# by Terwer in the LICENSE file that accompanied this code.
#
# This code is distributed in the hope that it will be useful, but WITHOUT
# ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
# FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
# version 2 for more details (a copy is included in the LICENSE file that
# accompanied this code).
#
# You should have received a copy of the GNU General Public License version
# 2 along with this work; if not, write to the Free Software Foundation,
# Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
#
# Please contact Terwer, Shenzhen, Guangdong, China, youweics@163.com
# or visit www.terwer.space if you need additional information or have any
# questions.
#

pwd
rm -rf ./dist
yarn build
cp ./LICENSE ./dist/

# 删除siyuan挂件专属文件
rm ./dist/widget.json

# 火狐配置
mv ./dist/mv2/manifest-v2-for-firefox.json ./dist/manifest.json
mv ./dist/mv2/background-v2-for-firefox.js ./dist/background.js
rm -rf ./dist/mv2

rm -rf ./extension/firefox/*
mkdir -p extension/firefox
cp -r ./dist/* ./extension/firefox
echo "Firefox V2插件发布完毕."
